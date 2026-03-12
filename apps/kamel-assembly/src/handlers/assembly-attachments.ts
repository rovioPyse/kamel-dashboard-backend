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

const allowedGroups = ["assembly_user", "admin"];

export const handler = async (lambdaContext: HttpLambdaContext): Promise<HttpResponse> => {
  const { event } = lambdaContext;
  const authError = requireAnyGroup(event, allowedGroups);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

  switch (event.routeKey) {
    case "POST /assembly-records/{assemblyRecordId}/attachments":
      return created(event, {
        id: `assembly-attachment-${Date.now()}`,
        assemblyRecordId,
        attachmentType: body.attachmentType ?? "completed_bike_photo",
        objectKey: body.objectKey ?? null,
      });
    case "GET /assembly-records/{assemblyRecordId}/attachments":
      return list(event, []);
    case "POST /assembly-records/{assemblyRecordId}/attachments/upload-url":
      return ok(event, {
        assemblyRecordId,
        uploadUrl: `https://example.com/uploads/${assemblyRecordId}/${Date.now()}`,
        objectKey: `assembly/${assemblyRecordId}/${Date.now()}.jpg`,
      });
    default:
      return methodNotAllowed(event);
  }
};
