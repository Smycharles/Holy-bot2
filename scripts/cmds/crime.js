const fs = require("fs-extra");
const path = require("path");
const dataPath = path.join(__dirname, "cache", "bankData.json");

module.exports = {
  config: {
    name: "crime",
    aliases: ["vol", "braquage", "fauche"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 10, // Cooldown en secondes
    role: 0,
    description: {
      fr: "Tente un crime pour gagner ou perdre de l’argent"
    },
    category: "économie"
  },

  onStart: async function ({ message, event }) {
    const uid = event.senderID;
    let data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : {};

    if (!data[uid]) {
      data[uid] = { pocket: 2000, bank: 0 };
    }

    const success = Math.random() < 0.5; // 50% de chances

    if (success) {
      const gain = Math.floor(Math.random() * 451) + 250; // 250 à 700
      data[uid].pocket += gain;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return message.reply(`✅ Tu as réussi ton crime et volé ${gain} SC !
💼 Nouveau solde en poche : ${data[uid].pocket} SC`);
    } else {
      const loss = Math.floor(Math.random() * 201) + 100; // 100 à 300
      data[uid].pocket = Math.max(0, data[uid].pocket - loss);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return message.reply(`🚨 Crime raté ! Tu as perdu ${loss} SC en fuyant...
💼 Solde restant en poche : ${data[uid].pocket} SC`);
    }
  }
};
