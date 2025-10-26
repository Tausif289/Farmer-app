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
