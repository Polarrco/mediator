// eslint-disable-next-line
require("dotenv-safe").config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);

  console.log("IAM service is listening on port 3000.");
}

bootstrap();
