import { HttpResponse, requireAnyGroup } from "../shared/http";
import { ServicePartsService } from "../services/service-parts.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["service_user", "admin"];

class ServicePartsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateServicePart(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServicePartsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServicePartsService(lambdaContext).createServicePart();
  }

  static async handleListServiceParts(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServicePartsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServicePartsService(lambdaContext).listServiceParts();
  }

  static async handleUpdateServicePart(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServicePartsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServicePartsService(lambdaContext).updateServicePart();
  }
}

export default ServicePartsHandler;
