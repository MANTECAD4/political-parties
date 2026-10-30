import { PoliticalParty } from "../interfaces/store.interfaces";

const defaultParties: PoliticalParty[] = [
  {
    id: crypto.randomUUID(),
    name: "Partido Rojo",
    fill: "red",
    votes: 12,
  },
  {
    id: crypto.randomUUID(),
    name: "Partido Verde",
    fill: "green",
    votes: 6,
  },
  {
    id: crypto.randomUUID(),
    name: "Partido Azul",
    fill: "blue",
    votes: 7,
  },
];

export const createDefaultParties = (): PoliticalParty[] => {
  return defaultParties;
};
