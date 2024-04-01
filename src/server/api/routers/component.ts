import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {components} from "~/server/db/schema";
import {eq} from "drizzle-orm";

export const componentRouter = createTRPCRouter({
    byId: protectedProcedure
        .input(z.number())
        .query(({ctx, input}) => {
            return ctx.db.select().from(components)
                .where(({id}) => eq(id, input))
                .limit(1)
                .then(c => c[0])
        }),
})