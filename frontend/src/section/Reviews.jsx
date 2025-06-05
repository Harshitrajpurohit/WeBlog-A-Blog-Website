const reviews = [
  {
    title: "Website Review Check Update from Our Team in San Francisco",
    content:
      "The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to Naviglio where you can enjoy the main night life in Barcelona.",
    name: "Emily Carter",
  },
  {
    title: "Feedback from Our New York Branch",
    content:
      "Our team loved the user-friendly interface and the seamless navigation. The blog layout is clean and engaging, perfect for our readers!",
    name: "James Patel",
  },
  {
    title: "Comments from the London Office",
    content:
      "The content quality is top-notch, and the design is visually appealing. A great platform to share our stories and updates with the community.",
    name: "Sophie Bennett",
  },
];

export default function Reviews() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Reviews & Feedback
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col my-2 bg-white dark:bg-gray-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg w-full max-w-sm mx-auto transition-transform hover:scale-105 hover:shadow-md"
                        >
                            <div className="p-6">
                                <h5 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    {review.title}
                                </h5>
                                <p className="text-slate-600 dark:text-slate-400 leading-normal font-light mb-4">
                                    {review.content}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                    - {review.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
