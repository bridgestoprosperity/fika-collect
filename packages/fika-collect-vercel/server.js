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

// Enable CORS for local development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

for (const route of vercelJson.routes) {
  if (route.src && route.dest && route.dest.startsWith('api/')) {
    const methods = route.methods || ["GET"];
    const path = route.src.replace(/^\//, ""); // Remove leading slash
    const srcName = route.dest
      .split("/")
      .pop()
      .replace(/\?.*/, "")
      .replace(".ts", ".js");
    const src = resolve(join(__dirname, "dist", srcName));
    const expressPath = `/${path.replace(/\(\?<(\w+)>.*\)/, ":$1")}`;

    // Register all HTTP methods for this route
    for (const method of methods) {
      const methodLower = method.toLowerCase();
      const handler = (await import(src))[method.toUpperCase()];

      console.log(`Registering ${method} ${expressPath} -> ${srcName}`);

      if (handler) {
        app[methodLower](expressPath, async (req, res) => {
          try {
            // Create a proper Request object for the handler
            const url = new URL(req.url, `http://${req.headers.host}`);

            // Add route parameters (like :id) as query parameters
            // so handlers can access them via url.searchParams.get('id')
            if (req.params) {
              for (const [key, value] of Object.entries(req.params)) {
                url.searchParams.set(key, value);
              }
            }

            const requestInit = {
              method: req.method,
              headers: req.headers,
            };
            if (req.body && Object.keys(req.body).length > 0) {
              requestInit.body = JSON.stringify(req.body);
            }
            const request = new Request(url, requestInit);

            const response = await handler(request);
            res.status(response.status).json(await response.json());
          } catch (error) {
            logger.error(`Error in ${method} ${expressPath}:`, error);
            res.status(500).json({ error: error.message });
          }
        });
      }
    }
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
