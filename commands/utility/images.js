const { AttachmentBuilder, Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

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

function getImage(imageName, imgType) {
	let filePath = path.join(__dirname, "../../images", imageName + imgType);
	
	// make sure this file actually exists before returning the file path
	if (fs.existsSync(filePath)) {
		return {files: ["images/" + imageName + imgType] };
	} else {
		return null;
	}
}

module.exports = {
	data: arr,
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
		let checkedImgTypes = [".png", ".jpeg", ".jpg"]
		let reply;
		
		// search through valid file types until we find the picture
		for (let i = 0; i < checkedImgTypes.length; i++) {
			reply = getImage(interaction.options.getString('imagename'), checkedImgTypes[i]);
			if (reply != null) {
				break;
			}
		}

		try {
			await interaction.reply(reply);
		}
		catch {
			console.log("something went wrong");
		}
	},
};