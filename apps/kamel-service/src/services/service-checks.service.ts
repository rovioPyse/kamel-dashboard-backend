import { created, getPathParameter, list, ok, parseBody } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export class ServiceChecksService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createServiceCheck() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

    return created(event, {
      id: `service-check-${Date.now()}`,
      serviceRecordId,
      checkType: body.checkType ?? "powertrain",
      status: body.status ?? "pending",
    });
  }

  listServiceChecks() {
    return list(this.lambdaContext.event, []);
  }

  updateServiceCheck() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const checkId = getPathParameter(event, "checkId", "service-check-demo");

    return ok(event, {
      id: checkId,
      ...body,
    });
  }
}
