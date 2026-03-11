import {
  HttpEvent,
  HttpResponse,
  getPathParameter,
  methodNotAllowed,
  ok,
  requireAnyGroup,
} from "../shared/http";

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const authError = requireAnyGroup(event, ["admin"]);
  if (authError) {
    return authError;
  }

  const bikeId = getPathParameter(event, "bikeId", "bike-demo");

  switch (event.routeKey) {
    case "GET /dashboard/bikes/{bikeId}":
      return ok(event, {
        bikeId,
        bikeStatus: "active",
        latestAssemblyStatus: "completed",
        latestServiceStatus: "scheduled",
      });
    case "GET /dashboard/bikes/{bikeId}/timeline":
      return ok(event, {
        bikeId,
        events: [],
      });
    default:
      return methodNotAllowed(event);
  }
};
