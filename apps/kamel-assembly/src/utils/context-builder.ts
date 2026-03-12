import { createLogger } from "@kamel-dashboard-backend/logging";
import type { HttpEvent } from "@kamel-dashboard-backend/common";
import { randomUUID } from "crypto";
import type { HttpLambdaContext } from "../types/lambda";

export const buildLambdaContext = async (
  event: HttpEvent,
): Promise<HttpLambdaContext> => {
  const requestId = event.requestContext?.requestId ?? randomUUID();
  const logger = createLogger({
    app: "kamel-assembly",
    requestId,
  });

  return {
    requestId,
    logger,
    event,
  };
};
