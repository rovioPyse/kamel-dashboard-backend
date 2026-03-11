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
  const bikeId = getPathParameter(event, "bikeId", "bike-demo");

  switch (event.routeKey) {
    case "POST /bikes":
      return created(event, {
        id: `bike-${Date.now()}`,
        bikeCode: body.bikeCode ?? "BK-001",
        plateNumber: body.plateNumber ?? null,
        chassisNumber: body.chassisNumber ?? null,
        status: body.status ?? "draft",
      });
    case "GET /bikes":
      return list(event, []);
    case "GET /bikes/{bikeId}":
      return ok(event, {
        id: bikeId,
        bikeCode: "BK-001",
        status: "active",
      });
    case "PATCH /bikes/{bikeId}":
      return ok(event, {
        id: bikeId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
