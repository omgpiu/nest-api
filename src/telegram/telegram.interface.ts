import { ModuleMetadata } from "@nestjs/common";

export interface ITelegramOptions {
  chatId: string;
  token: string;
}

export interface ITelegramModuleAsyncOprions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any) => Promise<ITelegramOptions> | ITelegramOptions;
  inject?: any[];
}
