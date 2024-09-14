import { query, mutation } from "./_generated/server";
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

export const submitForm = mutation({
  args: {
    answers: v.array(
      v.object({
        question: v.string(),
        answer: v.union(v.string(), v.array(v.string())),
      })
    ),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    var submitScheme = {};
    args.answers.forEach((answer) => {
      submitScheme[answer.question] = answer.answer;
    });
    console.log(submitScheme);
    console.log(args.id);
    const taskId = await ctx.db.insert(args.id, submitScheme);
    // do something with `taskId`
  },
});
