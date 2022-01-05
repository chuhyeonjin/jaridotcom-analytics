import { embed } from './embed';

export interface interactionResponse {
  type: interactionResponseType;
  data: interactionResponseMessageData;
}

export interface interactionResponseMessageData {
  tts?: boolean;
  content?: string;
  embeds?: embed[];
  allowed_mentions?: any;
  flags?: 64; // EPHEMERAL
  components?: any[];
  attachments?: any[];
}

export enum interactionResponseType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  DEFERRED_UPDATE_MESSAGE, // Only valid for component-based interactions
  UPDATE_MESSAGE, // Only valid for component-based interactions
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
}
