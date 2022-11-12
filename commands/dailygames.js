const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports={
    data: new SlashCommandBuilder()
        .setName('dailygames')
        .setDescription('list of daily games the user is in')
        .addStringOption(option=>
            option.setName('targetuser')
            .setDescription('target chess.com user')
            .setRequired(true)
            ),
    async execute(interaction){
        let targetuser = interaction.options.getString('targetuser')
        let rjson
        let avt

        await chessAPI.getPlayer(targetuser).then(response=>{
            avt = response.body.avatar
        }, function(err){
            console.log(err)
        })

        chessAPI.getPlayerCurrentDailyChess(targetuser).then(response=>{
            rjson = response.body
            let embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`Daily games for ${targetuser}`)
            .setDescription(`List of all daily games`)
            .setThumbnail(avt)
            for(const game of rjson.games){
                embed.addFields(
                    {name: `${game.white.split('/')[5]} vs ${game.black.split('/')[5]}`, value: `${game.url}`}
                )
            }
            interaction.reply({embeds:[embed]})
        },
        function(err, response){

            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`Failed to fetch daily games for user ${targetuser}`)
                .addFields(
                    {name: 'Response Status Code', value: '```' + err.statusCode + '```'},
                    {name: 'Full error', value: '```' + err + '```'}
                )
            ]})
        }
        )
    }
}