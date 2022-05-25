import { Module } from "@nestjs/common";
import { IEHUserCreated } from "./Application/IntegrationEventHandler/IEH-UserCreated";
import { IEHUserNotified } from "./Application/IntegrationEventHandler/IEH-UserNotified";
import { SMSRepository } from "./Application/Repository/SMSRepository";

@Module({
  providers: [SMSRepository, IEHUserNotified, IEHUserCreated],
})
export class NotificationServiceModule {}
