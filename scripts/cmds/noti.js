module.exports = {
  config: {
    name: "noti",
    version: "1.0",
    author: "Samy x GPT",
    role: 0,
    shortDescription: "💌 Envoie un message stylé à tous les groupes",
    category: "admin",
    guide: {
      en: ".noti <message>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const allowedUID = "61566160637367"; // Ton ID
    if (event.senderID !== allowedUID)
      return api.sendMessage("⛔ Commande réservée à l’admin.", event.threadID, event.messageID);

    const senderName = event.senderName || "Admin";
    const messageText = args.join(" ");
    if (!messageText)
      return api.sendMessage("⚠️ Tu dois écrire un message après `.noti`.", event.threadID, event.messageID);

    try {
      const allThreads = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = allThreads.filter(t => t.isGroup);

      const styledMsg = `
╔═╗─────────────╔═╗
║🕶️║ 𝓝𝓸𝓽𝓲𝓯𝓲𝓬𝓪𝓽𝓲𝓸𝓷 𝓷𝓮́𝓸𝓷 ║🕶️║
╚═╝─────────────╚═╝

👑 De : ${senderName}  
💬 Message :  
『 ${messageText} 』

╔═╗─────────────╔═╗
║🕶️║ 𝓝𝓸𝓽𝓲𝓯𝓲𝓬𝓪𝓽𝓲𝓸𝓷 𝓷𝓮́𝓸𝓷 ║🕶️║
╚═╝─────────────╚═╝
`;

      let successCount = 0;
      for (const thread of groupThreads) {
        try {
          await api.sendMessage(styledMsg, thread.threadID);
          successCount++;
        } catch {
          // Échec, on ignore pour continuer
        }
      }

      return api.sendMessage(`✅ Message envoyé dans ${successCount} groupe(s).`, event.threadID, event.messageID);
    } catch (error) {
      return api.sendMessage("❌ Une erreur est survenue lors de l’envoi.", event.threadID, event.messageID);
    }
  }
};
