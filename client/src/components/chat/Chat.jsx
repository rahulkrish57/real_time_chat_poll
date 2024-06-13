import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiService } from "../../service/api.service";
import "./chat.css";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import Bubble from "./Bubble";
const Chat = ({ socket, user, username, userId, room, dateFormat }) => {
  const [messageList, setMessageList] = useState([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  //handle current message input function
  const handleCurrentMsg = (e) => {
    const { value } = e.target;
    const data = { room: room, author: user, userId: userId };
    socket.emit("typing", data);
    setCurrentMsg(value);
  };

  // send Current Message function
  const sendMsg = async () => {
    if (currentMsg !== "") {
      const messageData = {
        room: room,
        author: username,
        userId: userId,
        chat_id: uuidv4(),
        message: currentMsg,
        token: user,
        cAt: new Date(),
        uAt: new Date(),
      };
      await socket.emit("send_msg", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMsg("");
      socket.emit("stop_typing", { user, room });
    } else {
      alert("Please enter something");
    }
  };
  const chatHistoryFunc = async () => {
    try {
      const config = {
        "access-token": user,
      };
      const response = await apiService.chatHistory(config);
      console.log(response);
      const { data } = response;
      setMessageList(data.info);
    } catch (error) {
      alert("Chat History Failed!");
    }
  };
  useEffect(() => {
    chatHistoryFunc();
  }, []);
  useEffect(() => {
    // function handles receiving message
    const handleMessageReceive = (msg_data) => {
      setMessageList((list) => {
        const isPresent = list.some((msg) => msg.chat_id === msg_data.chat_id);
        if (!isPresent) {
          return [...list, msg_data];
        }
        return list;
      });
    };

    // function handles Typing loader
    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socket.on("receive_msg", handleMessageReceive);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    // Cleanup on unmount
    return () => {
      socket.off("receive_msg", handleMessageReceive);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket]);
  return (
    <div className="chat-container">
      {/* chat header */}
      <div className="chat-header ">
        <h3 className="mb-0">Live Chat</h3>
      </div>
      {/* chat header */}
      <div className="chat-body">
        {messageList.length > 0 ? (
          messageList.map((msgData, i) => {
            return (
              <div
                key={msgData.chat_id}
                className={`m-4 bubble ${
                  msgData.userId === userId
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <Bubble
                  msg={msgData.message}
                  time={dateFormat(msgData.cAt)}
                  author={msgData.userId !== userId && msgData.author}
                  bubble_cname={
                    msgData.userId === userId ? "bubble-right" : "bubble-left"
                  }
                />
              </div>
            );
          })
        ) : (
          <>
            <div className={" empty-conv h-100"}>
              <p className="mb-2">Start Conversation...</p>
            </div>
          </>
        )}
      </div>
      {/* chat header */}
      {isTyping && <div className="typing-indicator">Typing...</div>}
      <div className="chat-footer d-flex gap-2">
        {/* <input
          type="text"
          value={currentMsg}
          placeholder="type your message..."
          onChange={handleCurrentMsg}
        /> */}
        <Form.Group controlId="currentMsg" className="w-100">
          <Form.Control
            type="text"
            value={currentMsg}
            placeholder="type your message..."
            onChange={handleCurrentMsg}
            required
          />
        </Form.Group>
        <Button onClick={sendMsg}>&#9658;</Button>
      </div>
    </div>
  );
};
export default Chat;
