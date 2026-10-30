export interface PoliticalParty {
  id: string;
  name: string;
  fill: string;
  votes: number;
}

// !! Responses
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
  PARTY_DELETED = "PARTY_DELETED",
  ERROR = "ERROR",
}
export interface WebSocketError {
  type: WebSocketResponseType.ERROR;
  payload: {
    error: string;
  };
}

//!!Requests
export interface WebSocketRequest {
  type: WebSocketRequestType;
  payload: unknown;
}

export enum WebSocketRequestType {
  GET_PARTIES = "GET_PARTIES",
  ADD_PARTY = "ADD_PARTY",
  UPDATE_PARTY = "UPDATE_PARTY",
  DELETE_PARTY = "DELETE_PARTY",
}
