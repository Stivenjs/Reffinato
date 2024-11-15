import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, ArrowLeft, Trash2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from "@/instances/axiosInstance";
import useAuthStore from "@/store/authStore";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export default function EnhancedFixedChatWindow({ isOpen, onClose }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showEndedAlert, setShowEndedAlert] = useState(false);
  const { user } = useAuthStore();
  const socketRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!user || !user.uid) return;
    try {
      const response = await axiosInstance("/messages");
      const fetchedMessages = response.data;

      const organizedMessages = fetchedMessages.reduce((acc, msg) => {
        const key =
          user.uid === ADMIN_UID
            ? msg.isAdmin
              ? msg.recipient
              : msg.sender
            : user.displayName;

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(msg);
        return acc;
      }, {});

      setMessages(organizedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user]);

  const initializeSocket = useCallback(() => {
    if (!user || !user.uid) return;
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      if (user.uid === ADMIN_UID) {
        newSocket.emit("admin login", ADMIN_UID);
      } else {
        newSocket.emit("user login", user.displayName);
      }
    });

    newSocket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => {
        const key =
          user.uid === ADMIN_UID
            ? msg.isAdmin
              ? msg.recipient
              : msg.sender
            : user.displayName;
        return {
          ...prevMessages,
          [key]: [...(prevMessages[key] || []), msg],
        };
      });
      if (
        user.uid === ADMIN_UID &&
        !users.includes(msg.sender) &&
        msg.sender !== ADMIN_UID
      ) {
        setUsers((prevUsers) => [...new Set([...prevUsers, msg.sender])]);
      }
    });

    newSocket.on("user list", (userList) => {
      setUsers(userList.filter((u) => u !== ADMIN_UID));
    });

    newSocket.on("conversation ended", (endedUser) => {
      if (user.uid === ADMIN_UID) {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          delete newMessages[endedUser];
          return newMessages;
        });
        setUsers((prevUsers) => prevUsers.filter((u) => u !== endedUser));
        if (selectedUser === endedUser) {
          setSelectedUser(null);
        }
      } else {
        setMessages({});
        setShowEndedAlert(true);
      }
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("chat message");
      newSocket.off("user list");
      newSocket.off("conversation ended");
      newSocket.disconnect();
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const cleanup = initializeSocket();
      return () => {
        cleanup();
        socketRef.current = null;
      };
    }
  }, [isOpen, initializeSocket, fetchMessages]);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (inputMessage && socketRef.current) {
        const messageObj = {
          sender: user.displayName,
          content: inputMessage,
          isAdmin: user.uid === ADMIN_UID,
          recipient: user.uid === ADMIN_UID ? selectedUser : ADMIN_UID,
        };

        socketRef.current.emit("chat message", messageObj, (error) => {
          if (error) {
            console.error("Error sending message:", error);
          } else {
            setInputMessage("");
            setMessages((prevMessages) => {
              const key =
                user.uid === ADMIN_UID ? selectedUser : user.displayName;
              return {
                ...prevMessages,
                [key]: [...(prevMessages[key] || []), messageObj],
              };
            });
          }
        });
      }
    },
    [inputMessage, user, selectedUser]
  );

  const endConversation = useCallback(() => {
    if (socketRef.current && selectedUser) {
      socketRef.current.emit("end conversation", selectedUser, (error) => {
        if (error) {
          console.error("Error ending conversation:", error);
        } else {
          setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            delete newMessages[selectedUser];
            return newMessages;
          });
          setUsers((prevUsers) => prevUsers.filter((u) => u !== selectedUser));
          setSelectedUser(null);
        }
      });
    }
  }, [selectedUser]);

  const renderUserList = () => (
    <div className="grid grid-cols-1 gap-2">
      {users.map((username) => (
        <Button
          key={username}
          onClick={() => setSelectedUser(username)}
          variant="outline"
          className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {username[0].toUpperCase()}
            </div>
            <span className="ml-2 truncate">{username}</span>
          </div>
        </Button>
      ))}
    </div>
  );

  const renderMessages = () => {
    const messagesToRender =
      user.uid === ADMIN_UID
        ? selectedUser
          ? messages[selectedUser] || []
          : []
        : messages[user.displayName] || [];

    return messagesToRender.map((msg, index) => (
      <div
        key={index}
        className={`mb-2 ${
          msg.sender === user.displayName ? "text-right" : "text-left"
        }`}
      >
        <span
          className={`inline-block p-2 rounded-lg ${
            msg.sender === user.displayName
              ? "bg-[#a0501a] text-white"
              : "bg-gray-200"
          }`}
        >
          <strong>{msg.sender}:</strong> {msg.content}
        </span>
      </div>
    ));
  };

  if (!isOpen || !user || !user.uid) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col overflow-hidden z-50 shadow-lg">
      <CardHeader className="p-4 flex-shrink-0 flex justify-between items-center bg-gray-100 relative">
        <div className="p-4">
          <CardTitle className="text-sm font-medium text-gray-900 flex items-center">
            {user.uid === ADMIN_UID ? (
              selectedUser ? (
                <>Chat with {selectedUser} </>
              ) : (
                "User List - Select a user to start chatting"
              )
            ) : (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Live Support Chat - An agent is available to assist you
              </>
            )}
          </CardTitle>
        </div>
        {user.uid === ADMIN_UID && selectedUser && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedUser(null)}
            aria-label="Back to user list"
            className="text-gray-500 absolute top-1 left-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center space-x-2 absolute top-1 right-1">
          {user.uid === ADMIN_UID && selectedUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={endConversation}
              aria-label="End conversation"
              className="text-gray-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close chat"
            className="text-gray-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-2">
        {showEndedAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Conversation Ended</AlertTitle>
            <AlertDescription>
              The administrator has closed this conversation. If you need
              further assistance, please start a new conversation.
            </AlertDescription>
          </Alert>
        )}
        {user.uid === ADMIN_UID && !selectedUser
          ? renderUserList()
          : renderMessages()}
      </CardContent>
      {(user.uid !== ADMIN_UID || selectedUser) && !showEndedAlert && (
        <CardFooter className="flex-shrink-0 p-2 bg-gray-50">
          <form onSubmit={sendMessage} className="flex w-full gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button
              variant="ghost"
              type="submit"
              size="sm"
              className="text-black"
            >
              <Send />
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
