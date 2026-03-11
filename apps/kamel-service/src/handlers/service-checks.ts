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
  const checkId = getPathParameter(event, "checkId", "service-check-demo");

  switch (event.routeKey) {
    case "POST /service-records/{serviceRecordId}/checks":
      return created(event, {
        id: `service-check-${Date.now()}`,
        serviceRecordId,
        checkType: body.checkType ?? "powertrain",
        status: body.status ?? "pending",
      });
    case "GET /service-records/{serviceRecordId}/checks":
      return list(event, []);
    case "PATCH /service-checks/{checkId}":
      return ok(event, {
        id: checkId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
