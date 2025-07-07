const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ppcouple",
    aliases: ["couple", "ppc"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "Affiche un couple avec leurs photos de profil"
    },
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    // Obtenir la liste des membres de la conversation
    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs;

    // Choisir deux personnes au hasard
    const shuffled = participantIDs.sort(() => 0.5 - Math.random());
    const [id1, id2] = shuffled;

    // Obtenir les noms
    const userInfo = await api.getUserInfo(id1, id2);
    const name1 = userInfo[id1]?.name || "Utilisateur 1";
    const name2 = userInfo[id2]?.name || "Utilisateur 2";

    // Chemins d'enregistrement des images
    const img1Path = path.join(__dirname, "cache", `${id1}.jpg`);
    const img2Path = path.join(__dirname, "cache", `${id2}.jpg`);

    // Télécharger les images de profil
    const avatar1 = await axios.get(`https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=`, { responseType: "arraybuffer" });
    const avatar2 = await axios.get(`https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=`, { responseType: "arraybuffer" });

    // Sauvegarder les images
    fs.writeFileSync(img1Path, avatar1.data);
    fs.writeFileSync(img2Path, avatar2.data);

    // Créer le message
    const message = {
      body: `💞 Nouveau couple trouvé !\n\n❤️ ${name1} + ${name2} = 💘\nQui ship ce couple ? 😍`,
      attachment: [
        fs.createReadStream(img1Path),
        fs.createReadStream(img2Path)
      ]
    };

    // Envoyer le message
    api.sendMessage(message, threadID, () => {
      fs.unlinkSync(img1Path);
      fs.unlinkSync(img2Path);
    });
  }
};
