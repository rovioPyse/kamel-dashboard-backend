import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class AssemblyChecksService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createAssemblyCheck() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

    return created(event, {
      id: `assembly-check-${Date.now()}`,
      assemblyRecordId,
      checkType: body.checkType ?? "qc_visual_inspection",
      status: body.status ?? "pending",
    });
  }

  listAssemblyChecks() {
    return list(this.lambdaContext.event, []);
  }

  updateAssemblyCheck() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const checkId = getPathParameter(event, "checkId", "assembly-check-demo");

    return ok(event, {
      id: checkId,
      ...body,
    });
  }
}
