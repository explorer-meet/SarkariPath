import { Platform } from "react-native";

export type Exam = {
  id: string;
  name: string;
  organization: string;
  category: string;
  status: string;
  dateLabel: string;
  dateDetail: string;
  verified: boolean;
  sourceLabel: string;
  sourceUrl: string;
};

export type StudyMaterial = {
  id: string;
  title: string;
  subject: string;
  detail: string;
  content: string;
  type: string;
  duration: string;
  premium: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export type QuizReview = QuizQuestion & {
  correctIndex: number;
  selectedIndex: number | null;
  explanation: string;
};

export type QuizResult = {
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  review: QuizReview[];
};

const localHost = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL || localHost;
let validBaseUrl: string | null = null;
let apiOrigin = configuredBaseUrl;
try {
  const parsedUrl = new URL(configuredBaseUrl);
  if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
    validBaseUrl = parsedUrl.toString().replace(/\/+$/, "");
    apiOrigin = parsedUrl.host;
  }
} catch {
  validBaseUrl = null;
}
export const API_BASE_URL = validBaseUrl;
export const API_ORIGIN = apiOrigin;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_URL must be a valid HTTP or HTTPS URL.");
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(`Cannot reach ${API_ORIGIN}. Check that the backend is running and the mobile API URL is correct.`);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`The backend returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `The backend returned an error (${response.status}).`;
    throw new Error(message);
  }

  return body as T;
}

export async function getExams(): Promise<Exam[]> {
  const result = await request<{ items: Exam[]; demo: boolean }>("/api/exams");
  return result.items;
}

export async function getMaterials(): Promise<StudyMaterial[]> {
  const result = await request<{ items: StudyMaterial[]; demo: boolean }>("/api/materials");
  return result.items;
}

export async function getQuiz(): Promise<QuizQuestion[]> {
  const result = await request<{ items: QuizQuestion[]; demo: boolean }>("/api/quiz");
  return result.items;
}

export async function scoreQuiz(answers: Record<string, number>): Promise<QuizResult> {
  return request<QuizResult>("/api/quiz/score", {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}
