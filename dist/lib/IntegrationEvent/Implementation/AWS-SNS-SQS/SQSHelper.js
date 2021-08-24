"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSHelper = void 0;
const date_fns_1 = require("date-fns");
const sqs_consumer_1 = require("sqs-consumer");
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
                    const subscription = [...subscriptions.entries()].find(([eventConstructor]) => eventConstructor.name === parsedBody.EventName);
                    if (!subscription) {
                        throw new Error(`There is no subscription respecting to this event: ${parsedBody.EventName}.`);
                    }
                    const [eventConstructor, eventHandlers] = subscription;
                    if (!eventConstructor || !eventHandlers || eventHandlers.length === 0) {
                        throw new Error(`There is no event handler respecting to this event: ${parsedBody.EventName}.`);
                    }
                    else {
                        const event = new eventConstructor(parsedBody.EventBody);
                        for (const handler of eventHandlers) {
                            await handler.handle(event);
                        }
                    }
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
}
exports.SQSHelper = SQSHelper;
//# sourceMappingURL=SQSHelper.js.map