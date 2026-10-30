import z from "zod";

export const PoliticalPartySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  fill: z.string(),
  votes: z.int(),
});

export const AddPartySchema = PoliticalPartySchema.omit({
  id: true,
  votes: true,
});

export type AddPartyDto = z.infer<typeof AddPartySchema>;

export const WithIdSchema = z.object({
  id: z.uuid(),
});

export const UpdatePartyDataSchema = PoliticalPartySchema.omit({
  id: true,
}).partial();
export const UpdatePartySchema = z.object({
  id: z.uuid(),
  data: UpdatePartyDataSchema,
});

export type UpdatePartyDataDto = z.infer<typeof UpdatePartyDataSchema>;
export type UpdatePartyDto = z.infer<typeof UpdatePartySchema>;
