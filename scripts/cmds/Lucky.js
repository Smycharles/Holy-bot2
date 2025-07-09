module.exports = {
  config: {
    name: "luck",
    aliases: ["lucky", "spin", "chance"],
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "🎡 Fais tourner la roue de la chance !"
    },
    category: "🎰 casino"
  },

  onStart: async function ({ message, args, event, usersData }) {
    const uid = event.senderID;
    const bet = parseInt(args[0]);

    if (!bet || bet <= 0) {
      return message.reply("💡 Utilisation : `.luck <mise>`\nExemple : `.luck 500`");
    }

    const userData = await usersData.get(uid) || {};
    const money = userData.money || 0;

    if (money < bet) {
      return message.reply("❌ Tu n'as pas assez de SC pour miser ça.");
    }

    // Table de résultats
    const spinResults = [
      { emoji: "💥", label: "Perdu !", multiplier: 0 },
      { emoji: "💸", label: "Tu récupères ta mise", multiplier: 1 },
      { emoji: "🤑", label: "Tu doubles !", multiplier: 2 },
      { emoji: "💎", label: "Jackpot x5 !", multiplier: 5 },
      { emoji: "🎰", label: "JACKPOT SUPRÊME x10 !!!", multiplier: 10 },
      { emoji: "😢", label: "-50% de ta mise", multiplier: 0.5 }
    ];

    // Tirage au hasard
    const result = spinResults[Math.floor(Math.random() * spinResults.length)];
    const gain = Math.floor(bet * result.multiplier);

    // Mise à jour du solde
    await usersData.set(uid, {
      money: money - bet + gain
    });

    const response =
`🎡 | **LUCK SPIN** | 🎡

Résultat : ${result.emoji}  ${result.label}
💸 Mise : ${bet} SC
💰 Gain : ${gain} SC
🎯 Solde final : ${money - bet + gain} SC`;

    return message.reply(response);
  }
};
