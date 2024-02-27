import { privateProceduce } from "../server/trpc";
import prisma from "@/lib/prisma";

export const getUserProfile = privateProceduce.query(async ({ ctx }) => {
  const { user } = ctx;
  const profile = await prisma.user_profiles.findUnique({
    where: {
      user_id: user.id,
    },
    include: {
      company_profiles: true,
    },
  });

  return profile;
});
