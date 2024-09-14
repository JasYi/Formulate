import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllEntries = query({
  args: { taskListId: v.string() },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks");
    return tasks;
  },
});
