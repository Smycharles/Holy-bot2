module.exports = {
  config: {
    name: "prefix",
    aliases: ["prefix", "Prefix", "P", "p"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 3,
    role: 0,
    description: {
      fr: "Affiche le préfixe du bot même sans le préfixe"
    },
    category: "informations"
  },

  onStart: async function ({ message, event }) {
    const prefix = global.GoatBot.config.prefix || ".";
    const botName = global.GoatBot.config.botName || "𝑺𝒂𝒎𝒚 𝑩𝒐𝒕 🧸";
    const now = new Date();
    const date = now.toLocaleDateString("fr-FR");
    const time = now.toLocaleTimeString("fr-FR");

    const msg = `
╭── 🎀 ${botName} 🎀 ──╮
│ 💬 Préfixe actuel : 『 ${prefix} 』
│ 📅 Date : ${date}
│ ⏰ Heure : ${time}
│ 🎀 Utilise ce préfixe pour m'appeler !
╰── 𖥻 Merci de m’avoir invoqué 💌 ──╯`;

    return message.reply({
      body: msg,
      mentions: [{ tag: event.senderID, id: event.senderID }]
    });
  },

  onChat: async function ({ event, message }) {
    const content = event.body?.toLowerCase()?.trim();
    const keys = ["prefix", "p"];
    if (keys.includes(content)) {
      return this.onStart({ message, event });
    }
  }
};
