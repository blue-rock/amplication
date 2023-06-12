import { DynamicModule, Module } from "@nestjs/common";
import {
  OpenTelemetryModule,
  OpenTelemetryModuleAsyncOption,
  OpenTelemetryModuleConfig,
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  PipeInjector,
  ScheduleInjector,
} from "../external";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class TracingModule extends OpenTelemetryModule {
  static forRoot(
    configuration?: Partial<OpenTelemetryModuleConfig>
  ): Promise<DynamicModule> {
    const collectorOptions = {
      // url: '<opentelemetry-collector-url>', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
    };

    const traceExporter = new OTLPTraceExporter(collectorOptions);

    return OpenTelemetryModule.forRoot({
      ...configuration,
      traceAutoInjectors: [
        ControllerInjector,
        GuardInjector,
        EventEmitterInjector,
        ScheduleInjector,
        PipeInjector,
      ],
      spanProcessor: new BatchSpanProcessor(traceExporter),
    });
  }

  static async forRootAsync(
    configuration?: OpenTelemetryModuleAsyncOption
  ): Promise<DynamicModule> {
    return OpenTelemetryModule.forRootAsync({
      ...configuration,
      useFactory: async () => {
        const config = await configuration?.useFactory();
        return {
          ...config,
          traceAutoInjectors: [
            ControllerInjector,
            GuardInjector,
            EventEmitterInjector,
            ScheduleInjector,
            PipeInjector,
          ],
          spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
        };
      },
    });
  }
}
