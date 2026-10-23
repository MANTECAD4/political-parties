import { createDefaultParties } from "../data/initial-parties";
import { PoliticalParty } from "../interfaces/store.interfaces";
import { getDefinedProperties } from "../utils/get-defined-properties";

export class PartiesStore {
  private parties: Record<string, PoliticalParty> = createDefaultParties();

  public getAll = (): Record<string, PoliticalParty> => {
    return this.parties;
  };
  public findById = (id: string): PoliticalParty | null => {
    const party = this.parties[id];
    return party ?? null;
  };

  public add = (party: PoliticalParty): PoliticalParty => {
    this.parties[party.id] = party;
    return party;
  };

  public update = (
    id: string,
    partyProperties: Partial<Omit<PoliticalParty, "id">>,
  ): PoliticalParty => {
    const validProperties = getDefinedProperties(partyProperties);

    const prevPartyStatus = this.parties[id];
    if (Object.values(validProperties).length === 0 || !prevPartyStatus)
      throw new Error("invalid data");

    const newPartyStatus = { ...prevPartyStatus, ...validProperties };

    this.parties[id] = newPartyStatus;

    return newPartyStatus;
  };

  public increment = (id: string): PoliticalParty => {
    const prevPartyState = this.parties[id];
    if (!prevPartyState) throw new Error("party not found");
    const newPartyStatus = {
      ...prevPartyState,
      votes: prevPartyState.votes + 1,
    };
    this.parties[id] = newPartyStatus;
    return newPartyStatus;
  };
  public decrement = (id: string): PoliticalParty => {
    const prevPartyState = this.parties[id];
    if (!prevPartyState) throw new Error("party not found");
    const newPartyStatus = {
      ...prevPartyState,
      votes: prevPartyState.votes < 1 ? 0 : prevPartyState.votes - 1,
    };
    this.parties[id] = newPartyStatus;

    return newPartyStatus;
  };
  public remove = (id: string): PoliticalParty => {
    const party = this.findById(id);
    if (!party) throw new Error("Party not found");

    delete this.parties[id];
    return party;
  };

  public reset = (): void => {
    this.parties = createDefaultParties();
    return;
  };
}
