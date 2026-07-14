import { Link } from "react-router-dom";
import {
  FaUsers,
  FaProjectDiagram,
  FaRocket,
} from "react-icons/fa";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">

      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-6 gap-4">

        <h1 className="text-2xl sm:text-3xl font-bold text-violet-600">
          TeamForge AI
        </h1>

        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">

          <Link
            to="/login"
            className="
              flex-1 sm:flex-none
              px-5 py-2
              border border-violet-600
              rounded-lg
              text-violet-600
              text-center
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              flex-1 sm:flex-none
              px-5 py-2
              bg-violet-600
              text-white
              rounded-lg
              text-center
            "
          >
            Register
          </Link>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Build Amazing
              <span className="text-violet-600">
                {" "}Projects Together
              </span>
            </h1>

            <p className="mt-6 text-gray-600 text-base sm:text-lg">
              TeamForge AI helps students connect,
              collaborate and create impactful projects
              with talented teammates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <Link
                to="/register"
                className="
                  w-full sm:w-auto
                  bg-violet-600
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  text-center
                "
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="
                  w-full sm:w-auto
                  border
                  px-8
                  py-4
                  rounded-xl
                  text-center
                "
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}
          <div className="flex justify-center">

            <img
              src="/team-illustration.png"
              alt="Team"
              className="w-full max-w-xs sm:max-w-md"
            />

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why TeamForge AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <FaProjectDiagram className="text-4xl text-violet-600 mb-4" />

            <h3 className="text-xl font-semibold">
              Create Projects
            </h3>

            <p className="text-gray-500 mt-3">
              Start innovative projects and share ideas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <FaUsers className="text-4xl text-green-600 mb-4" />

            <h3 className="text-xl font-semibold">
              Find Teammates
            </h3>

            <p className="text-gray-500 mt-3">
              Connect with skilled students instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <FaRocket className="text-4xl text-orange-500 mb-4" />

            <h3 className="text-xl font-semibold">
              Launch Faster
            </h3>

            <p className="text-gray-500 mt-3">
              Collaborate efficiently and build together.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default LandingPage;