import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MoreVertical, Smile, Code, Trash2, Check, X, Edit } from 'lucide-react';
import "@/assets/css/dripauto.css";

export default function DripAutomation() {
  const [showModal, setShowModal] = useState(false);
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: "Follow up text after 10 days",
      day: 65,
      message: "Hey/Hi/Hello",
      moreCount: 1
    },
    {
      id: 2,
      name: "Follow Up",
      day: 1,
      message: "Hello/Hey/Hi?",
      moreCount: 6
    }
  ]);

  // State for new drip automation
  const [automationName, setAutomationName] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, day: 1, content: '', isOpen: true }
  ]);
  const [nameError, setNameError] = useState(false);
  
  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const emojiPickerRef = useRef(null);

  // Complete emoji set (without categories)
  const allEmojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','👋','👍','👎','👊','✊','🤛','🤜','🤞','✌️','🤟','🤘','👌','👆','👇','👈','👉','👏','🙌','👐','🤲','🤝','👂','👃','👣','👀','👁️','👁️‍🗨️','🧠','🦴','❤️','💯','✨','⭐','🔥','🎉','💡','🔔','📌','📱','💻','⌚','📷','🎁','📝','📚','🏆','💰','🔑','🍕','🍔','🍟','🍗','🍖','🥓','🥩','🥪','🌭','🍿','🧂','🥤','🍺','🍷'];


  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openModal = () => {
    setShowModal(true);
    setAutomationName('');
    setMessages([{ id: 1, day: 1, content: '', isOpen: true }]);
    setNameError(false);
  };

  const closeModal = () => setShowModal(false);

  const addMessage = () => {
    const newId = messages.length + 1;
    setMessages([...messages, { id: newId, day: messages[messages.length - 1].day + 1, content: '', isOpen: true }]);
  };

  const deleteMessage = (id) => {
    if (messages.length === 1) {
      return; // Don't allow deleting the last message
    }
    const updatedMessages = messages.filter(message => message.id !== id);
    // Renumber IDs
    const renumberedMessages = updatedMessages.map((msg, index) => ({
      ...msg,
      id: index + 1
    }));
    setMessages(renumberedMessages);
  };

  const changeMessageDay = (id, increment) => {
    const updatedMessages = messages.map(message => {
      if (message.id === id) {
        return { ...message, day: Math.max(1, message.day + increment) };
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  const updateMessageContent = (id, content) => {
    const updatedMessages = messages.map(message => {
      if (message.id === id) {
        return { ...message, content };
      }
      return message;
    });
    setMessages(updatedMessages);
  };

  const saveAutomation = () => {
    if (!automationName.trim()) {
      setNameError(true);
      return;
    }
    
    // Save logic would go here
    const newAutomation = {
      id: automations.length + 1,
      name: automationName,
      day: messages[0].day,
      message: messages[0].content || "New message",
      moreCount: messages.length - 1
    };
    
    setAutomations([...automations, newAutomation]);
    closeModal();
  };

  const toggleEmojiPicker = (messageId) => {
    setActiveMessageId(messageId);
    setShowEmojiPicker(!showEmojiPicker);
  };

  const insertEmoji = (emoji) => {
    if (activeMessageId) {
      const updatedMessages = messages.map(message => {
        if (message.id === activeMessageId) {
          return { 
            ...message, 
            content: message.content + emoji 
          };
        }
        return message;
      });
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
        <div className="batches-header px-6 pt-8" style={{ color: '#0f172a', marginBottom: '20px' }}>
          <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: '10px 0 20px 0'}}>Drip Automation</h1>

          <button 
            onClick={openModal}
            className="create-batch-btn bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md mt-4"
          >
            Create New Drip Automation
          </button>
        </div>

      <div className="">
        {/* Main Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-72"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="automation-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Messages</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {automations.map((automation) => (
                  <tr key={automation.id}>
                    <td>
                      <div className="name-container">
                        <div className="name-content">
                          <span className="automation-name">{automation.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="message-container">
                        <div className="day-badge">
                          Day {automation.day}
                        </div>
                        <div className="message-content">
                          <p className="message-text">
                            {automation.message}
                          </p>
                          {automation.moreCount > 0 && (
                            <p className="more-count">+{automation.moreCount} more</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <button className="edit-button action-btn" onClick={() => { /* Your edit logic */ }}>
                          <Edit size={18} />
                        </button>
                        <button className="delete-button action-btn" onClick={() => { /* Your delete logic */ }}>
                          <Trash2 size={18} />
                        </button>
                        <button className="action-btn">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="text-sm text-gray-600 total-records">Total: {automations.length}</div>
            <div className="flex space-x-1 pagination-controls">
              <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 pagination-btn">&lt;&lt;</button>
              <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 pagination-btn">&lt;</button>
              <button className="px-2 py-1 border border-gray-300 rounded bg-blue-500 text-white pagination-btn">1</button>
              <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 pagination-btn">&gt;</button>
              <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 pagination-btn">&gt;&gt;</button>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Entries</span>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Drip Automation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-modal overflow-y-auto relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Add Drip Automation</h2>
              <p className="text-sm text-gray-500 mb-4">Message count: {messages.length} Message{messages.length > 1 ? 's' : ''}</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name Drip Automation <span className="inline-block bg-gray-200 text-gray-600 rounded-full h-5 w-5 text-xs flex items-center justify-center">i</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Drip Automation"
                  value={automationName}
                  onChange={(e) => {
                    setAutomationName(e.target.value);
                    if (e.target.value.trim()) setNameError(false);
                  }}
                  className={`w-full p-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {nameError && <p className="text-red-500 text-xs mt-1">Name is required</p>}
              </div>

              {messages.map((message) => (
                <div key={message.id} className="mb-6 message-container">
                  <div className="text-center mb-2">
                    <span className="px-4 py-1 bg-gray-200 rounded-md text-sm">Message {message.id}</span>
                  </div>

                  <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-3/4">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium mr-2">Send on Day</span>
                        <button 
                          className="border border-gray-300 rounded-md px-2"
                          onClick={() => changeMessageDay(message.id, -1)}
                        >-</button>
                        <input 
                          type="text" 
                          value={message.day} 
                          className="w-10 text-center border-y border-gray-300" 
                          readOnly 
                        />
                        <button 
                          className="border border-gray-300 rounded-md px-2"
                          onClick={() => changeMessageDay(message.id, 1)}
                        >+</button>
                        <span className="ml-3 text-sm text-gray-500">After prospect has been added to the Drip Automation</span>
                      </div>

                      <div className="border border-gray-300 rounded-md p-2 min-h-32 relative">
                        <textarea 
                          placeholder="Write Message" 
                          className="w-full min-h-24 resize-none border-0 focus:outline-none" 
                          value={message.content}
                          onChange={(e) => updateMessageContent(message.id, e.target.value)}
                        />
                        <div className="flex border-t pt-2">
                          <div className="relative">
                            <button 
                              className="mr-2 text-gray-500 hover:text-gray-700"
                              onClick={() => toggleEmojiPicker(message.id)}
                            >
                              <Smile size={20} />
                            </button>
                            
                            {/* Simple Emoji Picker Modal */}
                            {showEmojiPicker && activeMessageId === message.id && (
                              <div 
                                ref={emojiPickerRef}
                                className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                style={{ width: '200px', height: '80px', overflow: 'auto' }}
                              >
                                <div className="p-2 grid grid-cols-6 gap-1">
                                  {allEmojis.map((emoji, index) => (
                                    <button 
                                      key={index} 
                                      className="hover:bg-gray-100 rounded p-1 text-lg"
                                      onClick={() => {
                                        insertEmoji(emoji);
                                        // Optionally close the picker after selection
                                        // setShowEmojiPicker(false);
                                      }}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        
                          <button className="px-2 py-1 bg-gray-100 rounded-md text-xs flex items-center">
                            Add Merge Field
                          </button>
                          <div className="ml-auto">
                            <button 
                              className="text-gray-500 hover:text-gray-700 bg-red-100 p-1 rounded"
                              onClick={() => deleteMessage(message.id)}
                              disabled={messages.length === 1}
                            >
                              <Trash2 size={18} className={messages.length === 1 ? 'opacity-50' : ''} />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 bg-green-100 p-1 rounded">
                              <Check size={18} className="text-emerald-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border border-dashed border-gray-300 rounded-md p-4 text-center mb-4">
                <button 
                  className="text-gray-500 hover:text-gray-700 flex items-center justify-center w-full"
                  onClick={addMessage}
                >
                  <span className="mr-1">+</span> Add message {messages.length + 1}
                </button>
              </div>

              <div className="flex justify-center mt-6">
                <button 
                  className="save-message-btn"
                  onClick={saveAutomation}
                >
                  Save Drip Automation
                </button>
              </div>
            </div>
          </div>  
        </div>
      )}
    </div>
  );
}