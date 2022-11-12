const {Client, Events, GatewayIntentBits, Collection, EmbedBuilder} = require('discord.js')
const token = require('./config.json').token
const fs = require('fs')
const path = require('path')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()
const lastrestart = Math.floor(Date.now()/1000)

module.exports={lastrestart}

const client = new Client({intents:[GatewayIntentBits.Guilds]})
client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) { //i dont know what this means
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

clearimg()

client.on('ready', ()=>{
    console.log('logged in and shit')
	client.user.setPresence({
		activities: [{name: 'chess'}],
		status: 'online',
	})
})

client.on('interactionCreate', async interaction=>{
    if(!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if(!command){
        console.log('not a command dumbass')
        return
    }

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({embeds: [
			new EmbedBuilder()
				.setColor('Red')
				.setTitle('Error Executing Command')
				.setDescription('The command file threw an error, so no clue what happened')
				.addFields(
					{name: 'Error thrown', value: '```' + error.toString() + '```'}
				)
		], ephemeral: true})
	}
})

//clear img folder evey once in awhile (good idea)

function clearimg(){
	const dir = fs.readdirSync('./img')
	dir.forEach(element =>
		fs.unlinkSync(`./img/${element}`)
		)

}

setInterval(
	clearimg, 60000 * 60 * 24
)



client.login(token)

module.exports ={
	lastrestart
}