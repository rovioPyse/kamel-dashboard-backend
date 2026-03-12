import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class UsersService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createUser() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};

    return created(event, {
      id: `user-${Date.now()}`,
      email: body.email ?? "user@example.com",
      status: "invited",
      groups: body.groups ?? [],
    });
  }

  listUsers() {
    return list(this.lambdaContext.event, []);
  }

  getUser() {
    const { event } = this.lambdaContext;
    const userId = getPathParameter(event, "userId", "user-demo");

    return ok(event, {
      id: userId,
      email: "user@example.com",
      groups: ["assembly_user"],
    });
  }

  updateUser() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const userId = getPathParameter(event, "userId", "user-demo");

    return ok(event, {
      id: userId,
      ...body,
    });
  }

  assignGroups() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const userId = getPathParameter(event, "userId", "user-demo");

    return ok(event, {
      id: userId,
      groups: body.groups ?? [],
    });
  }
}
