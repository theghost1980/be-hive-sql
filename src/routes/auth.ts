import { PublicKey, Signature } from "@hiveio/dhive";
import crypto from "crypto";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { secret } from "..";
import { getDHiveClient } from "../hive/DHive.api";
import { AuthUtils } from "../utils/auth.utils";
import { AppLogger } from "../utils/logger.util";

const clientDhive = getDHiveClient();

const authRouter = Router();

const pendingChallenges: Record<string, string> = {};

authRouter.post("/challenge", (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(403).json({ error: "Username required!" });
  }

  const challenge = AuthUtils.generateChallenge(username);
  pendingChallenges[username] = challenge;

  return res.json({ challenge });
});

authRouter.post("/verify", async (req: Request, res: Response) => {
  const { username, signature } = req.body; // 'signature' esperado como cadena hexadecimal

  const challenge = pendingChallenges[username];

  if (!challenge) {
    return res.status(400).json({ error: "No challenge found for this user." });
  }

  try {
    // Convertir cadena hex de firma a Buffer y crear objeto dhive.Signature
    let signatureBuffer: Buffer;
    try {
      signatureBuffer = Buffer.from(signature, "hex");
      if (signatureBuffer.length !== 65) {
        // Una firma típica tiene 65 bytes
        throw new Error("Signature buffer has incorrect length.");
      }
    } catch (bufferError: any) {
      return res.status(400).json({ error: "Invalid signature format." });
    }
    const dhiveSig = Signature.fromBuffer(signatureBuffer);

    // Calcular hash SHA-256 del challenge
    const challengeHash = crypto
      .createHash("sha256")
      .update(challenge)
      .digest(); // Retorna Buffer

    // Recuperar clave pública que firmó el hash usando dhive
    const recoveredPubKey = dhiveSig.recover(challengeHash);

    // Obtener datos de la cuenta del usuario usando tu cliente dhive
    if (!clientDhive) {
      return res
        .status(500)
        .json({ error: "Server error: Hive client not available." });
    }
    const accounts = await clientDhive.database.getAccounts([username]);

    // Verificar si cuenta fue encontrada
    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ error: "User account not found on the blockchain." });
    }

    // Extraer claves públicas de posting
    const account = accounts[0];
    const userPostingKeys = account?.posting?.key_auths?.map(
      ([keyOrPubKey, weight]: [string | PublicKey, number]) => {
        return keyOrPubKey.toString();
      }
    );

    // Comparar clave recuperada con claves de posting
    const recoveredPubKeyString = recoveredPubKey.toString(); // Convertir a string STM...

    if (
      !Array.isArray(userPostingKeys) ||
      !userPostingKeys.includes(recoveredPubKeyString)
    ) {
      return res.status(401).json({
        error:
          "Authentication failed: Signature does not match user's posting authority.",
      });
    }

    // Autenticación Exitosa
    delete pendingChallenges[username]; // Eliminar challenge usado

    // Emitir JWT
    if (secret) {
      const token = jwt.sign({ username, role: "user" }, secret, {
        expiresIn: "1h",
      });
      return res.json({ success: true, token });
    } else {
      return res.json({
        success: true,
        message:
          "Authentication successful, but server is not configured to issue tokens.",
      });
    }
  } catch (err: any) {
    // Manejo de errores generales
    console.error("Error during authentication verification process:", err);
    return res.status(500).json({
      error: "Server error during verification process.",
      details: err.message,
    });
  }
});

authRouter.post("/validate-token", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    AppLogger.warn(
      "Token validation failed: Authorization header missing or malformed."
    );
    return res
      .status(401)
      .json({ success: false, message: "Authorization token required" });
  }

  if (!secret) {
    AppLogger.error(
      "JWT Secret is not configured on the backend! Critical error."
    );
    return res
      .status(500)
      .json({ success: false, message: "Server configuration error" });
  }

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      AppLogger.error("Token validation failed:", {
        message: err.message,
        name: err.name,
      });
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const username = decoded.username;

    if (!username || typeof username !== "string") {
      AppLogger.error(
        "Token validated, but payload is missing or has invalid username format.",
        decoded
      );
      return res
        .status(500)
        .json({ success: false, message: "Token payload invalid" });
    }

    AppLogger.info(`Token validated successfully for user: "${username}".`);
    res.status(200).json({ success: true, username: username });
  });
});

export default authRouter;
