import { useEffect, useState, useRef } from "react";
import "../styles/chatarea.css";
import { getLoans, acceptLoan, rejectLoan } from "../services/loan.service";
import { getBalance } from "../services/balance.service";
import LoanModal from "./LoanModal";

import {
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ChatArea = ({ selectedFriend }) => {
  const [loans, setLoans] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);

  const messagesRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [loans]);

  useEffect(() => {
    if (!selectedFriend) return;

    const fetchData = async () => {
      try {
        const loanRes = await getLoans(selectedFriend._id, user.token);
        setLoans(loanRes.data);

        const balanceRes = await getBalance(selectedFriend._id, user.token);
        setBalance(balanceRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selectedFriend]);

  const reloadLoans = async () => {
    const res = await getLoans(selectedFriend._id, user.token);
    setLoans(res.data);
  };

  const handleAccept = async (loanId) => {
    await acceptLoan(loanId, user.token);
    reloadLoans();
  };

  const handleReject = async (loanId) => {
    await rejectLoan(loanId, user.token);
    reloadLoans();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return <Clock size={14} />;
    if (status === "accepted") return <CheckCircle size={14} />;
    if (status === "rejected") return <XCircle size={14} />;
  };

  if (!selectedFriend) {
    return <div className="chat-area empty">Select a friend</div>;
  }

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
            <div className="bal negative">
              <ArrowUpRight size={16} />
              <div>
                <span>You owe</span>
                <b>-{balance.youOwe} ETB</b>
              </div>
            </div>

            <div className="bal positive">
              <ArrowDownLeft size={16} />
              <div>
                <span>They owe</span>
                <b>+{balance.theyOwe} ETB</b>
              </div>
            </div>

            <div className="bal net">
              <Scale size={16} />
              <div>
                <span>Net</span>
                <b>
                  {balance.net > 0 ? "+" : ""}
                  {balance.net} ETB
                </b>
              </div>
            </div>
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
      <div className="chat-messages" ref={messagesRef}>
        {loans.length === 0 ? (
          <div className="empty-chat">
            <p>No transactions yet</p>
            <span>Start by adding a loan </span>
          </div>
        ) : (
          loans.map((loan) => {
            const isMe = loan.sender === user._id;

            return (
              <div
                key={loan._id}
                className={`message-row ${isMe ? "right" : "left"}`}
              >
                <div className={`message-bubble ${isMe ? "me" : "them"}`}>
                  <p className="msg-text">
                    {loan.type === "give" ? "You gave" : "You received"}{" "}
                    <b>{loan.amount} ETB</b>
                  </p>

                  {/* FOOTER */}
                  <div className="msg-footer">
                    <span className={`status ${loan.status}`}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </span>

                    <span className="time">{formatTime(loan.createdAt)}</span>
                  </div>

                  {/* ACTIONS */}
                  {loan.status === "pending" && !isMe && (
                    <div className="actions">
                      <button
                        className="accept"
                        onClick={() => handleAccept(loan._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject"
                        onClick={() => handleReject(loan._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <button onClick={() => setShowLoanModal(true)}>
          + Add Transaction
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
