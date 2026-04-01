import Order from "../models/orderModel";
import Product from "../models/productModel";
import MainInventory from "../models/mainInventoryModel";
import Ingredient from "../models/ingredientModel";
import { IIngredient } from "../interfaces/ingredient.interface";

export interface InventoryAlert {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  currentStock: number;
  averageDailyUsage: number;
  daysUntilStockout: number;
  status: "critical" | "low" | "normal";
  recommendation: string;
  alertGeneratedAt: Date;
}

interface UsageData {
  ingredientId: string;
  totalUsage: number;
  daysOfData: number;
}

class SmartInventoryService {
  /**
   * Calculates average daily usage of each ingredient from last 30 days of orders
   */
  private async calculateDailyUsage(): Promise<UsageData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: "cancelled" },
    }).populate({
      path: "products.product",
      populate: { path: "ingredients.ingredient" },
    });

    const ingredientUsageMap = new Map<string, number>();

    // Aggregate ingredient usage from all orders
    orders.forEach((order) => {
      order.products.forEach((item) => {
        const product = item.product as any;
        if (product && product.ingredients) {
          product.ingredients.forEach((ing: any) => {
            const ingredientId = ing.ingredient._id.toString();
            const usedQuantity = ing.quantity * item.quantity;
            const currentUsage = ingredientUsageMap.get(ingredientId) || 0;
            ingredientUsageMap.set(ingredientId, currentUsage + usedQuantity);
          });
        }
      });

      // Also handle deals (if they reference products)
      if (order.deals && order.deals.length > 0) {
        // Note: This assumes deals have products. Adjust based on your Deal schema
        // For now, we'll skip deals as the implementation depends on your Deal model
      }
    });

    // Calculate daily averages
    const daysOfData = 30;
    const usageData: UsageData[] = Array.from(ingredientUsageMap.entries()).map(
      ([ingredientId, totalUsage]) => ({
        ingredientId,
        totalUsage,
        daysOfData,
      })
    );

    return usageData;
  }

  /**
   * Analyzes inventory levels and generates alerts for low-stock items
   * Alert thresholds:
   * - Critical: Less than 1 day supply
   * - Low: 1-3 days supply
   * - Normal: > 3 days supply
   */
  async analyzeInventory(): Promise<InventoryAlert[]> {
    try {
      const usageData = await this.calculateDailyUsage();

      if (usageData.length === 0) {
        return []; // No orders to analyze
      }

      const alerts: InventoryAlert[] = [];

      // Fetch all ingredients with their current stock
      const inventoryItems = await MainInventory.find()
        .populate<{ ingredient: IIngredient }>("ingredient")
        .exec();

      for (const inventory of inventoryItems) {
        const ingredient = inventory.ingredient as any;
        const ingredientId = ingredient._id.toString();

        // Find usage data for this ingredient
        const usage = usageData.find((u) => u.ingredientId === ingredientId);
        if (!usage) continue;

        const averageDailyUsage = usage.totalUsage / usage.daysOfData;
        if (averageDailyUsage === 0) continue; // Skip unused ingredients

        const currentStock = inventory.quantity;
        const daysUntilStockout = currentStock / averageDailyUsage;

        // Determine alert status
        let status: "critical" | "low" | "normal" = "normal";
        let recommendation = "Stock levels are healthy.";

        if (daysUntilStockout < 1) {
          status = "critical";
          recommendation = `URGENT: Only ${daysUntilStockout.toFixed(1)} days of ${ingredient.name} remaining. Reorder immediately to avoid stockout.`;
        } else if (daysUntilStockout < 3) {
          status = "low";
          recommendation = `Low stock alert: Only ${daysUntilStockout.toFixed(1)} days of ${ingredient.name} remaining. Consider reordering soon.`;
        }

        if (status !== "normal") {
          alerts.push({
            ingredientId,
            ingredientName: ingredient.name,
            unit: ingredient.unit,
            currentStock,
            averageDailyUsage: Number(averageDailyUsage.toFixed(2)),
            daysUntilStockout: Number(daysUntilStockout.toFixed(1)),
            status,
            recommendation,
            alertGeneratedAt: new Date(),
          });
        }
      }

      // Sort alerts by urgency (critical first, then by days until stockout)
      alerts.sort((a, b) => {
        if (a.status === "critical" && b.status !== "critical") return -1;
        if (a.status !== "critical" && b.status === "critical") return 1;
        return a.daysUntilStockout - b.daysUntilStockout;
      });

      return alerts;
    } catch (error) {
      throw new Error(
        `Inventory analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Gets all current alerts (can be called on demand or by scheduler)
   */
  async getCurrentAlerts(): Promise<InventoryAlert[]> {
    return this.analyzeInventory();
  }

  /**
   * Gets summary statistics about inventory health
   */
  async getInventorySummary() {
    const alerts = await this.analyzeInventory();

    const summary = {
      totalItems: (await MainInventory.countDocuments()) || 0,
      alertCount: alerts.length,
      criticalCount: alerts.filter((a) => a.status === "critical").length,
      lowCount: alerts.filter((a) => a.status === "low").length,
      normalCount:
        (await MainInventory.countDocuments()) -
        alerts.filter((a) => a.status !== "normal").length,
      mostUrgentItem: alerts.length > 0 ? alerts[0] : null,
      lastAnalysisTime: new Date(),
    };

    return summary;
  }
}

export default new SmartInventoryService();
