import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { ServiceAttachmentsService } from "../services/service-attachments.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["service_user", "admin"];

class ServiceAttachmentsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateServiceAttachment(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceAttachmentsService(lambdaContext).createServiceAttachment();
  }

  static async handleListServiceAttachments(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceAttachmentsService(lambdaContext).listServiceAttachments();
  }

  static async handleGetServiceUploadUrl(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = ServiceAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new ServiceAttachmentsService(lambdaContext).getServiceUploadUrl();
  }
}

export default ServiceAttachmentsHandler;
