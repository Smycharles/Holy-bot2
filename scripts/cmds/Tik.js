const axios = require("axios");

module.exports = {
  config: {
    name: "tik",
    version: "1.0",
    author: "Samy x GPT",
    role: 0,
    shortDescription: "🎬 Télécharge une vidéo TikTok via un lien",
    category: "video",
    guide: {
      en: ".tik <lien TikTok>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const link = args[0];
    if (!link || !link.includes("tiktok.com"))
      return api.sendMessage("❌ Veuillez entrer un lien TikTok valide.\nExemple : .tik https://vm.tiktok.com/xxxxx", event.threadID, event.messageID);

    try {
      const res = await axios.get(`https://api.tiklydown.me/download?url=${encodeURIComponent(link)}`);
      const videoURL = res.data?.video?.no_watermark;

      if (!videoURL)
        return api.sendMessage("⚠️ Vidéo introuvable ou erreur d'API.", event.threadID, event.messageID);

      const videoStream = await global.utils.getStreamFromURL(videoURL, "tiktok.mp4");

      const message = {
        body: "📥 Téléchargement TikTok réussi ! Voici ta vidéo sans watermark 🎬",
        attachment: videoStream
      };

      return api.sendMessage(message, event.threadID, event.messageID);

    } catch (err) {
      console.error("TikTok download error:", err);
      return api.sendMessage("❌ Une erreur est survenue lors du téléchargement.", event.threadID, event.messageID);
    }
  }
};
