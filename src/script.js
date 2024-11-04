const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);

    // Subscribe to the topic for incoming messages
    stompClient.subscribe('/topic/messages', function (messageOutput) {
        showMessage(messageOutput.body);
    });
});

function sendMessage() {
    const inputMessage = document.getElementById('inputMessage').value;

    // Send the message to the server
    stompClient.send("/app/message", {}, inputMessage);

    // Clear the input field
    document.getElementById('inputMessage').value = '';
}

function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
}
