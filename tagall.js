module.exports = {
  config: {
    name: "tagall",
    version: "2.1",
    author: "Samy x GPT",
    role: 0,
    shortDescription: "📢 Mentionne tous les membres avec style",
    category: "group",
    guide: {
      en: ".tagall"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const allMembers = threadInfo.participantIDs;
      const BATCH_SIZE = 20; // maximum de mentions par message

      let index = 0;

      for (let i = 0; i < allMembers.length; i += BATCH_SIZE) {
        const batch = allMembers.slice(i, i + BATCH_SIZE);

        let msg = "╭─━━━━━━━━━━━━━━━━━━─╮\n";
        msg += "│  🌸 𝓣𝓪𝓰 𝓯𝓵𝓸𝓻𝓪𝓵 𝓼𝓽𝔂𝓵𝓮 🌸  │\n";
        msg += "╰─━━━━━━━━━━━━━━━━━━─╯\n\n";

        let mentions = [];

        for (let j = 0; j < batch.length; j++) {
          const userID = batch[j];
          const name = threadInfo.userInfo.find(u => u.id === userID)?.name || "Membre";

          msg += `🌸 ${index + 1}. ${name}\n`;
          mentions.push({ id: userID, tag: name });

          index++;
        }

        msg += `\n⟡ ${index} membres mentionnés jusqu'ici ⟡`;

        await api.sendMessage({ body: msg, mentions }, event.threadID);

        await new Promise(resolve => setTimeout(resolve, 2000)); // pause entre les envois
      }

      api.sendMessage("✅ Tous les membres ont été tagués avec amour 🌸", event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Une erreur est survenue pendant le tag.", event.threadID);
    }
  }
};
