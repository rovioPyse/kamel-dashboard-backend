import { error, type HttpEvent, type HttpResponse } from "@kamel-dashboard-backend/common";
import { routesMap } from "./handlers/handler-map";
import { buildLambdaContext } from "./utils/context-builder";

export const handler = async (event: HttpEvent): Promise<HttpResponse> => {
  const lambdaContext = await buildLambdaContext(event);
  const { logger, requestId, event: eventContext } = lambdaContext;
  const routeKey = eventContext.routeKey ?? "";
  const route = routesMap[routeKey];

  if (!route) {
    logger.error("No route found", { routeKey, requestId });
    return error(eventContext, 404, "NO_METHOD_FOUND", `No method found for ${routeKey}`);
  }

  logger.info("Request received", { routeKey, requestId });

  try {
    const response = await route.handler(lambdaContext);
    logger.info("Request completed", {
      routeKey,
      requestId,
      statusCode: response.statusCode,
    });
    return response;
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : "Unknown error";
    logger.error("Request failed", {
      routeKey,
      requestId,
      error: message,
    });
    return error(eventContext, 500, "INTERNAL_SERVER_ERROR", "Unexpected error");
  }
};
