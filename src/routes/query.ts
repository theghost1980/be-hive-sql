import { Request, Response, Router } from "express";
import {
  getAllOnboardings,
  getOnboarded,
  getOnboardingsByOnboarder,
} from "../db/localdb";
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
        const onboardedList = await getOnboarded(username);
        return res.status(200).json(onboardedList);
      } catch (error: any) {
        AppLogger.error(`Error leyendo onboardings en DB. ${error.message}`);
        return res.status(500).json("Error interno del servidor!");
      }
    }
  }
);

queryRouter.get(
  "/getAll",
  requireUserToken,
  async (req: Request, res: Response) => {
    try {
      const onboardings = await getAllOnboardings();
      res.status(200).json(onboardings);
    } catch (error: any) {
      console.error("Error getting all onboardings:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default queryRouter;
