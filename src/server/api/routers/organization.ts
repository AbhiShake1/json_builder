import { organizations, userOrganizations } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";

export const organizationRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ search: z.ostring() }).default({}))
    .query(async ({ ctx, input: { search } }) => {
      const res = await ctx.db.select()
        .from(userOrganizations)
        .rightJoin(organizations, eq(userOrganizations.organizationId, organizations.id))
        .where(({ user_organization: { userId }, organization: { name } }) => {
          const ofUser = eq(userId, ctx.session.user.id)
          if (!search) return ofUser

          return and(ofUser, ilike(name, `%${search}%`))
        })
        .execute()
      return res.map(({ organization }) => organization)
    }),
  create: protectedProcedure
    .input(z.custom<typeof organizations.$inferInsert>())
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.insert(organizations).values(input).returning({ id: organizations.id })
      await ctx.db.insert(userOrganizations).values({ userId: ctx.session.user.id, organizationId: org[0]!.id })
      return org
    }),
})
