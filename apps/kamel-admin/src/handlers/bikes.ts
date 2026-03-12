import { HttpResponse, requireAnyGroup } from "../shared/http";
import { BikesService } from "../services/bikes.service";
import type { HttpLambdaContext } from "../types/lambda";

class BikesHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, ["admin"]);
  }

  static async handleCreateBike(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = BikesHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new BikesService(lambdaContext).createBike();
  }

  static async handleListBikes(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = BikesHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new BikesService(lambdaContext).listBikes();
  }

  static async handleGetBike(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = BikesHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new BikesService(lambdaContext).getBike();
  }

  static async handleUpdateBike(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = BikesHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new BikesService(lambdaContext).updateBike();
  }
}

export default BikesHandler;
