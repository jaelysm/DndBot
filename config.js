require('dotenv').config();

module.exports = {
  bot: {
    token: process.env.TOKEN,
  },
  server: {
    clientId: process.env.CLIENTID,
    guildId: process.env.GUILDID
  }
};
