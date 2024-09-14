import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllEntries = query({
  args: { taskListId: v.string() },
  handler: async (ctx, args) => {
    if (args.taskListId == "") {
      return [];
    }
    console.log(args.taskListId);
    const tasks = await ctx.db.query("documents").collect();
    console.log(tasks);
    return tasks;
  },
});
