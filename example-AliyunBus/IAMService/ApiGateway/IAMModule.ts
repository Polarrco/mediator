import { Module } from "@nestjs/common";
import { IAMServiceModule } from "../Service";
import { IAMController } from "./IAMController";

@Module({
  controllers: [IAMController],
  imports: [IAMServiceModule],
})
export class IAMModule {}
