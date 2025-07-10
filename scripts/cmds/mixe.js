const OWNER_ID = "61566160637367";

// Liste étendue d'emojis fun pour les réactions
const reactions = [
  "😎","🔥","💥","✨","🎉","😂","👍","🙌",
  "💫","🌟","🎊","🥳","😜","😇","🤩","😺",
  "😹","😻","💖","💗","💙","💚","💛","🧡",
  "💜","🤗","💬","👑","🌈","🎈","🎵","🎶",
  "🕺","💃","🍀","☀️","🌸","🍓","🍉","🥥",
  "🍩","🍪","🍰","🍫","☕","🍵","🍻","🍹",
  "🥂","💎","📸","🎁","🚀","🌍","🦄","🐱",
  "🐶","🐰","🦊","🐻","🐼","🐨","🐯","🦁",
  "🐸","🐵","🐔","🐧","🐦","🦉","🐢","🐬"
];

let mixeActive = false;

module.exports = {
  config: {
    name: "mixe",
    version: "1.1",
    author: "Mod by ChatGPT",
    role: 0,
    description: "Active un mode où le bot réagit à tes messages avec des emojis fun",
    category: "owner",
    guide: "{pn} <on|off>"
  },

  onStart: async function({ args, event, message }) {
    if (event.senderID !== OWNER_ID) {
      return message.reply("❌ Seul le propriétaire peut utiliser cette commande.");
    }

    if (!args[0] || (args[0] !== "on" && args[0] !== "off")) {
      return message.reply("Usage : .mixe on | .mixe off");
    }

    mixeActive = args[0] === "on";

    return message.reply(`✅ Mode mixe est maintenant ${mixeActive ? "activé" : "désactivé"}.`);
  },

  onMessage: async function({ event, api }) {
    if (!mixeActive) return;
    if (event.senderID !== OWNER_ID) return;

    const reaction = reactions[Math.floor(Math.random() * reactions.length)];

    try {
      await api.sendMessage(reaction, event.threadID);
    } catch (err) {
      console.error("Erreur en envoyant la réaction mixe :", err);
    }
  }
};
