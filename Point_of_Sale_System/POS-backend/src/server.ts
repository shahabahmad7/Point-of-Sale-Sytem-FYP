import app from "./app";
import connectDB from "./config/db";
import env from "./config/env";
import * as cron from "node-cron";
import smartInventoryService from "./services/smartInventoryService";

//PORT
const PORT = env.PORT || 3000;

/**
 * Initialize scheduled tasks
 */
const initializeScheduledTasks = () => {
  // Run inventory analysis every 6 hours (at 0, 6, 12, 18 UTC)
  cron.schedule("0 */6 * * *", async () => {
    try {
      console.log(
        `[${new Date().toISOString()}] Running scheduled inventory analysis...`
      );
      const alerts = await smartInventoryService.analyzeInventory();

      if (alerts.length > 0) {
        console.log(
          `[${new Date().toISOString()}] Generated ${alerts.length} inventory alerts:`
        );
        alerts.forEach((alert) => {
          console.log(
            `  - ${alert.ingredientName}: ${alert.daysUntilStockout} days remaining [${alert.status.toUpperCase()}]`
          );
        });
      } else {
        console.log(
          `[${new Date().toISOString()}] All inventory levels are healthy.`
        );
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error running scheduled inventory check:`,
        error
      );
    }
  });

  console.log("Scheduled tasks initialized: Inventory analysis running every 6 hours");
};

connectDB().then(() => {
  initializeScheduledTasks();
  app.listen(PORT, () => console.log("Server running on PORT: " + PORT));
});
