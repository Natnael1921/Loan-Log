import { useState } from "react";
import { searchUsers, sendFriendRequest } from "../services/friend.service";
import "../styles/addfriendmodal.css";
import { getAvatarColor } from "../utils/avatar";

const AddFriendModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestedIds, setRequestedIds] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) return setResults([]);

    try {
      setLoading(true);
      const res = await searchUsers(value, user.token);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (id) => {
    try {
      await sendFriendRequest(id, user.token);
      setRequestedIds((prev) => [...prev, id]);
    } catch (err) {
      alert("Request failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Add Friend</h3>
          <button className="close-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* INPUT */}
        <input
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* LOADING */}
        {loading && <div className="loading">Searching...</div>}

        {/* RESULTS */}
        <div className="results">
          {results.length === 0 && query && !loading && (
            <div className="empty">No users found</div>
          )}

          {results.map((u) => (
            <div key={u._id} className="result-item">
              <div className="user-info">
                <div
                  className="avatar"
                  style={{
                    background: getAvatarColor(u.username || "U"),
                  }}
                >
                  {(u.username || "U").charAt(0).toUpperCase()}
                </div>

                <span>{u.username}</span>
              </div>

              <button
                onClick={() => handleAdd(u._id)}
                disabled={requestedIds.includes(u._id)}
                className={requestedIds.includes(u._id) ? "sent" : ""}
              >
                {requestedIds.includes(u._id) ? "Sent" : "Add"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;