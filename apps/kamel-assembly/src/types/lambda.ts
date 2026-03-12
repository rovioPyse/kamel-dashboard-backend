import type { Logger } from "@kamel-dashboard-backend/logging";
import type { HttpEvent } from "../shared/http";

export interface HttpLambdaContext {
  requestId: string;
  logger: Logger;
  event: HttpEvent;
}
