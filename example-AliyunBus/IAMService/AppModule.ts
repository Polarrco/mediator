import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../../lib";
import { IAMModule } from "./ApiGateway/IAMModule";
import { EventBus_Usage } from "../../lib/IntegrationEvent/IntegrationEventModuleOptions";

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
      type: "Aliyun-RocketMQ",
      usage: process.env.ALIYUN_BUS_USAGE as EventBus_Usage,
      rocketMQ: {
        accessKeyId: process.env.ALIYUN_BUS_ROCKETMQ_ACCESS_KEY_ID!,
        accessKeySecret: process.env.ALIYUN_BUS_ROCKETMQ_ACCESS_KEY_SECRET!,
        endpoint: process.env.ALIYUN_BUS_ROCKETMQ_ENDPOINT!,
        instanceId: process.env.ALIYUN_BUS_ROCKETMQ_INSTANCE_ID!,
        topic: process.env.ALIYUN_BUS_ROCKETMQ_TOPIC!,
        groupId: process.env.ALIYUN_BUS_ROCKETMQ_GROUP_ID!,
        batchSize: parseInt(process.env.ALIYUN_BUS_ROCKETMQ_BATCH_SIZE!),
        pollingDelayInSeconds: parseInt(process.env.ALIYUN_BUS_ROCKETMQ_POLLING_DELAY_IN_SECONDS!),
      },
    }),
    IAMModule,
  ],
})
export class AppModule {}
