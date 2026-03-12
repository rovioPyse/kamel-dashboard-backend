import { handler as bikesHandler } from "./bikes";
import { handler as dashboardHandler } from "./dashboard";
import { handler as providersHandler } from "./providers";
import { handler as serviceCentresHandler } from "./service-centres";
import { handler as usersHandler } from "./users";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "../shared/http";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /bikes": { handler: bikesHandler },
  "GET /bikes": { handler: bikesHandler },
  "GET /bikes/{bikeId}": { handler: bikesHandler },
  "PATCH /bikes/{bikeId}": { handler: bikesHandler },
  "POST /users": { handler: usersHandler },
  "GET /users": { handler: usersHandler },
  "GET /users/{userId}": { handler: usersHandler },
  "PATCH /users/{userId}": { handler: usersHandler },
  "POST /users/{userId}/groups": { handler: usersHandler },
  "POST /fleet-providers": { handler: providersHandler },
  "GET /fleet-providers": { handler: providersHandler },
  "GET /fleet-providers/{providerId}": { handler: providersHandler },
  "PATCH /fleet-providers/{providerId}": { handler: providersHandler },
  "POST /service-centres": { handler: serviceCentresHandler },
  "GET /service-centres": { handler: serviceCentresHandler },
  "GET /service-centres/{serviceCentreId}": { handler: serviceCentresHandler },
  "PATCH /service-centres/{serviceCentreId}": { handler: serviceCentresHandler },
  "GET /dashboard/bikes/{bikeId}": { handler: dashboardHandler },
  "GET /dashboard/bikes/{bikeId}/timeline": { handler: dashboardHandler },
};
