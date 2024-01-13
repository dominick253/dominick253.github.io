document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sendButton').addEventListener('click', sendMessage);
});

async function sendMessage() {
    const userInputField = document.getElementById('userInput');
    const userMessage = userInputField.value;
    userInputField.value = '';

    if (userMessage.trim() === '') return;

    updateChatBox('You: ' + userMessage);

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        updateChatBox('AI: ' + data.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
        updateChatBox('AI: Sorry, there was an error.');
    }
}

function updateChatBox(message) {
    const chatBox = document.getElementById('chatbox');
    chatBox.innerHTML += message + '<br>';
    chatBox.scrollTop = chatBox.scrollHeight;
}
