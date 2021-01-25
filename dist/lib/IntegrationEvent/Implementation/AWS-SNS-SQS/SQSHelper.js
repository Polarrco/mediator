"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const sqs_consumer_1 = require("sqs-consumer");
const RedisHelper_1 = require("./RedisHelper");
class SQSHelper {
    static bundleQueueWithSubscriptions(options) {
        const consumer = sqs_consumer_1.Consumer.create({
            sqs: options.SQSClient,
            queueUrl: options.SQSUrl,
            batchSize: options.batchSize || 1,
            visibilityTimeout: options.visibilityTimeout || undefined,
            handleMessage: async (message) => {
                if (message.Body) {
                    let parsedBody;
                    try {
                        parsedBody = JSON.parse(message.Body);
                        parsedBody.TimestampParsed = new Date(parsedBody.Timestamp);
                        parsedBody.EventName = parsedBody.MessageAttributes["event-name"]["Value"];
                        parsedBody.EventBody = JSON.parse(parsedBody.Message, SQSHelper.jsonDateReviver);
                    }
                    catch (error) {
                        console.log(`Parse integration event error: ${error}`);
                        throw error;
                    }
                    const subscriptions = options.getSubscriptions();
                    await SQSHelper.handleEvent(parsedBody, subscriptions, options.RedisClient);
                }
            },
        });
        consumer.start();
        return consumer;
    }
    static jsonDateReviver(key, value) {
        if (typeof value === "string") {
            const date = date_fns_1.parseJSON(value);
            if (date_fns_1.isDate(date) && date_fns_1.isValid(date)) {
                return date;
            }
        }
        return value;
    }
    static async handleEvent(parsedBody, subscriptions, RedisClient) {
        const subscriptionNameMap = new Map([...subscriptions.entries()].map(entry => [
            entry[0].name,
            { eventConstructor: entry[0], eventHandlers: entry[1] },
        ]));
        let eventData = SQSHelper.getEventData(subscriptionNameMap, parsedBody.EventName, parsedBody.EventBody);
        if (eventData) {
            if (RedisClient) {
                const canExecute = await RedisHelper_1.RedisHelper.canStartEventExecution({ event: eventData, RedisClient: RedisClient });
                if (canExecute && eventData.queueId) {
                    let eventName;
                    let eventDataParsed;
                    let eventDataString = await RedisHelper_1.RedisHelper.fetchNextEvent({
                        queueId: eventData.queueId,
                        RedisClient: RedisClient,
                    });
                    while (eventDataString) {
                        eventDataParsed = JSON.parse(eventDataString, SQSHelper.jsonDateReviver);
                        eventName = eventDataParsed.eventName;
                        eventData = eventDataParsed;
                        if (eventData && eventData.queueId) {
                            await SQSHelper.executeEventHandlers(subscriptionNameMap, eventName, eventData);
                            eventDataString = await RedisHelper_1.RedisHelper.fetchNextEvent({
                                queueId: eventData.queueId,
                                RedisClient: RedisClient,
                            });
                        }
                        else {
                            break;
                        }
                    }
                }
                else {
                    await SQSHelper.executeEventHandlers(subscriptionNameMap, parsedBody.EventName, eventData);
                }
            }
            else {
                await SQSHelper.executeEventHandlers(subscriptionNameMap, parsedBody.EventName, eventData);
            }
        }
    }
    static getEventData(subscriptionNameMap, eventName, eventData) {
        let event = undefined;
        if (subscriptionNameMap.has(eventName)) {
            const subscription = subscriptionNameMap.get(eventName);
            if (subscription && subscription.eventConstructor) {
                event = new subscription.eventConstructor(eventData);
            }
        }
        return event;
    }
    static async executeEventHandlers(subscriptionNameMap, eventName, eventData) {
        if (subscriptionNameMap.has(eventName)) {
            const subscription = subscriptionNameMap.get(eventName);
            if (subscription && subscription.eventHandlers && subscription.eventHandlers.length > 0) {
                for (const handler of subscription.eventHandlers) {
                    await handler.handle(eventData);
                }
            }
        }
    }
}
exports.SQSHelper = SQSHelper;
//# sourceMappingURL=SQSHelper.js.map