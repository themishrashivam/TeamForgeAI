import { FaGraduationCap, FaCalendarAlt } from "react-icons/fa";

function EducationCard({ education = [] }) {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        border
        border-gray-100
        dark:border-slate-700
        shadow-sm
        p-6
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaGraduationCap className="text-violet-600 text-xl" />

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Education
        </h2>
      </div>

      {/* Education Timeline */}
      {education.length > 0 ? (
        <div className="space-y-8">
          {education.map((item, index) => (
            <div
              key={index}
              className="
                relative
                pl-8
                border-l-2
                border-violet-200
                dark:border-violet-800
              "
            >
              {/* Timeline Dot */}
              <div
                className="
                  absolute
                  -left-[9px]
                  top-1
                  w-4
                  h-4
                  rounded-full
                  bg-violet-600
                  border-2
                  border-white
                  dark:border-slate-800
                "
              ></div>

              {/* Degree */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.degree}
              </h3>

              {/* Institute */}
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {item.institute}
              </p>

              {/* Duration */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-2
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <FaCalendarAlt />
                <span>{item.duration}</span>
              </div>

              {/* Score */}
              {item.score && (
                <div
                  className="
                    mt-3
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    bg-violet-100
                    text-violet-700
                    dark:bg-violet-900/30
                    dark:text-violet-300
                    text-sm
                    font-medium
                  "
                >
                  {item.score}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaGraduationCap className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />

          <p className="text-gray-500 dark:text-gray-400">
            No education details added yet
          </p>
        </div>
      )}
    </div>
  );
}

export default EducationCard;