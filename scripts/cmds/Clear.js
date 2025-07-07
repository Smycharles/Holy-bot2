module.exports = {
  config: {
    name: "clear",
    version: "1.0",
    author: "Samy x GPT",
    role: 2, // réservé à l’admin
    shortDescription: "🧹 Supprime tous les messages du bot dans le groupe",
    category: "admin",
    guide: {
      en: ".clear"
    }
  },

  onStart: async function ({ api, event }) {
    const allowedUID = "61566160637367"; // ton UID ici

    if (event.senderID !== allowedUID)
      return api.sendMessage("⛔ Commande réservée à l’admin.", event.threadID, event.messageID);

    try {
      const botID = api.getCurrentUserID();

      // Récupérer les 100 derniers messages pour limiter (API souvent limitée)
      const messages = await api.getThreadHistory(event.threadID, 100, event.messageID);

      // Filtrer les messages du bot
      const botMessages = messages.filter(m => m.senderID === botID);

      if (botMessages.length === 0)
        return api.sendMessage("❌ Aucun message du bot trouvé à supprimer.", event.threadID, event.messageID);

      // Supprimer tous les messages du bot trouvés
      const messageIDs = botMessages.map(m => m.messageID);
      await api.unsendMessages(messageIDs);

      api.sendMessage(`✅ ${messageIDs.length} messages du bot supprimés !`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Impossible de supprimer les messages du bot.", event.threadID, event.messageID);
    }
  }
};
