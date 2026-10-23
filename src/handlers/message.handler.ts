// import {
//   WebSocketRequestType,
//   WebSocketRequest,
// } from "../interfaces/request.interface";
// import {
//   WebSocketResponse,
//   WebSocketResponseType,
// } from "../interfaces/responses.interface";

// const handleGetParties = (): WebSocketResponse => ({
//   type: WebSocketResponseType.PARTIES_LIST,
//   payload: null,
// });

// const handleAddParty = (payload: unknown): WebSocketResponse => {
//   return {
//     type: WebSocketResponseType.PARTY_ADDED,
//     payload,
//   };
// };

// const handleUpdateParty = (payload: unknown): WebSocketResponse => ({
//   type: WebSocketResponseType.PARTY_UPDATED,
//   payload,
// });
// const handleDeleteParty = (payload: unknown): WebSocketResponse => ({
//   type: WebSocketResponseType.PARTY_DELETED,
//   payload,
// });

// const handleUpdateVotes = (payload: unknown): WebSocketResponse => ({
//   type: WebSocketResponseType.VOTES_UPDATED,
//   payload,
// });

// const handleError = (errorMessage: string): WebSocketResponse => ({
//   type: WebSocketResponseType.ERROR,
//   payload: { error: errorMessage },
// });

// export const handleMessage = (rawMessage: string): WebSocketResponse => {
//   try {
//     const jsonMessage: WebSocketRequest = JSON.parse(rawMessage);

//     switch (jsonMessage.type) {
//       case WebSocketRequestType.ADD_PARTY:
//         return handleAddParty(jsonMessage.payload);
//       case WebSocketRequestType.UPDATE_PARTY:
//         return handleUpdateParty(jsonMessage.payload);
//       case WebSocketRequestType.DELETE_PARTY:
//         return handleDeleteParty(jsonMessage.payload);
//       case WebSocketRequestType.UPDATE_VOTES:
//         return handleUpdateVotes(jsonMessage.payload);
//       case WebSocketRequestType.PARTIES_LIST:
//         return handleGetParties();

//       default:
//         return handleError("Unrecognized request code");
//     }
//   } catch (error) {
//     return handleError("Invalid request message");
//   }
// };
