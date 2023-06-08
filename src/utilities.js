class Utilities {
  static makeReadonlyMap(entries) {
    const map = new Map(entries);

    return Object.freeze({
      getEntries: map.entries.bind(map),
      forEach: map.forEach.bind(map),
      get: map.get.bind(map),
      has: map.has.bind(map),
      getKeys: map.keys.bind(map),
      getSize: map.size,
      getValues: map.values.bind(map),
      [Symbol.iterator]: map[Symbol.iterator].bind(map),
    });
  }

  static deleteUndefinedProperties(object) {
    for (const key of Object.keys(object)) {
      if (object[key] === undefined) {
        delete object[key];
      }
    }
    return object;
  }

  static async executePromiseWithEvents(
    promiseFunction,
    eventEmitter,
    successEvent,
    failureEvent,
    importantArgs = []
  ) {
    try {
      await promiseFunction();
      eventEmitter.emit(successEvent, ...importantArgs);
    } catch (error) {
      eventEmitter.emit(failureEvent, ...importantArgs, error);
      throw error;
    }
  }
}

class ValidationUtil {
  static validatePositiveInteger(name, value, required) {
    const integerValue = Number.parseInt(String(value), 10);

    if (Number.isNaN(integerValue)) {
      if (!required) return undefined;
      throw new TypeError(`InvalidType: ${name} must be a number`);
    } else if (integerValue < 0) {
      throw new RangeError(
        `MustBePositive: ${name} must be a positive integer`
      );
    } else return integerValue;
  }

  static validateFunction(name, value, required) {
    if (typeof value === "function") {
      return value;
    } else {
      if (!required) return undefined;
      throw new TypeError(`InvalidType: ${name} must be a function`);
    }
  }

  static validatePosterOptions(options) {
    if (typeof options !== "object" || options === null)
      throw new TypeError("InvalidType: options must be a record");
    const typedOptions = options;

    return {
      guildCount: this.validateFunction(
        "guildCount",
        typedOptions.guildCount,
        true
      ),
      userCount: this.validateFunction(
        "userCount",
        typedOptions.userCount,
        true
      ),
      shardCount: this.validateFunction(
        "shardCount",
        typedOptions.shardCount,
        true
      ),
      voiceConnectionCount: this.validateFunction(
        "voiceConnectionCount",
        typedOptions.voiceConnectionCount,
        true
      ),
    };
  }

  static validateWebhookOptions(options) {
    if (typeof options !== "object" || options === null)
      throw new TypeError("InvalidType: options must be a record");
    const typedOptions = options;

    return {
      port: this.validatePositiveInteger("port", typedOptions.port, true),
      handleAfterVote: this.validateFunction(
        "handleAfterVote",
        typedOptions.handleAfterVote,
        false
      ),
    };
  }

  static validateStatisticsOptions(options) {
    if (typeof options !== "object" || options === null)
      throw new TypeError("InvalidType: options must be a record");
    const typedOptions = options;

    return {
      guildCount: this.validatePositiveInteger(
        "guildCount",
        typedOptions.guildCount,
        true
      ),
      userCount: this.validatePositiveInteger(
        "userCount",
        typedOptions.userCount,
        true
      ),
      shardCount: this.validatePositiveInteger(
        "shardCount",
        typedOptions.shardCount,
        true
      ),
      voiceConnectionCount: this.validatePositiveInteger(
        "voiceConnectionCount",
        typedOptions.voiceConnectionCount,
        true
      ),
    };
  }
}


module.exports = {
  Utilities,
  ValidationUtil,
};