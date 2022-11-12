const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()
const ChessImageGenerator = require('chess-image-generator')
const imageGenerator = new ChessImageGenerator()
const fs = require('fs')

imageGenerator.style = "alpha"

module.exports ={
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('returns an image of the board')
        .addNumberOption(option=>
            option.setName('game_id')
            .setDescription('id of the chess game')
            .setRequired(true)
            )
        .addBooleanOption(option=>
            option.setName('is_daily')
            .setDescription('set to true if the target game is daily, leave blank if its live')
            .setRequired(false)
            ),
        
    async execute(interaction){
        let gameid = interaction.options.getNumber('game_id')
        let isdaily = interaction.options.getBoolean('is_daily')
        let rjson
        let type

    

        await chessAPI.getGameByID(gameid.toString(), isdaily).then(response=>{
            rjson = response.body


            imageGenerator.loadPGN(rjson.game.pgn)


            fs.writeFileSync(`./img/${gameid.toString()}.png`, 'overwite me')

            imageGenerator.generatePNG(`./img/${gameid.toString()}.png`)



            interaction.reply({embeds: [new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`[Game Link](https://chess.com/game/${type}/${gameid.toString()})`)
                .setTitle(`Game ${gameid.toString()}`)
                .setImage(`attachment://${gameid.toString()}.png`)
            ], files: [`./img/${gameid.toString()}.png`]})



        }, function(err){
            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`Failed to fetch game ${gameid.toString()}`)
                .addFields(
                    {name: 'Response Status Code', value: '```' + err.statusCode + '```'},
                    {name: 'Full error', value: '```' + err + '```'}
                )
            ]})
            return
        })

        
    }
}