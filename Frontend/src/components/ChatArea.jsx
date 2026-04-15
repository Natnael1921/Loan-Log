import "../styles/ChatArea.css";

const ChatArea = () => {
  return (
    <div className="chat-area">
      {/* HEADER */}
      <div className="chat-header">
        <div className="user-info">
          <div className="avatar big">JD</div>
          <h3>John Doe</h3>
        </div>

        <div className="balance-info">
          <p className="negative">You owe: -500 ETB</p>
          <p className="positive">John owes you: +1000 ETB</p>
          <p className="net">Net: +500 ETB</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {/* LEFT MESSAGE */}
        <div className="message left">
          <p>John requested 500 ETB</p>
          <div className="actions">
            <button className="accept">Accept</button>
            <button className="reject">Reject</button>
          </div>
        </div>

        {/* RIGHT MESSAGE */}
        <div className="message right">
          <p>You gave 500 ETB</p>
          <span className="accepted">✔ Accepted</span>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="chat-actions">
        <button className="add">+ Add</button>
        <div className="actions-right">
          <button className="minus">-</button>
          <button className="plus">+</button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;