import { created, getPathParameter, list, ok, parseBody } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export class AssemblyRecordsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createAssemblyRecord() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return created(event, {
      id: `assembly-record-${Date.now()}`,
      bikeId: body.bikeId ?? bikeId,
      status: body.status ?? "draft",
    });
  }

  listAssemblyRecords() {
    return list(this.lambdaContext.event, []);
  }

  getAssemblyRecord() {
    const { event } = this.lambdaContext;
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      id: assemblyRecordId,
      bikeId,
      status: "in_progress",
    });
  }

  updateAssemblyRecord() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

    return ok(event, {
      id: assemblyRecordId,
      ...body,
    });
  }

  listBikeAssemblyRecords() {
    return list(this.lambdaContext.event, []);
  }

  getBikeAssemblySummary() {
    const { event } = this.lambdaContext;
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      bikeId,
      latestStatus: "completed",
      openItems: 0,
    });
  }
}
