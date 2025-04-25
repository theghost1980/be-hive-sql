import { Request, Response, Router } from "express";
import {
  getOnboardingByPair,
  insertLog,
  insertOnboarding,
  LogEntry,
  OnboardingEntry,
} from "../db/localdb";
import { requireUserToken } from "../middleware/middleware";

const onboardingRouter = Router();

onboardingRouter.post(
  "/add",
  requireUserToken,
  async (req: Request, res: Response) => {
    const {
      onboarder,
      onboarded,
      amount,
      memo,
    }: { onboarder: string; onboarded: string; amount: string; memo: string } =
      req.body;

    if (!onboarder || !onboarded || !amount || !memo) {
      return res.status(400).json({
        error: "Required fields: onboarder, onboarded, amount, memo.",
      });
    }

    try {
      const existingOnboarding = await getOnboardingByPair(
        onboarder,
        onboarded
      );

      if (existingOnboarding.length) {
        return res.status(409).json({ message: "Onboarding already exists." });
      }

      // Insertar el nuevo onboarding
      const timestamp = Date.now();
      await insertOnboarding({
        onboarder,
        onboarded,
        amount,
        memo,
        timestamp,
      } as OnboardingEntry);

      // Registrar la acción en los logs
      await insertLog({
        username: onboarder,
        action: `onboarded: ${onboarded}`,
      } as LogEntry);

      res.status(201).json({ message: "Onboarding registered successfully." });
    } catch (error: any) {
      console.error("Error al registrar onboarding:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default onboardingRouter;
