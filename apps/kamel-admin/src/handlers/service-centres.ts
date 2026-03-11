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

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const authError = requireAnyGroup(event, ["admin"]);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const serviceCentreId = getPathParameter(event, "serviceCentreId", "service-centre-demo");

  switch (event.routeKey) {
    case "POST /service-centres":
      return created(event, {
        id: `service-centre-${Date.now()}`,
        name: body.name ?? "Dubai Main Workshop",
        status: body.status ?? "active",
      });
    case "GET /service-centres":
      return list(event, []);
    case "GET /service-centres/{serviceCentreId}":
      return ok(event, {
        id: serviceCentreId,
        name: "Dubai Main Workshop",
        status: "active",
      });
    case "PATCH /service-centres/{serviceCentreId}":
      return ok(event, {
        id: serviceCentreId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
