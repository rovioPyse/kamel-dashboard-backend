import {
  HttpEvent,
  HttpResponse,
  created,
  getPathParameter,
  list,
  methodNotAllowed,
  ok,
  parseBody,
  requireAnyGroup,
} from "../shared/http";

const allowedGroups = ["assembly_user", "admin"];

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const authError = requireAnyGroup(event, allowedGroups);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const assemblyRecordId = getPathParameter(event, "assemblyRecordId", "assembly-record-demo");
  const checkId = getPathParameter(event, "checkId", "assembly-check-demo");

  switch (event.routeKey) {
    case "POST /assembly-records/{assemblyRecordId}/checks":
      return created(event, {
        id: `assembly-check-${Date.now()}`,
        assemblyRecordId,
        checkType: body.checkType ?? "qc_visual_inspection",
        status: body.status ?? "pending",
      });
    case "GET /assembly-records/{assemblyRecordId}/checks":
      return list(event, []);
    case "PATCH /assembly-checks/{checkId}":
      return ok(event, {
        id: checkId,
        ...body,
      });
    default:
      return methodNotAllowed(event);
  }
};
