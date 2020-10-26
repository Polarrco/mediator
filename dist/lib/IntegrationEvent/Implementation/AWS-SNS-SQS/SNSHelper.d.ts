import { SNS } from "aws-sdk";
import { IntegrationEvent } from "../../IntegrationEvent";
export declare class SNSHelper {
    static publishEvent(options: {
        event: IntegrationEvent;
        SNSArn: string;
        SNSClient: SNS;
    }): Promise<object>;
}
//# sourceMappingURL=SNSHelper.d.ts.map