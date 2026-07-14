import { useState } from "react";
import api from "../../services/api";

function CreateProjectModal({
  onClose,
  onProjectCreated,
}) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    requiredSkills: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/create", {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      setFormData({
        title: "",
        description: "",
        image: "",
        requiredSkills: "",
      });

      onProjectCreated();
      onClose();

    } catch (error) {
      console.log(error);
      alert("Failed to create project");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Project Title */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                p-3
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your project..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                p-3
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Project Image URL
            </label>

            <input
              type="text"
              name="image"
              placeholder="https://example.com/project-image.jpg"
              value={formData.image}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                p-3
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* Live Preview */}
          {formData.image && (
            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Image Preview
              </label>

              <div className="border rounded-xl overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                  }}
                />
              </div>

            </div>
          )}

          {/* Skills */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB"
              value={formData.requiredSkills}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                p-3
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

            <p className="text-sm text-gray-500 mt-2">
              Separate skills using commas.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-2
                border
                border-gray-300
                rounded-lg
                hover:bg-gray-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5
                py-2
                bg-violet-600
                text-white
                rounded-lg
                hover:bg-violet-700
              "
            >
              Create Project
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateProjectModal;