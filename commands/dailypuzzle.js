const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailypuzzle')
        .setDescription('gives info about todays daily puzzle'),
    async execute(interaction){
        let rjson


        await chessAPI.getDailyPuzzle().then(response =>{
            rjson = response.body
        })
        interaction.reply({embeds: [new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Daily puzzle')
            .setDescription('Info about todays daily puzzle')
            .addFields(
                {name: 'Title', value: rjson.title, inline:true},
                {name: 'URL', value: rjson.url.toString(), inline: true},
                {name: 'Time published', value:`<t:${rjson.publish_time}:R>`, inline: true}
            )
            .setImage(rjson.image.toString())
        ]})
    }
}