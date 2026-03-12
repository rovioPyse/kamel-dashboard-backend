import { createLogger } from "@kamel-dashboard-backend/logging";
import { randomUUID } from "crypto";
import type { HttpEvent } from "../shared/http";
import type { HttpLambdaContext } from "../types/lambda";

export const buildLambdaContext = async (
  event: HttpEvent,
): Promise<HttpLambdaContext> => {
  const requestId = event.requestContext?.requestId ?? randomUUID();
  const logger = createLogger({
    app: "kamel-service",
    requestId,
  });

  return {
    requestId,
    logger,
    event,
  };
};
