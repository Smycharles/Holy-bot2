const activeBooms = new Map();

module.exports = {
  config: {
    name: "boom",
    version: "1.0",
    author: "SamyCharlesღ",
    countDown: 5,
    role: 0,
    description: {
      fr: "💣 Pose une bombe. Si personne ne tape 'stop', tu gagnes !"
    },
    category: "🎰 casino"
  },

  onStart: async function ({ message, event, usersData }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const prize = 5000;

    if (activeBooms.has(threadID)) {
      return message.reply("💣 Une bombe est déjà active ici !");
    }

    activeBooms.set(threadID, { senderID });

    message.reply(`💣 Une bombe a été posée par <@${senderID}> !\n⏳ Si personne ne tape "stop" dans 15 secondes, il gagne ${prize} SC !`);

    setTimeout(async () => {
      const current = activeBooms.get(threadID);
      if (current && current.senderID === senderID) {
        activeBooms.delete(threadID);

        // Ajoute l'argent
        const user = await usersData.get(senderID);
        const newMoney = (user.money || 0) + prize;
        await usersData.set(senderID, { money: newMoney });

        return message.reply(`💥 Temps écoulé ! Personne n’a stoppé la bombe.\n🎉 <@${senderID}> remporte ${prize} SC !`);
      }
    }, 15000);
  },

  onChat: async function ({ event, message }) {
    const threadID = event.threadID;
    const content = event.body?.toLowerCase()?.trim();

    if (content === "stop" && activeBooms.has(threadID)) {
      activeBooms.delete(threadID);
      return message.reply("🧯 Quelqu’un a désamorcé la bombe à temps ! Personne ne gagne cette fois 😈");
    }
  }
};
