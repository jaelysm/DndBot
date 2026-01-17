const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let arr = new SlashCommandBuilder()
	.setName('inspiration')
	.setDescription('Provides information about current inspiration stats.')
	.addSubcommand((subcommand) =>
		subcommand
			.setName('read')
			.setDescription('Get current inspiration points for all users'),
	)
	.addSubcommand((subcommand) => 
		subcommand
			.setName('edit')
			.setDescription('Edit user\'s inspiration points')
			.addStringOption((option) =>
				option
				.setName('addremove')
				.addChoices(
					{ name: 'Add', value: 'add' },
					{ name: 'Remove', value: 'remove' },
				)
				.setDescription('Set whether inspiration will be added or removed')
				.setRequired(true)
				.setMaxLength(6),
		)
		.addStringOption((option) =>
			option
				.setName('name')
				.setDescription('Character\'s name')
				.addChoices(
					{ name: 'Mouse', value: 'Mouse' },
					{ name: 'Akira', value: 'Akira' },
					{ name: 'Gerald', value: 'Gerald' },
					{ name: 'Roxy', value: 'Roxy' },
				)
				.setRequired(true)
				.setMaxLength(20),
		)
		.addNumberOption((option) =>
			option
				.setName('amount')
				.setDescription('Amount to add/remove')
				.setRequired(true),
		)
	)
;

function readWriteInspiration(addOrRemove, charName, amt) {
  let data = fs.readFileSync('text_files/inspiration.txt', 'utf-8');
  let prevAmt = 0;
  let newAmt = 0;
  
  // get current inspiration info
  let substr = data.substring(data.indexOf(charName)+charName.length+1);
  prevAmt = parseFloat(substr.substring(0,substr.indexOf(",")));
 
  // get new inspiration info
  if (addOrRemove == "add") {
	  newAmt = prevAmt + amt;
  }
  else {
	  newAmt = prevAmt - amt;
  }
 
  // get new values to display in pretty format
  let newValues = data.replace(charName + ' ' + prevAmt, charName + ' ' + newAmt);

  // update data in file
  fs.writeFileSync('text_files/inspiration.txt', newValues, 'utf-8');

  return "Changing " + charName + "'s inspiration from " + prevAmt + " to " + newAmt + "\nNew Inspirations: \n" + newValues.replaceAll(',', '');
}

function readInspirations() {
	// get data in pretty format
	let data = fs.readFileSync('text_files/inspiration.txt', 'utf-8').replaceAll(',', '');
	return data;
}

module.exports = {
	data: arr,
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
		let reply;

		const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'read':
				reply = "Current inspiration points: \n" + readInspirations()
                break;
            case 'edit':
                reply = readWriteInspiration(interaction.options.getString('addremove'), interaction.options.getString('name'), interaction.options.getNumber('amount'))
                break;
            default:
                // something went wrong!
                await interaction.reply('Unknown subcommand. Please use \'read\' or \'edit\'.');
        }

		await interaction.reply(`${reply}`);
	},
};

