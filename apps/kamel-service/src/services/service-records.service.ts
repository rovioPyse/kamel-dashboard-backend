import { created, getPathParameter, list, ok, parseBody } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export class ServiceRecordsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createServiceRecord() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return created(event, {
      id: `service-record-${Date.now()}`,
      bikeId: body.bikeId ?? bikeId,
      status: body.status ?? "draft",
    });
  }

  listServiceRecords() {
    return list(this.lambdaContext.event, []);
  }

  getServiceRecord() {
    const { event } = this.lambdaContext;
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      id: serviceRecordId,
      bikeId,
      status: "in_progress",
    });
  }

  updateServiceRecord() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

    return ok(event, {
      id: serviceRecordId,
      ...body,
    });
  }

  listBikeServiceRecords() {
    return list(this.lambdaContext.event, []);
  }

  getBikeServiceSummary() {
    const { event } = this.lambdaContext;
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      bikeId,
      latestStatus: "scheduled",
      openIssues: 0,
    });
  }
}
