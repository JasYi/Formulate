import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      body: args.storageId,
      author: args.author,
      format: "image",
    });
    return docId;
  },
});
