import prisma from "@/lib/prisma";
import { publicProcedure, router, createCallerFactory } from "./trpc";
import { authRouter } from "./auth-router";
import { getUserProfile } from "../actions/profile";

export const appRouter = router({
  authRouter,
  getUserProfile,
  getTodos: publicProcedure.query(async () => {
    return [10, 20, 30];
  }),
  test: publicProcedure.query(async () => {
    const res = await prisma.user_profiles.count();

    return {
      count: res,
    };
  }),
});

export type AppRouter = typeof appRouter;
