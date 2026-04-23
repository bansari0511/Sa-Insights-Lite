/**
 * AI Chat Panel — OSINT assistant (sa-insights-lite).
 *
 * Flow per user query:
 *   1. POST query to SEARCH_API_URL  (/osintsearch/query)
 *   2. Render the assistant answer
 *   3. POST the Q&A pair to STORE_API_URL so Nova can read the conversation
 *
 * A conversation starts when the panel mounts (or on "New chat") and its id
 * is `<username>-<timestamp>` — stable for the session, unique per user.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './AIChatPanel.css';

const SEARCH_API_URL = import.meta.env.VITE_AI_CHAT_API_URL || '/osintsearch/query';
const STORE_API_URL = import.meta.env.VITE_CHAT_STORE_API_URL || '';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function makeConversationId(username) {
  return `${username || 'anonymous'}-${Date.now()}`;
}

// Fire-and-forget POST to the chat store. No-ops if the store URL is not set.
function saveToStore(conversationId, input, output) {
  if (!STORE_API_URL || !conversationId) return;
  fetch(STORE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId,
      message: { input, output },
    }),
  }).catch(() => {});
}

function fmtDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getDateRange90() {
  const now = new Date();
  const past = new Date(now);
  past.setDate(now.getDate() - 90);
  return { from_date: fmtDate(past), to_date: fmtDate(now) };
}

function renderMd(text) {
  if (!text) return '';
  let h = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h
    .replace(/```([\s\S]*?)```/g, '<pre class="ai-code">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="ai-ic">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[-*] (.+)/gm, '<div class="ai-li">$1</div>')
    .replace(/\n/g, '<br/>');
  return h;
}

function timeLabel(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const days = Math.floor(s / 86400);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const AIChatPanel = ({ open, onClose, onNavigateToHost }) => {
  const { user } = useAuth();
  const username = user?.username || null;

  const [conversationId, setConversationId] = useState(() => makeConversationId(username));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 400); }, [open]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const goToNova = useCallback(() => {
    if (onNavigateToHost) onNavigateToHost('/nova');
  }, [onNavigateToHost]);

  const startNewChat = useCallback(() => {
    abortRef.current?.abort();
    setConversationId(makeConversationId(username));
    setMessages([]);
    setInput('');
    setIsLoading(false);
  }, [username]);

  const submit = useCallback(async (queryOverride) => {
    const query = (queryOverride || input).trim();
    if (!query || isLoading) return;
    if (!queryOverride) setInput('');

    const userMsg = { id: generateId(), role: 'user', content: query, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const { from_date, to_date } = getDateRange90();
    const body = {
      query, from_date, to_date,
      geoSelection: '', sources: ['OSINT'], point: '', polygon: '',
    };

    abortRef.current = new AbortController();
    try {
      // 1. Run the OSINT search.
      const res = await fetch(SEARCH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();

      // 2. Show the answer.
      const assistantMsg = {
        id: generateId(),
        role: 'assistant',
        content: data.result || 'No results found.',
        sources: data.dataResults?.length || 0,
        suggested: data.suggestedQuestions || data.suggested_questions || [],
        ts: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      // 3. Persist the Q&A pair (input = query, output = full search response).
      saveToStore(conversationId, query, data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: null,
        error: err.message || 'Something went wrong.', ts: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, conversationId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  if (!open) return null;
  const hasChat = messages.length > 0 || isLoading;

  return (
    <div className="ai-panel">
      {/* Header */}
      <div className="ai-hdr">
        <div className="ai-hdr-orb">
          <div className="ai-hdr-orb-inner" />
        </div>
        <div className="ai-hdr-info">
          <span className="ai-hdr-name">Nova</span>
          <span className="ai-hdr-status">
            <span className="ai-hdr-dot" />
            OSINT Assistant
          </span>
        </div>
        <div className="ai-hdr-actions">
          {hasChat && (
            <button className="ai-hdr-btn" onClick={startNewChat} title="New chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          )}
          <button className="ai-hdr-btn" onClick={onClose} title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="ai-body">
        {!hasChat && (
          <div className="ai-welcome">
            <div className="ai-welcome-orb">
              <div className="ai-welcome-orb-ring" />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="aiWG" x1="2" y1="2" x2="22" y2="22">
                    <stop offset="0%" stopColor="#818cf8"/>
                    <stop offset="50%" stopColor="#6366f1"/>
                    <stop offset="100%" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="3.5" fill="url(#aiWG)"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="url(#aiWG)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
                  stroke="url(#aiWG)" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <h3 className="ai-welcome-title">Hi{user?.username ? `, ${user.username}` : ''}!</h3>
            <p className="ai-welcome-sub">I can help you explore <strong>news, threats, events</strong> and intelligence from the last 90 days.</p>

            <div className="ai-starters">
              {[
                { icon: '\u{1F30D}', text: 'Summarize key geopolitical events' },
                { icon: '\u{1F512}', text: 'Latest cybersecurity threats' },
                { icon: '\u{1F4CA}', text: 'Weekly intelligence briefing' },
              ].map(s => (
                <button key={s.text} className="ai-starter" onClick={() => submit(s.text)}>
                  <span className="ai-starter-icon">{s.icon}</span>
                  <span className="ai-starter-text">{s.text}</span>
                  <svg className="ai-starter-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>

            <div className="ai-nova-promo">
              <div className="ai-nova-promo-top">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Want deeper analysis?</span>
              </div>
              <p className="ai-nova-promo-desc">Geospatial maps, entity graphs, data sources, and reports are available in Nova AI Search.</p>
              <button className="ai-nova-go" onClick={goToNova}>
                Open Nova AI Search
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`ai-msg ai-msg--${m.role}`}>
            {m.role === 'assistant' && (
              <div className="ai-msg-orb">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" fill="#fff"/>
                  <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </div>
            )}
            <div className={`ai-msg-content ai-msg-content--${m.role}`}>
              {m.role === 'assistant' && <div className="ai-msg-label">Nova</div>}
              {m.error ? (
                <div className="ai-msg-err">{m.error}</div>
              ) : (
                <div className="ai-msg-text" dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
              )}
              <div className="ai-msg-foot">
                {m.sources > 0 && <span className="ai-msg-badge">{m.sources} source{m.sources !== 1 ? 's' : ''}</span>}
                <span className="ai-msg-time">{timeLabel(m.ts)}</span>
              </div>
              {m.suggested?.length > 0 && (
                <div className="ai-msg-suggestions">
                  {m.suggested.slice(0, 3).map((q, j) => (
                    <button key={j} className="ai-suggest-btn" onClick={() => submit(q)}>{q}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-msg ai-msg--assistant">
            <div className="ai-msg-orb ai-msg-orb--thinking">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#fff"/>
                <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div className="ai-msg-content ai-msg-content--assistant ai-thinking">
              <div className="ai-msg-label">Nova</div>
              <div className="ai-think-wave">
                <span/><span/><span/><span/><span/>
              </div>
              <span className="ai-think-text">Analyzing intelligence...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Nova-handoff bar */}
      {hasChat && (
        <button className="ai-nova-bar" onClick={goToNova}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Explore in <strong>Nova</strong> for maps, graphs &amp; reports</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}

      {/* Input */}
      <div className="ai-input-area">
        <form className="ai-input-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <div className="ai-input-box">
            <textarea
              ref={inputRef}
              className="ai-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about OSINT..."
              rows={1}
              disabled={isLoading}
            />
            <button type="submit" className="ai-send-btn" disabled={!input.trim() || isLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </form>
        <p className="ai-input-sub">Nova uses AI to search OSINT data. Results may not always be accurate.</p>
      </div>
    </div>
  );
};

export default AIChatPanel;
