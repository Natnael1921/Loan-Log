import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Add Friend Button */}
      <button className="add-friend">+ Add Friend</button>

      {/* Search */}
      <div className="search-box">
        <input placeholder="Search friends..." />
      </div>

      {/* Friends List */}
      <div className="friends-list">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div className={`friend-item ${i === 0 ? "active" : ""}`} key={i}>
            <div className="avatar">JD</div>

            <div className="friend-info">
              <h4>John Doe</h4>
              <p className="positive">John owes you +500 ETB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
