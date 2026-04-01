/// <reference path="../types/brain.d.ts" />
import Order from "../models/orderModel";
import Product from "../models/productModel";
import brain from "brain.js";

interface ForecastData {
  date: string;
  totalSales: number;
}

interface ProductForecast {
  productId: string;
  productName: string;
  currentWeekTotal: number;
  predictedNextWeekTotal: number;
  growthPercentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

interface SalesForecastResult {
  forecastDate: string;
  totalPredictedSales: number;
  confidence: number;
  productForecasts: ProductForecast[];
  analysisMessage: string;
}

class SalesForecastingService {
  /**
   * Generates daily aggregated sales data from orders in the last 90 days
   */
  private async getDailySalesData(): Promise<ForecastData[]> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const orders = await Order.find({
      createdAt: { $gte: ninetyDaysAgo },
      status: { $ne: "cancelled" },
    }).select("total createdAt");

    // Aggregate sales by day
    const dailySalesMap = new Map<string, number>();

    orders.forEach((order) => {
      const dateKey = new Date(order.createdAt!).toISOString().split("T")[0];
      const currentTotal = dailySalesMap.get(dateKey) || 0;
      dailySalesMap.set(dateKey, currentTotal + (order.total || 0));
    });

    // Convert to sorted array
    const sortedDates = Array.from(dailySalesMap.keys()).sort();
    const forecastData = sortedDates.map((date) => ({
      date,
      totalSales: dailySalesMap.get(date) || 0,
    }));

    return forecastData;
  }

  /**
   * Trains a neural network on historical data and predicts next 7 days
   */
  async predictNextWeekSales(): Promise<SalesForecastResult> {
    try {
      const dailyData = await this.getDailySalesData();

      if (dailyData.length < 14) {
        throw new Error(
          "Insufficient data for sales forecasting (need at least 14 days of data)"
        );
      }

      // Normalize data for neural network
      const maxSale = Math.max(...dailyData.map((d) => d.totalSales));
      const minSale = Math.min(...dailyData.map((d) => d.totalSales));
      const range = maxSale - minSale || 1;

      const trainingData = dailyData.map((d, index) => ({
        input: [index / dailyData.length, d.totalSales / maxSale],
        output: [
          dailyData[Math.min(index + 1, dailyData.length - 1)].totalSales /
            maxSale,
        ],
      }));

      // Create and train neural network
      const net = new brain.NeuralNetwork({
        hiddenLayers: [16, 8],
        activation: "relu",
      });

      net.train(trainingData, {
        iterations: 1000,
        errorThresh: 0.005,
        log: false,
      });

      // Predict next 7 days
      const predictions: number[] = [];
      let lastValue = dailyData[dailyData.length - 1].totalSales / maxSale;

      for (let i = 0; i < 7; i++) {
        const output = net.run([
          (dailyData.length + i) / (dailyData.length + 7),
          lastValue,
        ]) as number[];
        lastValue = output[0];
        predictions.push(Math.max(0, lastValue * maxSale)); // Denormalize
      }

      const totalPredictedSales = predictions.reduce((a, b) => a + b, 0);
      const currentWeekTotal = dailyData
        .slice(-7)
        .reduce((sum, d) => sum + d.totalSales, 0);

      // Get product-level forecasts
      const productForecasts = await this.getProductLevelForecasts(
        predictions,
        currentWeekTotal
      );

      const growthPercentage =
        ((totalPredictedSales - currentWeekTotal) / currentWeekTotal) * 100;
      const trend =
        growthPercentage > 5
          ? "increasing"
          : growthPercentage < -5
            ? "decreasing"
            : "stable";

      return {
        forecastDate: new Date().toISOString().split("T")[0],
        totalPredictedSales: Math.round(totalPredictedSales),
        confidence: 0.75, // Basic confidence metric
        productForecasts,
        analysisMessage: `Sales are expected to ${trend} next week. Predicted sales: ${Math.round(totalPredictedSales)} (${growthPercentage > 0 ? "+" : ""}${growthPercentage.toFixed(1)}% change from this week).`,
      };
    } catch (error) {
      throw new Error(
        `Sales forecasting failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Forecasts sales for individual products based on historical patterns
   */
  private async getProductLevelForecasts(
    weekPredictions: number[],
    currentWeekTotal: number
  ): Promise<ProductForecast[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const currentWeekOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      status: { $ne: "cancelled" },
    }).populate("products.product");

    // Aggregate product quantities sold
    const productSalesMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    currentWeekOrders.forEach((order) => {
      order.products.forEach((item) => {
        const productId = (item.product as any)._id.toString();
        const productName = (item.product as any).name;
        const quantity = item.quantity;
        const price = (item.product as any).price;

        const existing = productSalesMap.get(productId) || {
          name: productName,
          quantity: 0,
          revenue: 0,
        };

        existing.quantity += quantity;
        existing.revenue += quantity * price;
        productSalesMap.set(productId, existing);
      });
    });

    // Calculate forecasts per product
    const productForecasts = Array.from(productSalesMap.entries())
      .map(([productId, data]) => {
        const currentWeekRevenue = data.revenue;
        const proportionOfTotal =
          currentWeekTotal > 0 ? currentWeekRevenue / currentWeekTotal : 0;
        const predictedRevenue = weekPredictions.reduce((a, b) => a + b, 0) * proportionOfTotal;
        const growthPercentage =
          currentWeekRevenue > 0
            ? ((predictedRevenue - currentWeekRevenue) / currentWeekRevenue) *
              100
            : 0;

        return {
          productId,
          productName: data.name,
          currentWeekTotal: Math.round(currentWeekRevenue),
          predictedNextWeekTotal: Math.round(predictedRevenue),
          growthPercentage: Number(growthPercentage.toFixed(1)),
          trend: (
            growthPercentage > 5
              ? "increasing"
              : growthPercentage < -5
                ? "decreasing"
                : "stable"
          ) as "increasing" | "decreasing" | "stable",
        };
      })
      .sort((a, b) => b.predictedNextWeekTotal - a.predictedNextWeekTotal)
      .slice(0, 10); // Top 10 products

    return productForecasts;
  }
}

export default new SalesForecastingService();
