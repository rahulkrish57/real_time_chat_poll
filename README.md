# Real-time Polling Application with Chat Feature
__Overview__
This project is a real-time polling application that integrates a voting system and a chat feature. The application is built using Node.js, Express, and Socket.IO to facilitate real-time communication between users. It allows users to vote on various topics and engage in real-time chat, providing a dynamic and interactive experience.
## Features

### **Real-time Voting System**:

- Users can vote on various topics or options.
- Poll results are updated in real-time and broadcast to all connected users.

### **Real-time Chat Feature**:

- Users can send and receive chat messages in real-time.
- **Typing indicator** shows when a user is typing.
- Chat messages are visible to all connected users.

### **User Authentication**:

- Basic user authentication system to uniquely identify users.
- User names are associated with chat messages.

### **Interactive User Interface**:

- Attractive and user-friendly HTML interface.
- Separate sections for polling, chat, and voting buttons.

### **Data Management**:

- Server-side data structures to store poll options, chat messages, and user information.
- Real-time updates and storage of poll data and chat messages.
## Usage

1. Open the application in your browser.
2. Enter your full name, dummy email and give password to register
3. Once register you can access using same email and password
4. Create a poll.
5. Vote on the available poll options.
6. Send and receive chat messages in real-time.
7. See real-time updates of poll results and chat messages.

## Technical Implementation

### **Real-time Communication**

- **Socket.IO**: Used to implement real-time communication for both polling and chat features. Events are broadcasted to all connected clients to ensure real-time updates.

### **User Authentication**

- **Basic Authentication**: Implemented a simple user authentication system to identify users. User names are stored and associated with their chat messages.

### **Data Management**

- **In-memory Data Storage**: Poll options, chat messages, and user information are stored in react state management and browser storage. Real-time updates are managed using Socket.IO.
- **MongoDB Integration**: Persistent storage of chat history, poll history, and user data.

## Usage
### URLs

- **Frontend URL**: [https://real-time-poll-chat.onrender.com/](https://real-time-poll-chat.onrender.com)
- **API URL**: [https://chat-api-5l1t.onrender.com/api](https://chat-api-5l1t.onrender.com/api)

### Routes

1. **POST /auth/login**: Endpoint for user login.
2. **POST /auth/register**: Endpoint for user registration.
3. **GET /chat/history**: Endpoint to get chat history.
4. **GET /poll/history**: Endpoint to get poll history.

## Challenges and Solutions

- **Real-time Updates**: Ensuring real-time updates for both polling and chat features was challenging. This was addressed using Socket.IO's broadcasting capabilities.
- **User Experience**: Creating a seamless user experience required careful design and CSS styling.

## Conclusion

This real-time polling application with chat features provides an engaging platform for users to interact through voting and chatting. The use of Socket.IO and Node.js enables seamless real-time communication, making the application dynamic and responsive.

## Future Enhancements

- **Customization**: Customize the color of each user bubble in chat. Adding Edit/Delete options to both chat and poll.
- **Advanced Authentication**: Enhance the authentication system to support more secure methods, such as OAuth.
- **Scalability**: Improve the application's scalability to handle a larger number of users simultaneously.

## Contact

For any questions or support, please contact:

- **Name**: Rahulkrishnan R
- **Email**: rahulkrishdev@gmail.com
- **GitHub**: [rahulkrish57](https://github.com/rahulkrish57)

Thank you for using the Real-time Polling Application with Chat Feature!
