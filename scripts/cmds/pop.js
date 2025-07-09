const activeGames = new Map();

module.exports = {
  config: {
    name: "pop",
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 3,
    role: 0,
    description: {
      fr: "🎈 Crève le bon ballon pour gagner des SC"
    },
    category: "🎰 casino"
  },

  onStart: async function ({ message, args, event, usersData }) {
    const threadID = event.threadID;
    const uid = event.senderID;
    const reward = Math.floor(Math.random() * 3000) + 1000; // Gain entre 1000 et 4000 SC

    // Étape 1 : Affichage des ballons
    if (!args[0]) {
      if (activeGames.has(threadID)) {
        return message.reply("🎈 Un jeu est déjà en cours ici !");
      }

      const luckyNumber = Math.floor(Math.random() * 5) + 1; // 1 à 5
      activeGames.set(threadID, { number: luckyNumber, user: uid, reward });

      return message.reply(
        `🎈 5 ballons sont devant toi...\nTape \`.pop <numéro>\` pour en crever un (1 à 5)\nExemple : \`.pop 2\``
      );
    }

    // Étape 2 : Réponse du joueur
    const game = activeGames.get(threadID);
    if (!game) return message.reply("❌ Il n’y a pas de ballon à éclater. Fais d’abord `.pop`");

    if (uid !== game.user) return message.reply("⛔ Seul le joueur qui a lancé peut crever un ballon.");

    const choice = parseInt(args[0]);
    if (isNaN(choice) || choice < 1 || choice > 5) {
      return message.reply("❌ Choisis un numéro entre 1 et 5. Exemple : `.pop 3`");
    }

    activeGames.delete(threadID);

    if (choice === game.number) {
      // 🎉 Gagné
      const user = await usersData.get(uid);
      const newMoney = (user.money || 0) + game.reward;
      await usersData.set(uid, { money: newMoney });

      return message.reply(
        `🎈 BOUM ! Tu as percé le bon ballon numéro ${choice} !\n💰 Tu gagnes ${game.reward} SC !`
      );
    } else {
      // 💥 Perdu
      return message.reply(
        `💥 Le ballon numéro ${choice} était vide ou a explosé dans ta main !\n😢 Tu gagnes rien. Le bon était le numéro ${game.number}.`
      );
    }
  }
};
