import { readFileSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import winston from "winston";

const __dirname = dirname(fileURLToPath(import.meta.url));

const vercelJsonPath = join(__dirname, "../../vercel.json");
const vercelJson = JSON.parse(readFileSync(vercelJsonPath, "utf-8"));

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

const app = express();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

for (const route of vercelJson.routes) {
  if (route.src && route.dest) {
    const method = route.methods ? route.methods[0].toLowerCase() : "get";
    const path = route.src.replace(/^\//, ""); // Remove leading slash
    const srcName = route.dest
      .split("/")
      .pop()
      .replace(/\?.*/, "")
      .replace(".ts", ".js");
    const src = resolve(join(__dirname, "dist", srcName));
    const handler = (await import(src))[method.toUpperCase()];

    const expressPath = `/${path.replace(/\(\?<(\w+)>.*\)/, ":$1")}`;

    if (handler) {
      app[method](expressPath, async (req, res) => {
        try {
          const response = await handler(req);
          res.status(response.status).json(await response.json());
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    }
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
