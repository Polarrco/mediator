import { getConstructorName } from "../../../Helper/getConstructorName";
import { IntegrationEvent } from "../../IntegrationEvent";
import { undefinedEventName } from "../../../Helper/undefinedEventName";
import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from "@aws-sdk/client-sns";

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
    SNSClient: SNSClient;
  }): Promise<PublishCommandOutput> {
    const params: PublishCommandInput = {
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

    return options.SNSClient.send(new PublishCommand(params));
  }
}
