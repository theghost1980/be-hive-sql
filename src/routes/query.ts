import { Router } from "express";
import { getOnboarded, getOnboardingsByOnboarder } from "../db/localdb";
import { requireUserToken } from "../middleware/middleware";
import { AppLogger } from "../utils/logger.util";

const queryRouter = Router();

queryRouter.get(
  "/all-onboarded-by-username",
  requireUserToken,
  async (req, res) => {
    const username = req.query.username;
    if (!username || typeof username != "string") {
      return res.status(400).json("Username is required here! String required");
    } else {
      try {
        const logList = await getOnboardingsByOnboarder(username);
        return res.status(200).json(logList);
      } catch (error: any) {
        AppLogger.error(`Error leyendo onboardings en DB. ${error.message}`);
        return res.status(500).json("Error interno del servidor!");
      }
    }
  }
);

queryRouter.get(
  "/onboarded-by-username",
  requireUserToken,
  async (req, res) => {
    const username = req.query.username;
    if (!username || typeof username != "string") {
      return res.status(400).json("Username is required here! String required");
    } else {
      try {
        const logList = await getOnboarded(username);
        return res.status(200).json(logList);
      } catch (error: any) {
        AppLogger.error(`Error leyendo onboardings en DB. ${error.message}`);
        return res.status(500).json("Error interno del servidor!");
      }
    }
  }
);

export default queryRouter;
