import { useEffect, useState } from "react";
import { getFriends } from "../services/friend.service";
import { getBalance } from "../services/balance.service";
import "../styles/sidebar.css";
import AddFriendModal from "./AddFriendModal";
const Sidebar = () => {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await getFriends(user.token);

        const formattedFriends = res.data.map((f) => {
          if (f.requester._id === user._id) {
            return f.recipient;
          } else {
            return f.requester;
          }
        });

        //  FETCH BALANCE FOR EACH FRIEND
        const friendsWithBalance = await Promise.all(
          formattedFriends.map(async (friend) => {
            try {
              const balanceRes = await getBalance(friend._id, user.token);

              return {
                ...friend,
                balance: balanceRes.data,
              };
            } catch (err) {
              return {
                ...friend,
                balance: null,
              };
            }
          }),
        );

        setFriends(friendsWithBalance);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="sidebar">
      <button className="add-friend" onClick={() => setShowModal(true)}>
        + Add Friend
      </button>
      {showModal && <AddFriendModal onClose={() => setShowModal(false)} />}
      <div className="search-box">
        <input placeholder="Search friends..." />
      </div>

      <div className="friends-list">
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          friends.map((friend) => (
            <div className="friend-item" key={friend._id}>
              <div className="avatar">{friend.name?.charAt(0)}</div>

              <div className="friend-info">
                <h4>{friend.name}</h4>

                {/*  BALANCE DISPLAY */}
                {friend.balance ? (
                  <p
                    className={
                      friend.balance.net > 0
                        ? "positive"
                        : friend.balance.net < 0
                          ? "negative"
                          : ""
                    }
                  >
                    {friend.balance.net > 0
                      ? `${friend.name} owes you +${friend.balance.net} ETB`
                      : friend.balance.net < 0
                        ? `You owe ${friend.name} ${Math.abs(
                            friend.balance.net,
                          )} ETB`
                        : "Settled"}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
