import prisma from "@/lib/prisma";
import { publicProcedure, router, createServerCaller } from "./trpc";
import { authRouter } from "./auth-router";
import { getUserProfile } from "../actions/profile";
import { inferRouterOutputs } from "@trpc/server";


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

export type RouterOutput = inferRouterOutputs<AppRouter>;
export const trpcServer = createServerCaller(appRouter);
