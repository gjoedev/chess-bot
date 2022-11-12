const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports ={
    data: new SlashCommandBuilder()
        .setName('clubmembers')
        .setDescription('lists all members of a club (hell)')
        .addStringOption(option =>
            option.setName('club_id')
            .setDescription('id of the club')
            .setRequired(true)
            ),
    async execute(interaction){
        let rjson
        let clubid = interaction.options.getString('club')

        await chessAPI.getClubMembers(clubid).then(response=>{
            rjson = response.body
            console.log(rjson)
        })

        let embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Members in ${rjson.name}`)
        .setDescription(`Why would you run this command. Think of all the processing power you just used up. Was it worth it?`)

        for(const user of rjson.all_time){
            embed.addFields({
                name: `${user.username.toString()}`, value: `<t:${user.joined.toString()}:f>`, inline: true
            })
        }

        interaction.reply({embeds: [embed]})
    }
}