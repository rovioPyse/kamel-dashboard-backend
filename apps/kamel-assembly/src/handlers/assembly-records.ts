import { requireAnyGroup, type HttpResponse } from "@kamel-dashboard-backend/common";
import { AssemblyRecordsService } from "../services/assembly-records.service";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["assembly_user", "admin"];

class AssemblyRecordsHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, allowedGroups);
  }

  static async handleCreateAssemblyRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).createAssemblyRecord();
  }

  static async handleListAssemblyRecords(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).listAssemblyRecords();
  }

  static async handleGetAssemblyRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).getAssemblyRecord();
  }

  static async handleUpdateAssemblyRecord(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).updateAssemblyRecord();
  }

  static async handleListBikeAssemblyRecords(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).listBikeAssemblyRecords();
  }

  static async handleGetBikeAssemblySummary(
    lambdaContext: HttpLambdaContext,
  ): Promise<HttpResponse> {
    const authError = AssemblyRecordsHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new AssemblyRecordsService(lambdaContext).getBikeAssemblySummary();
  }
}

export default AssemblyRecordsHandler;
