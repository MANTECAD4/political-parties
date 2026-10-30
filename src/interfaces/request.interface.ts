export interface WebSocketRequest {
  type: WebSocketRequestType;
  payload: unknown;
}

export enum WebSocketRequestType {
  GET_PARTIES = "GET_PARTIES",
  ADD_PARTY = "ADD_PARTY",
  UPDATE_PARTY = "UPDATE_PARTY",
  INCREMENT_PARTY = "INCREMENT_PARTY",
  DECREMENT_PARTY = "DECREMENT_PARTY",
  DELETE_PARTY = "DELETE_PARTY",
  UPDATE_VOTES = "UPDATE_VOTES",
}
