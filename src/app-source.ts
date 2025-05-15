import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true,
  logging: false,
  entities: [process.env.ENTITIES_FOLDER || "src/entities/**/*.ts"],
});

export function getRepo(entity: any) {
  return AppDataSource.getRepository(entity);
}
