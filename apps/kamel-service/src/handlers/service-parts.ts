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
  const partUsageId = getPathParameter(event, "partUsageId", "part-usage-demo");

  switch (event.routeKey) {
    case "POST /service-records/{serviceRecordId}/parts-used":
      return created(event, {
        id: `service-part-${Date.now()}`,
        serviceRecordId,
        partId: body.partId ?? "part-demo",
        quantity: body.quantity ?? 1,
      });
    case "GET /service-records/{serviceRecordId}/parts-used":
      return list(event, []);
    case "PATCH /service-parts-used/{partUsageId}":
      return ok(event, {
        id: partUsageId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
