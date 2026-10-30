import { UpdatePartyDataDto, UpdatePartyDto } from "../dtos";
import { PoliticalParty } from "../interfaces/store.interfaces";

export const getDefinedProperties = (partyProperties: UpdatePartyDataDto) => {
  const partialParty: Record<string, any> = {};
  Object.entries(partyProperties).forEach(([propertyName, propertyValue]) => {
    if (propertyValue === null || propertyValue === undefined) return;
    partialParty[propertyName] = propertyValue;
  });
  return partialParty;
};
