// components/Header.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '../appwrite';
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
    const [board, searchString, setSearchString] = useBoardStore((state) => [
        state.board,
        state.searchString,
        state.setSearchString
    ]);
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestion, setSuggestion] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await account.get();
                console.log('Header User:', currentUser);
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (board.columns.size === 0) return;
        setLoading(true);

        const fetchSuggestionFunc = async () => {
            try {
                const suggestion = await fetchSuggestion(board);
                setSuggestion(suggestion);
            } catch (error) {
                console.error('Error fetching suggestion:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestionFunc();
    }, [board]);

    const handleLogout = async () => {
        try {
            if (user) { // Ensure user is authenticated
                await account.deleteSession('current');
                router.push('/login'); // Redirect to login page after logout
            }
        } catch (error) {
            console.error('Error during logout:', error);
            router.push('/login'); // Redirect to login even if logout fails
        }
    }

    return (
        <header>
            <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
                {/* Background gradient */}
                <div 
                    className="
                        absolute 
                        top-0
                        left-0
                        w-full
                        h-96
                        bg-gradient-to-br
                        from-pink-400
                        to-[#0055D1]
                        rounded-md
                        filter
                        blur-3xl
                        opacity-50
                        -z-50"
                />
                <Image
                    src="https://links.papareact.com/c2cdd5"
                    alt="App Logo"
                    width={300}
                    height={100}
                    className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
                />

                <div className="flex items-center space-x-5 flex-1 justify-end">
                    {/* Search Box */}
                    <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="flex-1 outline-none p-2"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <button type="submit" hidden>Search</button>
                    </form>

                    {/* Avatar and Logout */}
                    <div className="flex items-center space-x-3">
                        {user && (
                            <Avatar 
                                name={user.name || user.email || "User"} 
                                round 
                                size="50" 
                                color="#0055D1" 
                            />
                        )}
                        <button 
                            onClick={handleLogout} 
                            className="text-red-500 hover:text-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center px-5 py-2 md:py-5">
                <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl
                rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
                    <UserCircleIcon 
                        className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && "animate-spin"}`}
                    />
                    {suggestion && !loading
                        ? suggestion
                        : "GPT is summarising your tasks for the day..."}
                </p>
            </div>
        </header>
    )
}

export default Header;



// import Image from "next/image";
// import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/16/solid";
// import Avatar from "react-avatar";
// import { useBoardStore } from "@/store/BoardStore";
// import { useEffect, useState } from "react";
// import fetchSuggestion from "@/lib/fetchSuggestion";

// function Header() {
//     const [board, searchString, setSearchString] = useBoardStore((state) => [
//         state.board,
//         state.searchString,
//         state.setSearchString
//     ]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [suggestion, setSuggestion] = useState<string>("");

//     useEffect(() => {
//         if (board.columns.size === 0) return;
//         setLoading(true);

//         const fetchSuggestionFunc = async () => {
//             const suggestion = await fetchSuggestion(board);
//             setSuggestion(suggestion);
//             setLoading(false);
//         };

//         fetchSuggestionFunc();
//     }, [board]);

//     return (
//         <header>
//             <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
//                 <div 
//                     className="
//                     absolute 
//                     top-0
//                     left-0
//                     w-full
//                     h-96
//                     bg-gradient-to-br
//                     from-pink-400
//                     to-[#0055D1]
//                     rounded-md
//                     filter
//                     blur-3xl
//                     opacity-50
//                     -z-50"
//                 />
//                 <Image
//                     src="https://links.papareact.com/c2cdd5"
//                     alt="Trello Logo"
//                     width={300}
//                     height={100}
//                     className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
//                 />

//                 <div className="flex items-center space-x-5 flex-1 justify-end">
//                     <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
//                         <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
//                         <input 
//                             type="text" 
//                             placeholder="Search" 
//                             className="flex-1 outline-none p-2"
//                             value={searchString}
//                             onChange={(e) => setSearchString(e.target.value)}
//                         />
//                         <button type="submit" hidden>
//                             Search
//                         </button>
//                     </form>

//                     <Avatar name="Sahajpreet Singh" round size="50" color="#0055D1" />
//                 </div>
//             </div>
//             <div className="flex items-center justify-center px-5 py-2 md:py-5">
//                 <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
//                     <UserCircleIcon className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && "animate-spin"}`} />
//                     {suggestion && !loading
//                         ? suggestion
//                         : "GPT is summarizing your tasks for the day..."}
//                 </p>
//             </div>
//         </header>
//     );
// }

// export default Header;


