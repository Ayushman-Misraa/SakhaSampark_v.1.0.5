# Serverless Chat and File-Sharing Web App

This is a serverless chat and file-sharing web application built using HTML, CSS, and JavaScript. It uses WebRTC and PeerJS for peer-to-peer communication and Firebase Authentication for user login.

## Features

### Authentication
- Reuses the existing Firebase Authentication system
- Usernames are used as Peer IDs for WebRTC connections
- Authenticated users are redirected to the Contacts page

### Contacts Page (contacts.html)
- Displays a list of the user's contacts
- Allows users to send connection requests to other users
- Displays pending connection requests with accept/reject options
- Stores accepted contacts in Firebase Realtime Database
- Updates the contact list dynamically

### Chat Page (chat.html)
- Enables real-time messaging between users using WebRTC
- Supports file sharing without a server
- Displays incoming files with download options
- Uses a responsive design that works on mobile devices
- Shows connection status

## Implementation Details

### Technologies Used
- HTML5, CSS3, and JavaScript
- WebRTC for peer-to-peer communication
- PeerJS library to simplify WebRTC implementation
- Firebase Authentication for user management
- Firebase Realtime Database for storing contacts

### File Structure
- `contacts.html`: The contacts page with user list and request management
- `chat.html`: The chat interface with messaging and file sharing
- `Assets/bg.jpg`: Background image for the chat and contacts pages

### How It Works
1. Users log in using the existing authentication system
2. After login, users are redirected to the contacts page
3. Users can add contacts by username
4. When a contact request is accepted, both users can chat with each other
5. In the chat, users can send text messages and files directly to each other
6. All communication happens peer-to-peer without going through a server

## Setup Instructions

1. Make sure to add a background image file named `bg.jpg` to the Assets folder
2. No additional setup is required as the app uses the existing Firebase configuration

## Mobile Responsiveness

The application is designed to be fully responsive and works well on mobile devices:
- Flexible layouts that adapt to different screen sizes
- Touch-friendly buttons and controls
- Appropriate font sizes for readability on small screens