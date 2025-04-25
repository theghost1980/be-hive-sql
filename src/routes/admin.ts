import { Router } from "express";
import { getLogsByUsername, getOnboardingsByOnboarder } from "../db/localdb";
import { AppLogger } from "../utils/logger.util";

const adminRouter = Router();

adminRouter.get("/logs-by-username", async (req, res) => {
  const username = req.query.username;
  if (!username || typeof username != "string") {
    return res.status(400).json("Username is required here! String required");
  } else {
    try {
      const logList = await getLogsByUsername(username);
      return res.status(200).json(logList);
    } catch (error: any) {
      AppLogger.error(`Error leyendo logs en DB. ${error.message}`);
      return res.status(500).json("Error interno del servidor!");
    }
  }
});

adminRouter.get("/onboarding-by-onboarder", async (req, res) => {
  const onboarder = req.query.onboarder;
  if (!onboarder || typeof onboarder != "string") {
    return res.status(400).json("Onboarder is required here! String required");
  } else {
    try {
      const logList = await getOnboardingsByOnboarder(onboarder);
      return res.status(200).json(logList);
    } catch (error: any) {
      AppLogger.error(`Error leyendo logs en DB. ${error.message}`);
      return res.status(500).json("Error interno del servidor!");
    }
  }
});

export default adminRouter;
