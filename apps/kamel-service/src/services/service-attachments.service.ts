import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class ServiceAttachmentsService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createServiceAttachment() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

    return created(event, {
      id: `service-attachment-${Date.now()}`,
      serviceRecordId,
      attachmentType: body.attachmentType ?? "report_photo",
      objectKey: body.objectKey ?? null,
    });
  }

  listServiceAttachments() {
    return list(this.lambdaContext.event, []);
  }

  getServiceUploadUrl() {
    const { event } = this.lambdaContext;
    const serviceRecordId = getPathParameter(event, "serviceRecordId", "service-record-demo");

    return ok(event, {
      serviceRecordId,
      uploadUrl: `https://example.com/uploads/${serviceRecordId}/${Date.now()}`,
      objectKey: `service/${serviceRecordId}/${Date.now()}.jpg`,
    });
  }
}
