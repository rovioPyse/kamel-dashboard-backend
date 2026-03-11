import {
  HttpEvent,
  HttpResponse,
  created,
  getPathParameter,
  list,
  methodNotAllowed,
  ok,
  parseBody,
  requireAnyGroup,
} from "../shared/http";

const allowedGroups = ["service_user", "admin"];

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const authError = requireAnyGroup(event, allowedGroups);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");
  const bikeId = getPathParameter(event, "bikeId", "bike-demo");

  switch (event.routeKey) {
    case "POST /service-records":
      return created(event, {
        id: `service-record-${Date.now()}`,
        bikeId: body.bikeId ?? bikeId,
        status: body.status ?? "draft",
      });
    case "GET /service-records":
      return list(event, []);
    case "GET /service-records/{serviceRecordId}":
      return ok(event, {
        id: serviceRecordId,
        bikeId,
        status: "in_progress",
      });
    case "PATCH /service-records/{serviceRecordId}":
      return ok(event, {
        id: serviceRecordId,
        ...body,
      });
    case "GET /bikes/{bikeId}/service-records":
      return list(event, []);
    case "GET /bikes/{bikeId}/service-summary":
      return ok(event, {
        bikeId,
        latestStatus: "scheduled",
        openIssues: 0,
      });
    default:
      return methodNotAllowed(event);
  }
};
