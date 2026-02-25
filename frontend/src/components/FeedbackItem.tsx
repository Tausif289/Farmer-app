
import { AppContext } from "../context/appcontext";
import { useContext, useState } from "react";
import axios from "axios";

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

interface Props {
  fb: Feedback;
  currentUserId?: string;
  onEdit: (fb: Feedback) => void;
  onDelete: (id: string) => void;
  refresh: () => void; // 🔄 added prop to refresh after reply
}

export default function FeedbackItem({
  fb,
  currentUserId,
  onEdit,
  onDelete,
  refresh,
}: Props) {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("AppContext must be used within AppContextProvider");

  const { name } = context;
  const isOwner = fb.userId === currentUserId;

  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `https://backend-foarmer-app.onrender.com/api/${fb._id}/reply`,
        { content: replyText,
          username: name,
         },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReplyText("");
      refresh(); // reload feedback list after posting
    } catch (err) {
      console.log("Error posting reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 border-2 border-green-500 rounded-3xl p-6 mb-6 shadow-xl hover:shadow-black transition-shadow flex flex-col justify-between">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg">
        {fb.username?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-bold text-green-900">{fb.username}</p>
        <p className="text-xs text-green-800">
          {new Date(fb.createdAt).toLocaleString()}
        </p>
      </div>
    </div>

    {isOwner && (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(fb)}
          className="px-3 py-1 bg-green-800 text-white rounded-xl hover:bg-green-700 transition text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(fb._id)}
          className="px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-500 transition text-sm"
        >
          Delete
        </button>
      </div>
    )}
  </div>

  {/* Content */}
  <div className="mt-4">
    {fb.title && <h4 className="text-xl font-semibold text-green-900">{fb.title}</h4>}
    <p className="text-green-800 mt-1">{fb.content}</p>
  </div>

  {/* Improvements */}
  {fb.improvements && fb.improvements.length > 0 && (
    <div className="mt-4 bg-green-100 border-l-4 border-green-800 rounded-r-xl p-3">
      <p className="text-sm font-medium text-green-900 mb-2">Improvement tasks:</p>
      <ul className="list-disc ml-5 text-green-800 text-sm space-y-1">
        {fb.improvements.map((it) => (
          <li key={it._id} className={it.done ? "line-through text-green-600" : ""}>
            {it.text}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Replies */}
  {fb.replies && fb.replies.length > 0 && (
    <div className="mt-4 border-t border-green-800 pt-3">
      <p className="text-sm font-medium text-green-900 mb-2">Replies:</p>
      <ul className="space-y-3">
        {fb.replies.map((r) => (
          <li
            key={r._id}
            className="bg-green-100 border-l-4 border-green-700 rounded-r-xl p-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
                {r.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-green-900">{r.username}</span>
                <span className="text-xs text-green-800">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-green-800 ml-14">{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Reply Input */}
  <div className="mt-4 flex gap-2">
    <input
      type="text"
      placeholder="Write a reply..."
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      className="flex-1 border-2 border-green-800 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    <button
      onClick={handleReply}
      disabled={loading}
      className="px-4 py-2 bg-green-800 text-white rounded-2xl hover:bg-green-700 transition text-sm"
    >
      {loading ? "Sending..." : "Reply"}
    </button>
  </div>
</div>

  );
}
