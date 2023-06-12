import { context, trace, Span } from "@opentelemetry/api";
import { Injectable } from "@nestjs/common";
import { MetadataScanner } from "@nestjs/core/metadata-scanner";
import { BaseTraceInjector } from "./Injectors/BaseTraceInjector";

@Injectable()
export class TraceService {
  protected readonly metadataScanner: MetadataScanner = new MetadataScanner();
  private readonly traceInjector = new BaseTraceInjector(null);

  public getTracer() {
    return trace.getTracer("default");
  }

  public getSpan(): Span {
    return trace.getSpan(context.active());
  }

  public startSpan(name: string): Span {
    const tracer = trace.getTracer("default");
    return tracer.startSpan(name);
  }
}
