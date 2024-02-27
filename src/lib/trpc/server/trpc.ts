import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const { user } = ctx;
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProceduce = t.procedure.use(isAuth);
export const createCallerFactory = t.createCallerFactory;
