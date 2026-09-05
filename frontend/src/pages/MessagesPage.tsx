// src/pages/MessagesPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage, type ChatMessage } from '../services/storage.service';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [folder, setFolder] = useState<'main' | 'requests' | 'spam'>('main');
  const [activeChatId, setActiveChatId] = useState<string>('c1');
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.chat.get());
  const [inputVal, setInputVal] = useState('');

  const chats = [
    { id: 'c1', name: 'Іван Мельник', subtitle: 'Шале "Карпатська Тиша" • 12-18 Грудня', time: '14:28' },
    { id: 'c2', name: 'Олена Бондаренко', subtitle: 'Дякую за прийом! Все було чудово', time: 'Вчора' },
    { id: 'c3', name: 'Служба турботи Trails UA', subtitle: 'Ваш акаунт успішно верифіковано', time: '2 дні тому' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const updated = storage.chat.send({
      senderName: user?.firstName || 'Ви',
      text: inputVal.trim(),
      isHost: false,
    });
    setMessages(updated);
    setInputVal('');
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '30px auto', padding: '0 24px 80px 24px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#291C0E', marginBottom: '20px' }}>
        💬 Повідомлення
      </h1>

      <div style={messengerContainerStyle}>
        {/* ЛЕВАЯ ПАНЕЛЬ ДИАЛОГОВ */}
        <div style={chatSidebarStyle}>
          <div style={folderNavStyle}>
            <button style={folder === 'main' ? activeFolderBtnStyle : folderBtnStyle} onClick={() => setFolder('main')}>
              Вхідні (3)
            </button>
            <button style={folder === 'requests' ? activeFolderBtnStyle : folderBtnStyle} onClick={() => setFolder('requests')}>
              Запити (1)
            </button>
            <button style={folder === 'spam' ? activeFolderBtnStyle : folderBtnStyle} onClick={() => setFolder('spam')}>
              СПАМ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {chats.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                style={{
                  ...chatCardItemStyle,
                  backgroundColor: activeChatId === c.id ? '#F4ECE4' : '#FFFFFF',
                }}
              >
                <div style={avatarPlaceholderStyle}>{c.name.charAt(0)}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '14px', color: '#291C0E' }}>{c.name}</strong>
                    <span style={{ fontSize: '11px', color: '#A78D78' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6E473B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ ЧАТА */}
        <div style={chatAreaStyle}>
          <div style={chatHeaderStyle}>
            <div>
              <strong style={{ fontSize: '16px', color: '#291C0E' }}>Іван Мельник</strong>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>● Онлайн</div>
            </div>
            <span style={{ fontSize: '12px', color: '#6E473B', backgroundColor: '#F4ECE4', padding: '4px 10px', borderRadius: '8px' }}>
              Бронювання: Шале 'Карпатська Тиша'
            </span>
          </div>

          <div style={messagesScrollAreaStyle}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.isHost ? 'flex-end' : 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    ...messageBubbleStyle,
                    backgroundColor: m.isHost ? '#DC9666' : '#FFFFFF',
                    color: m.isHost ? '#FFFFFF' : '#291C0E',
                    border: m.isHost ? 'none' : '1px solid #E1D4C2',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{m.text}</p>
                </div>
                <span style={{ fontSize: '11px', color: '#A78D78', marginTop: '3px' }}>{m.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={inputFormStyle}>
            <input
              type="text"
              placeholder="Напишіть ваше повідомлення..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={chatInputFieldStyle}
            />
            <button type="submit" style={sendBtnStyle}>
              Надіслати ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const messengerContainerStyle: React.CSSProperties = { display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E1D4C2', overflow: 'hidden', height: '620px', boxShadow: '0 6px 24px rgba(41,28,14,0.06)' };
const chatSidebarStyle: React.CSSProperties = { width: '340px', borderRight: '1px solid #E1D4C2', display: 'flex', flexDirection: 'column' };
const folderNavStyle: React.CSSProperties = { display: 'flex', borderBottom: '1px solid #E1D4C2', padding: '8px' };
const folderBtnStyle: React.CSSProperties = { flex: 1, padding: '8px 4px', border: 'none', background: 'none', fontSize: '12px', fontWeight: 600, color: '#6E473B', cursor: 'pointer', borderRadius: '8px' };
const activeFolderBtnStyle: React.CSSProperties = { ...folderBtnStyle, backgroundColor: '#DC9666', color: '#FFFFFF', fontWeight: 700 };
const chatCardItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #F4ECE4', cursor: 'pointer' };
const avatarPlaceholderStyle: React.CSSProperties = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6E473B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 };
const chatAreaStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FAF5EE' };
const chatHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E1D4C2' };
const messagesScrollAreaStyle: React.CSSProperties = { flex: 1, padding: '24px', overflowY: 'auto' };
const messageBubbleStyle: React.CSSProperties = { maxWidth: '70%', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };
const inputFormStyle: React.CSSProperties = { display: 'flex', gap: '10px', padding: '16px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E1D4C2' };
const chatInputFieldStyle: React.CSSProperties = { flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #BEB5A9', outline: 'none', fontSize: '14px' };
const sendBtnStyle: React.CSSProperties = { backgroundColor: '#DC9666', color: '#FFFFFF', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' };