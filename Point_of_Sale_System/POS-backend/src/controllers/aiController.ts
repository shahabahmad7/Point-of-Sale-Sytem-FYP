import { Request, Response } from "express";
import salesForecastingService from "../services/salesForecastingService";
import smartInventoryService from "../services/smartInventoryService";
import catchAsync from "../util/catchAsync";

class AIController {
  /**
   * @route GET /api/ai/sales-forecast
   * @desc Predict sales for the next 7 days using neural network analysis
   */
  getSalesForecast = catchAsync(async (req: Request, res: Response) => {
    const forecast = await salesForecastingService.predictNextWeekSales();

    res.status(200).json({
      status: "success",
      data: forecast,
    });
  });

  /**
   * @route GET /api/ai/inventory-alerts
   * @desc Get current inventory alerts (low stock items)
   */
  getInventoryAlerts = catchAsync(async (req: Request, res: Response) => {
    const alerts = await smartInventoryService.getCurrentAlerts();

    res.status(200).json({
      status: "success",
      data: {
        alertCount: alerts.length,
        alerts,
      },
    });
  });

  /**
   * @route GET /api/ai/inventory-summary
   * @desc Get inventory health summary
   */
  getInventorySummary = catchAsync(async (req: Request, res: Response) => {
    const summary = await smartInventoryService.getInventorySummary();

    res.status(200).json({
      status: "success",
      data: summary,
    });
  });

  /**
   * @route GET /api/ai/sales-forecast/products/:productId
   * @desc Get detailed forecast for a specific product
   */
  getProductForecast = catchAsync(async (req: Request, res: Response) => {
    const forecast = await salesForecastingService.predictNextWeekSales();
    const productId = req.params.productId;

    const productForecast = forecast.productForecasts.find(
      (pf) => pf.productId === productId
    );

    if (!productForecast) {
      return res.status(404).json({
        status: "fail",
        message: "Product forecast not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: productForecast,
    });
  });

  /**
   * @route POST /api/ai/trigger-inventory-check
   * @desc Manually trigger inventory analysis (useful for testing)
   */
  triggerInventoryCheck = catchAsync(async (req: Request, res: Response) => {
    const alerts = await smartInventoryService.analyzeInventory();

    res.status(200).json({
      status: "success",
      message: "Inventory analysis completed",
      data: {
        checksRun: new Date().toISOString(),
        alertsGenerated: alerts.length,
        alerts,
      },
    });
  });
}

export default new AIController();
