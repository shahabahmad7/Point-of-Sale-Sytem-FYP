import express, { Router } from "express";
import aiController from "../controllers/aiController";
import { protect } from "../middlewares/protect";
import { restrictTo } from "../middlewares/restrictTo";

const router: Router = express.Router();

// Protect all AI routes - only admin users can access
router.use(protect);
router.use(restrictTo("admin"));

// Sales Forecasting Routes
router.get("/sales-forecast", aiController.getSalesForecast);
router.get("/sales-forecast/products/:productId", aiController.getProductForecast);

// Inventory Management Routes
router.get("/inventory-alerts", aiController.getInventoryAlerts);
router.get("/inventory-summary", aiController.getInventorySummary);
router.post("/trigger-inventory-check", aiController.triggerInventoryCheck);

export default router;
