import { createLogger } from "@kamel-dashboard-backend/logging";
import { handler as serviceAttachmentsHandler } from "./handlers/service-attachments";
import { handler as serviceChecksHandler } from "./handlers/service-checks";
import { handler as servicePartsHandler } from "./handlers/service-parts";
import { handler as serviceRecordsHandler } from "./handlers/service-records";
import { HttpEvent, HttpResponse, error } from "./shared/http";

type RouteHandler = (event: HttpEvent) => Promise<HttpResponse>;

const handlers: Record<string, RouteHandler> = {
  "service-attachments-handler": serviceAttachmentsHandler,
  "service-checks-handler": serviceChecksHandler,
  "service-parts-handler": servicePartsHandler,
  "service-records-handler": serviceRecordsHandler,
};

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const handlerName = process.env.HANDLER_NAME ?? "";
  const logger = createLogger({
    app: "kamel-service",
    handler: handlerName,
    requestId: event.requestContext?.requestId,
  });
  const routeHandler = handlers[handlerName];

  if (!routeHandler) {
    logger.error("Handler mapping is missing", { handlerName });
    return error(event, 500, "MISCONFIGURED_HANDLER", "Lambda handler is not configured");
  }

  logger.info("Request received", { routeKey: event.routeKey });

  try {
    const response = await routeHandler(event);
    logger.info("Request completed", {
      routeKey: event.routeKey,
      statusCode: response.statusCode,
    });
    return response;
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : "Unknown error";
    logger.error("Request failed", {
      routeKey: event.routeKey,
      error: message,
    });
    return error(event, 500, "INTERNAL_SERVER_ERROR", "Unexpected error");
  }
};
