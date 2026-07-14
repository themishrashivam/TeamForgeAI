import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
import {
  FaUsers,
  FaFolderOpen,
  FaComments,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/login",
        formData
      );

      toast.success("Login Success!")

      navigate("/dashboard");

    } catch (error) {
      toast.error("Login Failed!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8ff] flex flex-col lg:flex-row">

      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      {/* LEFT SECTION */}

      <div className="w-full lg:w-1/2 px-6 md:px-12 lg:px-20 py-10 flex flex-col">

        <div>
          <h2 className="text-3xl font-bold text-violet-600">
            TeamForge AI
          </h2>

          <h1 className="mt-10 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900">
            Welcome Back!
            <br />
            Let's Build
            <br />
            <span className="text-violet-600">
              Great Things
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Login to your account and continue
            collaborating with your team.
          </p>
        </div>

        <div className="mt-10 space-y-8">

          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <FaUsers />
            </div>

            <div>
              <h3 className="font-bold text-xl">
                Connect with Talent
              </h3>

              <p className="text-gray-600">
                Find and connect with amazing people.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <FaFolderOpen />
            </div>

            <div>
              <h3 className="font-bold text-xl">
                Work on Impactful Projects
              </h3>

              <p className="text-gray-600">
                Collaborate and build innovative
                solutions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <FaComments />
            </div>

            <div>
              <h3 className="font-bold text-xl">
                Learn & Grow Together
              </h3>

              <p className="text-gray-600">
                Share knowledge and grow as a team.
              </p>
            </div>
          </div>

        </div>

        <div className="hidden lg:flex justify-center mt-auto pt-10">
          <img
            src="/team-illustration.png"
            alt="Team"
            className="max-w-lg"
          />
        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">

        <div className="bg-white w-full max-w-xl rounded-3xl shadow-lg p-8 md:p-12">

          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-4xl">
              <FaLock />
            </div>
          </div>

          <h1 className="text-center text-4xl font-bold text-gray-900">
            Login to your account
          </h1>

          <p className="text-center text-gray-500 mt-3 mb-8">
            Enter your credentials to access
            your account
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-5 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-xl pl-12 p-4"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-5 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-xl pl-12 p-4"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-violet-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-violet-600
                hover:bg-violet-700
                text-white
                py-4
                rounded-xl
                font-semibold
                transition
              "
            >
              {loading
                ? "Logging In..."
                : "Login"}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-gray-500">
                or
              </span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* <button
              type="button"
              className="
                w-full
                border
                border-gray-300
                py-4
                rounded-xl
                hover:bg-gray-50
              "
            >
              Continue with Google
            </button> */}

            <p className="text-center text-gray-600">
              Don't have an account?

              <Link
                to="/register"
                className="ml-2 text-violet-600 font-semibold"
              >
                Sign up
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;