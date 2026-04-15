import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default Dashboard;
