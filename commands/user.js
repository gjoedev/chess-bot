const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const ChessWebAPI = require('chess-web-api')
const chessAPI = new ChessWebAPI()

module.exports ={
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('info about the user')
        .addStringOption(option=>
            option.setName('targetuser')
            .setDescription('target chess.com user')
            .setRequired(true)
            ),
    async execute(interaction){
        let targetuser = interaction.options.getString('targetuser')
        let rjson

        await chessAPI.getPlayer(targetuser).then(response=>{
            rjson = response.body

        }, function(err){
            interaction.reply({embeds: [ //todo: make it so discord.js doesnt sieze up and die when trying to reply to the interaction after error execution
                new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error')
                .setDescription(`Failed to fetch info for ${targetuser}`)
                .addFields(
                    {name: 'Response Status Code', value: '```' + err.statusCode + '```'},
                    {name: 'Full error', value: '```' + err + '```'}
                )
            ]})
        })

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setThumbnail(rjson.avatar)
        .setTitle(`User info for ${rjson.username}`)
        .setDescription(`Pretty much all user info given by the API`)
        .addFields(
            {name: 'Profile link', value: rjson.url, inline: true},
            {name: 'ID', value:'```' + rjson.player_id + '```', inline: true},
            {name: 'Status', value: rjson.status.toString(), inline: true},
            {name: 'Followers', value: rjson.followers.toString(), inline: true},
            {name: 'Streamer', value: rjson.is_streamer.toString(), inline: true},
            {name: 'Verified', value: rjson.verified.toString(), inline: true},
            {name: 'Join Date', value: `<t:${rjson.joined}:D>`, inline:true},
            {name: 'Last Online', value: `<t:${rjson.last_online}:R>`, inline:true}
        )
        //and so i enter if statement hell

        if(rjson.name != undefined){
            embed.addFields(
                {name:'Name:', value: `${rjson.name}`, inline:true}
            )
        }
        if(rjson.location != undefined){
            embed.addFields(
                {name: 'Location', value: rjson.location, inline:true}
            )
        }
        let country_abrv = rjson.country.split('/')[5]
        if(country_abrv == 'XX'){
            embed.addFields(
                {name: 'Country', value: ':united_nations:', inline:true}
            )
        }else{
            embed.addFields(
                {name: 'Country', value: `:flag_${country_abrv.toLowerCase()}:`, inline:true}
            ) //nice
        }
        if(rjson.title != undefined){
            embed.addFields(
                {name: 'Title', value: rjson.title}
            )
        }
        if(rjson.fide != undefined){
            embed.addFields(
                {name: 'FIDE Rating', value: rjson.fide.toString(), inline:true}
            )
        }
        if(rjson.twitch_url != undefined){
            embed.addFields(
                {name: 'Twitch Link', value: rjson.twitch_url.toString(), inline:true}
            )
        }

        //phew got out of there
        interaction.reply({embeds:[embed]})
    }
}