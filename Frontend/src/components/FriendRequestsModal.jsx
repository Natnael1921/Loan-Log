import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/friend.service";
import "../styles/friendrequestmodal.css";
const FriendRequestsModal = ({ requests, onClose, token, setRequests }) => {
  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id, token);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id, token);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="requests-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Friend Requests</h3>

        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No pending requests</p>
            <span>You are all caught up  !</span>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-info">
                <div className="avatar">
                  {req.requester.name?.charAt(0).toUpperCase()}
                </div>
                <span>{req.requester.name}</span>
              </div>

              <div className="request-actions">
                <button
                  className="accept"
                  onClick={() => handleAccept(req._id)}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  onClick={() => handleReject(req._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal;
