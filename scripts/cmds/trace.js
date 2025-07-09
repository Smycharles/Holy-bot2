const gameState = new Map();

module.exports = {
  config: {
    name: "trace",
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 2,
    role: 0,
    description: {
      fr: "🌀 Suis un chemin dangereux pour gagner des SC... ou tout perdre"
    },
    category: "🎰 casino"
  },

  onStart: async function ({ message, args, event, usersData }) {
    const uid = event.senderID;
    const pathLength = 6;

    // Démarre la trace
    if (!args[0]) {
      gameState.set(uid, { step: 1, gain: 0 });
      return message.reply("🌀 Tu entres dans la Forêt du Hasard...\nTape `.trace next` pour avancer ou `.trace stop` pour sortir avec tes gains.");
    }

    const state = gameState.get(uid);
    if (!state) return message.reply("❌ Tu dois d'abord faire `.trace` pour commencer.");

    if (args[0] === "stop") {
      gameState.delete(uid);
      if (state.gain > 0) {
        const user = await usersData.get(uid);
        const newMoney = (user.money || 0) + state.gain;
        await usersData.set(uid, { money: newMoney });

        return message.reply(`✅ Tu quittes le chemin avec 💰 ${state.gain} SC`);
      } else {
        return message.reply("😐 Tu quittes le chemin sans rien gagner...");
      }
    }

    if (args[0] === "next") {
      if (state.step > pathLength) {
        gameState.delete(uid);
        return message.reply("🚪 Tu es arrivé au bout du chemin. Tape `.trace` pour recommencer.");
      }

      const chance = Math.random();
      let resultMsg = "", gain = 0;

      if (chance < 0.2) {
        resultMsg = "💣 Tu es tombé dans un piège ! Tu perds tout.";
        gameState.delete(uid);
        return message.reply(resultMsg);
      } else if (chance < 0.5) {
        resultMsg = "😐 Rien ici. Continue...";
      } else {
        gain = Math.floor(Math.random() * 1000) + 500;
        state.gain += gain;
        resultMsg = `💰 Tu trouves un trésor de ${gain} SC !`;
      }

      state.step++;
      gameState.set(uid, state);

      return message.reply(`${resultMsg}\nÉtape ${state.step - 1}/${pathLength}\nTape \`.trace next\` ou \`.trace stop\``);
    }

    return message.reply("⚠️ Commande invalide. Utilise `.trace`, `.trace next` ou `.trace stop`.");
  }
};
