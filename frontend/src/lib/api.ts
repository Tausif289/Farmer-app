import axios from "axios";
//import { Feedback } from "../types/feedback";


interface Improvement {
  text: string;
  done?: boolean;
}
interface Reply {
  _id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

interface Feedback {
  _id: string;
  userId: string;
  username: string;
  title?: string;
  content: string;
  improvements: { text: string; done: boolean; _id: string }[];
  replies?: Reply[];   // ✅ Add this
  createdAt: string;
  updatedAt: string;
}

export const API_BASE ="http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token dynamically
export const authHeaders = (token?: string) => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export async function fetchFeedbacks(): Promise<Feedback[]> {
  const res = await api.get("/feedback");
  return res.data;
}

export async function postFeedback(
  data: { title?: string; content: string; improvements?: string[] ,username: string},
  token: string
): Promise<Feedback> {
  const res = await api.post("/feedback", data, authHeaders(token));
  return res.data;
}

export async function putFeedback(
  id: string,
  data: { title?: string; content?: string; improvements?: string[] },
  token: string
): Promise<Feedback> {
  const res = await api.put(`/${id}`, data, authHeaders(token));
  return res.data;
}

export async function delFeedback(id: string, token: string) {
  const res = await api.delete(`/${id}`, authHeaders(token));
  return res.data;
}
