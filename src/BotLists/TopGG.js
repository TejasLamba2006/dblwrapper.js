const { Utilities, ValidationUtil } = require('../utilities');
const { BotList } = require('../list');


class TopGG extends BotList {
    constructor() {
      super();
      this.key = 'topgg';
      this.title = 'Top.gg';
      this.logoUrl = 'https://top.gg/images/dblnew.png';
      this.websiteUrl = 'https://top.gg';
      this.apiUrl = 'https://top.gg/api';
    }
  
    async postStatistics(options) {
      options = ValidationUtil.validateStatisticsOptions(options);
  
      await Utilities.executePromiseWithEvents(
        () =>
          this.performRequest('POST', `/bots/${this.clientId}/stats`, {
            body: { server_count: options.guildCount, shard_count: options.shardCount },
            requiresApiToken: true,
          }),
        this,
        BotList.Events.StatisticsPostingSuccess,
        BotList.Events.StatisticsPostingFailure,
        [options]
      );
    }
  
    async getBot(id) {
      return this._performRequest('GET', `/bots/${id}`)
        .then(this._constructBot);
    }
  
    async getUser(id) {
      return this._performRequest('GET', `/users/${id}`)
        .then(this._constructUser);
    }
  
    hasVoted(id) {
      return this._performRequest('GET', `/bots/${this.clientId}/`, {
        query: { userId: id },
        requiresApiToken: true,
      }).then(({ voted }) => voted);
    }
  
    _constructBot(raw) {
      return {
        id: raw.id,
        username: raw.username,
        discriminator: raw.discriminator,
        avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar ?? raw.defAvatar}`,
        inviteUrl: raw.invite ?? `https://discord.com/oauth2/authorize?client_id=${raw.id}&scope=bot`,
        supportUrl: raw.support ? `https://discord.gg/${raw.support}` : undefined,
        websiteUrl: raw.website,
        shortDescription: raw.shortdesc,
        longDescription: raw.longdesc ?? '',
        raw,
      };
    }
  
    _constructUser(raw) {
      return {
        id: raw.id,
        username: raw.username,
        discriminator: raw.discriminator,
        avatarUrl: `https://cdn.discordapp.com/avatars/${raw.id}/${raw.avatar ?? raw.defAvatar}`,
        raw,
      };
    }
  
    _constructWebhookVote(raw) {
      return {
        type: raw.type === 'upvote' ? 'vote' : 'test',
        userId: raw.user,
        raw,
      };
    }
  }
  
  TopGG.IncomingBot = class {
    constructor() {
      this.id = '';
      this.username = '';
      this.discriminator = '';
      this.avatar = undefined;
      this.defAvatar = '';
      this.lib = '';
      this.prefix = '';
      this.shortdesc = '';
      this.longdesc = undefined;
      this.tags = [];
      this.website = undefined;
      this.support = undefined;
      this.github = undefined;
      this.owners = [];
      this.guilds = [];
      this.invite = undefined;
      this.date = '';
      this.server_count = undefined;
      this.shard_count = undefined;
      this.certifiedBot = false;
      this.vanity = undefined;
      this.points = 0;
      this.monthlyPoints = 0;
      this.donatebotguildid = '';
    }
  };
  
  TopGG.IncomingUser = class {
    constructor() {
      this.id = '';
      this.username = '';
      this.discriminator = '';
      this.avatar = undefined;
      this.defAvatar = '';
      this.bio = undefined;
      this.banner = undefined;
      this.social = {
        youtube: undefined,
        reddit: undefined,
        twitter: undefined,
        instagram: undefined,
        github: undefined,
      };
      this.color = undefined;
      this.supporter = false;
      this.certifiedDev = false;
      this.mod = false;
      this.webMod = false;
      this.admin = false;
    }
  };
  
  TopGG.IncomingWebhookVote = class {
    constructor() {
      this.bot = undefined;
      this.guild = undefined;
      this.user = '';
      this.type = '';
      this.isWeekend = undefined;
      this.query = '';
    }
  };
  
  TopGG.IncomingBot.satisfies = BotList.Bot;
  TopGG.IncomingUser.satisfies = BotList.User;
  TopGG.IncomingWebhookVote.satisfies = BotList.WebhookVote;
  
  module.exports = {
    TopGG
  };