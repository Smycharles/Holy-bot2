module.exports = {
  config: {
    name: "noti",
    aliases: ["notif", "broadcast", "global"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 10,
    role: 2, // Owner uniquement
    description: {
      fr: "📢 Envoie un message dans tous les groupes où le bot est présent"
    },
    category: "🔐 admin"
  },

  onStart: async function ({ message, args, threadsData, usersData, event }) {
    const content = args.join(" ");
    const uid = event.senderID;

    if (!content)
      return message.reply("❗ Utilisation : .noti <ton message>");

    const senderName = await usersData.getName(uid);
    const botName = "🎀 𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 🎀";

    const msgToSend = `
╭── ${botName} ──╮
│ 💬 ${content}
│ 😊 ${senderName}
╰── 𖥻 Notification globale 💌 ──╯`;

    const allThreads = await threadsData.getAll();
    let count = 0;

    for (const thread of allThreads) {
      try {
        await message.send(
          {
            body: msgToSend,
            mentions: [{ tag: senderName, id: uid }]
          },
          thread.threadID
        );
        count++;
      } catch (e) {
        // Évite les groupes où le bot a été kické
        continue;
      }
    }

    return message.reply(`✅ Message envoyé dans **${count}** groupes.`);
  }
};
