module.exports = {
  config: {
    name: "prefix",
    aliases: ["prefix", "Prefix"],
    version: "3.0",
    author: "SamyCharlesღ",
    countDown: 3,
    role: 0,
    description: {
      fr: "Répond avec une image aléatoire quand on tape prefix"
    },
    category: "info"
  },

  onStart: async function ({ message }) {
    const images = [
      "https://i.imgur.com/HjNHGw7.jpeg", // image 1 (le garçon animé)
      "https://i.imgur.com/5ohE1Yo.jpeg"  // image 2 (stream is starting)
    ];

    const chosenImage = images[Math.floor(Math.random() * images.length)];
    return message.reply({
      attachment: await global.utils.getStreamFromURL(chosenImage)
    });
  },

  onChat: async function ({ event, message }) {
    const content = event.body?.toLowerCase()?.trim();
    const triggers = ["prefix"];
    if (triggers.includes(content)) {
      return this.onStart({ message, event });
    }
  }
};
