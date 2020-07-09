import { Module } from "@nestjs/common";
import { NotificationController } from "./NotificationController";
import { SMSRepository } from "./SMSRepository";
import { UserCreatedIntegrationEventHandler } from "./UserCreatedIntegrationEventHandler";
import { UserUpdatedIntegrationEventHandler } from "./UserUpdatedIntegrationEventHandler";

@Module({
  controllers: [NotificationController],
  providers: [SMSRepository, ...[UserUpdatedIntegrationEventHandler, UserCreatedIntegrationEventHandler]],
})
export class NotificationServiceModule {}
