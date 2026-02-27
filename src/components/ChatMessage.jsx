import Robot from "../assets/robot.png";
import User from "../assets/user.png";
import './ChatMessage.css'
function ChatMessage({ message, sender,time }) {
  return (
    <div className={
      sender === 'user'
        ? 'chat-message-user'
        : 'chat-message-robot'
    }>
      {sender === 'robot' && (
        <img src={Robot} className="chat-message-profile" />
      )}

    <div className="chat-message-text">
  <span className="chat-message-content">{message}</span>
  <span className="chat-time">{time}</span>
</div>

      {sender === 'user' && (
        <img src={User} className="chat-message-profile" />
      )}
    </div>
  );
}

export default ChatMessage;