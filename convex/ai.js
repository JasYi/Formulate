import { action, internalQuery } from "./_generated/server";
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

    console.log(imgUrl);

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
                    description: "The possible answers to the question",
                  },
                },
              },
            },
          },
          required: ["app_start", "app_end"],
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
      tools: [functionSchema],
      max_tokens: 300,
    };

    // Make the API request
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the response
        console.log(data);
        console.log(data.choices[0]);
        const toolCall = data.choices[0].message.tool_calls[0];
        console.log(toolCall);
        return toolCall.function;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("finished");
    return "finished";
  },
});

// This is a query that generates image url
export const readData = internalQuery({
  args: { imageId: v.string() },
  handler: async (ctx, args) => {
    console.log(args.imageId);

    const document = await ctx.db.get(args.imageId);

    return await ctx.storage.getUrl(document.body);
  },
});
