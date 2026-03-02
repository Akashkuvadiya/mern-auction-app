import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  getCommissionStats,
  getPaymentStats,
  getDashboardStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

// Routes accessible only to Super Admin
router.get(
  "/stats",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getDashboardStats
);
router.get(
  "/commission-stats",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getCommissionStats
);
router.get(
  "/payment-stats",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getPaymentStats
);

export default router;
