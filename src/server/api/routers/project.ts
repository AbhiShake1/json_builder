import { projects } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  forOrganization: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.db.select().from(projects)
        .where(({ organizationId }) => eq(organizationId, input))
        .execute()
    }),
  create: protectedProcedure
    .input(z.custom<typeof projects.$inferInsert>())
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(projects).values(input).returning()
    }),
})

