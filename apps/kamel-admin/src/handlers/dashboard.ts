import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { DashboardService } from "../services/dashboard.service";
import type { HttpLambdaContext } from "../types/lambda";

class DashboardHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, ["admin"]);
  }

  static async handleGetDashboardBike(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = DashboardHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new DashboardService(lambdaContext).getDashboardBike();
  }

  static async handleGetDashboardBikeTimeline(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = DashboardHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new DashboardService(lambdaContext).getDashboardBikeTimeline();
  }
}

export default DashboardHandler;
