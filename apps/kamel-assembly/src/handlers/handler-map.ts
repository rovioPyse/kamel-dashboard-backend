import AssemblyAttachmentsHandler from "./assembly-attachments";
import AssemblyChecksHandler from "./assembly-checks";
import AssemblyRecordsHandler from "./assembly-records";
import AssemblySignoffsHandler from "./assembly-signoffs";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "@kamel-dashboard-backend/common";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /assembly-records": { handler: AssemblyRecordsHandler.handleCreateAssemblyRecord },
  "GET /assembly-records": { handler: AssemblyRecordsHandler.handleListAssemblyRecords },
  "GET /assembly-records/{assemblyRecordId}": { handler: AssemblyRecordsHandler.handleGetAssemblyRecord },
  "PATCH /assembly-records/{assemblyRecordId}": { handler: AssemblyRecordsHandler.handleUpdateAssemblyRecord },
  "GET /bikes/{bikeId}/assembly-records": { handler: AssemblyRecordsHandler.handleListBikeAssemblyRecords },
  "GET /bikes/{bikeId}/assembly-summary": { handler: AssemblyRecordsHandler.handleGetBikeAssemblySummary },
  "POST /assembly-records/{assemblyRecordId}/checks": { handler: AssemblyChecksHandler.handleCreateAssemblyCheck },
  "GET /assembly-records/{assemblyRecordId}/checks": { handler: AssemblyChecksHandler.handleListAssemblyChecks },
  "PATCH /assembly-checks/{checkId}": { handler: AssemblyChecksHandler.handleUpdateAssemblyCheck },
  "POST /assembly-records/{assemblyRecordId}/attachments": { handler: AssemblyAttachmentsHandler.handleCreateAssemblyAttachment },
  "GET /assembly-records/{assemblyRecordId}/attachments": { handler: AssemblyAttachmentsHandler.handleListAssemblyAttachments },
  "POST /assembly-records/{assemblyRecordId}/attachments/upload-url": { handler: AssemblyAttachmentsHandler.handleGetAssemblyUploadUrl },
  "POST /assembly-records/{assemblyRecordId}/signoffs": { handler: AssemblySignoffsHandler.handleCreateAssemblySignoff },
  "GET /assembly-records/{assemblyRecordId}/signoffs": { handler: AssemblySignoffsHandler.handleListAssemblySignoffs },
};
