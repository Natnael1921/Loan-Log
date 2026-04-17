import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { getFriends, getFriendRequests } from "../services/friend.service";
import { getLoans } from "../services/loan.service";
import { getBalance } from "../services/balance.service";

import Skeleton from "./Skeleton";
import AddFriendModal from "./AddFriendModal";
import FriendRequestsModal from "./FriendRequestsModal";

import "../styles/sidebar.css";
import { getAvatarColor } from "../utils/avatar";

const Sidebar = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [friendsRes, requestsRes] = await Promise.all([
          getFriends(user.token),
          getFriendRequests(user.token),
        ]);

        const formattedFriends = friendsRes.data.map((f) =>
          f.requester._id === user._id ? f.recipient : f.requester,
        );

        const enrichedFriends = await Promise.all(
          formattedFriends.map(async (friend) => {
            try {
              //  GET BALANCE
              const balanceRes = await getBalance(friend._id, user.token);

              //  GET LOANS
              const loansRes = await getLoans(friend._id, user.token);

              //  COUNT PENDING REQUESTS
              const pendingCount = loansRes.data.filter(
                (l) => l.status === "pending" && l.receiver === user._id,
              ).length;

              return {
                ...friend,
                balance: balanceRes.data,
                pendingCount,
              };
            } catch {
              return {
                ...friend,
                balance: null,
                pendingCount: 0,
              };
            }
          }),
        );

        setFriends(enrichedFriends);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (friend) => {
    setActiveId(friend._id);
    onSelectFriend(friend);
  };

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <div className="header-left">
          <h2>Friends</h2>
          <p className="subtext">Manage your lending circle</p>
        </div>

        <div className="header-actions">
          <div className="notif-wrapper" onClick={() => setShowRequests(true)}>
            <Bell size={20} />
            {requests.length > 0 && (
              <span className="notif-badge">{requests.length}</span>
            )}
          </div>

          <button className="add-friend" onClick={() => setShowAddModal(true)}>
            + Add
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input placeholder="Search friends..." />
      </div>

      {/* FRIENDS LIST */}
      <div className="friends-list">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="friend-card">
              <Skeleton width="42px" height="42px" radius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="12px" />
                <div style={{ height: "6px" }} />
                <Skeleton width="40%" height="10px" />
              </div>
              <Skeleton width="50px" height="18px" radius="999px" />
            </div>
          ))
        ) : friends.length === 0 ? (
          <div className="empty-state">
            <p>No friends yet</p>
            <span>Add someone to start tracking loans</span>
          </div>
        ) : (
          friends.map((friend) => {
            const net = friend.balance?.net;

            return (
              <div
                key={friend._id}
                onClick={() => handleSelect(friend)}
                className={`friend-card ${
                  activeId === friend._id ? "active" : ""
                }`}
              >
                {/* AVATAR */}
                <div
                  className="avatar"
                  style={{ background: getAvatarColor(friend.name) }}
                >
                  {friend.name?.charAt(0).toUpperCase()}
                </div>

                {/* INFO */}
                <div className="friend-info">
                  <div className="name-block">
                    <h4>{friend.name}</h4>
                    <span className="hint">Tap to view activity</span>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="right-section">
                    {/* PRIORITY: notification */}
                    {friend.pendingCount > 0 ? (
                      <span className="msg-badge">{friend.pendingCount}</span>
                    ) : (
                      <span
                        className={`badge ${
                          net > 0
                            ? "positive"
                            : net < 0
                              ? "negative"
                              : "neutral"
                        }`}
                      >
                        {net > 0
                          ? `+${net} ETB`
                          : net < 0
                            ? `-${Math.abs(net)} ETB`
                            : "Settled"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODALS */}
      {showAddModal && (
        <AddFriendModal onClose={() => setShowAddModal(false)} />
      )}

      {showRequests && (
        <FriendRequestsModal
          requests={requests}
          setRequests={setRequests}
          token={user.token}
          onClose={() => setShowRequests(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
