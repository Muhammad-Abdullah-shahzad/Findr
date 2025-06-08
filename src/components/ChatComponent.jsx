// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

const ChatComponent = ({ otherUser, currentUserId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend

    async function fetchMessages() {
        setLoading(true);
        setError(null);
        console.log("ChatComponent: fetchMessages called.", { currentUserId, otherUser });
        if (!currentUserId || !otherUser?.userid) {
            console.warn("ChatComponent: Skipping fetchMessages due to missing currentUserId or otherUser.userid");
            setLoading(false);
            return;
        }

        try {
            console.log(`ChatComponent: Fetching messages for sender ${currentUserId} and receiver ${otherUser.userid}`);
            const response = await fetch(`${API_BASE_URL}/api/chat/messages?senderId=${currentUserId}&receiverId=${otherUser.userid}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch messages');
            }
            const data = await response.json();
            console.log("ChatComponent: Fetched messages data:", data);
            setMessages(data);
            console.log("ChatComponent: Messages state after fetch:", data); // Log the new state directly
        } catch (err) {
            setError(`Error loading messages: ${err.message}`);
            console.error("ChatComponent: Fetch messages error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("ChatComponent useEffect (mount/props change):", { currentUserId, otherUser });
        // Ensure both users are defined before attempting to fetch messages
        if (!currentUserId || !otherUser?.userid) {
            console.log("ChatComponent useEffect: Missing currentUserId or otherUser.userid, cannot fetch messages.", { currentUserId, otherUser });
            setLoading(false);
            return;
        }

        console.log("ChatComponent useEffect: Initial fetch and setting up polling for", { currentUserId, otherUser });

        fetchMessages();

        // Polling for new messages (adjust interval as needed)
        const pollingInterval = setInterval(() => {
            console.log("ChatComponent: Polling for new messages...");
            fetchMessages();
        }, 5000); // Poll every 5 seconds

        return () => {
            console.log("ChatComponent useEffect cleanup: Clearing polling interval.");
            clearInterval(pollingInterval);
        };

    }, [currentUserId, otherUser]); // otherUser includes userid, firstName, lastName

    useEffect(() => {
        console.log("ChatComponent useEffect (messages update): Messages updated, attempting to scroll to bottom.", messages);
        // Scroll to the bottom of the chat when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUserId || !otherUser?.userid) {
            console.warn("ChatComponent: Skipping sendMessage due to empty message or missing user IDs.", { newMessage, currentUserId, otherUser });
            return;
        }

        console.log("ChatComponent: Attempting to send message:", { senderId: currentUserId, receiverId: otherUser.userid, messageText: newMessage });

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: otherUser.userid, // The user you are sending the message to
                    messageText: newMessage,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to send message');
            }

            console.log("ChatComponent: Message sent successfully to backend. Optimistically updating UI.");
            // Optimistically update UI with the new message
            const sentMessage = {
                messageId: Date.now(), // Temp ID for UI, actual ID from DB will be fetched shortly
                senderId: currentUserId,
                receiverId: otherUser.userid,
                messageText: newMessage,
                sentAt: new Date().toISOString(),
            };
            setMessages(prevMessages => {
                console.log("ChatComponent: Previous messages state (optimistic update):", prevMessages);
                const newState = [...prevMessages, sentMessage];
                console.log("ChatComponent: New messages state (optimistic update):", newState);
                return newState;
            });
            setNewMessage('');

            // After sending, immediately re-fetch to get the confirmed message from DB, including its real ID
            // This helps with persistence on refresh and ensures receiver gets updates.
            console.log("ChatComponent: Triggering immediate fetchMessages after send.");
            fetchMessages();

        } catch (err) {
            setError(`Error sending message: ${err.message}`);
            console.error("ChatComponent: Send message error:", err);
            // Optionally, show a toast or alert to the user
        }
    };

    const getSenderName = (senderId) => {
        if (senderId === currentUserId) return "You";
        // Assuming otherUser prop has firstName and lastName
        if (senderId === otherUser?.userid) return `${otherUser.firstName} ${otherUser.lastName}`;
        return "Unknown User"; // Should not happen if logic is correct
    };

    // Style definitions (replicated from UserDashboard/AdminDashboard for consistency)
    const chatStyles = {
        container: {
            fontFamily: "'Inter', sans-serif",
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.8rem',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 4rem)', // Adjust height to fill space minus main content padding
            maxHeight: '800px', // Max height for the chat box
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e2e8f0',
            color: '#1e293b',
        },
        headerTitle: {
            fontSize: '1.5rem',
            fontWeight: '700',
            flexGrow: 1,
        },
        backButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'color 0.2s ease',
            ':hover': {
                color: '#4F46E5',
            },
        },
        messagesContainer: {
            flexGrow: 1,
            overflowY: 'auto',
            paddingRight: '1rem', // For scrollbar
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minHeight: '200px',
        },
        messageBubble: {
            maxWidth: '70%',
            padding: '0.8rem 1.2rem',
            borderRadius: '1.2rem',
            lineHeight: '1.4',
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
        myMessage: {
            alignSelf: 'flex-end',
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: 'white',
            borderBottomRightRadius: 0,
        },
        otherMessage: {
            alignSelf: 'flex-start',
            background: '#e2e8f0',
            color: '#334155',
            borderBottomLeftRadius: 0,
        },
        messageSender: {
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.2rem',
            opacity: 0.8,
        },
        messageTime: {
            fontSize: '0.75rem',
            color: '#94a3b8',
            textAlign: 'right',
            marginTop: '0.5rem',
        },
        inputContainer: {
            display: 'flex',
            gap: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
        },
        messageInput: {
            flexGrow: 1,
            padding: '0.8rem 1.2rem',
            borderRadius: '0.75rem',
            border: '1px solid #cbd5e1',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ':focus': {
                borderColor: '#4F46E5',
                boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
            },
        },
        sendButton: {
            background: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.8rem 1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
            ':hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 15px rgba(79, 70, 229, 0.3)',
                filter: 'brightness(1.1)',
            },
            ':disabled': {
                background: '#cbd5e1',
                cursor: 'not-allowed',
                boxShadow: 'none',
                transform: 'none',
                filter: 'none',
            }
        },
        // Re-use noDataMessage and loading spinner styles from dashboards
        noDataMessage: {
            color: '#64748b',
            textAlign: 'center',
            padding: '1.5rem',
            background: '#f1f5f9',
            border: '1px dashed #cbd5e1',
            borderRadius: '0.75rem',
            marginTop: '1rem',
            fontSize: '1rem',
            fontStyle: 'italic'
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            fontSize: '1.2rem',
            color: '#64748b',
        },
    };

    if (loading) {
        return (
            <div style={chatStyles.loadingSpinner}>Loading messages...</div>
        );
    }

    if (error) {
        return (
            <div style={{ ...chatStyles.noDataMessage, color: 'red' }}>Error: {error}</div>
        );
    }

    return (
        <div style={chatStyles.container}>
            <div style={chatStyles.header}>
                <button onClick={onBack} style={chatStyles.backButton}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h2 style={chatStyles.headerTitle}>Chat with {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : '...'}</h2>
            </div>
            <div style={chatStyles.messagesContainer}>
                {messages.length === 0 && (
                    <div style={chatStyles.noDataMessage}>No messages yet. Start the conversation!</div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.messageId}
                        style={{
                            ...chatStyles.messageBubble,
                            ...(msg.senderId === currentUserId ? chatStyles.myMessage : chatStyles.otherMessage),
                        }}
                    >
                        <div style={chatStyles.messageSender}>
                            {getSenderName(msg.senderId)}
                        </div>
                        <div>{msg.messageText}</div>
                        {msg.attachmentURL && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <a href={msg.attachmentURL} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
                                    View Attachment
                                </a>
                            </div>
                        )}
                        <div style={chatStyles.messageTime}>
                            {new Date(msg.sentAt).toLocaleString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} style={chatStyles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={chatStyles.messageInput}
                />
                <button type="submit" style={chatStyles.sendButton} disabled={!newMessage.trim()}>
                    <Send size={20} /> Send
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;