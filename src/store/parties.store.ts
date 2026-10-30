import { createDefaultParties } from "../data/initial-parties";
import { UpdatePartyDataDto, UpdatePartyDto } from "../dtos";
import { PoliticalParty } from "../interfaces/store.interfaces";
import { getDefinedProperties } from "../utils/get-defined-properties";

export class PartiesStore {
  private parties: PoliticalParty[] = createDefaultParties();

  public getAll = (): PoliticalParty[] => {
    return this.parties;
  };
  public findById = (id: string): PoliticalParty | null => {
    const party = this.parties.find((party) => party.id === id);
    return party ?? null;
  };

  public add = (party: PoliticalParty): PoliticalParty => {
    this.parties.push(party);
    return party;
  };

  public update = (
    id: string,
    partyProperties: UpdatePartyDataDto,
  ): PoliticalParty => {
    const validProperties = getDefinedProperties(partyProperties);

    const prevPartyStatus = this.parties.find((party) => party.id === id);
    if (Object.values(validProperties).length === 0)
      throw new Error("At least one property is required for update");
    if (!prevPartyStatus) throw new Error("Referenced party not found");

    const updatedParty = { ...prevPartyStatus, ...validProperties };

    this.parties = this.parties.map((party) => {
      if (party.id === id) {
        return updatedParty;
      }
      return party;
    });

    return updatedParty;
  };

  public increment = (id: string): PoliticalParty => {
    const prevPartyState = this.parties.find((party) => party.id === id);
    if (!prevPartyState) throw new Error("party not found");
    const newPartyStatus = {
      ...prevPartyState,
      votes: prevPartyState.votes + 1,
    };
    this.parties = this.parties.map((party) => {
      if (party.id === id) {
        return newPartyStatus;
      }
      return party;
    });
    return newPartyStatus;
  };
  public decrement = (id: string): PoliticalParty => {
    const prevPartyState = this.parties.find((party) => party.id === id);
    if (!prevPartyState) throw new Error("party not found");
    const newPartyStatus = {
      ...prevPartyState,
      votes: prevPartyState.votes < 1 ? 0 : prevPartyState.votes - 1,
    };
    this.parties = this.parties.map((party) => {
      if (party.id === id) {
        return newPartyStatus;
      }
      return party;
    });

    return newPartyStatus;
  };
  public remove = (id: string): PoliticalParty => {
    const party = this.findById(id);
    if (!party) throw new Error("Party not found");

    this.parties = this.parties.filter((party) => party.id !== id);
    return party;
  };

  public reset = (): void => {
    this.parties = createDefaultParties();
    return;
  };
}
