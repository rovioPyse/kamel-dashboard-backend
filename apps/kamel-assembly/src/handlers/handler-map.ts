import { handler as assemblyAttachmentsHandler } from "./assembly-attachments";
import { handler as assemblyChecksHandler } from "./assembly-checks";
import { handler as assemblyRecordsHandler } from "./assembly-records";
import { handler as assemblySignoffsHandler } from "./assembly-signoffs";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "../shared/http";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /assembly-records": { handler: assemblyRecordsHandler },
  "GET /assembly-records": { handler: assemblyRecordsHandler },
  "GET /assembly-records/{assemblyRecordId}": { handler: assemblyRecordsHandler },
  "PATCH /assembly-records/{assemblyRecordId}": { handler: assemblyRecordsHandler },
  "GET /bikes/{bikeId}/assembly-records": { handler: assemblyRecordsHandler },
  "GET /bikes/{bikeId}/assembly-summary": { handler: assemblyRecordsHandler },
  "POST /assembly-records/{assemblyRecordId}/checks": { handler: assemblyChecksHandler },
  "GET /assembly-records/{assemblyRecordId}/checks": { handler: assemblyChecksHandler },
  "PATCH /assembly-checks/{checkId}": { handler: assemblyChecksHandler },
  "POST /assembly-records/{assemblyRecordId}/attachments": { handler: assemblyAttachmentsHandler },
  "GET /assembly-records/{assemblyRecordId}/attachments": { handler: assemblyAttachmentsHandler },
  "POST /assembly-records/{assemblyRecordId}/attachments/upload-url": { handler: assemblyAttachmentsHandler },
  "POST /assembly-records/{assemblyRecordId}/signoffs": { handler: assemblySignoffsHandler },
  "GET /assembly-records/{assemblyRecordId}/signoffs": { handler: assemblySignoffsHandler },
};
