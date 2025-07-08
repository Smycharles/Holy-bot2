const fs = require("fs-extra");
const path = require("path");

const dataPath = path.join(__dirname, "..", "cache", "gobeletData.json");
const bankPath = path.join(__dirname, "..", "cache", "bankData.json");

module.exports = {
  config: {
    name: "gobelet",
    aliases: ["cup", "balle", "jeu"],
    version: "3.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "Jeu de la balle cachée + top + mode difficile + dépôt SC"
    },
    category: "🎮 mini-jeux"
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;
    let gobelet = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : {};
    let bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath)) : {};

    if (!gobelet[uid]) gobelet[uid] = { niveau: 1, gains: 0 };
    if (!bank[uid]) bank[uid] = { pocket: 2000, bank: 0 };

    const niveau = gobelet[uid].niveau;
    const mode = args[0]?.toLowerCase();

    // 🏆 TOP 10
    if (mode === "top") {
      const sorted = Object.entries(gobelet).sort((a, b) => b[1].niveau - a[1].niveau).slice(0, 10);
      let msg = `🏆 Top 10 des joueurs Gobelet :\n\n`;
      for (let i = 0; i < sorted.length; i++) {
        msg += `${i + 1}. ${sorted[i][0]} — Niveau ${sorted[i][1].niveau}\n`;
      }
      return message.reply(msg);
    }

    // 💰 Dépôt vers bank
    if (mode === "dépôt" || mode === "depot") {
      const gains = gobelet[uid].gains || 0;
      if (gains <= 0) return message.reply("💼 Tu n'as aucun gain à déposer.");
      bank[uid].bank += gains;
      gobelet[uid].gains = 0;
      fs.writeFileSync(dataPath, JSON.stringify(gobelet, null, 2));
      fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
      return message.reply(`🏦 Tu as déposé ${gains} SC dans ta banque.`);
    }

    // 🎮 Jeu (normal ou difficile)
    const hardMode = mode === "difficile";
    const nbCups = Math.min((hardMode ? niveau + 4 : niveau + 2), 12);
    const balle = Math.floor(Math.random() * nbCups) + 1;

    const emojiCups = Array.from({ length: nbCups }, (_, i) => `🥤 ${i + 1}`).join(" | ");

    // Si aucun choix encore fait
    if (!args[0] || (hardMode && !args[1])) {
      return message.reply(
        `🎯 **Gobelets - Niveau ${niveau} ${hardMode ? '(😈 Difficile)' : ''}**\nSous quel gobelet est la balle ?\nRéponds avec :\n` +
        `» \`${global.GoatBot.config.prefix}gobelet ${hardMode ? 'difficile' : ''} <numéro>\`\n\n` +
        emojiCups
      );
    }

    // L'utilisateur a répondu un chiffre
    const choix = parseInt(hardMode ? args[1] : args[0]);
    if (isNaN(choix) || choix < 1 || choix > nbCups)
      return message.reply(`❌ Choix invalide. Choisis un nombre entre 1 et ${nbCups}.`);

    if (choix === balle) {
      const gain = hardMode ? 200 + niveau * 70 : 100 + niveau * 50;
      gobelet[uid].gains += gain;
      gobelet[uid].niveau += 1;

      // 🎁 Bonus tous les 5 niveaux
      let bonusMsg = "";
      if ((gobelet[uid].niveau - 1) % 5 === 0) {
        const bonus = 500;
        gobelet[uid].gains += bonus;
        bonusMsg = `\n🎁 Bonus spécial niveau ${niveau} : +${bonus} SC`;
      }

      fs.writeFileSync(dataPath, JSON.stringify(gobelet, null, 2));
      return message.reply(
        `✅ La balle était sous le gobelet ${balle} 🎉\n+${gain} SC gagnés${bonusMsg}\n🔼 Niveau : ${gobelet[uid].niveau}\n💰 Gains non déposés : ${gobelet[uid].gains} SC`
      );
    } else {
      const perte = 100;
      gobelet[uid].niveau = 1;
      gobelet[uid].gains = Math.max(0, gobelet[uid].gains - perte);
      fs.writeFileSync(dataPath, JSON.stringify(gobelet, null, 2));
      return message.reply(
        `❌ Mauvais choix ! La balle était sous le ${balle} 😢\n💸 -${perte} SC de tes gains\n🔁 Tu recommences au niveau 1`
      );
    }
  }
};
