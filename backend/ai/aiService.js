const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

// OpenRouter free model
const MODEL = "nex-agi/nex-n2.5-mini:free";

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

  required: ["recommendations"],

  additionalProperties: false,
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryError = (error) => {
  const message =
    error?.message ||
    JSON.stringify(error) ||
    "";

  const status = error?.status;

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
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("too many requests") ||
    message.toLowerCase().includes("overloaded") ||
    message.toLowerCase().includes("temporarily unavailable")
  );
};

const generateWithModel = async (
  model,
  prompt,
  responseSchema
) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured."
    );
  }

  const response = await fetch(
    OPENROUTER_URL,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type": "application/json",

        "HTTP-Referer":
          process.env.APP_URL ||
          "http://localhost:5000",

        "X-Title":
          "TeamForgeAI",
      },

      body: JSON.stringify({
        model,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_schema",

          json_schema: {
            name: "ai_response",

            strict: true,

            schema: responseSchema,
          },
        },

        temperature: 0.2,

        max_tokens: 3000,
      }),
    }
  );

  const data = await response.json();

  // IMPORTANT:
  // Print the complete response from OpenRouter.
  console.log(
    "========== OPENROUTER RESPONSE =========="
  );

  console.log(
    JSON.stringify(data, null, 2)
  );

  console.log(
    "=========================================="
  );

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      data?.message ||
      `OpenRouter request failed with status ${response.status}`;

    const error = new Error(errorMessage);

    error.status = response.status;
    error.data = data;

    throw error;
  }

  const message =
    data?.choices?.[0]?.message;

  console.log(
    "OpenRouter message:",
    JSON.stringify(message, null, 2)
  );

  let result =
    message?.content?.trim();

  /*
   * Some models/providers may return the
   * structured response differently.
   */
  if (!result && message?.refusal) {
    throw new Error(
      `OpenRouter model refused the request: ${message.refusal}`
    );
  }

  if (!result) {
    throw new Error(
      "OpenRouter returned an empty content response."
    );
  }

  /*
   * Remove accidental markdown JSON fences.
   *
   * Example:
   * ```json
   * { ... }
   * ```
   */
  if (result.startsWith("```")) {
    result = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  try {
    const parsed = JSON.parse(result);

    console.log(
      "Parsed AI result:",
      JSON.stringify(parsed, null, 2)
    );

    return parsed;
  } catch (error) {
    console.error(
      "OpenRouter JSON Parse Error:"
    );

    console.error(result);

    throw new Error(
      "OpenRouter returned invalid JSON."
    );
  }
};

const runWithFallback = async (
  prompt,
  responseSchema
) => {
  let lastError = null;

  /*
   * Keep the same retry behavior.
   */
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `OpenRouter request: ${MODEL}, attempt ${attempt}`
      );

      const result =
        await generateWithModel(
          MODEL,
          prompt,
          responseSchema
        );

      console.log(
        `OpenRouter request successful using ${MODEL}`
      );

      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `OpenRouter attempt ${attempt} failed:`,
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

  console.error(
    "All OpenRouter attempts failed:",
    lastError?.message || lastError
  );

  throw new Error(
    "OpenRouter AI is temporarily unavailable. Please try again in a few moments."
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
- Return only valid JSON.
- Do not include markdown.
- Do not include explanations outside the JSON.
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

  if (
    !Array.isArray(members) ||
    members.length === 0
  ) {
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