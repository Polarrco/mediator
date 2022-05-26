import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../../lib";
import { IAMModule } from "./ApiGateway/IAMModule";
import { EventBus_Type, EventBus_Usage } from "../../lib/IntegrationEvent/IntegrationEventModuleOptions";

/**
 * Configure SNS-SQS subscription filter policy like below:
 * {
 *    "event-name": [
 *      "Polarr"
 *    ]
 * }
 */
@Module({
  imports: [
    IntegrationEventModule.forRoot({
      usage: EventBus_Usage.ProducerOnly,
      type: EventBus_Type.AWS_SNS_SQS,
      SNS: {
        arn: process.env.AWS_BUS_SNS_ARN!,
        region: process.env.AWS_BUS_REGION!,
        accessKeyId: process.env.AWS_BUS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_BUS_SECRET_ACCESS_KEY!,
      },
      SQS: {
        url: process.env.AWS_BUS_SQS_URL!,
        region: process.env.AWS_BUS_REGION!,
        accessKeyId: process.env.AWS_BUS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_BUS_SECRET_ACCESS_KEY!,
      },
    }),
    IAMModule,
  ],
})
export class AppModule {}
