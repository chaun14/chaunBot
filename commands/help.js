const Discord = require("discord.js");

module.exports.run = async (client, message, args, prefixes) => {

	console.log("customprefix =" + args)


	let catégories = [];


	let embed = new Discord.RichEmbed();
				embed.setDescription("Commande help \n Mon préfixe sur ce serveur est `"+ "c!"+"`");
				embed.setFooter(client.user.username, client.user.displayAvatarURL);
				embed.setTimestamp();
				embed.setColor("#dd0000");
			
	client.commands.forEach(command => {
		if (catégories.indexOf(command.config.category) == -1) {
		catégories.push(command.config.category)
	}
	});


	catégories.forEach(catégorie => {
		let commandlist = "";
		client.commands.forEach(command => {
			if (command.config.category == catégorie){
				console.log("cmd "+command.config.name)
				commandlist = commandlist + "`"+command.config.name +"` *"+command.help.description+ "*\n"
			}
		})
		embed.addField(catégorie, commandlist);
	});

	message.channel.send(embed);


}



	module.exports.config = {
		category: "Utile",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		aliases: ["h"],
		serverForced: false
	}

module.exports.help = {
	description: "Commande d'aide.",
	utilisations: `help`,
	exemples: ``
}