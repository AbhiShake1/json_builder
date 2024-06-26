import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { components } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { isEqual } from "lodash";

export const componentRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const c = await ctx.db.select().from(components)
        .where(({ id }) => eq(id, input))
        .limit(1);
      return c[0];
    }),
  sync: protectedProcedure
    .input(z.object({ componentId: z.number(), schema: z.string(), localUpdatedAt: z.date().optional() }))
    .mutation(async ({ ctx, input: { schema, componentId, localUpdatedAt } }) => {
        // const resp = await ctx.mailer.emails.send({
        //     to: ["abhi9848038283@gmail.com"],
        //     subject: "Test",
        //     text: "abc",
        //     from: "JsonBuilder <onboarding@resend.dev>",
        // })
        // console.log(resp)

      const serverComponent = await ctx.db.select()
        .from(components)
        .where(({ id }) => eq(id, componentId))
        .limit(1)
        .execute()

      if (serverComponent.length === 0) throw new TRPCError({ code: "NOT_FOUND" })

      const { updatedAt, schema: serverSchema } = serverComponent[0]!

      if (updatedAt && serverSchema && localUpdatedAt && localUpdatedAt < updatedAt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Schema in server has been updated. Do you want to sync? All your local changes will be lost",
        })
      }

      if (isEqual(serverSchema, schema)) return null

      return ctx.db.update(components)
        .set({ updatedAt: new Date(), schema })
        .where(eq(components.id, componentId))
        .returning().then(t => t[0])
    }),
})

