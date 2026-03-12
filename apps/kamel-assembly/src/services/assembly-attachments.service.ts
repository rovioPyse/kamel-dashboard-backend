import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class AssemblyAttachmentsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createAssemblyAttachment() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

    return created(event, {
      id: `assembly-attachment-${Date.now()}`,
      assemblyRecordId,
      attachmentType: body.attachmentType ?? "completed_bike_photo",
      objectKey: body.objectKey ?? null,
    });
  }

  listAssemblyAttachments() {
    return list(this.lambdaContext.event, []);
  }

  getAssemblyUploadUrl() {
    const { event } = this.lambdaContext;
    const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");

    return ok(event, {
      assemblyRecordId,
      uploadUrl: `https://example.com/uploads/${assemblyRecordId}/${Date.now()}`,
      objectKey: `assembly/${assemblyRecordId}/${Date.now()}.jpg`,
    });
  }
}
