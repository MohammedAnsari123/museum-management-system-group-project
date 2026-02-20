// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const resetButton = document.getElementById('resetButton');
const typingIndicator = document.getElementById('typingIndicator');

// Add message to chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender + '-message');

    if (sender === 'bot') {
        messageDiv.innerHTML = `<strong>Chatbot:</strong> ${text}`;
    } else {
        messageDiv.innerHTML = `<strong>You:</strong> ${text}`;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    typingIndicator.style.display = 'none';
}

// Send message to chatbot API
async function sendToChatbot(message) {
    showTyping();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        hideTyping();

        if (response.ok) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        hideTyping();
        addMessage('bot', 'Sorry, I\'m having trouble connecting. Please try again later.');
    }
}

// Reset chat history
async function resetChat() {
    try {
        const response = await fetch('/api/chat/reset', {
            method: 'POST'
        });

        if (response.ok) {
            chatMessages.innerHTML = '<div class="message bot-message"><strong>Chatbot:</strong> Hello! I\'m your Museum Information Assistant. I can help you find information about museums in India. You can ask me about specific museums, search for museums in specific locations, or ask about different types of museums. What would you like to know?</div>';
        }
    } catch (error) {
        console.log('Error resetting chat:', error);
    }
}

// Event Listeners
if (sendButton) {
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            sendToChatbot(message);
        }
    });
}

if (userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}

if (resetButton) {
    resetButton.addEventListener('click', () => {
        resetChat();
    });
}

// Focus on input when page loads
window.addEventListener('load', () => {
    if (userInput) {
        userInput.focus();
    }
});
