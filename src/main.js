//make a class named Poster , its a pckage to interact wiht discord bot list api
const { EventEmitter } = require("events");
const { BotList } = require("./list.js");
const { Utilities, ValidationUtil } = require("./utilities.js");
/**
 * Handles posting statistics to all bot lists at once, allowing for auto posting.
 */
class BotListPoster extends EventEmitter {
  /**
   * @param botLists The bot lists to post to.
   * @param options The poster options.
   */
  constructor(botLists, options) {
    super();

    // Filter out bot lists that don't support statistics posting
    const botListsWithStatistics = botLists.filter(
      BotList.hasBotStatisticsPosting
    );
    const botListEntries = botListsWithStatistics.map((botList) => [
      botList.key,
      botList,
    ]);
    this.botLists = Utilities.makeReadonlyMap(botListEntries);

    this.options = ValidationUtil.validatePosterOptions(options);
  }

  /**
   * Send bot statistics to all postable bot lists.
   */
  async postStatistics() {
    const options = await this.buildStatisticsOptions();

    const promises = [];
    for (const botList of this.botLists.getValues()) {
      promises.push(botList.postStatistics(options));
    }
    await Promise.all(promises);
  }

  /**
   * Start automatically posting statistics to all postable bot lists.
   * @param interval The interval in milliseconds, defaults to 30 minutes.
   */
  startAutoPoster(interval = 1800000) {
    if (this.autoPostInterval) this.stopAutoPoster();

    this.autoPostInterval = setInterval(async () => {
      const options = await this.buildStatisticsOptions();

      const promises = [];
      const errors = [];
      for (const botList of this.botLists.getValues()) {
        promises.push(
          botList
            .postStatistics(options)
            .catch((error) => void errors.push(error))
        );
      }
      await Promise.all(promises);

      if (errors.length) {
        const error = errors.length === 1 ? errors[0] : new Error(errors);
        this.emit(BotListPoster.Event.AutoPostFailure, options, error);
      } else {
        this.emit(BotListPoster.Event.AutoPostSuccess, options);
      }
    }, interval);
  }

  /**
   * Stop automatically posting statistics to all postable bot lists.
   */
  stopAutoPoster() {
    if (!this.autoPostInterval) return;
    clearInterval(this.autoPostInterval);
    this.autoPostInterval = null;
  }

  /**
   * Fetch statistics and build the options.
   */
  async buildStatisticsOptions() {
    const guildCount = await this.options.guildCount();
    const userCount = await this.options.userCount();
    const shardCount = await this.options.shardCount();
    const voiceConnectionCount = await this.options.voiceConnectionCount();

    return ValidationUtil.validateStatisticsOptions({
      guildCount,
      userCount,
      shardCount,
      voiceConnectionCount,
    });
  }
}

/* Events */
/**
 * Namespace for bot list poster events.
 */
BotListPoster.Event = {
  AutoPostSuccess: "autoPostSuccess",
  AutoPostFailure: "autoPostFailure",
};

/* Event parameters for bot list poster events */
const BotListPosterEventParams = {
  [BotListPoster.Event.AutoPostSuccess]: [
    BotList.StatisticsOptions, // Replace with the appropriate type or value
  ],
  [BotListPoster.Event.AutoPostFailure]: [
    BotList.StatisticsOptions, // Replace with the appropriate type or value
    new Error(), // Replace with the appropriate type or value
  ],
};

/* Options */
/**
 * Namespace for bot list poster options.
 */
const BotListPosterOptions = {
  /**
   * The bot list poster options.
   */
  Options: {
    /** Function used to get guild count. */
    getGuildCount: () => Promise.resolve(0), // Replace with your implementation
    /** Function used to get user count. */
    getUserCount: () => Promise.resolve(0), // Replace with your implementation
    /** Function used to get shard count. */
    getShardCount: () => Promise.resolve(0), // Replace with your implementation
    /** Function used to get voice connection count. */
    getVoiceConnectionCount: () => Promise.resolve(0), // Replace with your implementation
  },
};

module.exports = {
  BotListPoster
};