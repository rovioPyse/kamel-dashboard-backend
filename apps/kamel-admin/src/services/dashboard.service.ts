import { getPathParameter, ok } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class DashboardService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  getDashboardBike() {
    const { event } = this.lambdaContext;
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      bikeId,
      bikeStatus: "active",
      latestAssemblyStatus: "completed",
      latestServiceStatus: "scheduled",
    });
  }

  getDashboardBikeTimeline() {
    const { event } = this.lambdaContext;
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      bikeId,
      events: [],
    });
  }
}
