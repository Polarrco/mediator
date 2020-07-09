import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../../lib";
import { IAMModule } from "./ApiGateway/IAMModule";

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
      type: "AWS-SNS-SQS",
      SNS: {
        arn: process.env.AWS_SNS_ARN_IAM!,
        region: process.env.AWS_region!,
        accessKeyId: process.env.AWS_accessKeyId!,
        secretAccessKey: process.env.AWS_secretAccessKey!,
      },
      SQS: {
        url: process.env.AWS_SQS_URL_IAM!,
        region: process.env.AWS_region!,
        accessKeyId: process.env.AWS_accessKeyId!,
        secretAccessKey: process.env.AWS_secretAccessKey!,
      },
    }),
    IAMModule,
  ],
})
export class AppModule {}
