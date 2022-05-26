// eslint-disable-next-line
require("dotenv-safe").config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3001);

  console.log("Notification Service is listening on port 3001.");
}

bootstrap();
