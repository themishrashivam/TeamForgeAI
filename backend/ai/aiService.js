import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.8-flash";

/* =========================================================
   PROJECT ANALYSIS SCHEMA
========================================================= */

const projectAnalysisSchema = {
  type: "object",

  properties: {
    summary: {
      type: "string",
    },

    difficulty: {
      type: "string",
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
    },

    recommendedTechStack: {
      type: "array",
      items: {
        type: "string",
      },
    },

    requiredRoles: {
      type: "array",
      items: {
        type: "string",
      },
    },

    recommendedSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },

    missingSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },

    roadmap: {
      type: "array",
      items: {
        type: "string",
      },
    },

    suggestions: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },

  required: [
    "summary",
    "difficulty",
    "recommendedTechStack",
    "requiredRoles",
    "recommendedSkills",
    "missingSkills",
    "roadmap",
    "suggestions",
  ],

  additionalProperties: false,
};

/* =========================================================
   TEAM RECOMMENDATION SCHEMA
========================================================= */

const teamRecommendationSchema = {
  type: "object",

  properties: {
    recommendations: {
      type: "array",

      items: {
        type: "object",

        properties: {
          userId: {
            type: "string",
          },

          matchPercentage: {
            type: "number",
          },

          matchedSkills: {
            type: "array",

            items: {
              type: "string",
            },
          },

          missingSkills: {
            type: "array",

            items: {
              type: "string",
            },
          },

          reason: {
            type: "string",
          },
        },

        required: [
          "userId",
          "matchPercentage",
          "matchedSkills",
          "missingSkills",
          "reason",
        ],

        additionalProperties: false,
      },
    },
  },

  required: [
    "recommendations",
  ],

  additionalProperties: false,
};

/* =========================================================
   UTILITY
========================================================= */

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

/* =========================================================
   TEMPORARY ERROR CHECK
========================================================= */

const isTemporaryError = (error) => {
  const message =
    error?.message ||
    JSON.stringify(error) ||
    "";

  const status =
    error?.status ||
    error?.code;

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("429") ||
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message
      .toLowerCase()
      .includes("rate limit") ||
    message
      .toLowerCase()
      .includes("too many requests") ||
    message
      .toLowerCase()
      .includes("overloaded") ||
    message
      .toLowerCase()
      .includes(
        "temporarily unavailable"
      )
  );
};

/* =========================================================
   GEMINI GENERATION
========================================================= */

const generateWithModel = async (
  model,
  prompt,
  responseSchema
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  try {
    console.log(
      "======================================"
    );

    console.log(
      `GEMINI REQUEST`
    );

    console.log(
      `Model: ${model}`
    );

    console.log(
      "======================================"
    );

    const response =
      await ai.models.generateContent({
        model,

        contents: prompt,

        config: {
          maxOutputTokens: 3000,

          responseMimeType:
            "application/json",

          responseSchema,
        },
      });

    console.log(
      "======================================"
    );

    console.log(
      "GEMINI RESPONSE RECEIVED"
    );

    console.log(
      "======================================"
    );

    /*
     * Gemini SDK returns generated
     * text through response.text
     */

    let result =
      response?.text?.trim();

    if (!result) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    /*
     * Remove accidental markdown
     * JSON code fences if present.
     */

    if (
      result.startsWith("```")
    ) {
      result = result
        .replace(
          /^```json\s*/i,
          ""
        )
        .replace(
          /^```\s*/i,
          ""
        )
        .replace(
          /\s*```$/i,
          ""
        )
        .trim();
    }

    try {
      const parsed =
        JSON.parse(result);

      console.log(
        "======================================"
      );

      console.log(
        "PARSED GEMINI RESULT"
      );

      console.log(
        JSON.stringify(
          parsed,
          null,
          2
        )
      );

      console.log(
        "======================================"
      );

      return parsed;
    } catch (parseError) {
      console.error(
        "Gemini JSON Parse Error:"
      );

      console.error(result);

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error?.message || error
    );

    throw error;
  }
};

/* =========================================================
   RETRY HANDLER
========================================================= */

const runWithFallback = async (
  prompt,
  responseSchema
) => {
  let lastError = null;

  /*
   * Try Gemini maximum 2 times.
   */

  for (
    let attempt = 1;
    attempt <= 2;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request: ${MODEL}, attempt ${attempt}`
      );

      const result =
        await generateWithModel(
          MODEL,
          prompt,
          responseSchema
        );

      console.log(
        `Gemini request successful using ${MODEL}`
      );

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error?.message || error
      );

      /*
       * Do not retry permanent errors.
       */

      if (
        !isTemporaryError(error)
      ) {
        break;
      }

      /*
       * Wait before retry.
       */

      if (attempt < 2) {
        await sleep(1500);
      }
    }
  }

  console.error(
    "All Gemini attempts failed:",
    lastError?.message ||
      lastError
  );

  /*
   * Return the actual Gemini error
   * instead of showing an OpenRouter error.
   */

  throw new Error(
    lastError?.message ||
      "Gemini AI is temporarily unavailable. Please try again in a few moments."
  );
};

/* =========================================================
   PROJECT ANALYSIS
========================================================= */

export const analyzeProjectWithAI =
  async ({
    title,
    description,
    requiredSkills = [],
    projectType = "",
  }) => {
    const prompt = `
You are an expert software project architect and team-building assistant.

Analyze the following software project and provide practical recommendations.

PROJECT TITLE:
${title}

PROJECT DESCRIPTION:
${description}

REQUIRED SKILLS:
${
  requiredSkills.length > 0
    ? requiredSkills.join(", ")
    : "Not specified"
}

PROJECT TYPE:
${projectType || "Not specified"}

Return a practical analysis.

RULES:

- Keep recommendations directly relevant to the project.
- Do not suggest unnecessary technologies.
- Recommend realistic team roles.
- Identify genuinely useful missing skills.
- Keep the roadmap practical and implementation-focused.
- Keep the response concise but useful.
- Return only valid JSON.
- Do not include markdown.
- Do not include explanations outside the JSON.
`;

    return await runWithFallback(
      prompt,
      projectAnalysisSchema
    );
  };

/* =========================================================
   AI TEAM MEMBER RECOMMENDATIONS
========================================================= */

export const recommendTeamMembersWithAI =
  async ({
    project,
    members = [],
  }) => {
    if (!project) {
      throw new Error(
        "Project information is required."
      );
    }

    if (
      !Array.isArray(members) ||
      members.length === 0
    ) {
      return {
        recommendations: [],
      };
    }

    /*
     * Prepare candidate users.
     *
     * Only the information needed by AI
     * is sent to Gemini.
     */

    const memberData =
      members.map((member) => ({
        userId:
          member?._id?.toString() || "",

        name:
          member?.name || "",

        skills:
          Array.isArray(
            member?.skills
          )
            ? member.skills
            : [],

        bio:
          member?.bio || "",

        branch:
          member?.branch || "",

        year:
          member?.year || "",
      }));

    const prompt = `
You are an AI team-building assistant for a software collaboration platform.

Your task is to find the best users for the project from the candidate list.

==================================================
PROJECT
==================================================

Title:
${project.title || "Not specified"}

Description:
${
  project.description ||
  "Not specified"
}

Required Skills:
${
  Array.isArray(
    project.requiredSkills
  ) &&
  project.requiredSkills.length > 0
    ? project.requiredSkills.join(
        ", "
      )
    : "Not specified"
}

Project Type:
${
  project.projectType ||
  "Not specified"
}

==================================================
CANDIDATE USERS
==================================================

${JSON.stringify(
  memberData,
  null,
  2
)}

==================================================
TASK
==================================================

Analyze every candidate and recommend the users who are genuinely suitable for this project.

Consider:

- Direct skill matches.
- Related or complementary technical skills.
- Project requirements.
- Candidate experience suggested by their bio.
- Branch and academic year only when relevant.
- Complementary skills that can strengthen the team.

==================================================
IMPORTANT RULES
==================================================

- Only recommend users from the candidate list.
- Use the exact userId provided in the candidate list.
- Never invent a userId.
- Do not recommend users who have no meaningful connection to the project.
- Match percentage must be between 0 and 100.
- matchedSkills must contain only skills actually present in that user's skills.
- missingSkills should contain useful project skills the user does not have.
- Give a short practical reason for every recommendation.
- Return the strongest candidates first.
- Prefer quality over quantity.
- Return at most 10 recommendations.
- Return only valid JSON.
- Do not include markdown.
- Do not include explanations outside the JSON.

Use exactly this structure:

{
  "recommendations": [
    {
      "userId": "candidate user id",
      "matchPercentage": 85,
      "matchedSkills": [
        "React",
        "Node.js"
      ],
      "missingSkills": [
        "Docker"
      ],
      "reason": "Strong MERN skills that match the project's core development requirements."
    }
  ]
}
`;

    const result =
      await runWithFallback(
        prompt,
        teamRecommendationSchema
      );

    if (
      !result ||
      !Array.isArray(
        result.recommendations
      )
    ) {
      return {
        recommendations: [],
      };
    }

    /*
     * Keep only the top 10 results.
     */

    return {
      recommendations:
        result.recommendations
          .slice(0, 10),
    };
  };