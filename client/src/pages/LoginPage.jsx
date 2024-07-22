import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api.jsx";
import Cookies from "js-cookie";

const LoginPage = () => {
    const Id = Cookies.get("SESSION_ID");
    const Navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
                )
                .required("Password is required")
        }),
        onSubmit: async values => {
            try {
                const response = await api.post(`/auth/login`, values);
                if (response.data.user.id) {
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1);
                    Cookies.set(
                        "SESSION_ID",
                        JSON.stringify(response.data.user.id),
                        {
                            expires: expirationDate
                        }
                    );
                    alert("Login Successfully!");
                    Navigate("/cal");
                } else {
                    throw new Error("Login failed"); // Throw error if user id is not present in response
                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    alert("User is not approved");
                } else {
                    alert("Login error");
                    console.error("Error:", error);
                }
            }
        }
    });

    useEffect(() => {
        if (Id) {
            
            const sessionId = JSON.parse(Id);
            Navigate("/cal");
        }
    }, []);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const resetPass = () => {
        Navigate("/for");
    };

    return (
        <div
            className="flex items-center justify-center h-full bg-cover bg-center min-h-screen pl-10 md:pl-0"
            style={{
                backgroundImage: "url(https://source.unsplash.com/random)"
            }}
        >
            <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-md max-w-sm w-full mr-10 md:mr-0">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                formik.touched.email && formik.errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.email}
                            </div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    formik.touched.password &&
                                    formik.errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.password}
                            </div>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white p-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                !(formik.isValid && formik.dirty) &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!(formik.isValid && formik.dirty)}
                        >
                            Login
                        </button>
                    </div>

                    <div className="mb-4 text-center">
                        <button
                            onClick={resetPass}
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Reset Password
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-gray-700">
                            Don't have an account?{" "}
                        </span>
                        <Link
                            to="/sig"
                            className="text-blue-500 text-sm hover:underline"
                        >
                            Click here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
