
import { useContext, useEffect, useState } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackItem from "../components/FeedbackItem";
import EditModal from "../components/EditModel";
import { fetchFeedbacks, putFeedback, delFeedback } from "../lib/api";

import toast from "react-hot-toast";
import { AppContext } from "../context/appcontext";
import { jwtDecode } from "jwt-decode";



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


interface TokenPayload {
  id: string;
}

export default function FeedbackPage() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within AppContextProvider");
  }
  const { token } = context;
  console.log(token);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Feedback | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  // decode token to get current user id
  //let currentUserId: string | undefined;
  useEffect(() => {
    if (!token) {
      console.warn("No token found in context, skipping decode.");
      return;
    }

    try {
      const payload = jwtDecode<TokenPayload>(token);
      setCurrentUserId(payload.id);
      console.log("Decoded userId:", payload.id);
    } catch (err) {
      console.error("JWT decode failed", err);
      setCurrentUserId(undefined);
    }
  }, [token]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await fetchFeedbacks();
      console.log(data);
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newFb: Feedback) => setFeedbacks(prev => [newFb, ...prev]);

  const handleEdit = (fb: Feedback) => setEditing(fb);

  const handleDelete = async (id: string) => {
    if (!token) return toast.error("Login required");
    if (!confirm("Delete this feedback?")) return;
    try {
      await delFeedback(id, token);
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const submitEdit = async (data: { title?: string; content?: string; improvements?: string[] }) => {
    if (!editing || !token) return;
    try {
      const updated = await putFeedback(editing._id, data, token);
      setFeedbacks(prev => prev.map(f => (f._id === editing._id ? updated : f)));
      setEditing(null);
      toast.success("Updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-green-50">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-900 text-center">
        🌿 Farmer Feedback
      </h2>

      <div className="max-w-6xl mx-auto mb-8">
        <FeedbackForm onAdded={handleAdd} />
      </div>

      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">All Feedbacks</h3>

        {loading ? (
          <p className="text-green-700">Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-green-700">No feedback yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((fb) => (
              <FeedbackItem
                key={fb._id}
                fb={fb}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refresh={loadFeedbacks}
              />
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          feedback={editing}
          onClose={() => setEditing(null)}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );

}
