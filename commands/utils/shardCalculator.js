module.exports.run = async(client, message, args) => {


    if (!args[0] && !args[1]) {

        message.channel.send("What the id of the server ?").then(async msg_demande1 => {
            var response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
            const msg1 = response.array()[0]
            msg1.delete()
            msg_demande1.delete()

            if (isNaN(msg1.content)) return message.channel.send("❌ __**Error:**__ Please give a correct server id. *example :* `661708081926897684`")

            message.channel.send("How many shard your bot have ?").then(async msg_demande2 => {
                var response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                const msg2 = response.array()[0]
                msg2.delete()
                msg_demande2.delete()


                if (isNaN(msg2.content)) return message.channel.send("❌ __**Error:**__ Please give a correct shard count. *example :* `16`")


                const shard = (((msg1.content >> 22) & 0x7FFFFFFF) % msg2.content) + 1


                message.channel.send("The given server is on the shard `" + shard + "` of this bot.")





            })
        })

    } else if (args[0] && args[1]) {

        if (isNaN(args[0])) return message.channel.send("❌ __**Error:**__ Please give a correct server id. *example :* `661708081926897684`")

        if (isNaN(args[1])) return message.channel.send("❌ __**Error:**__ Please give a correct shard count. *example :* `16`")


        const shard = (((args[0] >> 22) & 0x7FFFFFFF) % args[1]) + 1


        message.channel.send("The given server is on the shard `" + shard + "` of this bot.")






    } else {

        message.channel.send("❌ __**Error:**__ Wrong syntax. Example: `c!shardcalc 661708081926897684 16`")
    }
}

module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["shardCalc"],
    serverForced: false
}

module.exports.help = {
    description: "Found the server shard on a bot from its id",
    utilisations: `c!shardcalc | c!shardcalc serverid shardCount`,
    exemples: `c!shardcalc 661708081926897684 16`
}