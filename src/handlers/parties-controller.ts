import {
  WebSocketRequest,
  WebSocketRequestType,
} from "../interfaces/request.interface";
import {
  WebSocketResponse,
  WebSocketResponseType,
} from "../interfaces/responses.interface";
import { PartiesStore } from "../store/parties.store";
import { AddPartySchema, WithIdSchema } from "../dtos";
import { PoliticalParty } from "../interfaces/store.interfaces";

export class PartiesController {
  private readonly partiesStore = new PartiesStore();

  public handleMessage = (message: string): WebSocketResponse => {
    try {
      const jsonMessage: WebSocketRequest = JSON.parse(message);
      if (!jsonMessage.type) throw new Error("Missing request code");
      switch (jsonMessage.type) {
        case WebSocketRequestType.ADD_PARTY:
          return this.handleAddParty(jsonMessage.payload);
        case WebSocketRequestType.UPDATE_PARTY:
          return this.handleUpdateParty(jsonMessage.payload);
        case WebSocketRequestType.INCREMENT_PARTY:
          return this.handleIncrementParty(jsonMessage.payload);
        case WebSocketRequestType.DECREMENT_PARTY:
          return this.handleDecrementParty(jsonMessage.payload);
        case WebSocketRequestType.DELETE_PARTY:
          return this.handleDeleteParty(jsonMessage.payload);
        case WebSocketRequestType.UPDATE_VOTES:
          return this.handleUpdateVotes(jsonMessage.payload);
        case WebSocketRequestType.PARTIES_LIST:
          console.log("parties list");
          return this.handleGetParties();

        default:
          throw new Error("Unrecognized request code");
      }
    } catch (error) {
      return this.handleError("Invalid request message");
    }
  };

  private handleGetParties = (): WebSocketResponse => {
    const parties = this.partiesStore.getAll();
    return {
      type: WebSocketResponseType.PARTIES_LIST,
      payload: { parties },
    };
  };

  private handleAddParty = (partyData: unknown): WebSocketResponse => {
    const { data, success } = AddPartySchema.safeParse(partyData);

    if (!success) throw new Error("Invalid party format");
    const newParty: PoliticalParty = {
      ...data,
      votes: 0,
      id: crypto.randomUUID(),
    };
    const partyAdded = this.partiesStore.add(newParty);
    return {
      type: WebSocketResponseType.PARTY_ADDED,
      payload: { party: partyAdded },
    };
  };

  private handleIncrementParty = (payload: unknown): WebSocketResponse => {
    const { data, success, error } = WithIdSchema.safeParse(payload);

    if (!success) throw new Error("Required party id");
    const incrementedParty = this.partiesStore.increment(data.id);
    return {
      type: WebSocketResponseType.PARTY_INCREMENTED,
      payload: { party: incrementedParty },
    };
  };
  private handleDecrementParty = (payload: unknown): WebSocketResponse => {
    const { data, success } = WithIdSchema.safeParse(payload);
    if (!success) throw new Error("Required party id");
    const decrementedParty = this.partiesStore.decrement(data.id);
    return {
      type: WebSocketResponseType.PARTY_DECREMENTED,
      payload: { party: decrementedParty },
    };
  };

  private handleDeleteParty = (payload: unknown): WebSocketResponse => {
    const { data, success } = WithIdSchema.safeParse(payload);
    if (!success) throw new Error("Required party id");
    const deletedParty = this.partiesStore.remove(data.id);
    return {
      type: WebSocketResponseType.PARTY_DELETED,
      payload: { party: deletedParty },
    };
  };

  private handleUpdateParty = (payload: unknown): WebSocketResponse => ({
    type: WebSocketResponseType.PARTY_UPDATED,
    payload,
  });
  private handleUpdateVotes = (payload: unknown): WebSocketResponse => ({
    type: WebSocketResponseType.VOTES_UPDATED,
    payload,
  });

  private handleError = (errorMessage: string): WebSocketResponse => ({
    type: WebSocketResponseType.ERROR,
    payload: { error: errorMessage },
  });
}
