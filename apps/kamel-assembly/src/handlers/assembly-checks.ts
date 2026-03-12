import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { AssemblyChecksService } from "../services/assembly-checks.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["assembly_user", "admin"];

class AssemblyChecksHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateAssemblyCheck(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyChecksService(lambdaContext).createAssemblyCheck();
  }

  static async handleListAssemblyChecks(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyChecksService(lambdaContext).listAssemblyChecks();
  }

  static async handleUpdateAssemblyCheck(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyChecksHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyChecksService(lambdaContext).updateAssemblyCheck();
  }
}

export default AssemblyChecksHandler;
