const { getStreamsFromAttachment } = global.utils;

module.exports = {
  config: {
    name: "pp",
    version: "1.0",
    author: "Mod by ChatGPT",
    role: 0,
    description: "Change la photo de profil du bot et sa description en répondant à une photo",
    category: "owner",
    guide: "{pn} <description> (en répondant à une photo)"
  },

  onStart: async function({ api, event, args, message }) {
    const ownerID = "61566160637367";

    if (event.senderID !== ownerID) {
      return message.reply("❌ Seul le propriétaire peut utiliser cette commande.");
    }

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return message.reply("❌ Vous devez répondre à un message contenant une photo.");
    }

    // Filtrer les attachments photos dans le message répondu
    const photoAttachments = event.messageReply.attachments.filter(att => att.type === "photo" || att.type === "png");
    if (photoAttachments.length === 0) {
      return message.reply("❌ Le message répondu ne contient pas de photo valide.");
    }

    const description = args.join(" ").trim();

    try {
      // Récupérer le stream de la photo
      const streams = await getStreamsFromAttachment(photoAttachments);

      // Changer la photo de profil du bot (méthode GoatBot hypothétique)
      await api.changeAvatar(streams[0]);

      // Changer la description si texte donné
      if (description.length > 0) {
        await api.changeStatus(description);
      }

      return message.reply(`✅ Photo de profil changée avec succès${description.length > 0 ? " et description mise à jour." : "."}`);

    } catch (error) {
      console.error(error);
      return message.reply("❌ Une erreur est survenue lors du changement de la photo de profil.");
    }
  }
};
