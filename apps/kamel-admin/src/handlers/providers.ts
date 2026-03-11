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
  const providerId = getPathParameter(event, "providerId", "provider-demo");

  switch (event.routeKey) {
    case "POST /fleet-providers":
      return created(event, {
        id: `provider-${Date.now()}`,
        name: body.name ?? "Talabat",
        status: body.status ?? "active",
      });
    case "GET /fleet-providers":
      return list(event, []);
    case "GET /fleet-providers/{providerId}":
      return ok(event, {
        id: providerId,
        name: "Talabat",
        status: "active",
      });
    case "PATCH /fleet-providers/{providerId}":
      return ok(event, {
        id: providerId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
