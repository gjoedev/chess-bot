const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('club')
        .setDescription('gets basic information about a club')
        .addStringOption(option=>
            option.setName('club_id')
            .setDescription('id of the club, found in the url')
            .setRequired(true)
            ),
    async execute(interaction){
        let clubid = interaction.options.getString('club_id')
        let rjson

        await chessAPI.getClub(clubid).then(response=>{
            rjson = response.body


            let embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`${rjson.name}`)
            .setDescription(`Stats for club [${rjson.name}](${rjson.id})`)
            .setThumbnail(rjson.icon.toString())
            .addFields(
                {name: 'Club Id', value: '```' + rjson.club_id.toString() + '```', inline: true},
                {name: 'Name', value: rjson.name.toString(), inline:true},
                {name: 'Description', value: rjson.description, inline: true},
                {name: 'Avg Daily Rating', value: rjson.average_daily_rating.toString(), inline:true},
                {name: 'Member Count', value: rjson.members_count.toString(), inline:true},
                {name: 'Created', value: `<t:${rjson.created}:f>`, inline:true},
                {name: 'Last Activity', value: `<t:${rjson.last_activity}:R>`, inline:true},
                {name: 'Visibility', value: rjson.visibility.toString(), inline:true},
                {name: 'Request to Join', value: rjson.join_request.toString(), inline:true}
            )
        

            let country_abrv = rjson.country.split('/')[5]
            if(country_abrv == 'XX'){
                embed.addFields(
                    {name: 'Country', value: ':united_nations:', inline:true}
                )
            }else{
                embed.addFields(
                    {name: 'Country', value: `:flag_${country_abrv.toLowerCase()}:`, inline:true}
                )
            }
            interaction.reply({embeds: [embed]})


        }, function(err){
            interaction.reply({embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`Failed to fetch info on club ${clubid.toString()}`)
                .addFields(
                    {name: 'Response Status Code', value: '```' + err.statusCode + '```'},
                    {name: 'Full error', value: '```' + err + '```'}
                )
            ]})
            return
        })

        
    }
} //nice