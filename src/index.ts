import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import accountsRouter from "./routes/accounts";
import { AppLogger } from "./utils/logger.util";

//TODO improve sec + keychain login same as index, protect all routes. Upload to VPS and test

//TODO Automatizar que tu VPS compile o actualice código de un repo de GitHub cada vez que hagas un push (envíes cambios)

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", accountsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  AppLogger.info(`Server Up using ${port}`);
});
