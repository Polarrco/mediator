import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3000, () => console.log("Application is listening on port 3000."));
}
bootstrap();
