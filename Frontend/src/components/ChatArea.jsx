import { useEffect, useState } from "react";
import "../styles/chatArea.css";
import { getLoans, acceptLoan, rejectLoan } from "../services/loan.service";
import { getBalance } from "../services/balance.service";
import LoanModal from "./LoanModal";
import { useRef } from "react";

const ChatArea = ({ selectedFriend }) => {
  const [loans, setLoans] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loans]);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!selectedFriend) return;

    const fetchData = async () => {
      try {
        // fetch loans
        const loanRes = await getLoans(selectedFriend._id, user.token);
        setLoans(loanRes.data);

        //  fetch balance
        const balanceRes = await getBalance(selectedFriend._id, user.token);
        setBalance(balanceRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selectedFriend]);

  const handleAccept = async (loanId) => {
    await acceptLoan(loanId, user.token);
    reloadLoans();
  };

  const handleReject = async (loanId) => {
    await rejectLoan(loanId, user.token);
    reloadLoans();
  };

  const reloadLoans = async () => {
    const res = await getLoans(selectedFriend._id, user.token);
    setLoans(res.data);
  };

  if (!selectedFriend) {
    return <div className="chat-area">Select a friend</div>;
  }
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="chat-area">
      {/* HEADER */}
      <div className="chat-header">
        <div className="user-info">
          <div className="avatar big">{selectedFriend.name?.charAt(0)}</div>
          <h3>{selectedFriend.name}</h3>
        </div>

        {balance && (
          <div className="balance-info">
            <p className="negative">You owe: -{balance.youOwe} ETB</p>

            <p className="positive">
              {selectedFriend.name} owes you: +{balance.theyOwe} ETB
            </p>

            <p className="net">
              Net: {balance.net > 0 ? "+" : ""}
              {balance.net} ETB
            </p>
          </div>
        )}
      </div>
      {showLoanModal && (
        <LoanModal
          friendId={selectedFriend._id}
          onClose={() => setShowLoanModal(false)}
          onSuccess={reloadLoans}
        />
      )}
      {/* MESSAGES */}
      <div className="chat-messages">
        {loans.map((loan) => {
          const isMe = loan.sender === user._id;

          return (
            <div className={`message ${isMe ? "right" : "left"}`}>
              <p>
                {loan.type === "give" ? "Gave" : "Received"} {loan.amount} ETB
              </p>
              {loans.length === 0 && (
                <div className="empty-chat">
                  <p>No transactions yet</p>
                  <span>Start by adding a loan 👇</span>
                </div>
              )}
              {/* ACTIONS (ONLY RECEIVER) */}
              {loan.status === "pending" && !isMe && (
                <div className="actions">
                  <button onClick={() => handleAccept(loan._id)}>Accept</button>
                  <button onClick={() => handleReject(loan._id)}>Reject</button>
                </div>
              )}

              {/* STATUS FOR BOTH */}
              {loan.status === "pending" && isMe && (
                <span className="pending">⏳ Pending</span>
              )}

              {loan.status === "accepted" && (
                <span className="accepted">✔ Accepted</span>
              )}

              {loan.status === "rejected" && (
                <span className="rejected">✖ Rejected</span>
              )}
              <small className="time">{formatTime(loan.createdAt)}</small>
              <div ref={bottomRef}></div>
            </div>
          );
        })}
      </div>
      <div className="chat-input">
        <button onClick={() => setShowLoanModal(true)}>+ Add Loan</button>
      </div>
    </div>
  );
};

export default ChatArea;
