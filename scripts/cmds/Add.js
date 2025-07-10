module.exports = {
  config: {
    name: "add",
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "➕ Ajoute le bot dans un groupe via son threadID (UID)"
    },
    category: "admin"
  },

  onStart: async function ({ message, event, args, api }) {
    const adminID = "10000xxxxxxxx"; // ← Mets ici TON ID FACEBOOK

    if (event.senderID !== adminID) {
      return message.reply("⛔ Tu n’as pas la permission d’utiliser cette commande.");
    }

    const threadID = args[0];
    if (!threadID || isNaN(threadID)) {
      return message.reply("❌ Tu dois entrer un UID de groupe valide.\nExemple : `.add 1234567890123456`");
    }

    try {
      await api.sendMessage(
        "🎀 Coucou ! J’ai été ajouté ici par mon créateur 💌",
        threadID
      );
      message.reply(`✅ J’ai envoyé un message au groupe ${threadID}`);
    } catch (err) {
      console.log(err);
      return message.reply("❌ Impossible d’envoyer le message. Peut-être que je ne suis pas dans ce groupe ou l’UID est invalide.");
    }
  }
};
