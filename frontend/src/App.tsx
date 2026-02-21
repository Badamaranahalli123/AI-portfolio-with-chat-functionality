import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);

    try {
      const response = await axios.post("https://ai-portfolio-with-chat-functionality.onrender.com", {
        message: message,
      });

      setChat([
        ...chat,
        { role: "user", text: message },
        { role: "ai", text: response.data.reply },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>My AI Portfolio</h1>

      <div style={{ marginTop: "20px", minHeight: "300px" }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about my skills, experience..."
        style={{ width: "70%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default App;
