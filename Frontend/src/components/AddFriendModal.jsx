import { useState } from "react";
import { searchUsers,sendFriendRequest} from "../services/friend.service";
import "../styles/addfriendmodal.css";

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

      setLoading(false);
    } catch (err) {
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
        <h3>Add Friend</h3>

        <input
          placeholder="Enter friend's name..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* LOADING */}
        {loading && <p>Searching...</p>}

        {/* RESULTS */}
        <div className="results">
          {results.map((u) => (
            <div key={u._id} className="result-item">
              <div className="user-info">
                <div className="avatar">
                  {u.name.charAt(0)}
                </div>
                <span>{u.name}</span>
              </div>

              <button
                onClick={() => handleAdd(u._id)}
                disabled={requestedIds.includes(u._id)}
              >
                {requestedIds.includes(u._id)
                  ? "Requested"
                  : "Add"}
              </button>
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddFriendModal;