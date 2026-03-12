import {
  created,
  getPathParameter,
  ok,
  parseBody,
} from "@kamel-dashboard-backend/common";
import { query } from "@kamel-dashboard-backend/database";
import type { HttpLambdaContext } from "../types/lambda";

type DatabaseCheckRow = {
  connectedAt: string;
  version: string;
};

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

  async listBikes() {
    const { event, logger } = this.lambdaContext;

    const result = await query<DatabaseCheckRow>(
      `
        SELECT NOW()::text AS "connectedAt", version() AS version
      `
    );

    logger.info("Temporary bike DB connectivity check succeeded", {
      connectedAt: result.rows[0]?.connectedAt,
    });

    return ok(event, {
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
      dbCheck: {
        connected: true,
        connectedAt: result.rows[0]?.connectedAt ?? null,
        version: result.rows[0]?.version ?? null,
      },
    });
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
