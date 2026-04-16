import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className="dashboard">
      <Sidebar onSelectFriend={setSelectedFriend} />
      <ChatArea selectedFriend={selectedFriend} />
    </div>
  );
};

export default Dashboard;
