export enum commandType {
  CHAT_INPUT = 1,
  USER,
  MESSAGE,
}

export enum commandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP,
  STRING,
  INTEGER,
  BOOLEAN,
  USER,
  CHANNEL,
  ROLE,
  MENTIONABLE,
  NUMBER,
}

export interface commandOption {
  name: string;
  type: commandOptionType;
  value?: string | number;
  options?: commandOption[];
  focused?: boolean;
}
