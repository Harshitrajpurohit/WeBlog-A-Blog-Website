import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Meta } from "react-router";
import { FaReply } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function Comments({ slug, blogId }) {
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userIdFromStorage = user._id;

        if (!userIdFromStorage) {
            setIsNotLoggedIn(true);
        } else {
            setUserId(userIdFromStorage);
        }
    }, [navigate]);


    async function handleSubmit(e) {
        e.preventDefault();
        const message = {
            content: content,
            author: userId,
            blog: blogId,
        };
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${slug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error submitting comment:", errorData.error);
                alert("Failed to submit comment. Please try again.");
                return;
            }

            const data = await res.json();
            alert("Comment added!");

            setContent("");
            getComments();

        } catch (error) {
            console.error("Network error:", error);
            alert("Something went wrong. Please check your connection and try again.");
        }
    }

    // Fetch comments from the server
    async function getComments() {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${slug}/comments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Failed to fetch comments:", errorData.error);
                return;
            }

            const data = await res.json();
            setComments(data);

        } catch (error) {
            console.error("Network error while fetching comments:", error);
        }
    }
    useEffect(() => {
        getComments();
    }, [slug]);

    async function handleDeleteComment(commentId) {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${slug}/comments`,{
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({commentId})
            })
            const data = await res.json();
            if(res.status === 201){
                alert(data.message);
            }
            if(!res.ok){
                alert(data.message);
            }
            getComments();
        } catch (error) {
            console.log("failed to delete.");
        }
    }

    console.log(userId);
    console.log("id: ", comments[0])

    return (
        <div className="w-full max-w-4xl mx-auto mt-5 md:mt-10 px-4">

            <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">Comments</h1>

            {isNotLoggedIn ? (
                <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-center">
                    You are not logged in. Please log in to comment.
                </div>

            ) : (<form className="mb-8" onSubmit={handleSubmit}>
                <div className="relative w-full mb-4">
                    <textarea
                        value={content}
                        className="w-full min-h-[120px] resize-y bg-gray-800 text-white border border-gray-600 rounded-lg p-4 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Write your comment..."
                        aria-label="Write a new comment"
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <label className="absolute -top-2.5 left-3 text-xs font-medium text-gray-400 bg-gray-800 px-1">
                        Comment
                    </label>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium transition-colors duration-300"
                        aria-label="Submit comment"
                    >
                        Submit
                    </button>
                </div>
            </form>
            )}



            {/* show comments */}
            <section className="w-full max-w-5xl mx-auto mt-5 md:mt-10 md:px-4">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">All Comments</h2>
                {
                    comments.length === 0 ? (
                        <div className="text-center text-gray-400 text-sm">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (

                        comments.map((comment, index) => (
                            <div className="space-y-4 my-5 text-md md:text:lg" key={index}>
                                {/* Comment 1 */}
                                <div className="bg-gray-800 border border-gray-600 rounded-xl py-3 px-5 md:py-5 md:px-7">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs md:text-sm text-gray-400 pb-1">
                                                <span><img src={comment.author.avatar} alt="avater" className=" rounded-full borderobject-cover w-8 h-8 md:w-10 md:h-10
                            border-2 border-blue-400 inline mr-2" /></span>
                                                <span className="font-medium text-sm text-white pr-1">{comment.author.username}</span> · {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                            <p className="mt-2 text-white text-sm">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <button
                                            className="text-md text-blue-400 hover:text-blue-300 focus:outline-none focus:underline cursor-pointer"
                                            aria-label="Reply to User1's comment"

                                        >
                                            {/* <FaReply/> */}
                                        </button>
                                        {
                                            userId == comment.author._id && (
                                                <button
                                                    className={`text-xl text-white hover:text-blue-300 focus:outline-none focus:underline cursor-pointer
                                                `}
                                                onClick={() => handleDeleteComment(comment._id)}
                                                    aria-label="Reply to User1's comment"

                                                >
                                                    <MdDeleteOutline />
                                                </button>
                                            )
                                        }


                                    </div>
                                    {/* Nested Reply */}
                                    {/* <div className="mt-4 pl-6 border-l-2 border-gray-500">
                                    <p className="text-sm text-gray-400">
                                        <span className="font-medium text-white">User2</span> · June 3, 2025, 5:35 PM
                                    </p>
                                    <p className="mt-2 text-white text-sm">
                                        Totally agree! AI in healthcare is a game-changer.
                                    </p>
                                </div> */}
                                </div>

                            </div>
                        ))

                    )
                }
            </section>

        </div>
    );
}