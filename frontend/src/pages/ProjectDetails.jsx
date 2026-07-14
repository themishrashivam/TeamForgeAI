import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/${id}`);

      setProject(res.data.project);
    } catch (error) {
      console.log("Project Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Project Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-80 object-cover"
        />

        <div className="p-8">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800">
            {project.title}
          </h1>

          {/* Category & Type */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm">
              {project.category}
            </span>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              {project.projectType}
            </span>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {project.status}
            </span>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-2 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Creator */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Created By
            </h2>

            <p className="text-gray-700">
              {project.createdBy?.name || "Unknown"}
            </p>
          </div>

          {/* Team Members */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Team Members
            </h2>

            <p className="text-gray-700">
              {project.teamMembers?.length || 0} Members
            </p>
          </div>

          {/* GitHub */}
          {project.githubLink && (
            <div className="mt-8">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="bg-violet-600 text-white px-6 py-3 rounded-xl inline-block hover:bg-violet-700"
              >
                View GitHub Repository
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;