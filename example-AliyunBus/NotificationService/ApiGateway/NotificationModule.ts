import { Module } from "@nestjs/common";
import { NotificationServiceModule } from "../Service";
import { NotificationController } from "./NotificationController";

@Module({
  controllers: [NotificationController],
  imports: [NotificationServiceModule],
})
export class NotificationModule {}
