import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAppData } from '../../../context/AppDataContext';
import type { ChatMessage } from '../../../data/contracts';
import type { ChatDialogItem, MessageFolder } from '../../../data/mockData';
import { requestError, type BookingRecord } from '../../../services/bookings.service';

export const MenuMessagesTab: React.FC = () => {
  const { user } = useAuth();
  const { bookings, chat, mode } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeFolder, setActiveFolder] = useState<MessageFolder>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [chats, setChats] = useState<ChatDialogItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(Boolean(user));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const abort = new AbortController();
    const isHost = ['Landlord', 'Admin', 1, 3].includes(user.role);
    Promise.all([bookings.list(false, abort.signal), isHost ? bookings.list(true, abort.signal) : Promise.resolve([])])
      .then(([guestItems, hostItems]) => {
        const items = [...new Map([...guestItems, ...hostItems].map(item => [item.id, item])).values()];
        const mapped = items.map((item: BookingRecord, index): ChatDialogItem => ({
          id: item.id,
          name: item.guestId === user.id ? item.hostName : item.guestName,
          avatar: index % 2 === 0
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
          lastMessage: `${item.title} · ${item.checkIn} — ${item.checkOut}`,
          time: item.status === 'Pending' ? 'Новий запит' : item.status,
          unreadCount: item.status === 'Pending' ? 1 : undefined,
          folder: item.status === 'Pending' && item.hostId === user.id ? 'requests' : 'main',
          isOnline: false,
          statusText: `Бронювання: ${item.title}`,
        }));
        setChats(mapped);
        setSelectedChatId(current => current && mapped.some(item => item.id === current) ? current : mapped[0]?.id ?? null);
      })
      .catch(reason => { if (!abort.signal.aborted) setError(requestError(reason)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [bookings, user]);

  useEffect(() => {
    if (!selectedChatId) return;
    const abort = new AbortController();
    chat.list(selectedChatId, abort.signal)
      .then(items => { if (!abort.signal.aborted) setChatMessages(items); })
      .catch(reason => { if (!abort.signal.aborted) setError(requestError(reason)); });
    return () => abort.abort();
  }, [chat, selectedChatId]);

  const filteredChats = chats.filter((c) => {
    const matchesFolder = c.folder === activeFolder;
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  const activeChat = chats.find((c) => c.id === selectedChatId);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChatId || !messageInput.trim() || busy) return;

    const textToSend = messageInput.trim();
    setBusy(true);
    setError('');
    try {
      const sent = await chat.send(selectedChatId, textToSend);
      setChatMessages(prev => [...prev, sent]);
      setChats(prev => prev.map(item => item.id === selectedChatId ? { ...item, lastMessage: textToSend, time: 'Зараз' } : item));
      setMessageInput('');
    } catch (reason) { setError(requestError(reason)); }
    finally { setBusy(false); }
  };

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMessageInput(`📎 [Файл: ${file.name}] `);
    }
  };

  const handleAcceptRequest = async () => {
    if (!activeChat || busy) return;
    setBusy(true); setError('');
    try {
      await bookings.changeStatus(activeChat.id, 'Confirmed');
      setChats(prev => prev.map(item => item.id === activeChat.id ? { ...item, folder: 'main', time: 'Confirmed', unreadCount: undefined } : item));
      setActiveFolder('main');
    } catch (reason) { setError(requestError(reason)); }
    finally { setBusy(false); }
  };

  const handleDeclineRequest = async () => {
    if (!activeChat || busy) return;
    setBusy(true); setError('');
    try {
      await bookings.changeStatus(activeChat.id, 'Declined');
      setChats(prev => prev.filter(item => item.id !== activeChat.id));
      setSelectedChatId(null);
    } catch (reason) { setError(requestError(reason)); }
    finally { setBusy(false); }
  };

  const handleUnblockUser = () => {
    if (!activeChat) return;
    alert(`Користувача ${activeChat.name} розблоковано!`);
    setChats((prev) =>
      prev.map((c) => (c.id === activeChat.id ? { ...c, folder: 'main', isBlocked: false } : c))
    );
    setActiveFolder('main');
  };

  if (!user) return <p><a href="/login">Увійдіть</a>, щоб переглянути повідомлення.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.chatListSidebar}>
        <h1 style={styles.headerTitleAlegreya}>Повідомлення</h1>
        {mode === 'demo' && <div style={styles.modeNotice}>Демонстраційна переписка зберігається лише у вашому браузері.</div>}
        {loading && <div style={styles.modeNotice}>Завантаження діалогів…</div>}
        {error && <div role="alert" style={styles.errorNotice}>{error}</div>}

        <div style={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Пошук серед чатів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.folderTabsRow}>
          {(['main', 'requests', 'spam', 'blacklist'] as const).map((folderKey) => {
            const labels: Record<MessageFolder, string> = {
              main: 'Основні',
              requests: 'Запити',
              spam: 'Спам',
              blacklist: 'Чорний список',
            };
            const isActiveTab = activeFolder === folderKey;
            return (
              <button
                key={folderKey}
                type="button"
                onClick={() => {
                  setActiveFolder(folderKey);
                  setSelectedChatId(null);
                }}
                style={isActiveTab ? styles.folderTabActive : styles.folderTabDefault}
              >
                {labels[folderKey]}
              </button>
            );
          })}
        </div>

        <div style={styles.dialogsListStack}>
          {filteredChats.length === 0 ? (
            <div style={styles.noChatsMessage}>Немає повідомлень у цій категорії</div>
          ) : (
            filteredChats.map((item) => {
              const isSelected = item.id === selectedChatId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedChatId(item.id)}
                  style={{
                    ...styles.chatCardItem,
                    backgroundColor: isSelected ? '#DC9666' : '#FFFFFF',
                    border: isSelected ? '1.5px solid #DC9666' : '1.5px solid #D7C7B1',
                  }}
                >
                  <img src={item.avatar} alt={item.name} style={styles.chatAvatar44} />

                  <div style={styles.chatCardContentCol}>
                    <div style={styles.chatCardNameTimeRow}>
                      <span style={{ ...styles.chatCardName, color: isSelected ? '#FFFFFF' : '#291C0E' }}>
                        {item.name}
                      </span>
                      <span style={{ ...styles.chatCardTime, color: isSelected ? 'rgba(255,255,255,0.85)' : '#A78D78' }}>
                        {item.time}
                      </span>
                    </div>

                    <div style={{ ...styles.chatCardSnippet, color: isSelected ? 'rgba(255,255,255,0.95)' : '#A78D78' }}>
                      {item.lastMessage}
                    </div>
                  </div>

                  {item.unreadCount && (
                    <div style={isSelected ? styles.unreadBadgeWhite : styles.unreadBadgePill}>
                      {item.unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={styles.rightChatWindow}>
        {activeChat ? (
          <div style={styles.activeChatContainer}>
            <div style={styles.chatWindowHeader}>
              <div style={styles.headerUserBlock}>
                <img src={activeChat.avatar} alt={activeChat.name} style={styles.avatarImg48} />
                <div style={styles.headerUserTextCol}>
                  <span style={styles.chatHeaderUserName}>{activeChat.name}</span>
                  <div style={styles.chatHeaderStatusRow}>
                    <div
                      style={{
                        ...styles.statusDot,
                        backgroundColor: activeChat.isOnline ? '#2E7D32' : '#C62828',
                      }}
                    />
                    <span style={styles.statusTextMeta}>
                      {activeChat.statusText || (activeChat.isOnline ? 'В мережі' : 'Був у мережі нещодавно')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.messagesFeed}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={msg.isHost ? styles.messageRowEnd : styles.messageRowStart}>
                  <div style={msg.isHost ? styles.bubbleOrange : styles.bubbleWhite}>
                    <p style={msg.isHost ? styles.bubbleTextWhite : styles.bubbleTextDark}>{msg.text}</p>
                    <span style={msg.isHost ? styles.bubbleTimeWhite : styles.bubbleTime}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {activeFolder === 'requests' && (
              <div style={styles.requestActionsBar}>
                <button type="button" onClick={handleAcceptRequest} style={styles.btnAcceptRequest}>
                  Прийняти запит
                </button>
                <button type="button" onClick={handleDeclineRequest} style={styles.btnDeclineRequest}>
                  Відхилити запит
                </button>
              </div>
            )}

            {activeFolder === 'blacklist' ? (
              <div style={styles.blacklistActionBar}>
                <button type="button" onClick={handleUnblockUser} style={styles.btnUnblockLarge}>
                  Розблокувати акаунт
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={styles.chatComposerBar}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachFile}
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={styles.attachPaperclipBtn}
                  title="Прикріпити файл"
                >
                  <PaperclipIcon />
                </button>

                <div style={styles.textInputFieldBox}>
                  <input
                    type="text"
                    placeholder="Введіть повідомлення... (Enter для відправки)"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={styles.pureComposerInput}
                  />
                </div>

                <button type="submit" style={styles.sendSubmitBtn} title="Надіслати">
                  <SendIcon />
                </button>
              </form>
            )}
          </div>
        ) : (
          <div style={styles.emptyStateContainer}>
            <div style={styles.circleIcon80}>💬</div>
            <div style={styles.emptyStateTitle}>Оберіть чат для перегляду</div>
            <p style={styles.emptyStateSub}>
              Виберіть розмову зі списку ліворуч, щоб переглянути історію повідомлень та відповісти гостю.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14 14L10.6667 10.6667M12 6.66667C12 9.61219 9.61219 12 6.66667 12C3.72115 12 1.33333 9.61219 1.33333 6.66667C1.33333 3.72115 3.72115 1.33333 6.66667 1.33333C9.61219 1.33333 12 3.72115 12 6.66667Z" stroke="#A78D78" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="#DC9666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    boxShadow: '0px 10px 24px -10px rgba(0, 0, 0, 0.07)',
    overflow: 'hidden',
    height: '760px',
    width: '100%',
    boxSizing: 'border-box',
  },
  chatListSidebar: {
    width: '437px',
    borderRight: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    padding: '36px 24px',
    gap: '20px',
    boxSizing: 'border-box',
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
  },
  headerTitleAlegreya: {
    fontSize: '24px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 800,
    color: '#291C0E',
    margin: 0,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D7C7B1',
    boxSizing: 'border-box',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#291C0E',
  },
  folderTabsRow: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid #D7C7B1',
    paddingBottom: '8px',
  },
  folderTabDefault: {
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
    border: 'none',
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  folderTabActive: {
    padding: '6px 12px',
    backgroundColor: 'rgba(220, 150, 102, 0.15)',
    borderRadius: '6px',
    border: 'none',
    color: '#DC9666',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  dialogsListStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '4px',
  },
  noChatsMessage: {
    textAlign: 'center',
    color: '#A78D78',
    fontSize: '14px',
    marginTop: '40px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  modeNotice: {
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#FAF0E8',
    color: '#6E473B',
    fontSize: '12px',
    lineHeight: '17px',
  },
  errorNotice: {
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#FFF0ED',
    color: '#9F2D20',
    fontSize: '12px',
    lineHeight: '17px',
  },
  chatCardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  chatAvatar44: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  chatCardContentCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflow: 'hidden',
  },
  chatCardNameTimeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatCardName: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  chatCardTime: {
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  chatCardSnippet: {
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  unreadBadgePill: {
    padding: '2px 7px',
    backgroundColor: '#DC9666',
    borderRadius: '10px',
    color: 'white',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  unreadBadgeWhite: {
    padding: '2px 7px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    color: '#DC9666',
    fontSize: '11px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  rightChatWindow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FAF7F2',
    minWidth: 0,
  },
  activeChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  chatWindowHeader: {
    padding: '20px 30px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerUserBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarBorderWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    border: '1px solid #D7C7B1',
    overflow: 'hidden',
  },
  avatarImg48: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  headerUserTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  chatHeaderUserName: {
    color: '#6E473B',
    fontSize: '16px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
  },
  chatHeaderStatusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
  },
  statusTextMeta: {
    color: '#A78D78',
    fontSize: '13px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  messagesFeed: {
    flex: 1,
    padding: '28px 30px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  messageRowStart: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  messageRowEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  bubbleWhite: {
    maxWidth: '540px',
    padding: '14px 18px',
    backgroundColor: '#FFFFFF',
    borderRadius: '18px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  },
  bubbleOrange: {
    maxWidth: '540px',
    padding: '14px 18px',
    backgroundColor: '#DC9666',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0px 8px 18px -8px rgba(194, 65, 12, 0.15)',
  },
  bubbleTextDark: {
    color: '#6E473B',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '23px',
    margin: 0,
  },
  bubbleTextWhite: {
    color: '#FFFFFF',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    lineHeight: '23px',
    margin: 0,
  },
  bubbleTime: {
    color: '#A78D78',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  bubbleTimeWhite: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '12px',
    fontFamily: "'Iosevka Charon', sans-serif",
    textAlign: 'right',
  },
  requestActionsBar: {
    padding: '16px 30px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
  },
  btnAcceptRequest: {
    flex: 1,
    maxWidth: '340px',
    height: '46px',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    border: '1px solid #2E7D32',
    borderRadius: '100px',
    color: '#2E7D32',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnDeclineRequest: {
    flex: 1,
    maxWidth: '340px',
    height: '46px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    border: '1px solid #C62828',
    borderRadius: '100px',
    color: '#C62828',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  blacklistActionBar: {
    padding: '20px 30px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #D7C7B1',
    display: 'flex',
    justifyContent: 'center',
  },
  btnUnblockLarge: {
    width: '100%',
    maxWidth: '680px',
    height: '46px',
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    border: '1px solid #C62828',
    borderRadius: '100px',
    color: '#C62828',
    fontSize: '15px',
    fontFamily: "'Iosevka Charon', sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
  chatComposerBar: {
    padding: '20px 30px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  attachPaperclipBtn: {
    width: '46px',
    height: '46px',
    backgroundColor: '#FFFFFF',
    borderRadius: '23px',
    border: '2px solid #DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  textInputFieldBox: {
    flex: 1,
    height: '46px',
    padding: '0 20px',
    backgroundColor: '#E1D4C2',
    borderRadius: '100px',
    border: '1px solid #D7C7B1',
    display: 'flex',
    alignItems: 'center',
  },
  pureComposerInput: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#291C0E',
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
  },
  sendSubmitBtn: {
    width: '46px',
    height: '46px',
    backgroundColor: '#DC9666',
    borderRadius: '23px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(220, 150, 102, 0.3)',
  },
  emptyStateContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  emptyStateContentCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    maxWidth: '360px',
    textAlign: 'center',
  },
  circleIcon80: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#DC9666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(220, 150, 102, 0.25)',
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontFamily: "'Alegreya', Georgia, serif",
    fontWeight: 700,
    color: '#291C0E',
  },
  emptyStateSub: {
    fontSize: '14px',
    fontFamily: "'Iosevka Charon', sans-serif",
    color: '#A78D78',
    lineHeight: '21px',
    margin: 0,
  },
};
