import {
  HttpResponse,
  created,
  getPathParameter,
  list,
  methodNotAllowed,
  ok,
  parseBody,
  requireAnyGroup,
} from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export const handler = async (lambdaContext: HttpLambdaContext): Promise<HttpResponse> => {
  const { event } = lambdaContext;
  const authError = requireAnyGroup(event, ["admin"]);
  if (authError) {
    return authError;
  }

  const body = parseBody<Record<string, unknown>>(event) ?? {};
  const userId = getPathParameter(event, "userId", "user-demo");

  switch (event.routeKey) {
    case "POST /users":
      return created(event, {
        id: `user-${Date.now()}`,
        email: body.email ?? "user@example.com",
        status: "invited",
        groups: body.groups ?? [],
      });
    case "GET /users":
      return list(event, []);
    case "GET /users/{userId}":
      return ok(event, {
        id: userId,
        email: "user@example.com",
        groups: ["assembly_user"],
      });
    case "PATCH /users/{userId}":
      return ok(event, {
        id: userId,
        ...body,
      });
    case "POST /users/{userId}/groups":
      return ok(event, {
        id: userId,
        groups: body.groups ?? [],
      });
    default:
      return methodNotAllowed(event);
  }
};
