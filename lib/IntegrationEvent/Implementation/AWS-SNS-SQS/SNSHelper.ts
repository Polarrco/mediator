import { SNS } from "aws-sdk";
import { getConstructorName } from "../../../Helper/getConstructorName";
import { IntegrationEvent } from "../../IntegrationEvent";
import { undefinedEventName } from "../../../Helper/undefinedEventName";

/**
 * The naming convention for SNS topic is Service-[ServiceName].
 *
 * One Service can only have one topic, use Message Attribute or Message Tag to indicate message type
 * and filter the messages based on type before sending them to SQS.
 */
export class SNSHelper {
  public static async publishEvent(options: {
    event: IntegrationEvent;
    SNSArn: string;
    SNSClient: SNS;
  }): Promise<Record<string, any>> {
    const params = {
      Message: JSON.stringify(options.event),
      // We add in a message attribute to filter on.
      MessageAttributes: {
        "event-name": {
          DataType: "String",
          StringValue: getConstructorName(options.event) || undefinedEventName,
        },
      },
      TopicArn: options.SNSArn,
    };

    return await options.SNSClient.publish(params).promise();
  }
}
