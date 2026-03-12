import { HttpResponse, requireAnyGroup } from "../shared/http";
import { ServiceChecksService } from "../services/service-checks.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["service_user", "admin"];

class ServiceChecksHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateServiceCheck(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceChecksService(lambdaContext).createServiceCheck();
  }

  static async handleListServiceChecks(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceChecksService(lambdaContext).listServiceChecks();
  }

  static async handleUpdateServiceCheck(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceChecksService(lambdaContext).updateServiceCheck();
  }
}

export default ServiceChecksHandler;
