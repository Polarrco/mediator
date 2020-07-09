import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../../lib";
import { NotificationModule } from "./ApiGateway/NotificationModule";

@Module({
  imports: [
    IntegrationEventModule.forRoot({
      type: "AWS-SNS-SQS",
      SNS: {
        arn: process.env.AWS_SNS_ARN_Notification!,
        region: process.env.AWS_region!,
        accessKeyId: process.env.AWS_accessKeyId!,
        secretAccessKey: process.env.AWS_secretAccessKey!,
      },
      SQS: {
        url: process.env.AWS_SQS_URL_Notification!,
        region: process.env.AWS_region!,
        accessKeyId: process.env.AWS_accessKeyId!,
        secretAccessKey: process.env.AWS_secretAccessKey!,
      },
    }),
    NotificationModule,
  ],
})
export class AppModule {}
