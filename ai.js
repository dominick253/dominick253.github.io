//  ____                                                __                  __      __          __                  __
//  /\  _`\                       __          __        /\ \                /\ \  __/\ \        /\ \              __/\ \__
//  \ \ \/\ \    ___     ___ ___ /\_\    ___ /\_\    ___\ \ \/'\     ____   \ \ \/\ \ \ \     __\ \ \____    ____/\_\ \ ,_\    __
//   \ \ \ \ \  / __`\ /' __` __`\/\ \ /' _ `\/\ \  /'___\ \ , <    /',__\   \ \ \ \ \ \ \  /'__`\ \ '__`\  /',__\/\ \ \ \/  /'__`\
//    \ \ \_\ \/\ \L\ \/\ \/\ \/\ \ \ \/\ \/\ \ \ \/\ \__/\ \ \\`\ /\__, `\   \ \ \_/ \_\ \/\  __/\ \ \L\ \/\__, `\ \ \ \ \_/\  __/
//     \ \____/\ \____/\ \_\ \_\ \_\ \_\ \_\ \_\ \_\ \____\\ \_\ \_\/\____/    \ `\___x___/\ \____\\ \_,__/\/\____/\ \_\ \__\ \____\
//      \/___/  \/___/  \/_/\/_/\/_/\/_/\/_/\/_/\/_/\/____/ \/_/\/_/\/___/      '\/__//__/  \/____/ \/___/  \/___/  \/_/\/__/\/____/

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
