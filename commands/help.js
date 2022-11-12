const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports={
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help command'),
    async execute(interaction){
        await interaction.reply({embeds:[new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Help')
        .setDescription('Basic Help Command')
        
        .addFields(
            {name: 'User Commands', value: '```/user``` ```/stats``` ```/dailygames```',},
            {name: 'Game Commands', value: '```game``` ```dailypuzzle```'},
            {name: 'Club Commands', value: '```/club```'},
            {name: 'Utility', value: '```/ping``` ```/help```'}
        )
        
        ]})
    }
}