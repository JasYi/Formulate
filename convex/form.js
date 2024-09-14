import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFormSchema = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    console.log("args", args.formId);
    const item = await ctx.db.get(args.formId);
    console.log(item);
    return item;
  },
});
