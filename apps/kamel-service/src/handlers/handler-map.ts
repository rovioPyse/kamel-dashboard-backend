import { handler as serviceAttachmentsHandler } from "./service-attachments";
import { handler as serviceChecksHandler } from "./service-checks";
import { handler as servicePartsHandler } from "./service-parts";
import { handler as serviceRecordsHandler } from "./service-records";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "../shared/http";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /service-records": { handler: serviceRecordsHandler },
  "GET /service-records": { handler: serviceRecordsHandler },
  "GET /service-records/{serviceRecordId}": { handler: serviceRecordsHandler },
  "PATCH /service-records/{serviceRecordId}": { handler: serviceRecordsHandler },
  "GET /bikes/{bikeId}/service-records": { handler: serviceRecordsHandler },
  "GET /bikes/{bikeId}/service-summary": { handler: serviceRecordsHandler },
  "POST /service-records/{serviceRecordId}/checks": { handler: serviceChecksHandler },
  "GET /service-records/{serviceRecordId}/checks": { handler: serviceChecksHandler },
  "PATCH /service-checks/{checkId}": { handler: serviceChecksHandler },
  "POST /service-records/{serviceRecordId}/parts-used": { handler: servicePartsHandler },
  "GET /service-records/{serviceRecordId}/parts-used": { handler: servicePartsHandler },
  "PATCH /service-parts-used/{partUsageId}": { handler: servicePartsHandler },
  "POST /service-records/{serviceRecordId}/attachments": { handler: serviceAttachmentsHandler },
  "GET /service-records/{serviceRecordId}/attachments": { handler: serviceAttachmentsHandler },
  "POST /service-records/{serviceRecordId}/attachments/upload-url": { handler: serviceAttachmentsHandler },
};
