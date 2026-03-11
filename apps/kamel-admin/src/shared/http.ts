export interface HttpEvent {
  routeKey?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  pathParameters?: Record<string, string | undefined>;
  requestContext?: {
    requestId?: string;
    authorizer?: {
      jwt?: {
        claims?: Record<string, string | undefined>;
      };
    };
  };
}

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const defaultHeaders = (requestId: string): Record<string, string> => ({
  "content-type": "application/json",
  "x-request-id": requestId,
});

const getRequestId = (event: HttpEvent): string =>
  event.requestContext?.requestId ?? "local-request";

const response = (
  event: HttpEvent,
  statusCode: number,
  payload: unknown,
): HttpResponse => ({
  statusCode,
  headers: defaultHeaders(getRequestId(event)),
  body: JSON.stringify(payload),
});

export const ok = (event: HttpEvent, payload: unknown): HttpResponse =>
  response(event, 200, payload);

export const created = (event: HttpEvent, payload: unknown): HttpResponse =>
  response(event, 201, payload);

export const list = (
  event: HttpEvent,
  items: unknown[],
  page = 1,
  pageSize = 20,
  total = items.length,
): HttpResponse =>
  response(event, 200, {
    items,
    page,
    pageSize,
    total,
  });

export const error = (
  event: HttpEvent,
  statusCode: number,
  code: string,
  message: string,
): HttpResponse =>
  response(event, statusCode, {
    code,
    message,
  });

export const methodNotAllowed = (event: HttpEvent): HttpResponse =>
  error(event, 405, "METHOD_NOT_ALLOWED", `Unsupported route ${event.routeKey ?? "unknown"}`);

export const parseBody = <T>(event: HttpEvent): T | null => {
  if (!event.body) {
    return null;
  }

  try {
    return JSON.parse(event.body) as T;
  } catch {
    return null;
  }
};

export const requireAnyGroup = (
  event: HttpEvent,
  allowedGroups: string[],
): HttpResponse | null => {
  const rawGroups = event.requestContext?.authorizer?.jwt?.claims?.["cognito:groups"] ?? "";
  const groups = rawGroups
    .split(",")
    .map((group) => group.trim())
    .filter(Boolean);

  if (allowedGroups.some((group) => groups.includes(group))) {
    return null;
  }

  return error(event, 403, "FORBIDDEN", "User does not have access to this resource");
};

export const getPathParameter = (event: HttpEvent, key: string, fallback: string): string =>
  event.pathParameters?.[key] ?? fallback;
