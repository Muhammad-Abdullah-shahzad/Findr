// src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

const ChatComponent = ({ conversation, currentUserId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches your backend

    useEffect(() => {
        if (!conversation?.conversationId || !currentUserId) return;

        const fetchMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/chat/messages?conversationId=${conversation.conversationId}&uID=${currentUserId}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                setError(`Error loading messages: ${err.message}`);
                console.error("Fetch messages error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Polling for new messages (adjust interval as needed)
        const pollingInterval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(pollingInterval);

    }, [conversation, currentUserId]); // Re-fetch when conversation or user changes

    useEffect(() => {
        // Scroll to the bottom of the chat when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation?.conversationId || !currentUserId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: conversation.conversationId,
                    senderId: currentUserId,
                    message: newMessage,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to send message');
            }

            // Optimistically update UI
            const sentMessage = {
                id: Date.now(), // Temp ID for UI
                senderId: currentUserId,
                firstName: conversation.user1Id === currentUserId ? conversation.user1FirstName : conversation.user2FirstName,
                lastName: conversation.user1Id === currentUserId ? conversation.user1LastName : conversation.user2LastName,
                message: newMessage,
                createdAt: new Date().toISOString(),
            };
            setMessages(prevMessages => [...prevMessages, sentMessage]);
            setNewMessage('');

        } catch (err) {
            setError(`Error sending message: ${err.message}`);
            console.error("Send message error:", err);
            // Optionally, show a toast or alert to the user
        }
    };

    const getSenderName = (senderId) => {
        if (senderId === currentUserId) return "You";
        if (senderId === conversation.user1Id) return `${conversation.user1FirstName} ${conversation.user1LastName}`;
        if (senderId === conversation.user2Id) return `${conversation.user2FirstName} ${conversation.user2LastName}`;
        return "Unknown User";
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
            <div style={chatStyles.loadingSpinner}>
                <span className="spinner" style={{ marginRight: '0.5rem', border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #4F46E5', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></span>
                Loading chat...
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return <div style={{ ...chatStyles.noDataMessage, color: '#ef4444' }}>{error}</div>;
    }

    if (!conversation) {
        return <div style={chatStyles.noDataMessage}>No chat selected.</div>;
    }

    const otherParticipantName =
        conversation.user1Id === currentUserId
            ? `${conversation.user2FirstName} ${conversation.user2LastName}`
            : `${conversation.user1FirstName} ${conversation.user1LastName}`;

    return (
        <div style={chatStyles.container}>
            <div style={chatStyles.header}>
                <button onClick={onBack} style={chatStyles.backButton}>
                    <ArrowLeft size={20} /> Back to Chats
                </button>
                <h3 style={chatStyles.headerTitle}>Chat with {otherParticipantName}</h3>
            </div>

            <div style={chatStyles.messagesContainer}>
                {messages.length === 0 ? (
                    <p style={chatStyles.noDataMessage}>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                ...chatStyles.messageBubble,
                                ...(msg.senderId === currentUserId ? chatStyles.myMessage : chatStyles.otherMessage),
                            }}
                        >
                            <div style={chatStyles.messageSender}>
                                {getSenderName(msg.senderId)}
                            </div>
                            <div>{msg.message}</div>
                            <div style={chatStyles.messageTime}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Scroll target */}
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
                    <Send size={18} /> Send
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;