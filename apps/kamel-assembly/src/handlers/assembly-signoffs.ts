import {
  HttpEvent,
  HttpResponse,
  created,
  getPathParameter,
  list,
  methodNotAllowed,
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

  switch (event.routeKey) {
    case "POST /assembly-records/{assemblyRecordId}/signoffs":
      return created(event, {
        id: `assembly-signoff-${Date.now()}`,
        assemblyRecordId,
        signoffType: body.signoffType ?? "qc",
        signedBy: body.signedBy ?? "user-demo",
      });
    case "GET /assembly-records/{assemblyRecordId}/signoffs":
      return list(event, []);
    default:
      return methodNotAllowed(event);
  }
};
