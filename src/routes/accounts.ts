import { Router } from "express";
import { requireUserToken } from "../middleware/middleware";
import { accountsQueries } from "../queries/accounts/account.queries";
import { executeQuery, testConnection } from "../utils/db";

const router = Router();

router.get("/testCon", requireUserToken, async (req, res) => {
  const tests = await testConnection();
  res.status(200).json({ tests });
});

router.get("/new-24-h", requireUserToken, async (req, res) => {
  const rawLimit = req.query.limit;
  let limitQueryTo: number;

  const DEFAULT_LIMIT = 10;
  const MAX_ALLOWED_LIMIT = 500;

  if (typeof rawLimit === "string") {
    const parsedLimit = parseInt(rawLimit);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limitQueryTo = parsedLimit;
      if (limitQueryTo > MAX_ALLOWED_LIMIT) {
        limitQueryTo = MAX_ALLOWED_LIMIT;
        return res.status(400).json({
          status: "not_allowed",
          reason: "Limit exceeds max. Limit = 500",
        });
      }
    } else {
      limitQueryTo = DEFAULT_LIMIT;
    }
  } else {
    limitQueryTo = DEFAULT_LIMIT;
  }

  try {
    const sqlQuery = accountsQueries.get_new_users_24h_limit_to(limitQueryTo);
    const resultado = await executeQuery(sqlQuery);
    res.json({
      query_identifier: "get_new_users_24h_limit_to",
      sql_limit_used: limitQueryTo,
      execution_time: resultado.time,
      results: resultado.results,
    });
  } catch (error: any) {
    console.error("Error al obtener los resultados:", error);
    // Manejo de errores (evita enviar detalles internos completos en producción)
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message, // Opcional para debug
    });
  }
});

router.get("/fish-new-limit", requireUserToken, async (req, res) => {
  const rawLimit = req.query.limit;
  let limitQueryTo: number;

  const DEFAULT_LIMIT = 10;
  const MAX_ALLOWED_LIMIT = 500;

  if (typeof rawLimit === "string") {
    const parsedLimit = parseInt(rawLimit);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limitQueryTo = parsedLimit;
      if (limitQueryTo > MAX_ALLOWED_LIMIT) {
        limitQueryTo = MAX_ALLOWED_LIMIT;
        return res.status(400).json({
          status: "not_allowed",
          reason: "Limit exceeds max. Limit = 500",
        });
      }
    } else {
      limitQueryTo = DEFAULT_LIMIT;
    }
  } else {
    limitQueryTo = DEFAULT_LIMIT;
  }
  try {
    const resultado = await executeQuery(
      accountsQueries.get_new_30_days_min_1_post_avg_low_votes_limit_to(
        limitQueryTo
      )
    );
    res.json({
      query_identifier: "get_new_30_days_min_1_post_avg_low_votes",
      execution_time: resultado.time,
      results: resultado.results,
    });
  } catch (error) {
    console.error("Error al obtener los resultados:", error);
    res.status(500).json({ error: "Error interno del servidor", err: error });
  }
});

router.get("/fish-new", requireUserToken, async (req, res) => {
  try {
    const resultado = await executeQuery(
      accountsQueries.get_new_30_days_min_1_post_avg_low_votes
    );
    res.json({
      query_identifier: "get_new_30_days_min_1_post_avg_low_votes",
      execution_time: resultado.time,
      results: resultado.results,
    });
  } catch (error) {
    console.error("Error al obtener los resultados:", error);
    res.status(500).json({ error: "Error interno del servidor", err: error });
  }
});

router.get("/recent-accounts", requireUserToken, async (req, res) => {
  try {
    const resultado = await executeQuery(
      accountsQueries.get_new_users_past_month_with_low_votes
    );
    res.json({
      q: "getNewAccountsLast24h_limitTo",
      t: resultado.time,
      res: resultado.results,
    });
  } catch (error) {
    console.error("Error al obtener los resultados:", error);
    res.status(500).json({ error: "Error interno del servidor", err: error });
  }
});

//TODO add as needed in future bellow
// router.post("/custom-query", async (req, res) => {
//   const { query } = req.body;

//   if (!query || typeof query !== "string") {
//     return res.status(400).json({ error: "Consulta inválida" });
//   }

//   if (!query.trim().toLowerCase().startsWith("select")) {
//     return res.status(403).json({ error: "Solo se permiten consultas SELECT" });
//   }

//   try {
//     const result = await executeQuery(query);
//     res.status(200).json({
//       q: query,
//       t: result.time,
//       res: result.results,
//     });
//   } catch (error) {
//     console.error("Error en consulta personalizada:", error);
//     res.status(500).json({
//       error: "Error al ejecutar la consulta",
//       err: error,
//     });
//   }
// });

export default router;
