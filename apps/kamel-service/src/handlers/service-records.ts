import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { ServiceRecordsService } from "../services/service-records.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["service_user", "admin"];

class ServiceRecordsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateServiceRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).createServiceRecord();
  }

  static async handleListServiceRecords(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).listServiceRecords();
  }

  static async handleGetServiceRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).getServiceRecord();
  }

  static async handleUpdateServiceRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).updateServiceRecord();
  }

  static async handleListBikeServiceRecords(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).listBikeServiceRecords();
  }

  static async handleGetBikeServiceSummary(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceRecordsService(lambdaContext).getBikeServiceSummary();
  }
}

export default ServiceRecordsHandler;
