import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import accountsRouter from "./routes/accounts";
import authRouter from "./routes/auth";
import usefulRouter from "./routes/useful-info";
import { AppLogger } from "./utils/logger.util";
import { checkRPCHive } from "./utils/nectatflower.util";
import { ShutdownUtils } from "./utils/shutdown.util";

export const lastTestedRPCNode = {
  nectarflower_ts: 0,
  rpc_layer_1_url: "",
};

//TODO improve sec + keychain login same as index, protect all routes. Upload to VPS and test

//TODO Automatizar que tu VPS compile o actualice código de un repo de GitHub cada vez que hagas un push (envíes cambios)

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
export const secret = process.env.SECRET;
if (!secret) {
  AppLogger.error("Vital data in .env not found! Please check, contact admin!");
  process.exit(0);
}
const periodicCheckIntervalMs = 30 * 60 * 1000; // Define el intervalo (ej: 5 minutos = 5 * 60 * 1000) actual: 30min
let periodicCheckTimer: NodeJS.Timeout | null = null;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de tu backend Hive/HSBI!");
});
app.use("/api", accountsRouter); //protected
app.use("/public", usefulRouter); //free use public
app.use("/auth", authRouter);

async function runCheckAndReschedule() {
  AppLogger.info(`[${new Date().toISOString()}] Running periodic RPC check...`);
  try {
    await checkRPCHive();
  } catch (error: any) {
    AppLogger.error("Periodic RPC check failed.", {
      error_message: error.message,
    });
    ShutdownUtils.killGracefully();
  } finally {
    periodicCheckTimer = setTimeout(
      runCheckAndReschedule,
      periodicCheckIntervalMs
    );
  }
}

function scheduleFirstPeriodicCheck() {
  AppLogger.info(
    `Scheduling first periodic RPC check to run in ${
      periodicCheckIntervalMs / 1000
    } seconds.`
  );
  periodicCheckTimer = setTimeout(
    runCheckAndReschedule,
    periodicCheckIntervalMs
  );
}

//interval cleaners
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  if (periodicCheckTimer) clearTimeout(periodicCheckTimer);
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received (Ctrl+C). Shutting down gracefully...");
  if (periodicCheckTimer) clearTimeout(periodicCheckTimer);
  process.exit(0);
});

checkRPCHive()
  .then(() =>
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
      AppLogger.info(`Server Up using ${port}`);
      scheduleFirstPeriodicCheck();
    })
  )
  .catch((e: any) => {
    AppLogger.error(
      "Servidor Desactivado por seguridad. Por favor revise chequeo inicial de nodos RPC",
      {
        status: "initial checks failed",
        error_message: e.message,
      }
    );
    ShutdownUtils.killGracefully();
  });
