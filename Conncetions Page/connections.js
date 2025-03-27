// Initialize variables
let currentUser = null;
let currentPeer = null;
let contacts = [];
let connectionRequests = [];

// DOM Elements
const currentUsernameEl = document.getElementById('currentUsername');
const peerIdEl = document.getElementById('peerId');
const profileUsernameEl = document.getElementById('profileUsername');
const profilePeerIdEl = document.getElementById('profilePeerId');
const contactsListEl = document.getElementById('contactsList');
const requestsListEl = document.getElementById('requestsList');
const addContactForm = document.getElementById('addContactForm');
const contactPeerIdInput = document.getElementById('contactPeerId');
const logoutBtn = document.getElementById('logoutBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Show loading screen when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.Loader) {
        Loader.show();
    }

    // Check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            initializeApp();
        } else {
            // No user is signed in, redirect to login page
            window.location.href = '../Login page/login.html';
        }
    });
});

// Initialize the application
function initializeApp() {
    // Get current user's username from Firebase
    const userRef = firebase.database().ref(`users/${currentUser.uid}`);
    userRef.once('value').then((snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.username) {
            // Update UI with username
            currentUsernameEl.textContent = userData.username;
            profileUsernameEl.textContent = userData.username;
            
            // Initialize PeerJS with the username as the peer ID
            initializePeer(userData.username);
        } else {
            // If username is not found, create one using the email
            const username = currentUser.email.split('@')[0];
            userRef.set({
                username: username,
                email: currentUser.email
            }).then(() => {
                currentUsernameEl.textContent = username;
                profileUsernameEl.textContent = username;
                initializePeer(username);
            });
        }
    }).catch((error) => {
        console.error("Error getting user data:", error);
        // Use email as fallback
        const username = currentUser.email.split('@')[0];
        currentUsernameEl.textContent = username;
        profileUsernameEl.textContent = username;
        initializePeer(username);
    });

    // Set up event listeners
    setupEventListeners();

    // Load contacts and connection requests
    loadContacts();
    loadConnectionRequests();

    // Hide loading screen
    if (window.Loader) {
        Loader.hide();
    }
}

// Initialize PeerJS with fallback options
function initializePeer(username) {
    // Define server options with fallbacks
    const serverOptions = [
        {
            // Default PeerJS cloud server
            host: '0.peerjs.com',
            secure: true,
            port: 443
        },
        {
            // Backup server option
            host: 'peerjs-server.herokuapp.com',
            secure: true,
            port: 443
        },
        {
            // Last fallback - use local discovery only
            // This will work if both peers are on the same network
        }
    ];

    // STUN/TURN server configuration
    const iceServers = {
        'iceServers': [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
            }
        ]
    };

    // If there's an existing peer, clean it up properly
    if (currentPeer) {
        try {
            currentPeer.destroy();
        } catch (e) {
            console.log('Error destroying previous peer:', e);
        }
        currentPeer = null;
    }

    // Try to connect with the first server option
    tryConnectWithServer(username, 0);

    function tryConnectWithServer(username, serverIndex) {
        // If we've tried all server options, show error
        if (serverIndex >= serverOptions.length) {
            showNotification('Failed to connect to any PeerJS server. Please try again later.', 'error');
            return;
        }

        const options = {
            debug: 2,
            config: iceServers
        };

        // Add server options if not using the last fallback
        if (serverOptions[serverIndex].host) {
            options.host = serverOptions[serverIndex].host;
            options.secure = serverOptions[serverIndex].secure;
            options.port = serverOptions[serverIndex].port;
        }

        console.log(`Trying PeerJS server option ${serverIndex + 1}/${serverOptions.length}`);

        try {
            // Create a new Peer with the username as the ID
            currentPeer = new Peer(username, options);

            // Update UI with peer ID
            peerIdEl.textContent = `Peer ID: ${username}`;
            profilePeerIdEl.textContent = `Peer ID: ${username}`;

            // Set connection timeout
            const connectionTimeout = setTimeout(() => {
                if (currentPeer && !currentPeer.open) {
                    console.log(`Connection to server option ${serverIndex + 1} timed out, trying next option...`);
                    const tempPeer = currentPeer;
                    currentPeer = null;
                    try {
                        tempPeer.destroy();
                    } catch (e) {
                        console.log('Error destroying peer on timeout:', e);
                    }
                    tryConnectWithServer(username, serverIndex + 1);
                }
            }, 10000); // 10 second timeout

            // Handle peer events
            currentPeer.on('open', (id) => {
                clearTimeout(connectionTimeout);
                console.log('My peer ID is: ' + id);
                showNotification('Connected to PeerJS server', 'success');
            });

            currentPeer.on('disconnected', () => {
                console.log('Disconnected from PeerJS server, attempting to reconnect...');
                showNotification('Disconnected from server. Reconnecting...', 'info');

                // Try to reconnect to the server
                if (currentPeer) {
                    try {
                        currentPeer.reconnect();
                    } catch (e) {
                        console.error('Error during reconnect:', e);
                    }
                }

                // If reconnection fails after some time, create a new peer
                setTimeout(() => {
                    if (currentPeer && !currentPeer.open) {
                        console.log('Reconnection failed, creating new peer...');
                        const tempPeer = currentPeer;
                        currentPeer = null;
                        try {
                            tempPeer.destroy();
                        } catch (e) {
                            console.log('Error destroying peer on reconnection failure:', e);
                        }
                        initializePeer(username);
                    }
                }, 5000);
            });

            currentPeer.on('close', () => {
                console.log('PeerJS connection closed');

                // Create a new peer after a delay
                setTimeout(() => {
                    if (!currentPeer || !currentPeer.open) {
                        initializePeer(username);
                    }
                }, 5000);
            });

            currentPeer.on('error', (err) => {
                clearTimeout(connectionTimeout);
                console.error('Peer error:', err);

                if (err.type === 'server-error' || err.type === 'network' || err.type === 'socket-error' ||
                    err.type === 'unavailable-id' || err.message && err.message.includes('disconnect')) {
                    console.log(`Error with server option ${serverIndex + 1}, trying next option...`);
                    const tempPeer = currentPeer;
                    currentPeer = null;
                    try {
                        tempPeer.destroy();
                    } catch (e) {
                        console.log('Error destroying peer on error:', e);
                    }
                    tryConnectWithServer(username, serverIndex + 1);
                } else {
                    // Show a more user-friendly error message
                    let errorMessage = 'Connection error';
                    if (err.type === 'peer-unavailable') {
                        errorMessage = 'The contact is offline or unavailable';
                    } else if (err.type === 'network') {
                        errorMessage = 'Network connection issue. Please check your internet connection';
                    } else if (err.type === 'server-error') {
                        errorMessage = 'PeerJS server error. Please try again later';
                    } else if (err.type) {
                        errorMessage = `Connection error: ${err.type}`;
                    }

                    showNotification(errorMessage, 'error');
                }
            });

            currentPeer.on('connection', (conn) => {
                // Handle incoming connection
                conn.on('open', () => {
                    // Check if this is a new connection request
                    const contactExists = contacts.some(contact => contact.peerId === conn.peer);
                    const requestExists = connectionRequests.some(request => request.peerId === conn.peer);
                    
                    if (!contactExists && !requestExists) {
                        // Get the username of the peer
                        getUsernameByPeerId(conn.peer).then(username => {
                            // Add to connection requests
                            addConnectionRequest({
                                peerId: conn.peer,
                                username: username || conn.peer
                            });
                        });
                    }
                    
                    // Close the connection as we don't need it yet
                    // It will be reopened when the user accepts the request or starts a chat
                    conn.close();
                });
            });
        } catch (error) {
            console.error('Error creating Peer:', error);
            showNotification(`Error creating peer connection: ${error.message}`, 'error');
            
            // Try next server option
            setTimeout(() => {
                tryConnectWithServer(username, serverIndex + 1);
            }, 1000);
        }
    }
}

// Load contacts from Firebase
function loadContacts() {
    const contactsRef = firebase.database().ref(`contacts/${currentUser.uid}`);
    contactsRef.on('value', (snapshot) => {
        contacts = [];
        contactsListEl.innerHTML = '';
        
        const contactsData = snapshot.val();
        if (contactsData) {
            Object.keys(contactsData).forEach(key => {
                const contact = contactsData[key];
                contacts.push(contact);
                
                // Add contact to UI
                addContactToUI(contact);
            });
        }
        
        // Show empty state if no contacts
        if (contacts.length === 0) {
            contactsListEl.innerHTML = `
                <div class="empty-state">
                    <p>No contacts yet. Add a contact to start chatting!</p>
                </div>
            `;
        }
    });
}

// Load connection requests from Firebase
function loadConnectionRequests() {
    const requestsRef = firebase.database().ref(`requests/${currentUser.uid}`);
    requestsRef.on('value', (snapshot) => {
        connectionRequests = [];
        requestsListEl.innerHTML = '';
        
        const requestsData = snapshot.val();
        if (requestsData) {
            Object.keys(requestsData).forEach(key => {
                const request = requestsData[key];
                connectionRequests.push(request);
                
                // Add request to UI
                addRequestToUI(request);
            });
        }
        
        // Show empty state if no requests
        if (connectionRequests.length === 0) {
            requestsListEl.innerHTML = `
                <div class="empty-state">
                    <p>No pending requests.</p>
                </div>
            `;
        }
        
        // Update tab badge
        updateRequestsTabBadge();
    });
}

// Add a contact to the UI
function addContactToUI(contact) {
    const contactEl = document.createElement('div');
    contactEl.className = 'contact-card';
    contactEl.dataset.peerId = contact.peerId;
    
    contactEl.innerHTML = `
        <div class="contact-info">
            <h4>${contact.username || contact.peerId}</h4>
            <p class="peer-id">Peer ID: ${contact.peerId}</p>
        </div>
        <div class="contact-actions">
            <button class="btn btn-chat" data-peer-id="${contact.peerId}" data-username="${contact.username || contact.peerId}">Chat</button>
        </div>
    `;
    
    // Add event listener to chat button
    const chatBtn = contactEl.querySelector('.btn-chat');
    chatBtn.addEventListener('click', () => {
        // Navigate to chat page with peer ID
        window.location.href = `../Chat Page/chat.html?peerId=${contact.peerId}&username=${contact.username || contact.peerId}`;
    });
    
    contactsListEl.appendChild(contactEl);
}

// Add a connection request to the UI
function addRequestToUI(request) {
    const requestEl = document.createElement('div');
    requestEl.className = 'request-card';
    requestEl.dataset.peerId = request.peerId;
    
    requestEl.innerHTML = `
        <div class="request-info">
            <h4>${request.username || request.peerId}</h4>
            <p class="peer-id">Peer ID: ${request.peerId}</p>
        </div>
        <div class="request-actions">
            <button class="btn btn-accept" data-peer-id="${request.peerId}">Accept</button>
            <button class="btn btn-reject" data-peer-id="${request.peerId}">Reject</button>
        </div>
    `;
    
    // Add event listeners to buttons
    const acceptBtn = requestEl.querySelector('.btn-accept');
    acceptBtn.addEventListener('click', () => {
        acceptConnectionRequest(request);
    });
    
    const rejectBtn = requestEl.querySelector('.btn-reject');
    rejectBtn.addEventListener('click', () => {
        rejectConnectionRequest(request);
    });
    
    requestsListEl.appendChild(requestEl);
}

// Add a new connection request
function addConnectionRequest(request) {
    // Check if request already exists
    const requestExists = connectionRequests.some(r => r.peerId === request.peerId);
    if (requestExists) return;
    
    // Add to Firebase
    const requestsRef = firebase.database().ref(`requests/${currentUser.uid}`);
    const newRequestRef = requestsRef.push();
    newRequestRef.set({
        peerId: request.peerId,
        username: request.username,
        timestamp: Date.now()
    });
    
    // Show notification
    showNotification(`New connection request from ${request.username || request.peerId}`, 'info');
}

// Accept a connection request
function acceptConnectionRequest(request) {
    // Add to contacts
    const contactsRef = firebase.database().ref(`contacts/${currentUser.uid}`);
    const newContactRef = contactsRef.push();
    newContactRef.set({
        peerId: request.peerId,
        username: request.username,
        timestamp: Date.now()
    });
    
    // Add current user to the other user's contacts
    getUsernameByUserId(currentUser.uid).then(username => {
        // Get the user ID of the peer
        getUserIdByPeerId(request.peerId).then(userId => {
            if (userId) {
                const otherContactsRef = firebase.database().ref(`contacts/${userId}`);
                const newOtherContactRef = otherContactsRef.push();
                newOtherContactRef.set({
                    peerId: currentPeer.id,
                    username: username,
                    timestamp: Date.now()
                });
            }
        });
    });
    
    // Remove from requests
    removeConnectionRequest(request);
    
    // Show notification
    showNotification(`Connection request from ${request.username || request.peerId} accepted`, 'success');
}

// Reject a connection request
function rejectConnectionRequest(request) {
    // Remove from requests
    removeConnectionRequest(request);
    
    // Show notification
    showNotification(`Connection request from ${request.username || request.peerId} rejected`, 'info');
}

// Remove a connection request
function removeConnectionRequest(request) {
    const requestsRef = firebase.database().ref(`requests/${currentUser.uid}`);
    requestsRef.once('value', (snapshot) => {
        const requestsData = snapshot.val();
        if (requestsData) {
            Object.keys(requestsData).forEach(key => {
                if (requestsData[key].peerId === request.peerId) {
                    requestsRef.child(key).remove();
                }
            });
        }
    });
}

// Send a connection request
function sendConnectionRequest(peerId) {
    // Check if already a contact
    const contactExists = contacts.some(contact => contact.peerId === peerId);
    if (contactExists) {
        showNotification('This user is already in your contacts', 'error');
        return;
    }
    
    // Check if request already sent
    const requestExists = connectionRequests.some(request => request.peerId === peerId);
    if (requestExists) {
        showNotification('Connection request already sent to this user', 'error');
        return;
    }
    
    // Check if peer ID is valid
    if (peerId === currentPeer.id) {
        showNotification('You cannot add yourself as a contact', 'error');
        return;
    }
    
    // Get the user ID of the peer
    getUserIdByPeerId(peerId).then(userId => {
        if (userId) {
            // Get current user's username
            getUsernameByUserId(currentUser.uid).then(username => {
                // Add request to the other user's requests
                const otherRequestsRef = firebase.database().ref(`requests/${userId}`);
                const newRequestRef = otherRequestsRef.push();
                newRequestRef.set({
                    peerId: currentPeer.id,
                    username: username,
                    timestamp: Date.now()
                });
                
                // Show notification
                showNotification(`Connection request sent to ${peerId}`, 'success');
            });
        } else {
            showNotification('User not found. Check the Peer ID and try again.', 'error');
        }
    });
}

// Get username by user ID
function getUsernameByUserId(userId) {
    return new Promise((resolve, reject) => {
        const userRef = firebase.database().ref(`users/${userId}`);
        userRef.once('value').then((snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.username) {
                resolve(userData.username);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}

// Get user ID by peer ID (username)
function getUserIdByPeerId(peerId) {
    return new Promise((resolve, reject) => {
        const usersRef = firebase.database().ref('users');
        usersRef.orderByChild('username').equalTo(peerId).once('value').then((snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                // Get the first user ID
                const userId = Object.keys(usersData)[0];
                resolve(userId);
            } else {
                resolve(null);
            }
        }).catch(reject);
    });
}

// Get username by peer ID
function getUsernameByPeerId(peerId) {
    return new Promise((resolve, reject) => {
        // In this case, the peer ID is the username
        resolve(peerId);
    });
}

// Update requests tab badge
function updateRequestsTabBadge() {
    const requestsTab = document.querySelector('.tab-btn[data-tab="requests"]');
    if (connectionRequests.length > 0) {
        requestsTab.innerHTML = `Connection Requests <span class="badge">${connectionRequests.length}</span>`;
    } else {
        requestsTab.textContent = 'Connection Requests';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notificationEl = document.createElement('div');
    notificationEl.className = `notification ${type}`;
    notificationEl.textContent = message;
    
    // Add to body
    document.body.appendChild(notificationEl);
    
    // Show notification
    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificationEl);
        }, 300);
    }, 3000);
}

// Set up event listeners
function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Add contact form
    addContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const peerId = contactPeerIdInput.value.trim();
        if (peerId) {
            sendConnectionRequest(peerId);
            contactPeerIdInput.value = '';
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
        // Show loading screen before logout
        if (window.Loader) {
            Loader.show();
        }

        // Close peer connection if exists
        if (currentPeer) {
            currentPeer.destroy();
        }

        // Clear any session storage data
        sessionStorage.clear();

        // Sign out from Firebase
        firebase.auth().signOut().then(() => {
            // Redirect to the main index page which will handle the redirection
            window.location.href = '../index.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
            if (window.Loader) {
                Loader.hide();
            }
        });
    });
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        max-width: 300px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.info {
        background-color: #17a2b8;
    }
    
    .notification.success {
        background-color: #28a745;
    }
    
    .notification.error {
        background-color: #dc3545;
    }
    
    .badge {
        display: inline-block;
        background-color: #dc3545;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 0.7rem;
        margin-left: 5px;
    }
`;
document.head.appendChild(notificationStyles);

// Periodically check PeerJS connection status
function startPeerConnectionMonitoring() {
    const CHECK_INTERVAL = 30000; // 30 seconds
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    setInterval(() => {
        if (!currentPeer) {
            console.log('Connection monitoring: No peer object, initializing...');
            const username = currentUsernameEl.textContent;
            initializePeer(username);
            reconnectAttempts = 0;
            return;
        }

        if (!currentPeer.open) {
            console.log('PeerJS connection lost, attempting to reconnect...');
            reconnectAttempts++;

            if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
                // Try to reconnect to the server
                try {
                    showNotification(`Reconnecting to server (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`, 'info');
                    currentPeer.reconnect();
                } catch (e) {
                    console.error('Error during reconnect:', e);
                }
            } else {
                // If we've tried reconnecting multiple times, recreate the peer
                console.log('Max reconnect attempts reached, reinitializing peer...');
                showNotification('Reinitializing connection...', 'info');
                const username = currentUsernameEl.textContent;
                const tempPeer = currentPeer;
                currentPeer = null;
                try {
                    tempPeer.destroy();
                } catch (e) {
                    console.log('Error destroying peer during monitoring:', e);
                }
                initializePeer(username);
                reconnectAttempts = 0;
            }
        } else {
            // Connection is open, reset reconnect attempts
            reconnectAttempts = 0;
        }
    }, CHECK_INTERVAL);
}

// Start connection monitoring when the app initializes
document.addEventListener('DOMContentLoaded', () => {
    startPeerConnectionMonitoring();
});

// Clean up when leaving the page
window.addEventListener('beforeunload', () => {
    if (currentPeer) {
        currentPeer.destroy();
    }
});
