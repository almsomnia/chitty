export default {
   host: process.env.DB_HOST ?? "localhost",
   port: Number(process.env.DB_PORT ?? 5432),
   database: process.env.DB_DATABASE ?? "database",
   user: process.env.DB_USER ?? "postgres",
   password: process.env.DB_PASSWORD,
}
