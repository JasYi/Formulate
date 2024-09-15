import { action, internalQuery, internalMutation } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const chat = action({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    // Step 1: Get the image url
    const imgUrl = await ctx.runQuery(internal.ai.readData, {
      imageId: args.imageId,
    });

    /*
    *****************************************************
        OPENAI API CALL FROM HERE BELOW
    
    *****************************************************
    */

    // Define the function schema as an object
    const functionSchema = {
      type: "function",
      function: {
        name: "get_form_fields",
        description: "Extracts the questions from an image of a form",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: ["string"],
              description: "The title of the form",
            },
            questions: {
              type: ["array"],
              description: "The questions in the form",
              items: {
                type: "object",
                properties: {
                  question_text: {
                    type: ["string"],
                    description: "The question to be answered",
                  },
                  question_type: {
                    type: ["string"],
                    enum: ["text", "multiple_choice", "checkbox", "date"],
                    description: "The type of question",
                  },
                  answer_choices: {
                    type: ["array"],
                    items: {
                      type: ["string"],
                    },
                    description:
                      "The possible answers to the question. This field is populated if and only if the question_type is multiple_choice or checkbox.",
                  },
                },
              },
            },
          },
          required: ["title", "questions", "question_text", "question_type"],
        },
      },
    };

    // Replace this with your actual OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;

    // Prepare the request body
    const body = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "I will give you an image of a form. Extract the questions the form is asking and return the response in json format.",
            },
            {
              type: "image_url",
              image_url: {
                url: imgUrl,
              },
            },
          ],
        },
      ],
      temperature: 0,
      tools: [functionSchema],
      max_tokens: 1000,
    };

    // Make the API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const toolCall = data.choices[0].message.tool_calls[0];
    var res = toolCall.function;
    res["id"] = args.imageId;
    console.log(res.arguments);
    res["arguments"] = JSON.parse(res.arguments);
    console.log(res);

    const tableId = await ctx.runMutation(internal.ai.populateData, {
      jsonSchema: res,
    });

    console.log(tableId);
    return tableId;
  },
});

// This is a query that generates image url
export const readData = internalQuery({
  args: { imageId: v.string() },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.imageId);

    return await ctx.storage.getUrl(document.body);
  },
});

export const populateData = internalMutation({
  args: {
    jsonSchema: v.object({
      name: v.string(),
      arguments: v.object({
        title: v.string(),
        questions: v.array(
          v.object({
            question_text: v.string(),
            question_type: v.string(),
            answer_choices: v.optional(v.array(v.string())),
          })
        ),
      }),
      id: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    console.log("IN INTERNAL MUTATION");
    const testId = await ctx.db.insert("testForm", { test: "TEST VAL" });
    const idOut = await ctx.db.insert("forms", {
      name: args.jsonSchema.title,
      schema: args.jsonSchema.arguments,
    });
    console.log(idOut);
    return idOut;
  },
});
