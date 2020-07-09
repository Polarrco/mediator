import { Module } from "@nestjs/common";
import { IntegrationEventModule } from "../lib";
import { IAMModule } from "./IAMService/IAMModule";
import { NotificationServiceModule } from "./NotificationService/NotificationServiceModule";

@Module({
  imports: [
    IntegrationEventModule.forRoot({
      type: "InMemory",
    }),
    IAMModule,
    NotificationServiceModule,
  ],
})
export class AppModule {}
