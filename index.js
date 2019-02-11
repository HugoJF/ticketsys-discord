  const Discord = require('discord.js');
  const client = new Discord.Client();
  const {promisify} = require('util');
  const readdir = promisify(require('fs').readdir);
  const Enmap = require('enmap')

  client.commands = new Enmap()
  require('dotenv').config()

  const init = async () => {
    const cmdFiles = await readdir('./commands/')
    console.log('[#LOG]', `Carregando o total de ${cmdFiles.length} comandos.`)
    cmdFiles.forEach(f => {
      try {
        const props = require(`./commands/${f}`)
        if (f.split('.').slice(-1)[0] !== 'js') return
        if (props.init) {
          props.init(client)
        }
        client.commands.set(props.command.name, props)
      } catch (e) {
        console.log(`[#LOG] Impossivel executar comando ${f}: ${e}`)
      }
    })

  const evtFiles = await readdir('./events/')
    console.log('[#LOG]', `Carregando o total de ${evtFiles.length} eventos.`)
    evtFiles.forEach(f => {
      const eventName = f.split('.')[0]
      const event = require(`./events/${f}`)

      client.on(eventName, event.bind(null, client))
    })

    client.on('error', (err) => {
      console.log('[#ERROR]', err)
    })

    client.login(process.env.AUTH_TOKEN);
    client.on('ready', () => client.user.setPresence({
      status: 'online',
      game: {
        name: process.env.MOTD + ' | Gustavo 🔥#8002'
      }
    }));
  }
  init();

  client.on('messageReactionAdd', (reaction, user) => {
    var name = user.username;
    nameReplace = name.replace(/\s+/g, '-');
    if (client.channels.find("name", process.env.TICKET_TYPE_EMOTE_1 + "-" + nameReplace.toLowerCase())) {
      reaction.remove(user);
      client.channels.find("name", process.env.TICKET_TYPE_EMOTE_1 + "-" + nameReplace.toLowerCase()).overwritePermissions(user, {
        "READ_MESSAGES": true,
        "SEND_MESSAGES": true,
        "ATTACH_FILES": true,
        "CONNECT": true,
        "ADD_REACTIONS": true
      });
      client.channels.find("name", process.env.TICKET_TYPE_EMOTE_1 + "-" + nameReplace.toLowerCase()).setParent(process.env.TICKET_CATEGORY_ID)
      client.channels.find("name", process.env.TICKET_TYPE_EMOTE_1 + "-" + nameReplace.toLowerCase()).send("<@&" + process.env.TICKET_ROLE_ID + "> <@" + user.id + "> \n" + "``✅`` " + process.env.TICKET_REOPEN);
      return;
    }
    if (reaction.emoji.name === process.env.TICKET_TYPE_EMOTE_1 && client.channels.get(process.env.TICKET_CHANNEL_ID)) {
      reaction.remove(user);
      client.guilds.get(process.env.GUILD_ID).createChannel(process.env.TICKET_TYPE_EMOTE_1 + "-" + user.username, "text").then((createdChan) => {
        createdChan.setParent(process.env.TICKET_CATEGORY_ID).then((settedParent) => {
          settedParent.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find('name', process.env.TICKET_DEFAULT_ROLE), {
            "READ_MESSAGES": false,
            "SEND_MESSAGES": false
          });
          settedParent.overwritePermissions(client.guilds.get(process.env.GUILD_ID).roles.find('name', process.env.TICKET_ROLE_NAME), {
            "READ_MESSAGES": true,
            "SEND_MESSAGES": true,
            "ATTACH_FILES": true,
            "CONNECT": true,
            "CREATE_INSTANT_INVITE": false,
            "ADD_REACTIONS": true
          });
          settedParent.overwritePermissions(user, {
            "READ_MESSAGES": true,
            "SEND_MESSAGES": true,
            "ATTACH_FILES": true,
            "CONNECT": true,
            "CREATE_INSTANT_INVITE": false,
            "ADD_REACTIONS": true
          });
          const ticketChannel = new Discord.RichEmbed()
            .setAuthor(process.env.TICKET_EMBED_TITLE, process.env.TICKET_ICON)
            .setThumbnail(user.avatarURL)
            .setColor(process.env.TICKET_EMBED_COLOR)
            .addField("**Autor:**", user.username, true)
            .addField("**Tópico:**", process.env.TICKET_TYPE_1, true)
            .setDescription(process.env.TICKET_DESCRIPITION)
          settedParent.send("<@&" + process.env.TICKET_ROLE_ID + "> <@" + user.id + ">", {
            embed: ticketChannel
          });
          const ticketLog = new Discord.RichEmbed()
            .setAuthor(process.env.TICKET_EMBED_TITLE, process.env.TICKET_ICON)
            .setThumbnail(user.avatarURL)
            .setColor(process.env.TICKET_EMBED_COLOR)
            .addField("**Autor:**", user.username, true)
            .addField("**Tópico:**", process.env.TICKET_TYPE_1, true)
            .setDescription("``✅`` Ticket aberto.")
          client.channels.get(process.env.TICKET_CHANNEL_ID).send({
            embed: ticketLog
          });
          return;
        });
      });
    };
  });
