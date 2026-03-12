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
  const bikeId = getPathParameter(event, "bikeId", "bike-demo");

  switch (event.routeKey) {
    case "POST /assembly-records":
      return created(event, {
        id: `assembly-record-${Date.now()}`,
        bikeId: body.bikeId ?? bikeId,
        status: body.status ?? "draft",
      });
    case "GET /assembly-records":
      return list(event, []);
    case "GET /assembly-records/{assemblyRecordId}":
      return ok(event, {
        id: assemblyRecordId,
        bikeId,
        status: "in_progress",
      });
    case "PATCH /assembly-records/{assemblyRecordId}":
      return ok(event, {
        id: assemblyRecordId,
        ...body,
      });
    case "GET /bikes/{bikeId}/assembly-records":
      return list(event, []);
    case "GET /bikes/{bikeId}/assembly-summary":
      return ok(event, {
        bikeId,
        latestStatus: "completed",
        openItems: 0,
      });
    default:
      return methodNotAllowed(event);
  }
};
