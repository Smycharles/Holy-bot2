module.exports = {
  config: {
    name: "noti",
    aliases: ["notif", "broadcast"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 10,
    role: 2, // owner uniquement
    description: {
      fr: "📢 Envoie un message dans tous les groupes où le bot est présent"
    },
    category: "🔐 admin"
  },

  onStart: async function ({ message, args, threadsData, usersData, api, event }) {
    const content = args.join(" ");
    const senderID = event.senderID;

    if (!content)
      return message.reply("❗ Utilisation correcte : `.noti <message>`");

    const senderName = await usersData.getName(senderID);
    const allThreads = await threadsData.getAll();

    let count = 0;

    for (const thread of allThreads) {
      try {
        await api.sendMessage(
          {
            body: `╭── 🎀 𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 🎀 ──╮\n` +
                  `│ 💬 ${content}\n` +
                  `│ 😊 ${senderName}\n` +
                  `╰── 𖥻 Notification globale 💌 ──╯`,
            mentions: [{ tag: senderName, id: senderID }]
          },
          thread.threadID
        );
        count++;
      } catch (e) {
        // Groupe inactif ou bloqué
      }
    }

    return message.reply(`✅ Message envoyé dans ${count} groupes.`);
  }
};
