import cron from "node-cron";
import { UserService } from "../service/UserService.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running deactivateInactiveUsers job...");
  await UserService.deactivateInactiveUsers();
});
