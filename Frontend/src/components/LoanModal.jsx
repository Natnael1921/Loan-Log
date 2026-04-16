import { useState } from "react";
import { createLoan } from "../services/loan.service";
import "../styles/loanmodal.css";

const LoanModal = ({ onClose, friendId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("give"); // default

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    if (!amount) return alert("Enter amount");

    try {
      await createLoan(
        {
          receiverId: friendId,
          amount: Number(amount),
          type,
          note,
        },
        user.token,
      );

      onSuccess(); // reload chat
      onClose();
    } catch (err) {
      alert("Failed to create loan");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Loan</h3>

        {/* TYPE SWITCH */}
        <div className="type-toggle">
          <button
            className={type === "give" ? "active give" : ""}
            onClick={() => setType("give")}
          >
            Give
          </button>

          <button
            className={type === "take" ? "active take" : ""}
            onClick={() => setType("take")}
          >
            Take
          </button>
        </div>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="submit" onClick={handleSubmit}>
          Submit
        </button>

        <button className="close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoanModal;
