import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify";
import {
  FaUsers,
  FaFolderOpen,
  FaComments,
} from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    bio: "",
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.warning("Password do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          skills: formData.skills
            ? formData.skills
                .split(",")
                .map((skill) => skill.trim())
            : [],
          bio: formData.bio,
        }
      );

      toast.success("Registration Successful!");

      navigate("/login");

    } catch (error) {

      toast.error("Registration Failed!");

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
      {/* LEFT SIDE */}

      <div className="w-full lg:w-1/2 px-6 md:px-12 lg:px-20 py-10 flex flex-col">

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-violet-600">
            TeamForge AI
          </h2>

          <h1 className="mt-10 font-extrabold leading-tight text-5xl md:text-6xl lg:text-8xl text-gray-900">
            Build Great
            <br />
            Things
            <br />
            <span className="text-violet-600">
              Together
            </span>
          </h1>

          <p className="mt-8 text-base md:text-xl text-gray-600 max-w-xl">
            Join TeamForge AI and connect with
            skilled people to build amazing
            projects.
          </p>
        </div>

        <div className="mt-12 space-y-8">

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 text-xl">
              <FaUsers />
            </div>

            <div>
              <h3 className="font-bold text-xl text-gray-900">
                Find the Right Team
              </h3>

              <p className="text-gray-600">
                Discover and connect with skilled
                teammates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 text-xl">
              <FaFolderOpen />
            </div>

            <div>
              <h3 className="font-bold text-xl text-gray-900">
                Work on Meaningful Projects
              </h3>

              <p className="text-gray-600">
                Collaborate on innovative projects
                that make an impact.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 text-xl">
              <FaComments />
            </div>

            <div>
              <h3 className="font-bold text-xl text-gray-900">
                Grow Together
              </h3>

              <p className="text-gray-600">
                Learn, share ideas and grow your
                skills as a team.
              </p>
            </div>
          </div>

        </div>

        <div className="hidden lg:flex justify-center mt-auto pt-10">
          <img
            src="/team-illustration.png"
            alt="Team"
            className="w-full max-w-md"
          />
        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8">

        <div className="bg-white w-full max-w-xl rounded-3xl shadow-lg p-6 md:p-10">

          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Create your account
          </h1>

          <p className="text-center text-gray-500 mt-3 mb-8">
            Start your journey with TeamForge AI
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full p-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-4 border border-gray-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full p-4 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="3"
                className="w-full p-4 border border-gray-300 rounded-xl resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              bg-violet-600
              hover:bg-violet-700
              text-white
              font-semibold
              py-4
              rounded-xl
              transition-all
              duration-300
              "
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="text-violet-600 font-semibold ml-1"
              >
                Login
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;