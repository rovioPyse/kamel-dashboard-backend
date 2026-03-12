import { HttpResponse, requireAnyGroup } from "../shared/http";
import { ServiceCentresService } from "../services/service-centres.service";
import type { HttpLambdaContext } from "../types/lambda";

class ServiceCentresHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, ["admin"]);
  }

  static async handleCreateServiceCentre(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ServiceCentresHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceCentresService(lambdaContext).createServiceCentre();
  }

  static async handleListServiceCentres(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ServiceCentresHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceCentresService(lambdaContext).listServiceCentres();
  }

  static async handleGetServiceCentre(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ServiceCentresHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceCentresService(lambdaContext).getServiceCentre();
  }

  static async handleUpdateServiceCentre(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ServiceCentresHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceCentresService(lambdaContext).updateServiceCentre();
  }
}

export default ServiceCentresHandler;
