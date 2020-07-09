import { Module } from "@nestjs/common";
import { IEHUserNotified } from "./Application/IntegrationEventHandler/IEH-UserNotified";
import { IdentityRepository } from "./Application/Repository/IdentityRepository";

@Module({
  providers: [IdentityRepository, IEHUserNotified],
})
export class IAMServiceModule {}
