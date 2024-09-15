import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getAllEntries = query({
  args: { taskListId: v.string() },
  handler: async (ctx, args) => {
    if (args.taskListId == "") {
      return [];
    }
    const tasks = await ctx.db.query(args.taskListId).collect();
    console.log(tasks);
    if (tasks.length == 0) {
      return [[], []];
    }
    const columns = Object.keys(tasks[0]);
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
