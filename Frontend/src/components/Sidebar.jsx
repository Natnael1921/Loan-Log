import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { getFriends, getFriendRequests } from "../services/friend.service";
import { getBalance } from "../services/balance.service";

import AddFriendModal from "./AddFriendModal";
import FriendRequestsModal from "./FriendRequestsModal";

import "../styles/sidebar.css";

const Sidebar = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const [friendsRes, requestsRes] = await Promise.all([
          getFriends(user.token),
          getFriendRequests(user.token),
        ]);

        // FRIENDS
        const formattedFriends = friendsRes.data.map((f) =>
          f.requester._id === user._id ? f.recipient : f.requester,
        );

        const friendsWithBalance = await Promise.all(
          formattedFriends.map(async (friend) => {
            try {
              const balanceRes = await getBalance(friend._id, user.token);
              return { ...friend, balance: balanceRes.data };
            } catch {
              return { ...friend, balance: null };
            }
          }),
        );

        setFriends(friendsWithBalance);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (friend) => {
    setActiveId(friend._id);
    onSelectFriend(friend);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        {/* LEFT */}
        <div className="header-left">
          <h2>Friends</h2>
          <p className="subtext">Manage your lending circle</p>
        </div>

        {/* RIGHT */}
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
        {friends.length === 0 ? (
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
                <div className="avatar">
                  {friend.name?.charAt(0).toUpperCase()}
                </div>

                <div className="friend-info">
                  <div className="name-block">
                    <h4>{friend.name}</h4>
                    <span className="hint">Tap to view activity</span>
                  </div>

                  <span
                    className={`badge ${
                      net > 0 ? "positive" : net < 0 ? "negative" : "neutral"
                    }`}
                  >
                    {net > 0
                      ? `+${net} ETB`
                      : net < 0
                        ? `-${Math.abs(net)} ETB`
                        : "Settled"}
                  </span>
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
