import { HttpResponse, requireAnyGroup } from "../shared/http";
import { ProvidersService } from "../services/providers.service";
import type { HttpLambdaContext } from "../types/lambda";

class ProvidersHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, ["admin"]);
  }

  static async handleCreateProvider(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ProvidersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ProvidersService(lambdaContext).createProvider();
  }

  static async handleListProviders(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ProvidersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ProvidersService(lambdaContext).listProviders();
  }

  static async handleGetProvider(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ProvidersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ProvidersService(lambdaContext).getProvider();
  }

  static async handleUpdateProvider(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = ProvidersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ProvidersService(lambdaContext).updateProvider();
  }
}

export default ProvidersHandler;
