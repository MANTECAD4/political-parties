export type WebSocketResponse =
  | WebSocketError
  | {
      type: WebSocketResponseType;
      payload: unknown;
    };

export enum WebSocketResponseType {
  PARTIES_LIST = "PARTIES_LIST",
  PARTY_ADDED = "PARTY_ADDED",
  PARTY_UPDATED = "PARTY_UPDATED",
  PARTY_INCREMENTED = "PARTY_INCREMENTED",
  PARTY_DECREMENTED = "PARTY_DECREMENTED",
  PARTY_DELETED = "PARTY_DELETED",
  VOTES_UPDATED = "VOTES_UPDATED",
  ERROR = "ERROR",
}
export interface WebSocketError {
  type: WebSocketResponseType.ERROR;
  payload: {
    error: string;
  };
}
