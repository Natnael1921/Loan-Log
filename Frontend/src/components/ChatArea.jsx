import { useEffect, useState, useRef } from "react";
import "../styles/chatarea.css";
import { getLoans, acceptLoan, rejectLoan } from "../services/loan.service";
import { getBalance } from "../services/balance.service";
import LoanModal from "./LoanModal";
import { getAvatarColor } from "../utils/avatar";
import { usePresence } from "../hooks/usePresence";
import { getPresenceText } from "../utils/utils";
import Skeleton from "./Skeleton";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  Scale,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ChatArea = ({ selectedFriend, onBack }) => {
  const [loans, setLoans] = useState([]);
  const [balance, setBalance] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const onlineUsers = usePresence(user);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [loans]);

  useEffect(() => {
    if (!selectedFriend) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setLoans([]);
        setBalance(null);

        const loanRes = await getLoans(selectedFriend._id, user.token);
        setLoans(loanRes.data);

        const balanceRes = await getBalance(selectedFriend._id, user.token);
        setBalance(balanceRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
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
        <div className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
        </div>

        <div className="user-info">
          <div
            className="avatar big"
            style={{
              background: getAvatarColor(selectedFriend.username || "U"),
            }}
          >
            {(selectedFriend.username || "U").charAt(0)}
          </div>

          <div className="name-status">
            <h3>{selectedFriend.username}</h3>

            <span
              className={`presence-text ${
                getPresenceText(selectedFriend, onlineUsers) === "Online"
                  ? "online"
                  : ""
              }`}
            >
              {getPresenceText(selectedFriend, onlineUsers)}
            </span>
          </div>
        </div>

        {balance && (
          <div className="balance-info">
            {/* YOU OWE */}
            <div className="bal negative">
              <ArrowUpRight size={16} />
              <div>
                <span>You owe</span>
                <b>
                  {loading ? (
                    <Skeleton width="60px" height="12px" />
                  ) : (
                    `-${balance?.youOwe || 0} ETB`
                  )}
                </b>
              </div>
            </div>

            {/* THEY OWE */}
            <div className="bal positive">
              <ArrowDownLeft size={16} />
              <div>
                <span>They owe</span>
                <b>
                  {loading ? (
                    <Skeleton width="60px" height="12px" />
                  ) : (
                    `+${balance?.theyOwe || 0} ETB`
                  )}
                </b>
              </div>
            </div>

            {/* NET */}
            <div className="bal net">
              <Scale size={16} />
              <div>
                <span>Net</span>
                <b>
                  {loading ? (
                    <Skeleton width="50px" height="12px" />
                  ) : (
                    <>
                      {balance?.net > 0 ? "+" : ""}
                      {balance?.net || 0} ETB
                    </>
                  )}
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
        {loading ? (
          [...Array(6)].map((_, i) => {
            const isMe = i % 2 === 0;

            return (
              <div key={i} className={`message-row ${isMe ? "right" : "left"}`}>
                <div
                  className="message-bubble"
                  style={{
                    background: isMe ? "#e2e8f0" : "#f1f5f9",
                  }}
                >
                  <Skeleton width="140px" height="12px" />
                  <div style={{ height: "8px" }} />
                  <Skeleton width="90px" height="10px" />
                </div>
              </div>
            );
          })
        ) : loans.length === 0 ? (
          <div className="empty-chat">
            <p>No transactions yet</p>
            <span>Start by adding a loan</span>
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
                    {isMe ? (
                      <>
                        <b>{user.username}</b> gave to{" "}
                        <b>{selectedFriend.username}</b>{" "}
                        <b>{loan.amount} ETB</b>
                      </>
                    ) : (
                      <>
                        <b>{selectedFriend.username}</b> gave to{" "}
                        <b>{user.username}</b>{" "}
                        <b>{loan.amount} ETB</b>
                      </>
                    )}
                  </p>

                  <div className="msg-footer">
                    <span className={`status ${loan.status}`}>
                      {getStatusIcon(loan.status)}
                      {loan.status}
                    </span>

                    <span className="time">
                      {formatDate(loan.createdAt)} •{" "}
                      {formatTime(loan.createdAt)}
                    </span>
                  </div>

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