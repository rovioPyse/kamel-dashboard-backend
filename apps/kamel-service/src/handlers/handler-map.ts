import ServiceAttachmentsHandler from "./service-attachments";
import ServiceChecksHandler from "./service-checks";
import ServicePartsHandler from "./service-parts";
import ServiceRecordsHandler from "./service-records";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "@kamel-dashboard-backend/common";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /service-records": { handler: ServiceRecordsHandler.handleCreateServiceRecord },
  "GET /service-records": { handler: ServiceRecordsHandler.handleListServiceRecords },
  "GET /service-records/{serviceRecordId}": { handler: ServiceRecordsHandler.handleGetServiceRecord },
  "PATCH /service-records/{serviceRecordId}": { handler: ServiceRecordsHandler.handleUpdateServiceRecord },
  "GET /bikes/{bikeId}/service-records": { handler: ServiceRecordsHandler.handleListBikeServiceRecords },
  "GET /bikes/{bikeId}/service-summary": { handler: ServiceRecordsHandler.handleGetBikeServiceSummary },
  "POST /service-records/{serviceRecordId}/checks": { handler: ServiceChecksHandler.handleCreateServiceCheck },
  "GET /service-records/{serviceRecordId}/checks": { handler: ServiceChecksHandler.handleListServiceChecks },
  "PATCH /service-checks/{checkId}": { handler: ServiceChecksHandler.handleUpdateServiceCheck },
  "POST /service-records/{serviceRecordId}/parts-used": { handler: ServicePartsHandler.handleCreateServicePart },
  "GET /service-records/{serviceRecordId}/parts-used": { handler: ServicePartsHandler.handleListServiceParts },
  "PATCH /service-parts-used/{partUsageId}": { handler: ServicePartsHandler.handleUpdateServicePart },
  "POST /service-records/{serviceRecordId}/attachments": { handler: ServiceAttachmentsHandler.handleCreateServiceAttachment },
  "GET /service-records/{serviceRecordId}/attachments": { handler: ServiceAttachmentsHandler.handleListServiceAttachments },
  "POST /service-records/{serviceRecordId}/attachments/upload-url": { handler: ServiceAttachmentsHandler.handleGetServiceUploadUrl },
};
