module.exports = {
  config: {
    name: "clear",
    version: "1.0",
    author: "Samy x GPT",
    role: 0,
    shortDescription: "Supprimer les derniers messages (admin)",
    category: "admin",
    guide: {
      en: "clear <nombre>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const allowedUID = "61566160637367"; // Ton ID uniquement
    if (event.senderID !== allowedUID) {
      return api.sendMessage("🚫 Tu n’as pas la permission d’utiliser cette commande.", event.threadID, event.messageID);
    }

    const count = parseInt(args[0]);
    if (isNaN(count) || count <= 0) return api.sendMessage("❓ Tu dois indiquer combien de messages supprimer (ex : clear 10)", event.threadID, event.messageID);

    try {
      const messages = await api.getThreadHistory(event.threadID, count + 1); // +1 pour inclure la commande
      const msgIDs = messages.map(m => m.messageID);
      await api.deleteMessages(msgIDs);
      api.sendMessage(`🧹 ${count} message(s) supprimé(s).`, event.threadID);
    } catch (err) {
      api.sendMessage("❌ Erreur lors de la suppression.", event.threadID);
    }
  }
};
