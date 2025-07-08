module.exports = {
  config: {
    name: "noti",
    aliases: ["notif", "broadcast"],
    version: "2.0",
    author: "SamyCharlesღ",
    countDown: 10,
    role: 2, // Owner uniquement
    description: {
      fr: "📢 Envoie un message dans tous les groupes où le bot est encore membre"
    },
    category: "🔐 admin"
  },

  onStart: async function ({ message, args, api, threadsData, usersData, event }) {
    const content = args.join(" ");
    const senderID = event.senderID;

    if (!content)
      return message.reply("❗ Utilise comme ceci : `.noti <ton message>`");

    const senderName = await usersData.getName(senderID);
    const botName = "🎀 𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 🎀";

    const fullMessage = 
`╭── ${botName} ──╮
│ 💬 ${content}
│ 😊 ${senderName}
╰── 𖥻 Notification globale 💌 ──╯`;

    const allThreads = await threadsData.getAll();
    let count = 0;

    for (const thread of allThreads) {
      const { threadID } = thread;

      // on s’assure que c’est bien un groupe (threadID de plus de 15 chiffres souvent)
      if (!/^\d{16,}$/.test(threadID)) continue;

      try {
        await api.sendMessage({
          body: fullMessage,
          mentions: [{ tag: senderName, id: senderID }]
        }, threadID);
        count++;
      } catch (e) {
        // S'il ne peut pas envoyer, on ignore
      }
    }

    return message.reply(`✅ Message envoyé dans **${count} groupes**.`);
  }
};
