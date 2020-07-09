import { Module } from "@nestjs/common";
import { IAMController } from "./IAMController";
import { IdentityRepository } from "./IdentityRepository";
import { UserCreatedIntegrationEventHandler } from "./UserCreatedIntegrationEventHandler";

@Module({
  controllers: [IAMController],
  providers: [IdentityRepository, ...[UserCreatedIntegrationEventHandler]],
})
export class IAMModule {}
