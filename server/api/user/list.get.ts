import { z } from "zod";

export const paramsSchema = z.object({
  pageSize: z.coerce.number().min(1),
  pageIndex: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });

  const skip = (data.pageIndex - 1) * data.pageSize;
  const list = await prisma.user.findMany({
    skip: skip,
    take: data.pageSize,
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      isSuper: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return list;
});
