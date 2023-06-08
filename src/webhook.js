const { EventEmitter } = require("events");
const express = require("express");
const { Utilities, ValidationUtil } = require("./utilities");
const { BotList } = require("./list");
const { type } = require("os");

class Webhook extends EventEmitter {
  constructor(lists, options) {
    super();
    const listsWithVoteReceiving = lists.filter((list) =>
      BotList.hasVoteReceiving(list)
    );
    const listEntries = listsWithVoteReceiving.map((list) => [list.key, list]);
    this.lists = Utilities.makeReadonlyMap(listEntries);
    this.options = ValidationUtil.validateWebhookOptions(options);
    this.server = express();
    this.server.use(express.json());
    this.initialize();
  }

  initialize() {
    for (const list of this.lists.getValues()) {
      this.server.get(`/receive/${list.key}/vote`, (req, res) => {
res.status(200).send({
  status: "ok",
  type: "application/json",
  data: {
    key: list.key,
  },

});
      });
      this.server.post(`/receive/${list.key}/vote`, (req, res) => {
        const authorization = req.headers.authorization;
        if (authorization !== list.webhookToken) return res.sendStatus(401);
        if (!req.body) return res.sendStatus(400);
        const vote = list._constructWebhookVote(req.body);
        list.emit(Webhook.Events.NewVote, vote);
        this.emit(Webhook.Events.NewVote, list, vote);
        return Promise.resolve(this.options.handleAfterVote?.(req, res)).then(
          () => (res.headersSent ? undefined : res.sendStatus(200))
        );
      });
    }
    this.server.listen(this.options.port, () =>
      this.emit(Webhook.Events.Ready)
    );
  }
}

Webhook.Events = {
  Ready: "ready",
  NewVote: "newVote",
};

module.exports = { Webhook };

Webhook.Options = {
  port: 0,
  handleAfterVote: (req, res) => {},
};

Webhook.EventParams = {
  [Webhook.Events.Ready]: [],
  [Webhook.Events.NewVote]: [BotList, BotList.WebhookVote],
};

module.exports = {
  Webhook
};