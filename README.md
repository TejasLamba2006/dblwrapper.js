<div align="center">
    <h1>Discord Bot List</h1><br/>
    <h3>wrapper for doing anything with all major botlists</h3><br/>
    <code>npm install discord-bot-list</code><br/>
    <code>yarn add discord-bot-list</code/><br/>
    <code>pnpm add discord-bot-list</code><br/>
</div>

<div align="center">

[![Version](https://img.shields.io/npm/v/discord-bot-list?color=red&label=discord-bot-list)](https://github.com/TejasLamba2006/discord-bot-list)
[![Total Downloads](https://img.shields.io/npm/dt/discord-bot-list)](https://npmjs.com/discord-bot-list)

</div>

## Table of Contents
- [Table of Contents](#table-of-contents)
- [About](#about)
- [Supported Bot Lists](#supported-bot-lists)
- [Examples](#examples)
  - [Posting Bot Stats](#posting-bot-stats)
  - [Recieving Webhooks](#recieving-webhooks)
- [Bot List Specific Functions](#bot-list-specific-functions)
  - [Top.gg](#topgg)

## About

Discord Bot List is a comprehensive library that simplifies interacting with major bot lists. It not only allows you to easily post your bot's statistics to multiple Discord bot lists but also provides various other useful functions. With this library, you can check who has voted for your bot, retrieve detailed information about bots and users, and much more. It supports popular bot listing platforms and is designed to be user-friendly.



> Please note that while this library aims to support all major bot lists, some lists may not have been thoroughly tested yet.

## Supported Bot Lists

<table>
  <thead>
    <tr>
      <th>Icon</th>
      <th>Name</th>
      <th>Website</th>
      <th>Class Name</th>
    </tr>
  </thead>
  <tbody>
        <tr>
        <td><img src="https://top.gg/images/dblnew.png" width="32" height="32" /></td>
        <td>Top.gg</td>
        <td><a href="https://top.gg">top.gg</a></td>
        <td>TopGG</td>
        </tr>
  </tbody>
</table>

<div align="center" style="padding-top: 2rem; padding-bottom: 1rem">

| **More will be added soon** |
| ---------------------------------------- |

</div>

## Examples

### Posting Bot Stats

```js
const { BotList, BotListPoster } = require('discord-bot-list');

const lists = [
    new BotList.TopGG('you-bot-id', 'your-top.gg-api-token')
];

const poster = new BotListPoster(lists, {
    shardCount: () =>  1,
    guildCount: () => 25,
    userCount: () => 45778,
    voiceConnectionCount: () => 3,
});
// It is adviable to use real values for the above functions

poster.postStatistics(); //Post stats once
poster.startAutoPosting(); //Post stats every 30 minutes
poster.startAutoPosting(5 * 60 * 1000); //Post stats every 5 minutes
poster.stopAutoPoster(); //Stop auto posting
```

### Recieving Webhooks

```js
const { BotList, Webhook } = require('discord-bot-list');

const lists = [
    new BotList.TopGG('you-bot-id', 'your-top.gg-api-token')
];

const poster = new Webhook(lists, {
port: 3000, // Port to listen on
handleAfterVote: (req, res) => {
    // Do something after a user votes
}, // This isnt required 

});
// If you don't give handleAfterVote function, it will send a 200 response to the webhook and inbuilt events will be emitted
webhook.on(Webhook.Events.Ready, () => {
    // This event is emitted when the webhook is ready
    console.log("Webhook is ready!")
})
webhook.on(Webhook.Events.NewVote, (botList, vote) => {
    // This event is emitted when a new vote is recieved
    console.log(`New vote on ${botList.key} from ${vote.userId}`)
})

```
## Bot List Specific Functions

### Top.gg

- Importing
  ```js
    const { BotList : TopGG } = require('discord-bot-list');
    ```
- Constructor
    ```js
        const topgg = new TopGG('bot-id', 'api-token', 'webhook-password);
    ```
- Methods
  ```js
    // Get bot information from Top.gg
    topgg.getBot('bot-id').then(response => {
        console.log(response);
    }).catch(console.error);
    // Get user information from Top.gg
    topgg.getUser('user-id').then(response => {
        console.log(response);
    }).catch(console.error);
    // Check if user has voted for your bot
    topgg.hasVoted().then(response => {
        console.log(response);
    }).catch(console.error);
    /*
    true -> user voted in the last 24 hours
    false -> user didnt vote in the last 24 hours
    */
  ```
