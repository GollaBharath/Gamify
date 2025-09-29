import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css"; // your CSS file

const FAQ = [
  {
    triggers: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    response: "Hello 👋! Welcome to <b>Gamify</b>. How can I help you today?",
  },
  {
    triggers: ["thanks", "thank you", "thx"],
    response: "You're welcome! 😊 Always here to help.",
  },
  {
    triggers: ["bye", "goodbye", "see you", "later"],
    response: "Goodbye! 👋 Have a fun and productive day!",
  },
  {
    triggers: ["what is gamify", "gamify", "about gamify"],
    response:
      "🎮 <b>Gamify</b> is your all-in-one <b>open-source platform</b> designed to make <b>work</b> and <b>community activities</b> fun ✨.<br><br>We boost <b>productivity 🚀</b>, <b>collaboration</b>, and <b>engagement</b> using game mechanics like <b>points</b> and <b>rewards</b> 🏆.",
  },
  {
    triggers: ["What features does Gamify offer?","features", "what can i do", "gamify features"],
    response: `⚡ With <b>Gamify</b>, you can:<br>
✅ Create engaging <b>Events & Tasks</b><br>
🏆 Reward members with <b>Points</b><br>
🛒 Set up a <b>Shop</b> to redeem points<br>
📈 Compete on a <b>Leaderboard</b><br>
📁 Start quickly with ready-made <b>Templates</b>`,
  },
  {
    triggers: ["Who can use Gamify?","who is gamify for", "target audience", "users"],
    response:
      "👥 <b>Gamify</b> is for <b>everyone</b>!<br><br>💼 <b>Corporate Teams</b> – boost productivity<br>🎓 <b>Study Groups</b> – make learning fun<br>🌍 <b>Communities</b> – increase member engagement",
  },
  {
    triggers: ["Is Gamify free to use?","is gamify free", "pricing", "cost"],
    response:
      "🎉 Yes! <b>Gamify</b> is <b>100% free</b> and <b>open-source</b> under the MIT License.<br>No hidden fees. No vendor lock-in. ❤️",
  },
  {
    triggers: ["How do I create an account?","create account", "sign up", "register"],
    response:
      "🔑 Getting started is easy!<br>Click <b>Profile</b> or any <b>Get Started Free</b> button.<br>👉 Sign up with email or <b>Google</b> for instant access 🚀.",
  },
  {
    triggers: ["Can I self-host Gamify?","self host", "privacy", "host myself"],
    response:
      "🛡️ Absolutely! You can <b>self-host</b> Gamify to have <b>full control</b> of your data.<br>No tracking, no nonsense—just <b>your community</b> on your terms.",
  },
  {
    triggers: ["How can I contact support?","support", "help", "contact"],
    response: `💬 We'd love to hear from you!<br>
📝 Fill the <b>Contact Form</b><br>
📧 Email us directly<br>
🤝 Join our <b>Discord Community</b> for real-time help`,
  },
  {
    triggers: ["Where can I find developer resources?","developer resources", "api", "github"],
    response: `💻 For developers:<br>
🔗 Access full <b>source code</b> on <b>GitHub</b><br>
📖 Check our <b>API Docs</b> for integrations<br>
📂 Explore the <b>Resources</b> section in the footer`,
  },
  {
    triggers: [],
    response: "❌ Sorry, I didn’t understand. Please try asking differently 🙂",
  },
];

const QUICK_QUESTIONS = [
  "What is Gamify?",
  "What features does Gamify offer?",
  "Who can use Gamify?",
  "Is Gamify free to use?",
  "How do I create an account?",
  "Can I self-host Gamify?",
  "How can I contact support?",
  "Where can I find developer resources?",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am GrowCraft. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [showFirstFour, setShowFirstFour] = useState(true);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const findResponse = (text) => {
    const lc = text.toLowerCase();

    const sortedFAQ = [...FAQ].sort((a, b) => {
      const maxA = Math.max(...a.triggers.map((t) => t.length), 0);
      const maxB = Math.max(...b.triggers.map((t) => t.length), 0);
      return maxB - maxA;
    });

    for (const item of sortedFAQ) {
      if (item.triggers.some((trig) => lc.includes(trig.toLowerCase()))) {
        return item.response;
      }
    }

    return FAQ.find((i) => i.triggers.length === 0).response;
  };

  const sendMessage = (customText) => {
    const text = customText || input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    setTimeout(() => {
      const response = findResponse(text);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 500);
  };

  const toggleQuickQuestions = () => {
    setShowFirstFour(!showFirstFour);
  };

  const renderQuickQuestions = () => {
    const questionsToShow = showFirstFour ? QUICK_QUESTIONS.slice(0, 4) : QUICK_QUESTIONS.slice(4, 8);
    return (
      <>
        {questionsToShow.map((q, i) => (
          <button key={i} className="quick-question-btn" onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
        <button className="quick-question-btn toggle-btn" onClick={toggleQuickQuestions}>
          {showFirstFour ? "See More" : "See Less"}
        </button>
      </>
    );
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window open">
          <div className="chatbot-header">
            <img src="public\icons\apple-touch-icon.png" alt="Gamify Logo" className="chatbot-header-logo" />
            <span>Gamify</span>
            <button onClick={toggleChat}>
              <img
                src="public/icons/close_small_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png"
                alt="Close"
              />
            </button>
          </div>

          <div className="chatbot-body" ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.sender}-msg`}>
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
          </div>

          <div className="quick-questions">{renderQuickQuestions()}</div>

          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              placeholder="Type your query..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={() => sendMessage()}>
              <img src="public/icons/send.png" alt="Send" />
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        <img src="public/icons/apple-touch-icon.png" alt="gamebutton" />
      </button>
    </div>
  );
};

export default Chatbot;
