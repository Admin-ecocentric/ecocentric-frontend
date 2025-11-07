document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  const chatWindow = document.getElementById('chatWindow');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const shareBtn = document.getElementById('shareBtn');

  async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, 'user');
    userInput.value = '';

    const res = await fetch('/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query: question, user })
    });

    const data = await res.json();
    displayResponse(data.response);
  }

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
    div.innerHTML = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function displayResponse(responseText) {
    const div = document.createElement('div');
    div.classList.add('bot-msg');

    const sections = responseText.split(/(?=Overview:|References:|Case Studies:)/g);

    sections.forEach(section => {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('section');
      sectionDiv.innerHTML = section.trim();
      div.appendChild(sectionDiv);
    });

    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  shareBtn.addEventListener('click', async () => {
    const res = await fetch('/share', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user })
    });
    const data = await res.json();
    const shareUrl = `${window.location.origin}/share/${data.session_id}`;
    prompt('Share this link (read-only):', shareUrl);
  });
});
