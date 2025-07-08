const fs = require("fs-extra");
const path = require("path");
const bankPath = path.join(__dirname, "..", "cache", "bankData.json");

module.exports = {
  config: {
    name: "riska",
    aliases: ["r", "coffre", "risque"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "💣 Choisis un coffre et tente ta chance !"
    },
    category: "🎮 mini-jeux"
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;
    const choix = parseInt(args[0]);

    let bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath)) : {};
    if (!bank[uid]) bank[uid] = { pocket: 2000, bank: 0 };

    // 🔰 Si aucun argument, on affiche les règles
    if (!choix) {
      return message.reply(
        `🎮 **RISKA - Le jeu du coffre risqué !**\n\n` +
        `Tape \`.riska <1 | 2 | 3>\` pour ouvrir un des 3 coffres :\n` +
        `💰 Un coffre contient des SC\n😐 Un autre est vide\n💣 Et le dernier te fait perdre des SC !\n\n` +
        `Bonne chance... Tu gagnes ou tu pleures ! 😈`
      );
    }

    // ✅ Vérification choix
    if (![1, 2, 3].includes(choix)) {
      return message.reply(`❌ Choix invalide. Tape \`.riska 1\`, \`.riska 2\` ou \`.riska 3\``);
    }

    // 🎯 Génération du coffre gagnant / vide / bombe
    const positions = ["gain", "vide", "bombe"].sort(() => Math.random() - 0.5);
    const result = positions[choix - 1];

    const coffres = ["🪙 Coffre 1", "🪙 Coffre 2", "🪙 Coffre 3"];
    let gain = 0;
    let msg = "";

    if (result === "gain") {
      gain = Math.floor(Math.random() * 500) + 200; // Entre 200 et 700
      bank[uid].pocket += gain;
      msg = `🎉 Bravo ! Tu as ouvert **${coffres[choix - 1]}** et trouvé **${gain} SC** 💰`;
    } else if (result === "bombe") {
      const perte = Math.floor(Math.random() * 300) + 100; // Entre 100 et 400
      bank[uid].pocket = Math.max(0, bank[uid].pocket - perte);
      msg = `💥 BOOM ! Le coffre ${choix} contenait une bombe 💣\nTu perds ${perte} SC 😢`;
    } else {
      msg = `😐 Le coffre ${choix} était vide... Pas de chance, retente ta chance !`;
    }

    fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
    return message.reply(msg);
  }
};
