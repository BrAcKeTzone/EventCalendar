import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api";
import TermsAndConditionsModal from "../components/common/TermsAndConditionsModal";
import { offices } from "../assets/jsons/Offices.json";
import "../assets/styles/Loader.css";

const SignupPage = () => {
  const Navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [signupError, setSignupError] = useState("");
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
      id: "",
      name: "",
      email: "",
      otp: "",
      dateOfBirth: "",
      jobPosition: "",
      assignedOffice: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      id: Yup.string()
        .matches(/^\d{4}$/, "ID must be exactly 4 digits")
        .required("ID is required"),
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      otp: Yup.string()
        .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
        .required("OTP is required"),
      dateOfBirth: Yup.string().required("Date of Birth is required"),
      jobPosition: Yup.string().required("Job Position is required"),
      assignedOffice: Yup.string().required("Assigned Office is required"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.post(`/auth/vsignup`, values);
        alert(
          "You're all set! Your registration is complete and awaits admin confirmation"
        );
        Navigate("/");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setSignupError("Signup error");
        } else {
          alert("Signup error");
          console.error("Error:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const receiveOTP = async (email) => {
    try {
      setIsSubmitting(true);
      const response = await api.post(`/auth/signup`, { email });
      if (response.status === 200) {
        startCountdown();
        alert(
          "We've sent an OTP to " +
            email +
            ". Check your inbox and enter the code to verify your account."
        );
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response && error.response.status === 400) {
        alert("Email address may already be in use");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="flex items-center justify-center h-full bg-cover bg-center min-h-screen pl-10 md:pl-0"
      style={
        {
          // backgroundImage: "url(https://source.unsplash.com/random)"
        }
      }
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-md max-w-sm w-full mr-10 md:mr-0">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              ID
            </label>
            <input
              id="id"
              name="id"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.id}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                formik.touched.id && formik.errors.id
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.id && formik.errors.id ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.id}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

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
                onClick={() => receiveOTP(formik.values.email)}
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

          <div className="mb-4">
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dateOfBirth}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.dateOfBirth}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="jobPosition"
              className="block text-sm font-medium text-gray-700"
            >
              Job Position
            </label>

            <input
              id="jobPosition"
              name="jobPosition"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jobPosition}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                formik.touched.jobPosition && formik.errors.jobPosition
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.jobPosition && formik.errors.jobPosition ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.jobPosition}
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <label
              htmlFor="assignedOffice"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned Office
            </label>
            <select
              id="assignedOffice"
              name="assignedOffice"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.assignedOffice}
              className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                formik.touched.assignedOffice && formik.errors.assignedOffice
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select an office" />
              {offices.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </select>
            {formik.touched.assignedOffice && formik.errors.assignedOffice ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.assignedOffice}
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
                  formik.touched.password && formik.errors.password
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
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <div className="mb-4 text-center">
            <p className="text-gray-700 text-sm mb-2">
              By signing up, you agree to our
            </p>
            <p
              href=""
              className="text-blue-500 text-sm hover:underline mb-4 cursor-pointer"
              onClick={openModal}
            >
              Terms and Conditions
            </p>
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
              Sign Up
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
        </form>
      </div>
      <TermsAndConditionsModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      />
      {isSubmitting && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-white opacity-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
