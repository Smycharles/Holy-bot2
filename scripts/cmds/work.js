const fs = require("fs-extra");
const path = require("path");
const dataPath = path.join(__dirname, "cache", "bankData.json");

const jobs = [
  "Serveur de fast-food 🍔",
  "Développeur web 💻",
  "Livreur de pizza 🍕",
  "Artiste de rue 🎨",
  "Streamer Twitch 🎮",
  "Pompiste ⛽",
  "Facteur 📬",
  "Caissier 🛒",
  "Agent de sécurité 🛡️",
  "Comédien 🎭",
  "Danseur TikTok 🕺",
  "Chauffeur de taxi 🚕",
  "Vendeur de beignets 🍩",
  "Barbier 💈",
  "Dresseur Pokémon 🔴⚪",
  "Mécanicien 🚗"
];

module.exports = {
  config: {
    name: "work",
    aliases: ["travail", "job"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 10,
    role: 0,
    description: {
      fr: "Travaille pour gagner de l'argent (100-300 SC)"
    },
    category: "économie"
  },

  onStart: async function ({ message, event }) {
    const uid = event.senderID;
    let data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : {};

    if (!data[uid]) {
      data[uid] = { pocket: 2000, bank: 0 };
    }

    // Choisir un job aléatoire et une paie aléatoire
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const gain = Math.floor(Math.random() * 201) + 100; // 100 à 300

    data[uid].pocket += gain;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return message.reply(`👷 Tu as travaillé comme **${job}** et gagné **${gain} SC** !
💰 Nouveau solde en poche : ${data[uid].pocket} SC`);
  }
};
