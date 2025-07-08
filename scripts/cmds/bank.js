const fs = require("fs-extra");
const path = require("path");
const dataPath = path.join(__dirname, "cache", "bankData.json");

module.exports = {
  config: {
    name: "bank",
    aliases: ["argent", "money", "solde"],
    version: "2.1",
    author: "SamyCharlesღ",
    countDown: 3,
    role: 0,
    description: {
      fr: "Banque virtuelle avec dépôt, retrait, transfert, top, etc."
    },
    category: "économie"
  },

  onStart: async function ({ message, args, event, usersData }) {
    const uid = event.senderID;
    let data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : {};

    // Si nouveau joueur, on lui crée un compte et on donne 2000 SC de bonus
    if (!data[uid]) {
      data[uid] = { pocket: 2000, bank: 0 };
      save(data);
      return message.reply(`🎉 Bienvenue à la banque virtuelle, compte créé avec succès !
🧾 Bonus de bienvenue : +2000 SC ajoutés à ta poche.
Utilise \`bank\` pour voir ton solde ou \`bank deposer <montant>\` pour placer ton argent en sécurité.`);
    }

    const sub = (args[0] || "").toLowerCase();
    const amount = parseInt(args[2] || args[1]);

    // Afficher le solde
    if (!sub || sub === "solde") {
      return message.reply(`💼 Solde :
👤 Poche : ${data[uid].pocket} SC
🏦 Banque : ${data[uid].bank} SC`);
    }

    // Dépôt
    if (sub === "deposer" || sub === "deposit") {
      if (isNaN(amount) || amount <= 0)
        return message.reply("❌ Montant invalide à déposer.");
      if (data[uid].pocket < amount)
        return message.reply("❌ Tu n’as pas assez d’argent en poche.");
      data[uid].pocket -= amount;
      data[uid].bank += amount;
      save(data);
      return message.reply(`✅ ${amount} SC déposés à la banque avec succès.`);
    }

    // Retrait
    if (sub === "retirer" || sub === "withdraw") {
      if (isNaN(amount) || amount <= 0)
        return message.reply("❌ Montant invalide à retirer.");
      if (data[uid].bank < amount)
        return message.reply("❌ Tu n’as pas autant à la banque.");
      data[uid].bank -= amount;
      data[uid].pocket += amount;
      save(data);
      return message.reply(`✅ ${amount} SC retirés de la banque.`);
    }

    // Donner à un autre joueur
    if (sub === "give" || sub === "donner") {
      const target = args[1];
      const giveAmount = parseInt(args[2]);
      if (!target || isNaN(giveAmount) || giveAmount <= 0)
        return message.reply("❌ Utilisation : bank give <uid> <montant>");
      if (data[uid].pocket < giveAmount)
        return message.reply("❌ Tu n’as pas assez d’argent en poche.");
      if (!data[target]) data[target] = { pocket: 2000, bank: 0 };
      data[uid].pocket -= giveAmount;
      data[target].pocket += giveAmount;
      save(data);
      return message.reply(`✅ Tu as donné ${giveAmount} SC à l’utilisateur ${target}.`);
    }

    // Reset du compte
    if (sub === "reset") {
      data[uid] = { pocket: 2000, bank: 0 };
      save(data);
      return message.reply("🔁 Ton compte a été réinitialisé. 2000 SC dans la poche, 0 en banque.");
    }

    // Top 5 des plus riches
    if (sub === "top") {
      const sorted = Object.entries(data)
        .sort((a, b) => (b[1].pocket + b[1].bank) - (a[1].pocket + a[1].bank))
        .slice(0, 5);

      const topList = await Promise.all(sorted.map(async ([id, val], i) => {
        const name = (await usersData.getName(id)) || `UID ${id}`;
        const total = val.pocket + val.bank;
        return `${i + 1}. ${name} : ${total} SC (👛 ${val.pocket} + 🏦 ${val.bank})`;
      }));

      return message.reply("👑 Top 5 des plus riches :\n\n" + topList.join("\n"));
    }

    // Admin : ajouter de l'argent
    if (sub === "add") {
      if (event.senderID !== global.GoatBot.config.adminBot[0])
        return message.reply("❌ Réservé aux admins.");
      const target = args[1];
      if (!target || isNaN(amount) || amount <= 0)
        return message.reply("❌ Utilisation : bank add <uid> <montant>");
      if (!data[target]) data[target] = { pocket: 2000, bank: 0 };
      data[target].pocket += amount;
      save(data);
      return message.reply(`✅ ${amount} SC ajoutés à ${target}.`);
    }

    // Admin : retirer de l'argent
    if (sub === "remove") {
      if (event.senderID !== global.GoatBot.config.adminBot[0])
        return message.reply("❌ Réservé aux admins.");
      const target = args[1];
      if (!target || isNaN(amount) || amount <= 0)
        return message.reply("❌ Utilisation : bank remove <uid> <montant>");
      if (!data[target]) data[target] = { pocket: 2000, bank: 0 };
      data[target].pocket = Math.max(0, data[target].pocket - amount);
      save(data);
      return message.reply(`✅ ${amount} SC retirés à ${target}.`);
    }

    return message.reply("❓ Commandes disponibles :\n" +
      "- bank / solde\n" +
      "- bank deposer <montant>\n" +
      "- bank retirer <montant>\n" +
      "- bank give <uid> <montant>\n" +
      "- bank reset\n" +
      "- bank top\n" +
      "- bank add/remove <uid> <montant> (admin)");
  }
};

function save(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        }
