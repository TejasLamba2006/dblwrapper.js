const { BotList, BotListPoster } = require("../index");

const lists = [
    new BotList.TopGG('botid', 'tsdsdsads')
];

// This example uses 'discord.js' and '@discordjs/voice', promises are supported
const poster = new BotListPoster(lists, {
    shardCount: () =>  1,
    guildCount: () => 0,
    userCount: () => 0,
    // 'getGroups' is a function within '@discordjs/voice', you may prefer to just return 0
    voiceConnectionCount: () => 0,
});

poster.postStatistics();

poster.on(BotListPoster.Event.AutoPostSuccess, (options) => {
    console.log(`Posted statistics to ${options.length} bot lists`);
});

poster.on(BotListPoster.Event.AutoPostFailure, (options, error) => {
    console.error(`Failed to post statistics to ${options.length} bot lists`);
    console.error(error);
});