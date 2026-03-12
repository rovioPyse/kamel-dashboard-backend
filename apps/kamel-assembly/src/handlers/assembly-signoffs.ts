import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { AssemblySignoffsService } from "../services/assembly-signoffs.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["assembly_user", "admin"];

class AssemblySignoffsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateAssemblySignoff(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblySignoffsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblySignoffsService(lambdaContext).createAssemblySignoff();
  }

  static async handleListAssemblySignoffs(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblySignoffsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblySignoffsService(lambdaContext).listAssemblySignoffs();
  }
}

export default AssemblySignoffsHandler;
