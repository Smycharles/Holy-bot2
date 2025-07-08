const fs = require("fs-extra");
const path = require("path");
const bankPath = path.join(__dirname, "..", "cache", "bankData.json");

module.exports = {
  config: {
    name: "dice",
    aliases: ["dé", "dés", "roll"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "🎲 Lance un dé et gagne des SC si tu fais un bon score"
    },
    category: "🎮 mini-jeux"
  },

  onStart: async function ({ message, event }) {
    const uid = event.senderID;
    const roll = Math.floor(Math.random() * 6) + 1;

    let bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath)) : {};
    if (!bank[uid]) bank[uid] = { pocket: 2000, bank: 0 };

    let result = `🎲 Tu as lancé un dé... Résultat : **${roll}**\n`;

    if (roll === 6) {
      const gain = 500;
      bank[uid].pocket += gain;
      result += `🎉 Tu as fait un 6 ! Tu gagnes ${gain} SC 💰`;
    } else if (roll === 1) {
      const perte = 200;
      bank[uid].pocket = Math.max(0, bank[uid].pocket - perte);
      result += `😢 Tu as fait 1... Tu perds ${perte} SC 💸`;
    } else {
      result += `😐 Pas de gain cette fois. Réessaie !`;
    }

    fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
    return message.reply(result);
  }
};
