const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()
const {lastrestart} = require('../index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('info about the bot'),
    async execute(interaction){
        interaction.reply({embeds:[
            new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Bot Info')
                .setDescription(
                    `Last Restart: <t:${lastrestart}:R>
                    Ping to discord API: ${Math.abs(new Date().getTime() - interaction.createdTimestamp)}
                    Dependancies:
                        Chess Web API: https://github.com/andyruwruw/chess-web-api (modified for bot usage)
                        Chess Image Generator: https://github.com/andyruwruw/chess-image-generator
                        discord.js: https://github.com/andyruwruw/chess-image-generator
                    Code Stats:
                        Language: NodeJS v16.10.0
                        Source: maybe
                    Developer:
                        Contact (Discord): https://discord.com/users/724599899953430629
                        Contact (Email): if i get enough people i do email reveal
                        Github: https://github.com/gjoedev/
                        Single: Yes (and looking)
                    `
                )
        ]})
    }
}