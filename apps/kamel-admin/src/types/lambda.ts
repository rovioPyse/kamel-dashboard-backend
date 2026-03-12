import type { Logger } from "@kamel-dashboard-backend/logging";
import type { HttpEvent } from "@kamel-dashboard-backend/common";

export interface HttpLambdaContext {
  requestId: string;
  logger: Logger;
  event: HttpEvent;
}
