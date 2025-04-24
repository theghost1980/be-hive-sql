import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  // Puedes incluir metadata si tus logs la tienen
  return `${timestamp} ${level}: ${message}`;
});

// --- Logger General para la Aplicación ---
export const AppLogger: WinstonLogger = createLogger({
  level: "info", // Nivel por defecto para este logger (ej: info, warn, error)
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
      level: "info",
    }),
    new transports.File({
      filename: "application.log",
      level: "info",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: "errors.log",
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

export const LoginLogger: WinstonLogger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new transports.File({
      filename: "login.log",
      level: "info",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    // Opcional: Si quieres que los logs de login también aparezcan en la consola,
    // añade un Console transport aquí con su propio formato si es necesario.
    // new transports.Console({
    //     format: combine(
    //         colorize(),
    //         timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    //         printf(({ level, message, timestamp }) => {
    //           return `[LOGIN-EVENT] ${timestamp} ${level}: ${message}`; // Formato específico para logins en consola
    //         })
    //     )
    // }),
  ],
  exitOnError: false,
});

// --- Cómo usar ---

// Para logs generales de la aplicación:
// AppLogger.info("La aplicación ha iniciado correctamente.");
// AppLogger.warn("Advertencia: Recurso no encontrado.");
// AppLogger.error("¡Error crítico! La base de datos no responde.", { dbStatus: "down" });

// Para logs de eventos de login:
// Cuando un usuario se logre exitosamente:
// LoginLogger.info("User logged in successfully", { username: "theghost1980", ip: "192.168.1.100" });

// Cuando haya un intento de login fallido:
// LoginLogger.warn("Failed login attempt", { username_attempted: "unknown_user", ip: "203.0.113.5" });
