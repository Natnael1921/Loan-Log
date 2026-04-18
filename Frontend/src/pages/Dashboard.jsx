import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <div
        className={`dashboard-sidebar ${selectedFriend ? "hide-mobile" : ""}`}
      >
        <Sidebar onSelectFriend={setSelectedFriend} />
      </div>

      {/* CHAT */}
      <div
        className={`dashboard-chat ${selectedFriend ? "hide-mobile-chat" : ""}`}
      >
        <ChatArea
          selectedFriend={selectedFriend}
          onBack={() => setSelectedFriend(null)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
