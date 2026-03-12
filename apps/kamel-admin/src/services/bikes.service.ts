import { created, getPathParameter, list, ok, parseBody } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export class BikesService {
  constructor(private readonly lambdaContext: HttpLambdaContext) {}

  createBike() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};

    return created(event, {
      id: `bike-${Date.now()}`,
      bikeCode: body.bikeCode ?? "BK-001",
      plateNumber: body.plateNumber ?? null,
      chassisNumber: body.chassisNumber ?? null,
      status: body.status ?? "draft",
    });
  }

  listBikes() {
    return list(this.lambdaContext.event, []);
  }

  getBike() {
    const { event } = this.lambdaContext;
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      id: bikeId,
      bikeCode: "BK-001",
      status: "active",
    });
  }

  updateBike() {
    const { event } = this.lambdaContext;
    const body = parseBody<Record<string, unknown>>(event) ?? {};
    const bikeId = getPathParameter(event, "bikeId", "bike-demo");

    return ok(event, {
      id: bikeId,
      ...body,
    });
  }
}
