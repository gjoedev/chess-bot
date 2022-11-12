const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports={
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping'),
    async execute(interaction){
        await interaction.reply({embeds:[new EmbedBuilder()
        .setColor('Green')
        .setTitle('very amazingly programmed ping command')
        .setDescription('shoutout to me for this amazingly programmed ping command')
        
        .addFields(
            {name:'Ping', value: '```' + Math.abs(new Date().getTime() - interaction.createdTimestamp) + 'ms```', inline: true}
        )
        
        ]})
    }
}