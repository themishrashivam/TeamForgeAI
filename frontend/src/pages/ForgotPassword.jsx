import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setResetUrl("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/forgot-password",
        {
          email: email.trim(),
        }
      );

      setSuccess(true);

      setMessage(
        response.data.message ||
          "Password reset link generated successfully."
      );

      /*
        Email service is not connected yet.

        For development, backend returns resetUrl.
        Later this URL will be sent through email.
      */
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (error) {
      console.log(
        "Forgot Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetLink = () => {
    if (!resetUrl) {
      return;
    }

    try {
      const url = new URL(resetUrl);

      navigate(
        `${url.pathname}${url.search}${url.hash}`
      );
    } catch (error) {
      console.log(
        "Invalid Reset URL:",
        error
      );

      setError(
        "Invalid password reset link."
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f8f8ff]
        flex
        items-center
        justify-center
        px-4
        py-8
      "
    >
      <div
        className="
          w-full
          max-w-lg
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-100
          p-6
          sm:p-8
          md:p-10
        "
      >
        {/* Back to Login */}
        <Link
          to="/login"
          className="
            inline-flex
            items-center
            gap-2
            text-gray-500
            hover:text-violet-600
            transition
            text-sm
          "
        >
          <FaArrowLeft />
          Back to Login
        </Link>

        {/* Icon */}
        <div className="flex justify-center mt-8 mb-6">
          <div
            className="
              w-20
              h-20
              sm:w-24
              sm:h-24
              rounded-full
              bg-violet-100
              flex
              items-center
              justify-center
              text-violet-600
              text-3xl
              sm:text-4xl
            "
          >
            <FaLock />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            text-center
            text-gray-900
          "
        >
          Forgot Password?
        </h1>

        <p
          className="
            text-center
            text-gray-500
            mt-3
            text-sm
            sm:text-base
            leading-6
          "
        >
          Enter your registered email address and
          we'll help you reset your password.
        </p>

        {/* Success Message */}
        {success && (
          <div
            className="
              mt-6
              p-4
              rounded-xl
              bg-green-50
              border
              border-green-200
            "
          >
            <p
              className="
                text-sm
                text-green-700
                font-medium
              "
            >
              {message}
            </p>

            {/* Development Reset Link */}
            {resetUrl && (
              <div className="mt-4">
                <p
                  className="
                    text-xs
                    text-gray-500
                    mb-2
                  "
                >
                  Development reset link:
                </p>

                <button
                  type="button"
                  onClick={handleResetLink}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    font-medium
                    text-sm
                    transition
                    break-all
                  "
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="
              mt-6
              p-4
              rounded-xl
              bg-red-50
              border
              border-red-200
            "
          >
            <p
              className="
                text-sm
                text-red-600
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {/* Email */}
          <div>
            <label
              className="
                block
                mb-2
                font-medium
                text-gray-700
              "
            >
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope
                className="
                  absolute
                  left-4
                  top-5
                  text-gray-400
                "
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  pl-12
                  pr-4
                  py-4
                  bg-white
                  text-gray-900
                  placeholder-gray-400
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                  focus:border-violet-500
                  transition
                "
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-violet-600
              hover:bg-violet-700
              active:bg-violet-800
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              py-4
              rounded-xl
              font-semibold
              transition
              duration-200
            "
          >
            {loading
              ? "Generating Reset Link..."
              : "Reset Password"}
          </button>
        </form>

        {/* Login Link */}
        <p
          className="
            text-center
            text-gray-600
            mt-8
            text-sm
            sm:text-base
          "
        >
          Remember your password?

          <Link
            to="/login"
            className="
              ml-2
              text-violet-600
              font-semibold
              hover:underline
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;