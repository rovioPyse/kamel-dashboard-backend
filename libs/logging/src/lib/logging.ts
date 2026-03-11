export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LoggerContext {
  app: string;
  handler?: string;
  requestId?: string;
}

interface LogEntry extends LoggerContext {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: LogMetadata;
}

const writeLog = (level: LogLevel, entry: LogEntry): void => {
  const serialized = JSON.stringify(entry);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
};

export class Logger {
  constructor(private readonly context: LoggerContext) {}

  child(metadata: LogMetadata): Logger {
    return new Logger({
      ...this.context,
      ...metadata,
    });
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log("error", message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    writeLog(level, {
      ...this.context,
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }
}

export const createLogger = (context: LoggerContext): Logger => new Logger(context);
