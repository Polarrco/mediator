import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../../lib";
import { NotificationModule } from "./ApiGateway/NotificationModule";
import { EventBus_Type, EventBus_Usage } from "../../lib/IntegrationEvent/IntegrationEventModuleOptions";

@Module({
  imports: [
    IntegrationEventModule.forRoot({
      type: EventBus_Type.Aliyun_RocketMQ,
      usage: EventBus_Usage.All,
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
    NotificationModule,
  ],
})
export class AppModule {}
