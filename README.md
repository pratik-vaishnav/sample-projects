## Here’s a demo video of the project:
 https://github.com/pratik-vaishnav/sample-projects/raw/refs/heads/master/recording.mp4

# WebSocket Setup with Spring Boot and HTML/JavaScript Frontend

This guide will help you set up a WebSocket connection between a Spring Boot backend and a simple frontend using HTML, CSS, and JavaScript.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Setup in Spring Boot](#backend-setup-in-spring-boot)
    - [1. Add Dependencies](#1-add-dependencies)
    - [2. Configure WebSocket Endpoint](#2-configure-websocket-endpoint)
    - [3. Create a Message Controller](#3-create-a-message-controller)
- [Frontend Setup with HTML, CSS, and JavaScript](#frontend-setup-with-html-css-and-javascript)
    - [1. HTML Structure](#1-html-structure)
    - [2. CSS Styling](#2-css-styling)
    - [3. JavaScript for WebSocket Communication](#3-javascript-for-websocket-communication)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites
- Java (JDK 8 or higher)
- Spring Boot
- Basic knowledge of WebSocket, HTML, CSS, and JavaScript

## Backend Setup in Spring Boot

### 1. Add Dependencies
Add the following dependency to your `pom.xml` to enable WebSocket support:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### 2. Configure WebSocket Endpoint
Create a configuration class `WebSocketConfig` to set up WebSocket and STOMP (Simple Text Oriented Messaging Protocol) endpoints.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allows all origins
                .withSockJS();
    }
}
```

### 3. Create a Message Controller
Create a `MessageController` to handle incoming messages from the client and send responses.

```java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public String sendMessage(String message) {
        return "Server received: " + message;
    }
}
```

- `@MessageMapping("/message")`: Maps incoming messages from the client.
- `@SendTo("/topic/messages")`: Sends the response back to clients subscribed to this topic.

## Frontend Setup with HTML, CSS, and JavaScript

Create the following three files in your frontend project.

### 1. HTML Structure
Create an `index.html` file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Chat</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Simple WebSocket Chat</h1>
        <div id="messages" class="messages"></div>
        <input type="text" id="inputMessage" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sockjs-client/dist/sockjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/stompjs/lib/stomp.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### 2. CSS Styling
Create a `styles.css` file for basic styling:

```css
* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f4f4f9;
}

.container {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

h1 {
    font-size: 1.5em;
    color: #333;
}

.messages {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding: 10px;
    background: #fafafa;
    text-align: left;
}

#inputMessage {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

button {
    padding: 10px;
    width: 100%;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
```

### 3. JavaScript for WebSocket Communication
Create a `script.js` file to manage WebSocket connections and send/receive messages:

```javascript
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
```

## Running the Application

1. **Start the Spring Boot Application**: Run your Spring Boot application on `http://localhost:8080`.
2. **Open the HTML File**: Open `index.html` in a browser.

Once everything is set up, you should be able to send messages from the frontend and see responses in real time.

## Troubleshooting

If you encounter the following error:

```plaintext
java.lang.IllegalArgumentException: When allowCredentials is true, allowedOrigins cannot contain the special value "*" ...
```

This is because `allowCredentials(true)` cannot be used with `allowedOrigins("*")`. Instead, specify exact origins like `allowedOrigins("http://localhost:3000")`, or use `allowedOriginPatterns("*")` as shown in the configuration section above.

---

This setup should allow your frontend and backend to communicate via WebSockets!
