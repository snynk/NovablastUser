import React, { useContext, useState } from "react";
import { Icon, UserAvatar } from "@/components/Component";
import SimpleBar from "simplebar-react";
import { Input } from "reactstrap";
import { ChatItem } from "./ChatPartials";
import { findUpper } from "@/utils/Utils";
import { ChatContext } from "./ChatContext";
import "@/assets/css/chatbox.css";

export const ChatAsideBody = ({
  onInputChange,
  favState,
  favFilter,
  setFavState,
  setSelectedId,
  selectedId,
  favInputSearchChange,
  favFilterText,
  filterTab,
  chatItemClick,
  filteredChatList,
}) => {
  const { fav, favAction } = useContext(ChatContext);
  const [favData] = fav;
  const defaultChat = filteredChatList.filter((item) => item.group !== true);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="chat-sidebar">
      <SimpleBar className="chat-sidebar-scroll">
        <div className="chat-sidebar-header">
          <h3>Messages</h3>
          <div className={` ${searchFocused ? "focused" : ""}`}>
          
            <Input
              type="text"
              className="search-input4"
              placeholder="Search conversations"
              onChange={(e) => onInputChange(e)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="chat-filters">
          <div className={`filter-item ${filterTab === "messages" ? "active" : ""}`}>
            <span>All</span>
          </div>
          <div className={`filter-item ${filterTab === "unread" ? "active" : ""}`}>
            <span>Unread</span>
          </div>
          <div className={`filter-item ${filterTab === "archive" ? "active" : ""}`}>
            <span>Archived</span>
          </div>
        </div>
        
        {favState && (
          <div className="chat-section">
            <div className="chat-section-title">
              <h6>Favorites</h6>
            </div>
            <ul className="contact-list">
              {favFilter.length === 0 ? (
                favFilterText ? (
                  <div className="empty-message">No favorites found</div>
                ) : (
                  favData.slice(0, 3).map((contact, idx) => (
                    contact.fav === false && (
                      <li key={idx} className="contact-item" onClick={() => favAction(contact.id)}>
                        <UserAvatar
                          text={findUpper(contact.name)}
                          theme={contact.theme}
                          image={contact.image}
                          className="avatar"
                        />
                        <div className="contact-details">
                          <div className="contact-name">{contact.name}</div>
                          <div className="contact-action">Add to favorites</div>
                        </div>
                      </li>
                    )
                  ))
                )
              ) : (
                favFilter.map((contact, idx) => (
                  contact.fav === false && (
                    <li key={idx} className="contact-item" onClick={() => favAction(contact.id)}>
                      <UserAvatar
                        text={findUpper(contact.name)}
                        theme={contact.theme}
                        image={contact.image}
                        className="avatar"
                      />
                      <div className="contact-details">
                        <div className="contact-name">{contact.name}</div>
                        <div className="contact-action">Start Chat</div>
                      </div>
                    </li>
                  )
                ))
              )}
            </ul>
          </div>
        )}
        
        <div className="chat-section">
          <div className="chat-section-title">
            <h6>{filterTab}</h6>
          </div>
          <ul className="chat-list">
            {defaultChat.length !== 0 ? (
              filteredChatList.map((item, idx) => {
                if (filterTab === "messages") {
                  return (
                    item.convo.length > 0 &&
                    !item.group &&
                    !item.archive && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else if (filterTab === "archive") {
                  return (
                    item.convo.length > 0 &&
                    item.archive &&
                    !item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else if (filterTab === "unread") {
                  return (
                    item.convo.length > 0 &&
                    item.unread &&
                    !item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else {
                  return (
                    item.convo.length > 0 &&
                    !item.channel &&
                    item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                }
              })
            ) : (
              <div className="empty-message">
                <Icon name="messages" className="empty-icon" />
                <p>No conversations found</p>
              </div>
            )}
          </ul>
        </div>
      </SimpleBar>
    </div>
  );
};

export const ChannelAsideBody = ({
  filteredChatList,
  onInputChange,
  setSelectedId,
  setMobileView,
  selectedId,
  filterTab,
  chatItemClick,
}) => {
  const defaultChat = filteredChatList.filter((item) => item.group === true);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="chat-sidebar">
      <SimpleBar className="chat-sidebar-scroll">
        <div className="chat-sidebar-header">
          <h3>Channels</h3>
          <div className={`search-container ${searchFocused ? "focused" : ""}`}>
            <div className="search-icon">
              <Icon name="search" />
            </div>
            <Input
              type="text"
              className="search-input"
              placeholder="Search channels"
              onChange={(e) => onInputChange(e)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="chat-section">
          <div className="chat-section-title">
            <h6>All Channels</h6>
          </div>
          <ul className="channel-list">
            {filteredChatList.map((item, idx) => {
              return (
                item.channel && (
                  <li
                    key={idx}
                    className={`channel-item ${selectedId === item.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedId(item.id);
                      if (window.innerWidth < 860) setMobileView(true);
                    }}
                  >
                    <span className="channel-hash">#</span>
                    <span className="channel-name">{item.name}</span>
                    {item.unread && <span className="unread-indicator"></span>}
                  </li>
                )
              );
            })}
          </ul>
        </div>
        
        <div className="chat-section">
          <div className="chat-section-title">
            <h6>Teams / Groups</h6>
          </div>
          <ul className="chat-list">
            {defaultChat.length !== 0 ? (
              filteredChatList.map((item, idx) => {
                if (filterTab === "messages") {
                  return (
                    item.convo.length > 0 &&
                    item.group &&
                    !item.archive &&
                    !item.channel && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else if (filterTab === "archive") {
                  return (
                    item.convo.length > 0 &&
                    !item.channel &&
                    item.archive &&
                    item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else if (filterTab === "unread") {
                  return (
                    item.convo.length > 0 &&
                    !item.channel &&
                    item.unread &&
                    item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                } else {
                  return (
                    item.convo.length > 0 &&
                    !item.channel &&
                    item.group && (
                      <ChatItem
                        key={idx}
                        item={item}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        chatItemClick={chatItemClick}
                      />
                    )
                  );
                }
              })
            ) : (
              <div className="empty-message">
                <Icon name="users" className="empty-icon" />
                <p>No groups found</p>
              </div>
            )}
          </ul>
        </div>
      </SimpleBar>
    </div>
  );
};

export const ContactAsideBody = ({
  onInputChange,
  filterData,
  filterText,
  contactData,
  setSelectedId
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  
  return (
    <div className="chat-sidebar">
      <SimpleBar className="chat-sidebar-scroll">
        <div className="chat-sidebar-header">
          <h3>Contacts</h3>
          <div className={`search-container ${searchFocused ? "focused" : ""}`}>
            <div className="search-icon">
              <Icon name="search" />
            </div>
            <Input
              type="text"
              className="search-input"
              placeholder="Search contacts"
              onChange={(e) => onInputChange(e)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="chat-section">
          <ul className="contact-list">
            {filterData.length === 0 ? (
              filterText ? (
                <div className="empty-message">
                  <Icon name="users" className="empty-icon" />
                  <p>No contacts found</p>
                </div>
              ) : (
                contactData.map((item, idx) => (
                  <li key={idx} className="contact-item" onClick={() => setSelectedId(item.id)}>
                    <UserAvatar
                      text={findUpper(item.name)}
                      theme={item.theme}
                      image={item.image}
                      className="avatar"
                    />
                    <div className="contact-details">
                      <div className="contact-name">{item.name}</div>
                      <div className="contact-status">
                        <span className={`status-dot ${item.active ? "online" : "offline"}`}></span>
                        <span className="status-text">{item.active ? "Online" : "Offline"}</span>
                      </div>
                    </div>
                    <div className="contact-actions">
                      <button className="action-button">
                        <Icon name="messages" />
                      </button>
                    </div>
                  </li>
                ))
              )
            ) : (
              filterData.map((contact, idx) => (
                <li key={idx} className="contact-item" onClick={() => setSelectedId(contact.id)}>
                  <UserAvatar
                    text={findUpper(contact.name)}
                    theme={contact.theme}
                    image={contact.image}
                    className="avatar"
                  />
                  <div className="contact-details">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-status">
                      <span className={`status-dot ${contact.active ? "online" : "offline"}`}></span>
                      <span className="status-text">{contact.active ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                  <div className="contact-actions">
                    <button className="action-button">
                      <Icon name="messages" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </SimpleBar>
    </div>
  );
};