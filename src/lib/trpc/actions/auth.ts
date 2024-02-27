import { publicProcedure } from "../server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const userLogout = publicProcedure.mutation(async ({ ctx }) => {
  const { supabase, user } = ctx;
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  const { error } = await supabase.auth.signOut();
  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  return { success: true };
});

export const userLogin = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  )
  .mutation(async ({ input, ctx: { supabase } }) => {
    const { email, password } = input;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new TRPCError({ code: "UNAUTHORIZED" });
    return { success: true };
  });

export const userRegister = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      companyName: z.string().min(1),
      lastName: z.string().min(1),
      firstName: z.string().min(1),
    })
  )
  .mutation(async ({ input, ctx: { supabase } }) => {
    const { email, password, companyName, lastName, firstName } = input;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      throw new TRPCError({ code: "CONFLICT" });
    }
    if (!data.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const company = await prisma.company_profiles.create({
      data: {
        name: companyName,
      },
    });

    const profile = await prisma.user_profiles.create({
      data: {
        user_id: data.user?.id,
        company_profilesId: company.id,
        role: "admin",
        status: "active",
        firstName,
        lastName,
        email,
      },
    });

    return {
      sentToEmail: data.user?.email,
      user_profile: {
        profile,
        company,
      },
    };
  });
