import { created, getPathParameter, list, ok, parseBody } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export class ServiceCentresService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createServiceCentre() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};

    return created(event, {
      id: `service-centre-${Date.now()}`,
      name: body.name ?? "Dubai Main Workshop",
      status: body.status ?? "active",
    });
  }

  listServiceCentres() {
    return list(this.lambdaContext.event, []);
  }

  getServiceCentre() {
    const { event } = this.lambdaContext;
    const serviceCentreId = getPathParameter(event, "serviceCentreId", "service-centre-demo");

    return ok(event, {
      id: serviceCentreId,
      name: "Dubai Main Workshop",
      status: "active",
    });
  }

  updateServiceCentre() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const serviceCentreId = getPathParameter(event, "serviceCentreId", "service-centre-demo");

    return ok(event, {
      id: serviceCentreId,
      ...body,
    });
  }
}
