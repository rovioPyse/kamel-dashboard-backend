import BikesHandler from "./bikes";
import DashboardHandler from "./dashboard";
import ProvidersHandler from "./providers";
import ServiceCentresHandler from "./service-centres";
import UsersHandler from "./users";
import type { HttpLambdaContext } from "../types/lambda";
import type { HttpResponse } from "@kamel-dashboard-backend/common";

type RouteDefinition = {
  handler: (lambdaContext: HttpLambdaContext) => Promise<HttpResponse>;
};

export const routesMap: Record<string, RouteDefinition> = {
  "POST /bikes": { handler: BikesHandler.handleCreateBike },
  "GET /bikes": { handler: BikesHandler.handleListBikes },
  "GET /bikes/{bikeId}": { handler: BikesHandler.handleGetBike },
  "PATCH /bikes/{bikeId}": { handler: BikesHandler.handleUpdateBike },
  "POST /users": { handler: UsersHandler.handleCreateUser },
  "GET /users": { handler: UsersHandler.handleListUsers },
  "GET /users/{userId}": { handler: UsersHandler.handleGetUser },
  "PATCH /users/{userId}": { handler: UsersHandler.handleUpdateUser },
  "POST /users/{userId}/groups": { handler: UsersHandler.handleAssignGroups },
  "POST /fleet-providers": { handler: ProvidersHandler.handleCreateProvider },
  "GET /fleet-providers": { handler: ProvidersHandler.handleListProviders },
  "GET /fleet-providers/{providerId}": { handler: ProvidersHandler.handleGetProvider },
  "PATCH /fleet-providers/{providerId}": { handler: ProvidersHandler.handleUpdateProvider },
  "POST /service-centres": { handler: ServiceCentresHandler.handleCreateServiceCentre },
  "GET /service-centres": { handler: ServiceCentresHandler.handleListServiceCentres },
  "GET /service-centres/{serviceCentreId}": { handler: ServiceCentresHandler.handleGetServiceCentre },
  "PATCH /service-centres/{serviceCentreId}": { handler: ServiceCentresHandler.handleUpdateServiceCentre },
  "GET /dashboard/bikes/{bikeId}": { handler: DashboardHandler.handleGetDashboardBike },
  "GET /dashboard/bikes/{bikeId}/timeline": { handler: DashboardHandler.handleGetDashboardBikeTimeline },
};
