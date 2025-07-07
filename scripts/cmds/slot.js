const fs = require("fs");
const path = __dirname + "/cache/slotData.json";

// Initialiser la base de données si elle n'existe pas
if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

function loadData() {
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "slot",
    version: "1.2",
    author: "Samy x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "🎰 Joue à la machine à sous avec pièces",
    category: "fun",
    guide: {
      en: "slot <mise>"
    }
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;
    const data = loadData();

    // Création de compte si inexistant
    if (!data[uid]) {
      data[uid] = { coins: 1000 }; // départ avec 1000 coins
    }

    const mise = parseInt(args[0]);
    if (isNaN(mise) || mise <= 0) {
      return message.reply("💵 Tu dois entrer une mise valide (ex : `slot 100`).");
    }

    if (data[uid].coins < mise) {
      return message.reply(`❌ Tu n’as que ${data[uid].coins} coins.`);
    }

    // Slots
    const emojis = ["🍒", "🍋", "🍇", "🔔", "🍀", "💎"];
    const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

    // Difficulté aléatoire
    const difficulty = Math.random(); // 0 = facile, 1 = dur
    let gain = 0;

    const slot1 = randomEmoji();
    const slot2 = randomEmoji();
    const slot3 = randomEmoji();

    const result = `🎰 | ${slot1} | ${slot2} | ${slot3} | 🎰`;

    // Jackpot
    if (slot1 === slot2 && slot2 === slot3) {
      if (difficulty < 0.4) gain = mise * 10;
      else if (difficulty < 0.7) gain = mise * 5;
      else gain = mise * 2;
    }
    // Double
    else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      if (difficulty < 0.4) gain = mise * 2;
      else if (difficulty < 0.7) gain = mise;
      else gain = Math.floor(mise * 0.5);
    }
    // Perdu
    else {
      gain = 0;
    }

    const difference = gain - mise;
    data[uid].coins += difference;
    saveData(data);

    const msg =
      gain === 0
        ? `💀 Perdu ! Tu perds ${mise} coins.`
        : gain > mise
        ? `🎉 Gagné ! Tu gagnes ${gain} coins !`
        : `😬 Gagné partiel : Tu récupères ${gain} coins.`;

    const total = data[uid].coins;
    message.reply(`${result}\n\n${msg}\n💰 Solde actuel : ${total} coins`);
  }
};
