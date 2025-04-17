import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Smile, ArrowRight } from 'lucide-react';

const TemplateCreationModal = ({ isOpen, onClose }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('Residential');
  const [currentMessage, setCurrentMessage] = useState(1);
  const [messages, setMessages] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showNegativeKeywords, setShowNegativeKeywords] = useState(false);
  const [charCount, setCharCount] = useState(0);

  if (!isOpen) return null;

  const handleMessageChange = (e) => {
    const newMessages = { ...messages };
    newMessages[currentMessage] = e.target.value;
    setMessages(newMessages);
    setCharCount(e.target.value.length);
  };

  const switchMessage = (messageNum) => {
    setCurrentMessage(messageNum);
  };

  const handleNextMessage = () => {
    if (currentMessage < 5) {
      setCurrentMessage(currentMessage + 1);
    }
  };

  const handleAddTextSpinner = () => {
    const currentText = messages[currentMessage] || '';
    setMessages({
      ...messages,
      [currentMessage]: currentText + "{Text Option 1/Text Option 2/Text Option 3}"
    });
  };

  const handleAddMergeField = () => {
    const currentText = messages[currentMessage] || '';
    setMessages({
      ...messages,
      [currentMessage]: currentText + "{PropertyAddress}"
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Initial Template</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left column - Template configuration */}
          <div className="col-span-12 lg:col-span-7">
            {/* Template Name */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <button className="ml-2 text-gray-400">
                  <Info size={16} />
                </button>
              </div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter Template Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Template Type */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Template Type</label>
                <button className="ml-2 text-gray-400">
                  <Info size={16} />
                </button>
              </div>
              <div className="relative">
                <button 
                  className="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white flex justify-between items-center"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                >
                  <span>{templateType}</span>
                  <ChevronDown size={16} />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-md shadow-sm bg-white z-10">
                    <button 
                      className="w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setTemplateType('Residential');
                        setShowTypeDropdown(false);
                      }}
                    >
                      Residential
                    </button>
                    <button 
                      className="w-full px-3 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setTemplateType('Commercial');
                        setShowTypeDropdown(false);
                      }}
                    >
                      Commercial
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Kickstart conversations with a variety of motivated sellers</p>
            </div>
            
            {/* Messages section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium text-gray-800">Messages</h2>
                <button 
                  className="flex items-center text-blue-600 text-sm"
                  onClick={() => setShowNegativeKeywords(!showNegativeKeywords)}
                >
                  Negative Keywords
                  {showNegativeKeywords ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Follow our Best Practices to build high-converting content</p>
              
              {showNegativeKeywords && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Negative Keywords</h3>
                  <p className="text-sm text-gray-600">These words may trigger spam filters or reduce delivery rates...</p>
                  {/* Add negative keywords content here */}
                </div>
              )}
              
              {/* Message tabs */}
              <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                <div className="border-b border-gray-300 p-4">
                  <h3 className="font-medium">Message {currentMessage}</h3>
                </div>
                
                <div className="flex border-b border-gray-300">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      className={`py-2 px-4 ${currentMessage === num ? 'bg-green-100 text-green-600 border-b-2 border-green-500' : 'text-gray-600'}`}
                      onClick={() => switchMessage(num)}
                    >
                      {num === 1 ? 'Message 1' : num}
                    </button>
                  ))}
                </div>
                
                <div className="p-4">
                  <textarea
                    value={messages[currentMessage]}
                    onChange={handleMessageChange}
                    placeholder="Write your message"
                    className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">{charCount} / 320</div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                        <Smile size={18} />
                      </button>
                      <button 
                        className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={handleAddTextSpinner}
                      >
                        <span className="mr-1">Add Text Spinner</span>
                      </button>
                      <button 
                        className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={handleAddMergeField}
                      >
                        <span className="mr-1">Add Merge Field</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between p-4 border-t border-gray-300">
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Back
                  </button>
                  <div className="text-sm text-gray-500 self-center">Total Variations: 0</div>
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    onClick={handleNextMessage}
                  >
                    Next Message
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Bottom buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Save Template
              </button>
            </div>
          </div>
          
          {/* Right column - Message validation */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Message 1</h3>
                <div className="text-sm text-gray-500">Variations: 0</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <input type="radio" className="mt-1 mr-2" id="min-chars" />
                  <label htmlFor="min-chars" className="text-sm text-gray-700">Minimum of 8 characters</label>
                </div>
                
                <div className="flex items-start">
                  <input type="radio" className="mt-1 mr-2" id="text-spinners" />
                  <label htmlFor="text-spinners" className="text-sm text-gray-700">At least 2 Text Spinners [0/2]</label>
                </div>
                
                <div className="flex items-start">
                  <input type="radio" className="mt-1 mr-2" id="spinner-elements" />
                  <label htmlFor="spinner-elements" className="text-sm text-gray-700">Each Text Spinner must have at least 3 elements</label>
                </div>
                
                <div className="flex items-start">
                  <input type="radio" className="mt-1 mr-2" id="merge-field" />
                  <label htmlFor="merge-field" className="text-sm text-gray-700">Must have Merge Field</label>
                </div>
                
                <div className="flex items-start">
                  <input type="checkbox" checked className="mt-1 mr-2" id="no-negative" />
                  <label htmlFor="no-negative" className="text-sm text-green-600">Must have no negative/restricted keywords</label>
                </div>
                
                <div className="flex items-start">
                  <input type="checkbox" checked className="mt-1 mr-2" id="valid-fields" />
                  <label htmlFor="valid-fields" className="text-sm text-green-600">All Merge Fields and Text Spinners must be valid</label>
                </div>
              </div>
              
              {/* Additional messages preview */}
              <div className="mt-6 space-y-4">
                <div className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-700">Message 2</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-700">Message 3</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-700">Message 4</h4>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-700">Message 5</h4>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <div className="text-sm text-gray-500">Total Variations: 0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage example
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Create Initial Template
      </button>
      
      <TemplateCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default App;