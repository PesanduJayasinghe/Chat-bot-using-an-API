const API_KEY = "<REMOVED THE API KEY FOR PRIVACY>";

    const messagesContainer = document.getElementById("messages");
    const inputField = document.getElementById("input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

    function addMessage(text, sender) {
      const msg = document.createElement("div");
      msg.classList.add("message", sender);
      msg.textContent = text;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msg;
    }

    async function sendMessage() {
      const userMessage = inputField.value.trim();
      if (!userMessage) return;

      addMessage(userMessage, "user");
      inputField.value = "";

      const typingNode = addMessage("Typing...", "bot");

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [{ role: "user", content: userMessage }]
          })
        });

        const data = await response.json();
        typingNode.remove();

        if (data.error) {
          addMessage("API Error: " + data.error.message, "bot");
          console.error("OpenRouter API error:", data.error);
          return;
        }

        const botText = data.choices?.[0]?.message?.content;
        if (!botText) {
          addMessage("Unexpected response format.", "bot");
          console.log("Full response:", data);
          return;
        }

        addMessage(botText, "bot");

      } catch (err) {
        typingNode.remove();
        addMessage("Network Error: " + err.message, "bot");
        console.error(err);
      }
    }