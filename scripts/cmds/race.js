const fs = require("fs-extra");
const path = require("path");
const bankPath = path.join(__dirname, "..", "cache", "bankData.json");

module.exports = {
  config: {
    name: "race",
    aliases: ["course", "animalrace"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "🐢🐇 Devine quel animal va gagner la course et gagne des SC"
    },
    category: "🎮 mini-jeux"
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;

    const animaux = ["🐢 Tortue", "🐇 Lapin", "🐎 Cheval"];
    const gagnant = Math.floor(Math.random() * animaux.length);

    if (!args[0]) {
      return message.reply(
        `🐾 Choisis ton coureur :\n1. 🐢 Tortue\n2. 🐇 Lapin\n3. 🐎 Cheval\n\nRéponds avec le numéro ou le nom (ex: 2 ou Lapin)`
      );
    }

    const choix = args[0].toLowerCase();
    const indexChoisi =
      ["1", "tortue"].includes(choix) ? 0 :
      ["2", "lapin"].includes(choix) ? 1 :
      ["3", "cheval"].includes(choix) ? 2 :
      -1;

    if (indexChoisi === -1)
      return message.reply("❌ Choix invalide. Tape 1, 2 ou 3 (ou le nom de l’animal).");

    let bank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath)) : {};
    if (!bank[uid]) bank[uid] = { pocket: 2000, bank: 0 };

    const gain = 400;
    const perte = 200;

    if (indexChoisi === gagnant) {
      bank[uid].pocket += gain;
      fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
      return message.reply(`🏁 ${animaux[gagnant]} a gagné la course !\n🎉 Tu as bien parié et tu gagnes ${gain} SC 💰`);
    } else {
      bank[uid].pocket = Math.max(0, bank[uid].pocket - perte);
      fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2));
      return message.reply(`🏁 ${animaux[gagnant]} a gagné la course !\n😢 Tu as perdu ton pari. -${perte} SC`);
    }
  }
};
