import express from "express";
import controller from "../controllers/auth";

const router = express.Router();

router.get("/google", controller.authUser);
router.get("/google/callback", controller.callback);
router.get("/logout", controller.logout);

export default router;
