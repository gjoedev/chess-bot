const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports={
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('basic stats of user')
        .addStringOption(option=>
            option.setName('targetuser')
            .setDescription('target chess.com user')
            .setRequired(true)
        ),
    async execute(interaction){
        let targetuser = interaction.options.getString('targetuser')
        let rjson
        let avt
        let pjson


        await chessAPI.getPlayer(targetuser).then(response=>{
            avt = response.body.avatar
            pjson = response.body
        }, function(err){
            console.log(err) //todo: implement missing pfp on fail
        })


        chessAPI.getPlayerStats(targetuser).then(response=>{
            rjson = response.body
            if(rjson.chess_daily == undefined || rjson.chess_rapid == undefined){
                interaction.reply({embeds:[new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Error')
                    .setDescription(`Could not find stats for ${targetuser}`)
                    .addFields(
                        {name: 'Cause (Probably)', value: 'User has no stats to display (absolute L)'}
                    )
                ]})
                return
            }
            interaction.reply({embeds:[new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`Stats for ${pjson.username}`)
                .setDescription(`Daily and Rapid Scores of [${pjson.username}](${pjson.url})`)
                .setThumbnail(avt)
                .addFields(
                    {name: 'Daily', value: rjson.chess_daily.last.rating.toString()},
                    {name: 'Rapid', value: rjson.chess_rapid.last.rating.toString()},
                    {name: 'Best Daily', value: `${rjson.chess_daily.best.rating.toString()}, <t:${rjson.chess_daily.best.date}:R>`},
                    {name: 'Best Rapid', value: `${rjson.chess_rapid.best.rating.toString()}, <t:${rjson.chess_rapid.best.date}:R>`}
                    )
            ]})
        },function(err, response){

            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`Failed to fetch stats for user ${targetuser}`)
                .addFields(
                    {name: 'Response Status Code', value: '```' + err.statusCode + '```'},
                    {name: 'Full error', value: '```' + err + '```'}
                )
            ]})
        } )
    }
}
//nice