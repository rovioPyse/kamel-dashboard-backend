import { createLogger } from "@kamel-dashboard-backend/logging";
import { handler as assemblyAttachmentsHandler } from "./handlers/assembly-attachments";
import { handler as assemblyChecksHandler } from "./handlers/assembly-checks";
import { handler as assemblyRecordsHandler } from "./handlers/assembly-records";
import { handler as assemblySignoffsHandler } from "./handlers/assembly-signoffs";
import { HttpEvent, HttpResponse, error } from "./shared/http";

type RouteHandler = (event: HttpEvent) => Promise<HttpResponse>;

const handlers: Record<string, RouteHandler> = {
  "assembly-attachments-handler": assemblyAttachmentsHandler,
  "assembly-checks-handler": assemblyChecksHandler,
  "assembly-records-handler": assemblyRecordsHandler,
  "assembly-signoffs-handler": assemblySignoffsHandler,
};

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const handlerName = process.env.HANDLER_NAME ?? "";
  const logger = createLogger({
    app: "kamel-assembly",
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
