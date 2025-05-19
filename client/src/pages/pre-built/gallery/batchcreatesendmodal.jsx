import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "@/assets/css/batch-create-send-modal.css";

const BatchCreateSendModal = ({ isOpen, onClose, campaignData, templateData, batchData }) => {
  const [messagesSent, setMessagesSent] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("5043822433");
  const [messagePreview, setMessagePreview] = useState("");
  const [sendingInProgress, setSendingInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  console.log("🚀 BatchCreateSendModal - Received batchData:", batchData); // ✅ Debugging

  useEffect(() => {
    if (isOpen && batchData) {
      setMessagesSent(0);
      setSendingInProgress(false);
      setTotalMessages(batchData?.totalMessages || 5);
      setMessagePreview(templateData?.messages?.[0]?.content || "Hello! Have you received my message about your property?");
      setPhoneNumber(campaignData?.contacts?.[0]?.phone || "Unknown");
// ✅ Set contacts properly from `campaignData.contacts`
    setContacts(campaignData?.contacts && Array.isArray(campaignData.contacts) ? campaignData.contacts.slice(0, 5) : []);
    }
  }, [isOpen, campaignData, templateData, batchData]);

const handleSendMessages = async () => {
  console.log("🚀 Inside handleSendMessages - Batch Data:", batchData);

  // ✅ Extract `batchId` correctly from `batchData.data`
  const batchId = batchData?.data?._id;
  
  if (!batchId) {
    console.error("❌ Batch ID is missing or undefined!");
    return; // ✅ Stop retrying indefinitely
  }

  try {
    setLoading(true);
    setError(null);
    console.log(`📡 Sending messages for batch: ${batchId}`);

    const response = await fetch(`http://localhost:3000/api/messages/sendBatch/${batchId}`, { method: "POST" });
    const result = await response.json();

    if (result.success) {
      console.log("✅ Messages sent successfully!");
    } else {
      setError(result.error || "Message sending failed.");
    }
  } catch (err) {
    console.error("❌ Error sending messages:", err);
    setError("Error sending messages. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    isOpen && (
      <div className="modal-overlay14">
        <div className="batch-create-send-modal">
          <div className="modal-header">
            <h2>Batch {batchData?.batchNumber || "Unknown"}</h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-content11">
            {/* Left Side - Campaign Info */}
            <div className="left-panel">
              <div className="info-section">
                <div className="campaign-info">
                  <span>📁</span> {campaignData?.name || "Campaign"}
                </div>
                <div className="market-info">
                  <span>📊</span> {campaignData?.market || "Market"}
                </div>
              </div>
            </div>

            {/* Right Side - Message Preview */}
            <div className="right-panel">
              <h3>Message Preview & Process</h3>
              <div className="message-status">
                <div className="progress-circle">
                  <div className="progress-text">
                    <span className="current-count">{messagesSent}</span>/<span className="total-count">{totalMessages}</span>
                  </div>
                  <div className="phone-number">{phoneNumber}</div>
                </div>

                <div className="message-content">
                  <p>{messagePreview}</p>
                  <div className="message-count">
                    {messagesSent}/{totalMessages}
                  </div>
                </div>
              </div>

              <div className="send-button-container">
                <button className="send-message-button"  onClick={() => {
    console.log("📡 Button Clicked! Batch Data:",batchData?.data?._id);
    handleSendMessages();
  }} disabled={loading}>
                  {loading ? "Sending..." : "Send Messages"}
                </button>
              </div>
            </div>
          </div>

          {/* Contact List Table */}
          <div className="contacts-table">
            <div className="table-header">
              <div className="header-name">Name</div>
              <div className="header-phone">Phone Numbers</div>
              <div className="header-status">Status</div>
            </div>

            <div className="table-body">
              {contacts.map((contact, index) => (
                <div key={index} className="table-row">
                  <div className="row-name">{contact.name}</div>
                  <div className="row-phone">{contact.phone}</div>
                  <div className="row-status">
                    <div className={`status-indicator ${messagesSent > index ? "sent" : ""}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BatchCreateSendModal;
