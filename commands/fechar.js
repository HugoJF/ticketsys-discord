const Discord = require('discord.js')

module.exports = {
  run: async (client, message) => {
    message.delete().catch(O_o => {});
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("``❌`` Adicione um usuário. (" + process.env.COMMAND_PREFIX + "autofechar <@user>)").then(msg => msg.delete(8000))
    client.channels.get(message.channel.id).overwritePermissions(member.user, {
      "READ_MESSAGES": false,
      "SEND_MESSAGES": false,
      "ATTACH_FILES": false,
      "CONNECT": false,
      "CREATE_INSTANT_INVITE": false,
      "ADD_REACTIONS": false
    })
    const ticketLog = new Discord.RichEmbed()
      .setAuthor(process.env.TICKET_EMBED_TITLE, process.env.TICKET_ICON)
      .setThumbnail(member.avatarURL)
      .setColor(process.env.TICKET_EMBED_COLOR)
      .addField("**Ticket:**", "<#" + message.channel.id + ">", true)
      .addField("**Tópico:**", process.env.TICKET_TYPE_1, true)
      .setDescription("``🗑️`` Ticket fechado.")
      .addField("**Avaliação:**", "Não encontrada", true)
    client.channels.get(process.env.LOG_TICKET_ID).send({
      embed: ticketLog
    })
    client.channels.get(message.channel.id).send("``❗`` " + process.env.TICKET_CLOSE_CHANNEL).then(msg => msg.delete(9000))
    client.channels.get(message.channel.id).setParent(process.env.TICKET_CATEGORY_HISTORY_ID)
  },

  get command() {
    return {
      name: 'fechar',
      category: 'tickets',
      description: '[COMANDO UTILIZADO PARA FECHAR TICKETS]',
      usage: 'fechar'
    }
  }

}
