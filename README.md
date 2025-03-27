# Peer-to-Peer Chat and File Sharing Application

A serverless peer-to-peer chat and file-sharing web application using WebRTC and PeerJS for direct communication between users.

## Features

- **Peer-to-Peer Communication**: Direct communication between users without a central server using WebRTC
- **Firebase Authentication**: Secure user authentication
- **Real-time Messaging**: Instant message delivery
- **File Sharing**: Send and receive files directly between peers
- **Contact Management**: Add, accept, and reject connection requests
- **Responsive Design**: Works on both desktop and mobile devices
- **Glass Morphism UI**: Beautiful, modern interface with blur effects

## Pages

1. **Login/Signup Pages**: User authentication (existing pages)
2. **Connections Page**: Manage contacts and connection requests
3. **Chat Page**: Real-time messaging and file sharing with a selected contact

## Technologies Used

- **HTML5, CSS3, JavaScript**: Core web technologies
- **WebRTC**: Web Real-Time Communication for peer-to-peer connections
- **PeerJS**: Simplified WebRTC implementation
- **Firebase Authentication**: User authentication
- **Firebase Realtime Database**: Store user data, contacts, and connection requests

## How It Works

1. **Authentication**: Users log in using the existing authentication system
2. **Peer Connection**: Each user's username serves as their Peer ID for WebRTC connections
3. **Contact Management**: Users can send connection requests to other users by their Peer ID
4. **Messaging**: Once connected, users can send text messages directly to each other
5. **File Sharing**: Users can also share files directly with each other

## File Structure

- **Chat Page/**
  - `chat.html`: Chat interface
  - `chat.css`: Styles for the chat page
  - `chat.js`: Chat functionality and WebRTC implementation
  
- **Conncetions Page/**
  - `connections.html`: Contacts management interface
  - `connections.css`: Styles for the connections page
  - `connections.js`: Contact management functionality

- **Login page/** (Existing)
  - Authentication files
  - Firebase configuration

## Usage

1. Open the application and log in using the existing authentication system
2. You'll be redirected to the Connections Page
3. Add contacts by entering their Peer ID (username)
4. Accept incoming connection requests
5. Click on a contact to start chatting
6. Send messages and files directly to your contact

## Security

- All communication is peer-to-peer and encrypted by WebRTC
- No messages or files are stored on any server
- Firebase is only used for authentication and storing contact relationships