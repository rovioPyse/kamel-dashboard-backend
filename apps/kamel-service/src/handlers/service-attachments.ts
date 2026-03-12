import {
  HttpResponse,
  created,
  getPathParameter,
  list,
  methodNotAllowed,
  ok,
  parseBody,
  requireAnyGroup,
} from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

const allowedGroups = ["service_user", "admin"];

export const handler = async (lambdaContext: HttpLambdaContext): Promise<HttpResponse> => {
  const { event } = lambdaContext;
  const authError = requireAnyGroup(event, allowedGroups);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

  switch (event.routeKey) {
    case "POST /service-records/{serviceRecordId}/attachments":
      return created(event, {
        id: `service-attachment-${Date.now()}`,
        serviceRecordId,
        attachmentType: body.attachmentType ?? "report_photo",
        objectKey: body.objectKey ?? null,
      });
    case "GET /service-records/{serviceRecordId}/attachments":
      return list(event, []);
    case "POST /service-records/{serviceRecordId}/attachments/upload-url":
      return ok(event, {
        serviceRecordId,
        uploadUrl: `https://example.com/uploads/${serviceRecordId}/${Date.now()}`,
        objectKey: `service/${serviceRecordId}/${Date.now()}.jpg`,
      });
    default:
      return methodNotAllowed(event);
  }
};
