import { commandOption, commandType } from './command';

export interface interactionData {
  id: string; // snowflake
  name: string;
  type: commandType;
  resolved?: any;
  options?: commandOption[];
  custom_id?: string;
  component_type?: number;
  values?: any[];
  target_id?: string; //snowflake
}

export interface interaction {
  id: string; // snowflake
  application_id: string; // snowflake
  type: interactionType;
  data?: interactionData;
  guild_id?: string; // snowflake
  channel_id?: string; // snowflake
  member?: any;
  user?: any;
  token: string;
  version: number;
  message?: any;
}

export enum interactionType {
  PING = 1,
  APPLICATION_COMMAND,
  MESSAGE_COMPONENT,
  APPLICATION_COMMAND_AUTOCOMPLETE,
}
