const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "sticker",
    version: "1.0",
    author: "Samy x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Transforme une image ou GIF en sticker",
    category: "image",
    guide: {
      en: "Réponds à une image ou gif pour en faire un sticker."
    }
  },

  onStart: async function ({ message, event }) {
    const reply = event.messageReply;
    if (!reply || !reply.attachments || !["photo", "animated_image"].includes(reply.attachments[0]?.type)) {
      return message.reply("⚠️ Réponds à une **image ou GIF** pour le transformer en sticker.");
    }

    const url = reply.attachments[0].url;
    const apiUrl = `https://api.zahwazein.xyz/sticker/webp?url=${encodeURIComponent(url)}&apikey=zahirgpt`;

    try {
      const sticker = await getStreamFromURL(apiUrl);
      message.reply({ body: "🧷 Voilà ton sticker :", attachment: sticker });
    } catch (e) {
      message.reply("❌ Erreur lors de la génération du sticker.");
    }
  }
};
