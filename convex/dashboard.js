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
    const tasks = await ctx.db.query(args.taskListId).collect();
    const columns = Object.keys(tasks[0]);
    console.log(columns);
    var objects = [];
    tasks.forEach((task) => {
      var toAdd = [];
      columns.forEach((column) => {
        toAdd.push(task[column]);
      });
      objects.push(toAdd);
    });
    return [columns, objects];
  },
});
