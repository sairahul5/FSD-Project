import { useEffect, useState } from 'react'
import { listChatMessages, sendChatMessage } from '../api/chats'
import { getUser } from '../api/session'
import './Chat.css'

function Chat() {
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUser] = useState(() => getUser())

  const loadMessages = async () => {
    // Only attempt to load if user is admin to avoid 403 errors
    if (currentUser?.role === 'ADMIN') {
        try {
            const data = await listChatMessages()
            setMessages(data)
            setIsAdmin(true)
        } catch (error) {
            console.log("Could not load messages", error);
            setIsAdmin(false);
        }
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!content.trim()) {
      setStatus('Enter a message')
      return
    }
    setStatus('Sending message...')
    try {
      await sendChatMessage({
        username: currentUser?.email || 'Anonymous', // Keeping payload for backward compat, though ignored by secure backend
        content: content.trim(),
      })
      setContent('')
      setStatus('Message sent')
      if (isAdmin) {
          loadMessages()
      }
    } catch (error) {
      setStatus(error.message || 'Failed to send message')
    }
  }

  return (
    <main className="chat">
      <section className="app__section chat__header">
        <div>
          <h1 className="app__title">Chat Support</h1>
          <p className="app__subtitle">Send us a message.</p>
        </div>
      </section>

      <section className="app__section chat__body">
        <div className="chat__panel app__panel">
          {isAdmin && (
            <div className="chat__messages">
                {messages.length === 0 ? (
                <p className="chat__empty">No messages yet.</p>
                ) : (
                messages.map((message) => (
                    <div className="chat__bubble" key={message.id}>
                    <div className="chat__meta">
                        <span>{message.username}</span>
                        <span>{message.sentAt ? message.sentAt.slice(0, 10) : ''}</span>
                    </div>
                    <p>{message.content}</p>
                    </div>
                ))
                )}
            </div>
          )}
          
          <form className="chat__form" onSubmit={handleSend}>
            {/* Username input removed - handled by session now */}
            <textarea
              className="app__textarea"
              rows="3"
              placeholder="Write a message"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <button className="app__button" type="submit">Send</button>
          </form>
          {status ? <p className="chat__status">{status}</p> : null}
        </div>
      </section>
    </main>
  )
 }

 export default Chat
