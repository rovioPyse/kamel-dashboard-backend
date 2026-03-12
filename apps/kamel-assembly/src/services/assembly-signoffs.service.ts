import { created, getPathParameter, list, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class AssemblySignoffsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createAssemblySignoff() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

    return created(event, {
      id: `assembly-signoff-${Date.now()}`,
      assemblyRecordId,
      signoffType: body.signoffType ?? "qc",
      signedBy: body.signedBy ?? "user-demo",
    });
  }

  listAssemblySignoffs() {
    return list(this.lambdaContext.event, []);
  }
}
