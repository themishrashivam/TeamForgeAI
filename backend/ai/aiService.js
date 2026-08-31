import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
};

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
      },
    },
  },
  required: ["recommendations"],
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryError = (error) => {
  const message =
    error?.message ||
    JSON.stringify(error) ||
    "";

  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("temporarily unavailable")
  );
};

const generateWithModel = async (
  model,
  prompt,
  responseSchema
) => {
  const response =
    await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

  const result = response.text?.trim();

  if (!result) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  try {
    return JSON.parse(result);
  } catch (error) {
    console.error(
      "Gemini JSON Parse Error:",
      result
    );

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }
};

const runWithFallback = async (
  prompt,
  responseSchema
) => {
  const models = [
    "gemini-3.7-flash",
    "gemini-2.5-flash",
  ];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(
          `Gemini request: ${model}, attempt ${attempt}`
        );

        const result =
          await generateWithModel(
            model,
            prompt,
            responseSchema
          );

        console.log(
          `Gemini request successful using ${model}`
        );

        return result;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${model} attempt ${attempt} failed:`,
          error?.message || error
        );

        if (!isTemporaryError(error)) {
          break;
        }

        if (attempt < 2) {
          await sleep(1500);
        }
      }
    }
  }

  console.error(
    "All Gemini models failed:",
    lastError?.message || lastError
  );

  throw new Error(
    "Gemini AI is temporarily unavailable. Please try again in a few moments."
  );
};

export const analyzeProjectWithAI = async ({
  title,
  description,
  requiredSkills = [],
  projectType = "",
}) => {
  const prompt = `
You are an expert software project architect and team-building assistant.

Analyze the following software project and provide practical recommendations.

Project Title:
${title}

Project Description:
${description}

Required Skills:
${
  requiredSkills.length > 0
    ? requiredSkills.join(", ")
    : "Not specified"
}

Project Type:
${projectType || "Not specified"}

Return a practical analysis.

Rules:
- Keep recommendations directly relevant to the project.
- Do not suggest unnecessary technologies.
- Recommend realistic team roles.
- Identify genuinely useful missing skills.
- Keep the roadmap practical and implementation-focused.
- Keep the response concise but useful.
- Return only JSON.
`;

  return await runWithFallback(
    prompt,
    projectAnalysisSchema
  );
};

export const recommendTeamMembersWithAI = async ({
  project,
  members = [],
}) => {
  if (!project) {
    throw new Error(
      "Project information is required"
    );
  }

  if (!Array.isArray(members) || members.length === 0) {
    return {
      recommendations: [],
    };
  }

  const memberData = members.map((member) => ({
    userId: member._id.toString(),
    name: member.name || "",
    skills: Array.isArray(member.skills)
      ? member.skills
      : [],
    bio: member.bio || "",
    branch: member.branch || "",
    year: member.year || "",
  }));

  const prompt = `
You are an AI team-building assistant for a software collaboration platform.

Your task is to find the best users for the project from the candidate list.

PROJECT

Title:
${project.title || "Not specified"}

Description:
${project.description || "Not specified"}

Required Skills:
${
  Array.isArray(project.requiredSkills) &&
  project.requiredSkills.length > 0
    ? project.requiredSkills.join(", ")
    : "Not specified"
}

Project Type:
${project.projectType || "Not specified"}

CANDIDATE USERS

${JSON.stringify(memberData, null, 2)}

Analyze every candidate and recommend the users who are genuinely suitable for this project.

Consider:
- Direct skill matches.
- Related or complementary technical skills.
- Project requirements.
- Candidate experience suggested by their bio.
- Branch and academic year only when relevant.
- Complementary skills that can strengthen the team.

Important rules:
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
- Return only JSON.

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

  const result = await runWithFallback(
    prompt,
    teamRecommendationSchema
  );

  if (
    !result ||
    !Array.isArray(result.recommendations)
  ) {
    return {
      recommendations: [],
    };
  }

  return {
    recommendations:
      result.recommendations.slice(0, 10),
  };
};