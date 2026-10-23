import z from "zod";

export const AddPartySchema = z.object({
  //   id: z.uuid(),
  name: z.string(),
  color: z.string(),
  borderColor: z.string(),
  //   votes: z.int(),
});

export type AddPartyDto = z.infer<typeof AddPartySchema>;

export const WithIdSchema = z.object({
  id: z.uuid(),
});
