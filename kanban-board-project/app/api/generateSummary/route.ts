import { NextResponse } from "next/server";
import openai from "@/openai";

export async function POST(request: Request) {
    // todos in the body of the POST request
    const {todos} = await request.json();
    
    //communicate with openAI GPT
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.8,
        n: 1,
        max_tokens: 300,
        stream: false,
        messages: [
            {
                role: "system",
                content: `When responding, welcome the user as Mr. Gulati and say welcome the user to this AI-Powered Kanban Board app!
                Limit the response to 300 characters`,
            },
            {
                role: "user",
                content: `Hey there, provide a summary of the following tasks. Count how many todos are in each category
                such as To do, in progress and done, if the number of tasks in either To do category or In progress category are equal to or more than 4 then end with your response with a variation on the message of It looking like a busy day! Goodluck!
                In a different case, if both to do category and in progress cetgory have less than 4 todos then end with some variation of the phrase, it looks like a quiet day today, Goodluck! 
                , and never say the exact same ending message. Add a variation to it but keep the meaning. One more thing, the alias for To do category is Pending tasks and Done category should be referred to as Completed or To be Done, dont mention them as To Do or Done.
                In any use case you should not mention when tasks are less than 4 or more than 4 in a category.
                Here's the data: ${JSON
                    .stringify(
                        todos
                    )}`,
            },
        ],
    });


    

    return NextResponse.json(response.choices[0].message);
}
// import { NextResponse } from "next/server";
// import openai from "@/openai";

// export async function POST(request: Request) {
//     try {
//         const { todos } = await request.json();

//         const prompt = `
//         Please provide a concise summary of the tasks on the board. Here's what I need:
//         1. Count the number of tasks in each category (To do, In Progress, Done).
//         2. Summarize the first task in the "To do" column with the correct status and creation date.

//         Here are the tasks:
//         ${JSON.stringify(todos)}
//         `;

//         const response = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             temperature: 0.8,
//             n: 1,
//             stream: false,
//             messages: [
//                 {
//                     role: "system",
//                     content: `You are a helpful assistant that summarizes Kanban board tasks. Please ensure the output is user-friendly and accurate.`,
//                 },
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],
//         });

//         const message = response.choices[0].message?.content || "No summary available.";

//         const formattedResponse = `
//         Here's the summary of the tasks:
//         - **Task Count:**
//           - To Do: ${todos.filter((todo) => todo.status === "todo").length}
//           - In Progress: ${todos.filter((todo) => todo.status === "inprogress").length}
//           - Done: ${todos.filter((todo) => todo.status === "done").length}
//         - **First Task in "To Do":**
//           - Title: "${todos.find((todo) => todo.status === "todo")?.title || "N/A"}"
//           - Status: "To Do"
//           - Created At: "${todos.find((todo) => todo.status === "todo")?.$createdAt || "N/A"}"
//         `;

//         return NextResponse.json({ content: formattedResponse });
//     } catch (error) {
//         console.error("Error in POST /api/generateSummary:", error);
//         return NextResponse.json({ error: "An error occurred during the API call." }, { status: 500 });
//     }
// }

// export async function POST(request: Request) {
//     try {
//         const { todos } = await request.json();

//         // Return a simple JSON response to ensure basic functionality
//         return NextResponse.json({ message: "API is working!", todos });
//     } catch (error) {
//         console.error("Error in POST /api/generateSummary:", error);
//         return NextResponse.json({ error: "An error occurred." }, { status: 500 });
//     }
// }



