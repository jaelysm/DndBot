const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

let species = [
  'Aarakocra',
  'Aasimar',
  "Anyone who isn't water breathing",
  'Centuars',
  'Dragonborns',
  'Drow',
  'Dwarves',
  'Elves',
  'Giants',
  'Gnoll',
  'Gnomes',
  'Goblins',
  'Goliath',
  'Half-Elves (from elves)',
  'Half-Elves (from humans)',
  'Halflings',
  'Humans',
  'Indirect Racial Slurs',
  'Kobolds',
  'Non-Dragonborn',
  'Non-Drow',
  'Orcs / Half-Orcs',
  'Tabaxi',
  'Tieflings',
  'Triton',
];

// put list of species into an array for use in the command builder
let choicesArr = [];
for (let i = 0; i < species.length; i++) {
	choicesArr.push({name: species[i], value: species[i]});
}

let arr = new SlashCommandBuilder()
	.setName('insult')
	.setDescription('Provides information about current inspiration stats.')
	.addStringOption((option) =>
		option
			.setName('species')
			.setDescription('The species to insult')
			.setRequired(true)
			.addChoices(choicesArr),
	)
	.addNumberOption((option) =>
		option
			.setName('amount')
			.setDescription('The amount of insults to display')
			.setRequired(false),
	)
;

function readInsults(speciesInput, amount) {
	let data = fs.readFileSync('text_files/insults.txt', 'utf-8'); // read file
	let parsed = JSON.parse(data); // convert json to object
	let retval = parsed.find(p => p.title === speciesInput).list; // find list of insults for this species
	let selectedInsults = amount ? retval.slice(0, amount) : retval; // if user input a number, only get that many insults
	
	// if the user specified an amount, only show that amount, otherwise show all
	return "Insults for " + speciesInput + ":\n" + selectedInsults.join('\n');
}

module.exports = {
	data: arr,
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
		let reply = readInsults(interaction.options.getString('species'), interaction.options.getNumber('amount'));

		await interaction.reply(`${reply}`);
	},
};

