const { AttachmentBuilder, Client, GatewayIntentBits, SlashCommandBuilder, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { readWriteInspiration } = require('./inspiration');

const fs = require('fs');
const path = require('node:path');

let arr = new SlashCommandBuilder()
	.setName('vote')
	.setDescription('Sends a poll where players can vote on who gets an inspiration point')
;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessagePolls, // Required for polls
	],
});

async function handlePollResults(response, message, interaction) {
	// only the user who started the poll can close it
	const collectorFilter = (i) => i.user.id === interaction.user.id;
	
	// message automatically times out after 60 minutes
	const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 60_000_000 });

	if (confirmation.customId === 'closePoll') {
		
		// close out poll
		await message.poll.end();

		// get poll answers
		let answers = message.poll.answers;
		let maxVotes = 0;
		let winners = [];

		answers.forEach((answer) => {	
			if (answer.voteCount > maxVotes) {
				maxVotes = answer.voteCount;
				winners = [answer.text]; // reset winner list with new leader
			} else if (answer.voteCount === maxVotes && maxVotes > 0) {
				winners.push(answer.text); // handle ties
			}
		});

		let newInspos = "";
  
		if (maxVotes === 0) {
			console.log(`Result: No one voted in this poll.`);
			newInspos = "No one voted :(";
		} 
		else if (winners.length === 2) {
			console.log(`Result: It's a tie! Winners: ${winners.join(', ')} (${maxVotes} votes each)`);
			readWriteInspiration("add", winners[0], 0.5);
			newInspos = `It's a tie! Winners: ${winners.join(', ')} (${maxVotes} vote(s) each)\n` + readWriteInspiration("add", winners[1], 0.5);
		} 
		else if (winners.length === 1) {
			console.log(`Result: The winner is "${winners[0]}" with ${maxVotes} votes!`);
			newInspos = readWriteInspiration("add", winners[0], 1);
		} 
		else {
			newInspos = "More than 2 players tied in this vote, DM will decide.";
		}

		// send string with new inspiration scores to chat
		await response.resource.message.channel.send(newInspos);

		// change the poll text to say the poll is closed
		await confirmation.update({ content: 'Vote Closed!', components: [] });
	}
	else {
		await confirmation.update({ content: 'Action cancelled', components: [] });
	}
}

module.exports = {
	data: arr,
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		
		try {
			const poll = {
				question: { text: "Inspiration Vote!" },
				answers: [
					{ text: "Aurelius", emoji: "🍷" },
					{ text: "Jade", emoji: "🐱" },
					{ text: "Likrix", emoji: "🦋" },
					{ text: "Miguel", emoji: "🦝" },
					{ text: "Zignial", emoji: "🪽" },
				],
				allowMultiselect: true, // bool, represents whether users can pick multiple options
				duration: 1, // duration in hours (min 1) 
			};

			// buttons have to be added to a row component
			const close = new ButtonBuilder().setCustomId('closePoll').setLabel('Close Poll').setStyle(ButtonStyle.Danger);
			const row = new ActionRowBuilder().addComponents(close);

			const response = await interaction.reply({
				poll: poll,
				content: "",
				components: [row],
				withResponse: true,
			});

			handlePollResults(response, response.resource.message, interaction);
		}
		catch {
			console.log("something went wrong");
		}
	},
};