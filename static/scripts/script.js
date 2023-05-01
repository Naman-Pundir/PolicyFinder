
const chatbotButton = document.getElementById('chatbot-button');
chatbotButton.addEventListener('click', () => {
  console.log("yes chat is open");
  chat.style.display = 'block';
  // Add code to initialize your chatbot inside the chatbotWindow
});



const socket = new WebSocket('ws://localhost:8080');

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const messagesDiv = document.querySelector('#messages');

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message !== '') {
    // Send the message to the server
    console.log(message);
    socket.send(message);

    // Add the message to the messages div
    const messageP = document.createElement('p');
    messageP.textContent = `You: ${message}`;
    messagesDiv.appendChild(messageP);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Clear the message input
    messageInput.value = '';
  }
});

socket.addEventListener('message', (event) => {
  // Add the server response to the messages div
  const messageP = document.createElement('p');
  messageP.textContent = `Chatbot: ${event.data}`;
  messagesDiv.appendChild(messageP);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
