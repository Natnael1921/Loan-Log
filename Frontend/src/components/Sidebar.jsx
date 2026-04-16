import { useEffect, useState } from "react";
import { getFriends } from "../services/friend.service";
import { getBalance } from "../services/balance.service";
import "../styles/sidebar.css";
import AddFriendModal from "./AddFriendModal";

const Sidebar = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await getFriends(user.token);

        const formattedFriends = res.data.map((f) => {
          return f.requester._id === user._id ? f.recipient : f.requester;
        });

        const friendsWithBalance = await Promise.all(
          formattedFriends.map(async (friend) => {
            try {
              const balanceRes = await getBalance(friend._id, user.token);

              return {
                ...friend,
                balance: balanceRes.data,
              };
            } catch {
              return { ...friend, balance: null };
            }
          }),
        );

        setFriends(friendsWithBalance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
  }, []);

  const handleSelect = (friend) => {
    setActiveId(friend._id);
    onSelectFriend(friend);
  };

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <div>
          <h2>Friends</h2>
          <p className="subtext">Manage your lending circle</p>
        </div>

        <button className="add-friend" onClick={() => setShowModal(true)}>
          + Add
        </button>
      </div>

      {showModal && <AddFriendModal onClose={() => setShowModal(false)} />}

      {/* SEARCH */}
      <div className="search-box">
        <input placeholder="Search friends..." />
      </div>

      {/* LIST */}
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
    </div>
  );
};

export default Sidebar;
