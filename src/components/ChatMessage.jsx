import Robot from "../assets/robot.png";
import User from "../assets/user.png";
import './ChatMessage.css'
function ChatMessage({ message, sender }) {
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
        {message}
      </div>

      {sender === 'user' && (
        <img src={User} className="chat-message-profile" />
      )}
    </div>
  );
}

export default ChatMessage;