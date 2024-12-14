import { useUserSession } from "~/server/utils/user";

export default defineEventHandler(async (event) => {
  const useSession = await useUserSession(event);
  await useSession.clear();
  return true;
});
