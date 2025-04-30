import { Request, Response, Router } from "express";
import {
  getOnboardingByPair,
  insertLog,
  insertOnboarding,
  LogEntry,
  OnboardingEntry,
  updateOnboarding,
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
      const data = {
        onboarder,
        onboarded,
        amount,
        memo,
        timestamp,
      };
      await insertOnboarding(data as OnboardingEntry);

      // Registrar la acción en los logs
      await insertLog({
        username: onboarder,
        action: `onboarded: ${onboarded}`,
      } as LogEntry);

      res
        .status(201)
        .json({ message: "Onboarding registered successfully.", data });
    } catch (error: any) {
      console.error("Error al registrar onboarding:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

onboardingRouter.put(
  "/edit",
  requireUserToken,
  async (req: Request, res: Response) => {
    const {
      onboarder,
      onboarded,
      comment_permlink,
    }: {
      onboarder: string;
      onboarded: string;
      comment_permlink: string;
    } = req.body;

    if (!onboarder || !onboarded || !comment_permlink) {
      return res.status(400).json({
        error: "Required fields to update record!",
      });
    }

    try {
      const existingOnboarding = await getOnboardingByPair(
        onboarder,
        onboarded
      );

      if (!existingOnboarding || existingOnboarding.length === 0) {
        return res
          .status(404)
          .json({ message: "Onboarding record not found." });
      }

      const record = existingOnboarding.find(
        (e) => e.onboarded === onboarded && e.onboarder === onboarder
      );

      if (!record) {
        return res
          .status(404)
          .json({ message: "Onboarding record not found. id" });
      }

      await updateOnboarding(record.id!, { comment_permlink });

      await insertLog({
        username: onboarder,
        action: `edited onboarding for: ${onboarded}, field: ${comment_permlink}`,
      } as LogEntry);

      res
        .status(200)
        .json({
          message: "Onboarding record updated successfully.",
          comment_permlink,
        });
    } catch (error: any) {
      console.error("Error updating onboarding record:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default onboardingRouter;
