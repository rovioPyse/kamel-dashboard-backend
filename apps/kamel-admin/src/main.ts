import { createLogger } from "@kamel-dashboard-backend/logging";
import { handler as bikesHandler } from "./handlers/bikes";
import { handler as dashboardHandler } from "./handlers/dashboard";
import { handler as providersHandler } from "./handlers/providers";
import { handler as serviceCentresHandler } from "./handlers/service-centres";
import { handler as usersHandler } from "./handlers/users";
import { HttpEvent, HttpResponse, error } from "./shared/http";

type RouteHandler = (event: HttpEvent) => Promise<HttpResponse>;

const handlers: Record<string, RouteHandler> = {
  "bikes-handler": bikesHandler,
  "dashboard-handler": dashboardHandler,
  "providers-handler": providersHandler,
  "service-centres-handler": serviceCentresHandler,
  "users-handler": usersHandler,
};

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const handlerName = process.env.HANDLER_NAME ?? "";
  const logger = createLogger({
    app: "kamel-admin",
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
