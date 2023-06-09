const { EventEmitter } = require("events");
const { URL } = require("url");
const { Request } = require("./requests.js");
/**
 * Each bot list class will extend this class.
 */
class BotList extends EventEmitter {
  /**
   * @param {string} botId The ID of the bot.
   * @param {string} apiToken The API token for this list.
   * @param {string} [webhookToken] Webhook token for this list that belongs to the bot.
   */

  constructor(clientId, apiToken, webhookToken) {
    super();

    this.key = '';
    this.title = '';
    this.logoUrl = '';
    this.websiteUrl = '';
    this.apiUrl = '';
    this.clientId = clientId;
    this.apiToken = apiToken;
    this.webhookToken = webhookToken;
  }
  /**
   * Perform a request to this list's API.
   * @param {string} method Request method.
   * @param {string} path Path to request.
   * @param {Request.Options & Request.AdditionalOptions} [options] Request options.
   * @returns {Promise<Response>} The response data from the API.
   */
  performRequest(method, path, options = {}) {
    if (!options.headers) options.headers = {};
    options.headers['Authorization'] ??= this._formatApiToken();
    if (options.requiresApiToken && !options.headers['Authorization']) {
      console.log(this.title)
      throw new Error('MissingAPIToken');
    }
    return Request.perform(method, new URL(this.apiUrl + path), options);
  }

  _formatApiToken() {
    return this.apiToken;
  }
}

BotList.Events = {
  StatisticsPostingSuccess: 'statisticsPostingSuccess',
  StatisticsPostingFailure: 'statisticsPostingFailure',
  NewVote: 'newVote',
};

BotList.EventParams = {
  [BotList.Events.StatisticsPostingSuccess]: ['statisticsOptions'],
  [BotList.Events.StatisticsPostingFailure]: ['statisticsOptions', 'requestError'],
  [BotList.Events.NewVote]: ['webhookVote'],
};

BotList.StatisticsOptions = {
  guildCount: 0,
  userCount: 0,
  shardCount: 0,
  voiceConnectionCount: 0,
};

BotList.Bot = {
  id: '',
  username: '',
  discriminator: '',
  avatarUrl: '',
  inviteUrl: '',
  supportUrl: '',
  websiteUrl: '',
  shortDescription: '',
  longDescription: '',
  raw: {},
};

BotList.Server = {
  id: '',
  name: '',
  iconUrl: '',
  inviteUrl: '',
  shortDescription: '',
  longDescription: '',
  raw: {},
};

BotList.User = {
  id: '',
  username: '',
  discriminator: '',
  avatarUrl: '',
  raw: {},
};

BotList.WebhookVote = {
  type: '',
  userId: '',
  raw: {},
};

BotList.hasBotStatisticsPosting = (list) => {
  return (
    'postStatistics' in list &&
    typeof list.postStatistics === 'function'
  );
};

BotList.hasVoteReceiving = (list) => {
  return (
    '_constructWebhookVote' in list &&
    typeof list._constructWebhookVote === 'function'
  );
};

BotList.hasBotFetching = (list) => {
  return 'getBot' in list && typeof list.getBot === 'function';
};

BotList.hasUserBotsFetching = (list) => {
  return 'getUserBots' in list && typeof list.getUserBots === 'function';
};

BotList.hasServerFetching = (list) => {
  return 'getServer' in list && typeof list.getServer === 'function';
};

BotList.hasUserServersFetching = (list) => {
  return 'getUserServers' in list && typeof list.getUserServers === 'function';
};

BotList.hasUserFetching = (list) => {
  return 'getUser' in list && typeof list.getUser === 'function';
};

BotList.hasHasVotedFetching = (list) => {
  return 'hasVoted' in list && typeof list.hasVoted === 'function';
};



module.exports = {
  BotList
};