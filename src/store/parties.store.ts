import { createDefaultParties } from "../data/initial-parties";
import { UpdatePartyDataDto, UpdatePartyDto } from "../dtos";
import { PoliticalParty } from "../interfaces";
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
    updatedPartyProperties: Record<string, any>,
  ): PoliticalParty => {
    const prevPartyStatus = this.findById(id);

    if (!prevPartyStatus) throw new Error("Referenced party not found");
    const updatedParty = { ...prevPartyStatus, ...updatedPartyProperties };

    this.parties = this.parties.map((party) => {
      if (party.id === id) {
        return updatedParty;
      }
      return party;
    });

    return updatedParty;
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

// public increment = (id: string): PoliticalParty => {
//   const prevPartyState = this.parties.find((party) => party.id === id);
//   if (!prevPartyState) throw new Error("party not found");
//   const newPartyStatus = {
//     ...prevPartyState,
//     votes: prevPartyState.votes + 1,
//   };
//   this.parties = this.parties.map((party) => {
//     if (party.id === id) {
//       return newPartyStatus;
//     }
//     return party;
//   });
//   return newPartyStatus;
// };
// public decrement = (id: string): PoliticalParty => {
//   const prevPartyState = this.parties.find((party) => party.id === id);
//   if (!prevPartyState) throw new Error("party not found");
//   const newPartyStatus = {
//     ...prevPartyState,
//     votes: prevPartyState.votes < 1 ? 0 : prevPartyState.votes - 1,
//   };
//   this.parties = this.parties.map((party) => {
//     if (party.id === id) {
//       return newPartyStatus;
//     }
//     return party;
//   });

//   return newPartyStatus;
// };
