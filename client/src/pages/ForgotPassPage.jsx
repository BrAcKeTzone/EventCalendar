import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api.jsx";
import "../assets/styles/Loader.css";

const ForgotPassPage = () => {
  const Navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const startCountdown = () => {
    setIsOtpSent(true);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      setIsOtpSent(false);
      setCountdown(300);
    }, 300000);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      otp: Yup.string()
        .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
        .required("OTP is required"),
      newPassword: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("New Password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm New Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.put(`/auth/vforgot`, values);
        alert("Password reset successfully!");
        Navigate("/");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Error resetting password");
        } else {
          alert("An unexpected error occurred");
          console.error("Error:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const sendOTP = async (email) => {
    try {
      setIsSubmitting(true);
      const response = await api.post(`/auth/forgot`, { email });
      if (response.status === 200) {
        startCountdown();
        alert(
          "We've sent an OTP to " +
            email +
            ". Check your inbox and enter the code to reset your password."
        );
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response && error.response.status === 400) {
        alert("Email address not found.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="flex items-center justify-center h-full bg-cover bg-center min-h-screen pl-10 md:pl-0"
      style={{
        backgroundImage: "url(https://source.unsplash.com/random)",
      }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-md max-w-sm w-full mr-10 md:mr-0">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
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
            <div className="flex justify-end">
              <button
                className={`px-2 mt-1 text-blue-500 hover:underline ${
                  isOtpSent ? "cursor-not-allowed" : ""
                }`}
                type="button"
                disabled={isOtpSent}
                onClick={() => sendOTP(formik.values.email)}
              >
                {isOtpSent ? `Resend OTP (${countdown}s)` : "Send OTP"}
              </button>
            </div>
            {isOtpSent && (
              <>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.otp}
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    formik.touched.otp && formik.errors.otp
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </>
            )}
            {formik.touched.otp && formik.errors.otp ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.otp}
              </div>
            ) : null}
          </div>

          {isOtpSent && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.newPassword && formik.errors.newPassword
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
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmNewPassword}
                    className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formik.touched.confirmNewPassword &&
                      formik.errors.confirmNewPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.confirmNewPassword}
                  </div>
                ) : null}
              </div>
            </>
          )}

          <div className="mb-4">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                !(formik.isValid && formik.dirty) &&
                "opacity-50 cursor-not-allowed"
              }`}
              disabled={!(formik.isValid && formik.dirty) || !isOtpSent}
            >
              {isOtpSent ? "Reset Password" : "Send OTP First"}
            </button>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-700">
              Already have an account?{" "}
            </span>
            <Link to="/" className="text-blue-500 text-sm hover:underline">
              Sign In
            </Link>
          </div>
          <div className="my-2 px-16">
            <hr />
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-700">
              Don't have an account?{" "}
            </span>
            <Link to="/sig" className="text-blue-500 text-sm hover:underline">
              Click here
            </Link>
          </div>
        </form>
      </div>
      {isSubmitting && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassPage;
