import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Sorry, the page you are looking for does not exist.
                </p>
                <Link
                    to="/"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
