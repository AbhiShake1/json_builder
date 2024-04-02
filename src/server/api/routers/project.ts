import {components, projects} from "~/server/db/schema";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import {desc, eq} from "drizzle-orm";
import {z} from "zod";

export const projectRouter = createTRPCRouter({
    forOrganization: protectedProcedure
        .input(z.number())
        .query(({ctx, input}) => {
            return ctx.db.select().from(projects)
                .where(({organizationId}) => eq(organizationId, input))
                .orderBy(desc(projects.createdAt))
                .execute()
        }),
    create: protectedProcedure
        .input(z.custom<typeof projects.$inferInsert>())
        .mutation(({ctx, input}) => {
            return ctx.db.insert(projects).values(input).returning()
        }),

    componentsOf: protectedProcedure
        .input(z.number())
        .query(async ({ctx, input}) => {
            return ctx.db.select().from(components)
                .where(({projectId}) => eq(projectId, input))
                .orderBy(desc(components.updatedAt), desc(components.createdAt))
        }),
    createComponent: protectedProcedure
        .input(z.custom<Omit<typeof components.$inferInsert, "projectId"> & { projectId: number }>())
        .query(async ({ctx, input}) => {
            const schema = `{
    "$schema": "http://json-schema.org/draft-07/schema",
    "type": "object",
    "properties": {
        
    }
}
            `
            return ctx.db.insert(components).values({...input, schema})
        }),
})

