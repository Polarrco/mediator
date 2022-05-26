import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../lib";
import { IAMModule } from "./IAMService/IAMModule";
import { NotificationServiceModule } from "./NotificationService/NotificationServiceModule";
import { EventBus_Type } from "../lib/IntegrationEvent/IntegrationEventModuleOptions";

@Module({
  imports: [
    IntegrationEventModule.forRoot({
      type: EventBus_Type.InMemory,
    }),
    IAMModule,
    NotificationServiceModule,
  ],
})
export class AppModule {}
