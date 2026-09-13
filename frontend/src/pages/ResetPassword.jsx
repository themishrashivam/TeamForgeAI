import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        `/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      console.log(
        "Reset Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
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
          Reset Password
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
          Enter your new password below to
          secure your TeamForge AI account.
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
                text-center
              "
            >
              Password reset successfully!
            </p>

            <p
              className="
                text-xs
                text-green-600
                text-center
                mt-1
              "
            >
              Redirecting to Login...
            </p>
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
                text-center
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            {/* New Password */}
            <div>
              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-gray-700
                "
              >
                New Password
              </label>

              <div className="relative">
                <FaLock
                  className="
                    absolute
                    left-4
                    top-5
                    text-gray-400
                  "
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
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

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-2
                "
              >
                Password must be at least 6
                characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-gray-700
                "
              >
                Confirm Password
              </label>

              <div className="relative">
                <FaLock
                  className="
                    absolute
                    left-4
                    top-5
                    text-gray-400
                  "
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
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

            {/* Reset Button */}
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
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>
        )}

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

export default ResetPassword;