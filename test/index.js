// const { BotList, BotListPoster } = require("../index");

// const lists = [
//     new BotList.TopGG('1109759607657725983', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDk3NTk2MDc2NTc3MjU5ODMiLCJib3QiOnRydWUsImlhdCI6MTY4NjIxNzA3NX0.cYYWwFf3xH3ol-XFs39iqoV8gIKWzzYlzbnzyB1poQY')
// ];

// // This example uses 'discord.js' and '@discordjs/voice', promises are supported
// const poster = new BotListPoster(lists, {
//     shardCount: () =>  1,
//     guildCount: () => 25,
//     userCount: () => 45778,
//     // 'getGroups' is a function within '@discordjs/voice', you may prefer to just return 0
//     voiceConnectionCount: () => 3,
// });

// //poster.postStatistics();

// poster.on(BotListPoster.Event.AutoPostSuccess, (options) => {
//     console.log(`Posted statistics to ${options.length} bot lists`);
// });

// poster.on(BotListPoster.Event.AutoPostFailure, (options, error) => {
//     console.error(`Failed to post statistics to ${options.length} bot lists`);
//     console.error(error);
// });

const { BotList, Webhook } = require("../index");

const topGG = new BotList.TopGG(
  "1109759607657725983",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDk3NTk2MDc2NTc3MjU5ODMiLCJib3QiOnRydWUsImlhdCI6MTY4NjIxNzA3NX0.cYYWwFf3xH3ol-XFs39iqoV8gIKWzzYlzbnzyB1poQY",
  "topgg"
  );

const webhook = new Webhook([topGG], {
    port: 8080
})
webhook.on(Webhook.Events.Ready, () => {
    console.log("Webhook ready");
});
webhook.on(Webhook.Events.NewVote, (list, vote) => {
    console.log(`New vote on ${list.key}: ${vote.user.id}`);
})
