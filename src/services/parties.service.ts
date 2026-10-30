import { PartiesStore } from "../store/parties.store";
import {
  AddPartySchema,
  UpdatePartyDto,
  UpdatePartySchema,
  WithIdSchema,
} from "../dtos";
import {
  PoliticalParty,
  WebSocketRequest,
  WebSocketRequestType,
  WebSocketResponse,
  WebSocketResponseType,
} from "../interfaces";
import z from "zod";
import { getDefinedProperties } from "../utils/get-defined-properties";

export class PartiesService {
  private readonly partiesStore = new PartiesStore();

  public handleMessage = (message: string): WebSocketResponse => {
    try {
      const jsonMessage: WebSocketRequest = JSON.parse(message);
      if (!jsonMessage.type) throw new Error("Missing request code");
      switch (jsonMessage.type) {
        case WebSocketRequestType.ADD_PARTY:
          return this.handleAddParty(jsonMessage.payload);
        case WebSocketRequestType.UPDATE_PARTY:
          return this.handleUpdateParty(jsonMessage.payload as UpdatePartyDto);
        case WebSocketRequestType.DELETE_PARTY:
          return this.handleDeleteParty(jsonMessage.payload);
        case WebSocketRequestType.GET_PARTIES:
          console.log("parties list");
          return this.handleGetParties();

        default:
          throw new Error("Unrecognized request code");
      }
    } catch (error) {
      return this.handleError(
        (error as any).message ?? "Invalid request message",
      );
    }
  };

  public handleGetParties = (): WebSocketResponse => {
    const parties = this.partiesStore.getAll();
    return {
      type: WebSocketResponseType.PARTIES_LIST,
      payload: { parties },
    };
  };

  private handleAddParty = (partyData: unknown): WebSocketResponse => {
    const { data, error } = AddPartySchema.safeParse(partyData);
    if (error) {
      throw new Error(z.treeifyError(error).errors.join(", "));
    }
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

  private handleUpdateParty = (payload: UpdatePartyDto): WebSocketResponse => {
    const { data: checkedParty, error } = UpdatePartySchema.safeParse(payload);
    if (error) throw new Error(z.treeifyError(error).errors.join(", "));

    const validProperties = getDefinedProperties(checkedParty.data);

    const updatedParty = this.partiesStore.update(
      checkedParty.id,
      validProperties,
    );

    return {
      type: WebSocketResponseType.PARTY_UPDATED,
      payload: { party: updatedParty },
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

  private handleError = (errorMessage: string): WebSocketResponse => ({
    type: WebSocketResponseType.ERROR,
    payload: { error: errorMessage },
  });
}

// private handleIncrementParty = (payload: unknown): WebSocketResponse => {
//   const { data, success, error } = WithIdSchema.safeParse(payload);

//   if (!success) throw new Error("Required party id");
//   const incrementedParty = this.partiesStore.increment(data.id);
//   return {
//     type: WebSocketResponseType.PARTY_INCREMENTED,
//     payload: { party: incrementedParty },
//   };
// };
// private handleDecrementParty = (payload: unknown): WebSocketResponse => {
//   const { data, success } = WithIdSchema.safeParse(payload);
//   if (!success) throw new Error("Required party id");
//   const decrementedParty = this.partiesStore.decrement(data.id);
//   return {
//     type: WebSocketResponseType.PARTY_DECREMENTED,
//     payload: { party: decrementedParty },
//   };
// };
