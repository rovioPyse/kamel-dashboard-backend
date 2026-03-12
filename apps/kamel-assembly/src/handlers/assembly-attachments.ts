import { HttpResponse, requireAnyGroup } from "../shared/http";
import { AssemblyAttachmentsService } from "../services/assembly-attachments.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["assembly_user", "admin"];

class AssemblyAttachmentsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateAssemblyAttachment(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyAttachmentsService(lambdaContext).createAssemblyAttachment();
  }

  static async handleListAssemblyAttachments(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyAttachmentsService(lambdaContext).listAssemblyAttachments();
  }

  static async handleGetAssemblyUploadUrl(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyAttachmentsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyAttachmentsService(lambdaContext).getAssemblyUploadUrl();
  }
}

export default AssemblyAttachmentsHandler;
