import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodosForAI(board);
    console.log('Formatted todos to send:', todos);

    const res = await fetch("/api/generateSummary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
    });

    const GPTdata = await res.json();
    const { content } = GPTdata;

    return content;
};

export default fetchSuggestion;

// import { formatTodosForAI } from "./formatTodosForAI";

// export default async function fetchSuggestion(board: Board) {
//     const todos = formatTodosForAI(board);

//     try {
//         const res = await fetch("/api/generateSummary", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ todos }),
//         });

//         if (!res.ok) {
//             throw new Error(`API request failed with status ${res.status}`);
//         }

//         const data = await res.json();
//         return data.content; // Assuming `content` is where the formatted summary is stored
//     } catch (error) {
//         console.error("Error fetching suggestion:", error);
//         return "Could not fetch suggestions at this time.";
//     }
// }

