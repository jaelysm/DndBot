const { AttachmentBuilder, Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let arr = new SlashCommandBuilder()
	.setName('image')
	.setDescription('Sends image using provided name')
	.addStringOption((option) =>
		option
			.setName('imagename')
			.setDescription('The name of the image')
			.setRequired(true),
	)
;

function getImage(imageName) {
	let data = {files: ["images/" + imageName + ".png"] };
	return data;
}

module.exports = {
	data: arr,
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
		let reply = getImage(interaction.options.getString('imagename'));

		await interaction.reply(reply);
	},
};