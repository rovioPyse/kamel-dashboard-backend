import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class ServicePartsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createServicePart() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

    return created(event, {
      id: `service-part-${Date.now()}`,
      serviceRecordId,
      partId: body.partId ?? "part-demo",
      quantity: body.quantity ?? 1,
    });
  }

  listServiceParts() {
    return list(this.lambdaContext.event, []);
  }

  updateServicePart() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const partUsageId = getPathParameter(event, "partUsageId", "part-usage-demo");

    return ok(event, {
      id: partUsageId,
      ...body,
    });
  }
}
