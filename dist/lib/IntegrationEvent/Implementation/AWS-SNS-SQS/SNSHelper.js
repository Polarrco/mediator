"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getConstructorName_1 = require("../../../Helper/getConstructorName");
class SNSHelper {
    static async publishEvent(options) {
        const params = {
            Message: JSON.stringify(options.event),
            MessageAttributes: {
                "event-name": {
                    DataType: "String",
                    StringValue: getConstructorName_1.getConstructorName(options.event) || "UndefinedEventName",
                },
            },
            TopicArn: options.SNSArn,
        };
        return await options.SNSClient.publish(params).promise();
    }
}
exports.SNSHelper = SNSHelper;
//# sourceMappingURL=SNSHelper.js.map