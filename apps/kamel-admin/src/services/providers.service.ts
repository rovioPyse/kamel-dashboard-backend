import { created, getPathParameter, list, ok, parseBody } from "@kamel-dashboard-backend/common";
import type { HttpLambdaContext } from "../types/lambda";

export class ProvidersService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createProvider() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};

    return created(event, {
      id: `provider-${Date.now()}`,
      name: body.name ?? "Talabat",
      status: body.status ?? "active",
    });
  }

  listProviders() {
    return list(this.lambdaContext.event, []);
  }

  getProvider() {
    const { event } = this.lambdaContext;
    const providerId = getPathParameter(event, "providerId", "provider-demo");

    return ok(event, {
      id: providerId,
      name: "Talabat",
      status: "active",
    });
  }

  updateProvider() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const providerId = getPathParameter(event, "providerId", "provider-demo");

    return ok(event, {
      id: providerId,
      ...body,
    });
  }
}
