const { SlashCommandBuilder } = require('discord.js');
var fs = require('fs');

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
				.setDescription('Set wether inspiration will be added or removed')
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


function readWriteSync(addOrRemove, charName, amt) {
  var data = fs.readFileSync('inspiration.txt', 'utf-8');
  var prevAmt = newAmt = 0;
  
  let substr = data.substring(data.indexOf(charName)+charName.length+1);
  prevAmt = parseFloat(substr.substring(0,substr.indexOf(",")));
 
  if (addOrRemove == "add") {
	  newAmt = prevAmt + amt;
  }
  else {
	  newAmt = prevAmt - amt;
  }
 
  var newValue = data.replace(charName + ' ' + prevAmt, charName + ' ' + newAmt);

  fs.writeFileSync('inspiration.txt', newValue, 'utf-8');

  //return data + "\n We will " + addOrRemove + " " + amt + " for " + charName;
  return "changing " + charName + "'s inspiration from " + prevAmt + " to " + newAmt + "\nNew Inspirations: \n" + newValue;
}

function readInspirations() {
	var data = fs.readFileSync('inspiration.txt', 'utf-8');
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
				reply = readInspirations()
                break;
            case 'edit':
                reply = "\nInspiration:\n" + readWriteSync(interaction.options.getString('addremove'), interaction.options.getString('name'), interaction.options.getNumber('amount'))
                break;
            default:
                // something went wrong!
                await interaction.reply('Unknown subcommand.');
        }

		await interaction.reply(`${reply}`);
	},
};

