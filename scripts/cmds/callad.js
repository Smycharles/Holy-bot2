const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		version: "2.0",
		author: "NTKhang + Mod by ChatGPT",
		countDown: 5,
		role: 0,
		description: {
			vi: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
			en: "Send report, feedback, bug,... to bot admins"
		},
		category: "contacts admin",
		guide: {
			vi: "{pn} <tin nhắn>",
			en: "{pn} <your message>"
		}
	},

	langs: {
		en: {
			missingMessage: "⚠️ Please enter a message to send to the admins.",
			noAdmin: "❗ The bot has no configured admins.",
			success: "✅ Your message was sent to %1 admin(s):\n%2",
			failed: "❌ Failed to send to %1 admin(s):\n%2",
			reply: "📨 Reply from admin %1:\n『 %2 』\n↪ Reply to continue the conversation.",
			replySuccess: "✅ Your reply was sent to the user.",
			feedback: "📩 Feedback from admin %1:\n『 %4 』\n↪ Reply to respond.",
			replyUserSuccess: "✅ Your reply was sent to the admin."
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;
		if (!args[0]) return message.reply(getLang("missingMessage"));

		if (config.adminBot.length === 0)
			return message.reply(getLang("noAdmin"));

		const { senderID, threadID, isGroup } = event;
		const senderName = await usersData.getName(senderID);
		const threadName = isGroup ? (await threadsData.get(threadID)).threadName : null;

		const formattedMsg = 
`╭━━━ ⌜📨 APPEL UTILISATEUR 📬⌟ ━━━╮

👤 Nom        : ${senderName}
🆔 ID         : ${senderID}
🌐 Contexte   : ${isGroup ? `Groupe "${threadName}" (ID: ${threadID})` : "Message Privé"}

📝 Message reçu :
『 ${args.join(" ")} 』

📎 Pièces jointes : ${event.attachments.length > 0 ? "✅" : "❌"}

╰━━━ ⫷ Réponds à ce message pour contacter l’utilisateur ⫸ ━━━╯`;

		const formMessage = {
			body: formattedMsg,
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [], failedIDs = [];
		const adminNames = await Promise.all(config.adminBot.map(async id => ({
			id,
			name: await usersData.getName(id)
		})));

		for (const uid of config.adminBot) {
			try {
				const msgSent = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);
				global.GoatBot.onReply.set(msgSent.messageID, {
					commandName,
					messageID: msgSent.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			} catch (err) {
				failedIDs.push({ adminID: uid, error: err });
			}
		}

		let msg2 = "";
		if (successIDs.length > 0) {
			msg2 += getLang("success", successIDs.length,
				adminNames.filter(a => successIDs.includes(a.id)).map(a => `• ${a.name} (<@${a.id}>)`).join("\n"));
		}
		if (failedIDs.length > 0) {
			msg2 += "\n" + getLang("failed", failedIDs.length,
				failedIDs.map(f => `• ${adminNames.find(a => a.id === f.adminID)?.name || f.adminID}`).join("\n"));
			log.err("CALL ADMIN", failedIDs);
		}

		return message.reply({
			body: msg2,
			mentions: adminNames.map(a => ({ id: a.id, tag: a.name }))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const isGroup = event.isGroup;

		switch (type) {
			case "userCallAdmin": {
				const replyMsg =
`📨 Réponse de l’admin ${senderName} :
『 ${args.join(" ")} 』
↪ Réponds à ce message pour continuer.`;

				const formMessage = {
					body: replyMsg,
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, "", args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err) return message.err(err);
					message.reply(getLang("replySuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
		}
	}
};
