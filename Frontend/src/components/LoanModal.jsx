import { useState } from "react";
import { createLoan } from "../services/loan.service";
import "../styles/loanmodal.css";

const LoanModal = ({ onClose, friendId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("give");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    if (!amount) return alert("Enter amount");

    try {
      setLoading(true);

      await createLoan(
        {
          receiverId: friendId,
          amount: Number(amount),
          type,
          note,
        },
        user.token
      );

      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to create loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="loan-modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>New Transaction</h3>
          <button className="close-icon" onClick={onClose}>✕</button>
        </div>

        {/* TYPE TOGGLE */}
        <div className="type-toggle">
          <div
            className={`toggle-option ${type === "give" ? "active give" : ""}`}
            onClick={() => setType("give")}
          >
            You Gave
          </div>

          <div
            className={`toggle-option ${type === "take" ? "active take" : ""}`}
            onClick={() => setType("take")}
          >
            You Received
          </div>
        </div>

        {/* INPUTS */}
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount (ETB)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Note</label>
          <input
            type="text"
            placeholder="Optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanModal;