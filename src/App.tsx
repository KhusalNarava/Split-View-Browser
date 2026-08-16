import React, { useState, useEffect, useRef, useId } from 'react';
import { ArrowRight, RefreshCw, LayoutTemplate, Columns, Rows, Moon, Sun, GripVertical, GripHorizontal, Star, Bookmark, ChevronLeft, ChevronRight, Home, Camera, Ghost, Search, X, ChevronUp, ChevronDown, Plus, MoreVertical, HelpCircle, Keyboard, Eraser, Contrast } from 'lucide-react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';

export default function App() {
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>(() => {
    const saved = localStorage.getItem('browser-layout');
    return saved === 'vertical' ? 'vertical' : 'horizontal';
  });
  const [navVisible, setNavVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('browser-accent') || '#6366f1';
  });
  const navRef = useRef<HTMLDivElement>(null);

  // Sanitize the accent color to prevent CSS injection via localStorage manipulation
  const safeAccentColor = /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : '#6366f1';

  useEffect(() => {
    localStorage.setItem('browser-accent', safeAccentColor);
  }, [safeAccentColor]);

  useEffect(() => {
    localStorage.setItem('browser-layout', layout);
  }, [layout]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navVisible && navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setNavVisible(v => !v);
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setLayout(l => l === 'horizontal' ? 'vertical' : 'horizontal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'} font-sans relative`}>
      <style>
        {`
          :root {
            --accent-color: ${safeAccentColor};
            --accent-color-transparent: ${safeAccentColor}33; /* 20% opacity */
            --accent-color-light: ${safeAccentColor}1A; /* 10% opacity */
            --accent-color-hover: ${safeAccentColor}E6; /* 90% opacity */
          }
          .text-accent { color: var(--accent-color); }
          .bg-accent { background-color: var(--accent-color); }
          .bg-accent-transparent { background-color: var(--accent-color-transparent); }
          .hover\\:bg-accent-transparent:hover { background-color: var(--accent-color-transparent); }
          .hover\\:bg-accent:hover { background-color: var(--accent-color); }
          .focus\\:ring-accent:focus { box-shadow: 0 0 0 2px var(--accent-color-transparent); }
        `}
      </style>
      
      {/* Help Dialog Overlay */}
      {showHelp && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowHelp(false)} className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                <span className="text-sm font-medium">Toggle Navigation Island</span>
                <div className="flex items-center gap-1">
                  <kbd className={`px-2 py-1 text-xs font-mono rounded ${darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-white border shadow-sm text-zinc-600'}`}>Ctrl/Cmd</kbd>
                  <span className="text-zinc-500">+</span>
                  <kbd className={`px-2 py-1 text-xs font-mono rounded ${darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-white border shadow-sm text-zinc-600'}`}>B</kbd>
                </div>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
                <span className="text-sm font-medium">Toggle Split Layout</span>
                <div className="flex items-center gap-1">
                  <kbd className={`px-2 py-1 text-xs font-mono rounded ${darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-white border shadow-sm text-zinc-600'}`}>Ctrl/Cmd</kbd>
                  <span className="text-zinc-500">+</span>
                  <kbd className={`px-2 py-1 text-xs font-mono rounded ${darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-white border shadow-sm text-zinc-600'}`}>L</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Trigger Area */}
      {!navVisible && (
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 z-50 flex justify-center items-start cursor-pointer group"
          onClick={(e) => { e.stopPropagation(); setNavVisible(true); }}
        >
          <div className={`w-12 h-1.5 rounded-full transition-colors ${darkMode ? 'bg-zinc-700 group-hover:bg-zinc-500' : 'bg-zinc-300 group-hover:bg-zinc-400'}`} />
        </div>
      )}

      {/* Floating Navigation Bar */}
      <div 
        ref={navRef}
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 transform ${navVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <div className={`flex items-center gap-4 px-4 py-2 rounded-full shadow-lg border backdrop-blur-md ${darkMode ? 'bg-zinc-900/90 border-zinc-700 shadow-black/50' : 'bg-white/90 border-zinc-200 shadow-zinc-200/50'}`}>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-accent" />
            <h1 className="text-sm font-semibold whitespace-nowrap hidden sm:block">Split View</h1>
          </div>
          
          <div className={`w-px h-6 ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayout('horizontal')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${layout === 'horizontal' ? (darkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-900') : (darkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100')}`}
              title="Side by Side (Ctrl+L)"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('vertical')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${layout === 'vertical' ? (darkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-100 text-zinc-900') : (darkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100')}`}
              title="Up and Down (Ctrl+L)"
            >
              <Rows className="w-4 h-4" />
            </button>
          </div>

          <div className={`w-px h-6 ${darkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

          <div className="flex items-center gap-1">
            <div className="relative flex items-center justify-center p-1.5 rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Theme Color">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer border-0 p-0 appearance-none bg-transparent"
                style={{ clipPath: 'circle(50%)' }}
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'text-amber-400 hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-100'}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100'}`}
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <main className="flex-1 h-full w-full pt-2">
        <PanelGroup id="browser-panels" orientation={layout} className="w-full h-full">
          <Panel defaultSize={50} minSize={20}>
            <TabbedBrowser initialUrl="https://www.google.com/" darkMode={darkMode} />
          </Panel>
          <PanelResizeHandle className={`relative flex items-center justify-center transition-colors ${layout === 'horizontal' ? 'w-2 cursor-col-resize hover:bg-accent-transparent' : 'h-2 cursor-row-resize hover:bg-accent-transparent'}`}>
            <div className={`z-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-300 text-zinc-500'} ${layout === 'horizontal' ? 'h-8 w-1.5' : 'w-8 h-1.5'}`}>
              {layout === 'horizontal' ? <GripVertical className="w-3 h-3" /> : <GripHorizontal className="w-3 h-3" />}
            </div>
          </PanelResizeHandle>
          <Panel defaultSize={50} minSize={20}>
            <TabbedBrowser initialUrl="https://www.google.com/" darkMode={darkMode} />
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}

function BrowserPanel({ initialUrl, darkMode, isActive = true, onTitleChange }: { initialUrl: string, darkMode: boolean, isActive?: boolean, onTitleChange?: (title: string) => void }) {
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [bookmarks, setBookmarks] = useState<{url: string, title: string}[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const bookmarksRef = useRef<HTMLDivElement>(null);
  
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isPrivate, setIsPrivate] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [invertPage, setInvertPage] = useState(false);
  const panelId = useId();

  const activeUrl = history[historyIndex];

  const onTitleChangeRef = useRef(onTitleChange);
  useEffect(() => {
    onTitleChangeRef.current = onTitleChange;
  }, [onTitleChange]);

  useEffect(() => {
    if (onTitleChangeRef.current) {
      try {
        const urlObj = new URL(activeUrl);
        onTitleChangeRef.current(urlObj.hostname);
      } catch (e) {
        onTitleChangeRef.current("New Tab");
      }
    }
  }, [activeUrl]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('browser-bookmarks');
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed.filter(b => typeof b === 'object' && b !== null && typeof b.url === 'string' && typeof b.title === 'string'));
        }
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    const savedVisited = localStorage.getItem('browser-visited');
    if (savedVisited) {
      try {
        const parsed = JSON.parse(savedVisited);
        if (Array.isArray(parsed)) {
          setVisitedUrls(parsed.filter(u => typeof u === 'string'));
        }
      } catch (e) {
        console.error("Failed to parse visited URLs", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bookmarksRef.current && !bookmarksRef.current.contains(event.target as Node)) {
        setShowBookmarks(false);
      }
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveBookmark = () => {
    const isBookmarked = bookmarks.some(b => b.url === activeUrl);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter(b => b.url !== activeUrl);
    } else {
      const title = new URL(activeUrl).hostname;
      newBookmarks = [...bookmarks, { url: activeUrl, title }];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('browser-bookmarks', JSON.stringify(newBookmarks));
  };

  const isCurrentBookmarked = bookmarks.some(b => b.url === activeUrl);

  const getProxiedUrl = (url: string) => {
    if (!url) return '';
    try {
      new URL(url);
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    } catch {
      return '';
    }
  };

  const navigateTo = (url: string) => {
    setIsLoading(true);
    if (url !== activeUrl) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(url);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      if (!isPrivate) {
        const updatedVisited = [url, ...visitedUrls.filter(u => u !== url)].slice(0, 50);
        setVisitedUrls(updatedVisited);
        localStorage.setItem('browser-visited', JSON.stringify(updatedVisited));
      }
    }
    setInputUrl(url);
    setShowAutocomplete(false);
  };

  const handleGo = (e?: React.FormEvent) => {
    e?.preventDefault();
    let formattedUrl = inputUrl.trim();
    if (!formattedUrl) return;
    
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
      setInputUrl(formattedUrl);
    }
    navigateTo(formattedUrl);
    setShowBookmarks(false);
  };

  const loadBookmark = (url: string) => {
    navigateTo(url);
    setShowBookmarks(false);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setInputUrl(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setInputUrl(history[historyIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  const handleClearHistory = () => {
    setVisitedUrls([]);
    localStorage.removeItem('browser-visited');
  };

  const handlePrivateToggle = () => {
    const newPrivateState = !isPrivate;
    setIsPrivate(newPrivateState);
    if (newPrivateState) {
      // Clear the current panel's session history (simulated by regenerating the iframe key)
      setKey((prev) => prev + 1);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.sessionStorage.clear();
        } catch (e) {
          // Ignore cross-origin errors if any
        }
      }
    }
  };

  const executeFind = (backwards = false) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow || !findQuery) return;
    try {
      iframeRef.current.contentWindow.postMessage({ type: 'FIND', query: findQuery, backwards }, '*');
    } catch (error) {
      console.error("Find in page failed:", error);
    }
  };

  const handleFindQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindQuery(e.target.value);
    if (e.target.value) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage({ type: 'FIND', query: e.target.value, backwards: false }, '*');
        } catch (err) {}
      }
    }
  };

  const handleHome = () => {
    navigateTo('https://google.com');
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SCREENSHOT_RESULT' && e.data.dataUrl && isActive) {
        const link = document.createElement("a");
        link.href = e.data.dataUrl;
        link.download = `screenshot-${new URL(activeUrl).hostname}-${Date.now()}.png`;
        link.click();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeUrl, isActive]);

  const handleScreenshot = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage({ type: 'SCREENSHOT' }, '*');
    } catch (error) {
      console.error("Screenshot request failed:", error);
      alert("Could not request screenshot.");
    }
  };

  const proxiedUrl = getProxiedUrl(activeUrl);
  const suggestions = inputUrl ? visitedUrls.filter(u => u.toLowerCase().includes(inputUrl.toLowerCase()) && u !== inputUrl).slice(0, 5) : [];

  return (
    <section className={`absolute inset-0 flex flex-col transition-opacity duration-300 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'} ${darkMode ? 'bg-zinc-950' : 'bg-zinc-100/50'}`}>
      <div className={`flex items-center gap-2 p-2 border-b ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={handleBack}
            disabled={historyIndex === 0}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleForward}
            disabled={historyIndex === history.length - 1}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${historyIndex === history.length - 1 ? 'opacity-30 cursor-not-allowed' : ''} ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRefresh}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleHome}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center min-w-0" ref={autocompleteRef}>
          <form onSubmit={handleGo} className="flex-1 flex relative items-center w-full min-w-0">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
              placeholder="Enter URL"
              className={`w-full text-sm pl-4 pr-16 py-1.5 rounded-full outline-none focus:ring-accent transition-shadow min-w-0 ${darkMode ? 'bg-zinc-800 text-zinc-200 placeholder-zinc-500 border border-zinc-700' : 'bg-zinc-100 text-zinc-800 placeholder-zinc-400 border border-zinc-200/50'}`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center pr-1">
              <button 
                type="button"
                onClick={saveBookmark}
                className={`p-1.5 mr-1 rounded-full flex items-center justify-center transition-colors ${isCurrentBookmarked ? 'text-amber-500' : (darkMode ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200')}`}
                title={isCurrentBookmarked ? "Remove Bookmark" : "Bookmark this page"}
              >
                <Star className="w-3.5 h-3.5" fill={isCurrentBookmarked ? "currentColor" : "none"} />
              </button>
              <button 
                type="submit"
                className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-700' : 'text-zinc-500 hover:text-zinc-900 hover:bg-white border hover:border-zinc-200'}`}
                title="Go"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {showAutocomplete && suggestions.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-lg shadow-lg border z-50 overflow-hidden ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              {suggestions.map((u, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo(u)}
                  className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
                  title={u}
                >
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="relative" ref={bookmarksRef}>
            <button 
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
              title="Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            
            {showBookmarks && (
              <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-50 overflow-hidden ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${darkMode ? 'text-zinc-500 border-zinc-800' : 'text-zinc-500 border-zinc-100'}`}>
                  Bookmarks
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {bookmarks.length === 0 ? (
                    <div className={`px-4 py-3 text-sm italic ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      No bookmarks yet.
                    </div>
                  ) : (
                    bookmarks.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => loadBookmark(b.url)}
                        className={`w-full text-left px-4 py-2 text-sm truncate transition-colors ${darkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
                        title={b.url}
                      >
                        {b.title}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
          
          <button 
            onClick={() => {
              setShowFind(!showFind);
              if (!showFind) setTimeout(() => document.getElementById(`find-input-${panelId}`)?.focus(), 50);
            }}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${showFind ? 'text-accent bg-accent-transparent' : (darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200')}`}
            title="Find in Page"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleScreenshot}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleClearHistory}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
            title="Clear History"
          >
            <Eraser className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setInvertPage(!invertPage)}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${invertPage ? 'text-accent bg-accent-transparent' : (darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200')}`}
            title={invertPage ? "Revert page colors" : "Invert page colors"}
          >
            <Contrast className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handlePrivateToggle}
            className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${isPrivate ? (darkMode ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100') : (darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200')}`}
            title="Private Mode"
          >
            <Ghost className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className={`flex-1 relative flex flex-col ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
        {showFind && (
          <div className={`flex items-center gap-2 px-3 py-1.5 border-b text-sm shadow-sm z-20 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
            <Search className={`w-3.5 h-3.5 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              id={`find-input-${panelId}`}
              type="text"
              value={findQuery}
              onChange={handleFindQueryChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeFind(e.shiftKey);
                }
              }}
              placeholder="Find in page..."
              className={`flex-1 bg-transparent outline-none ${darkMode ? 'text-zinc-200 placeholder-zinc-500' : 'text-zinc-800 placeholder-zinc-400'}`}
            />
            <div className="flex items-center gap-0.5">
              <button 
                onClick={() => executeFind(true)}
                className={`p-1 rounded transition-colors ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
                title="Previous match (Shift+Enter)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => executeFind(false)}
                className={`p-1 rounded transition-colors ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
                title="Next match (Enter)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
              <button 
                onClick={() => {
                  setShowFind(false);
                  setFindQuery('');
                }}
                className={`p-1 rounded transition-colors ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-1 relative">
          {isLoading && (
            <div className={`absolute top-0 left-0 right-0 h-0.5 z-10 overflow-hidden ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
              <div className="h-full bg-accent animate-indeterminate rounded-full" />
            </div>
          )}
          {proxiedUrl ? (
            <iframe
              ref={iframeRef}
              key={key}
              src={proxiedUrl}
              onLoad={() => setIsLoading(false)}
              className={`absolute inset-0 w-full h-full border-none bg-white transition-all duration-300 ${invertPage ? 'invert hue-rotate-180' : ''}`}
              sandbox="allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation allow-downloads"
              title="Browser Panel"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm opacity-50">
              Enter a valid URL to load
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type TabInfo = {
  id: string;
  title: string;
  url: string;
};

function TabbedBrowser({ initialUrl, darkMode }: { initialUrl: string, darkMode: boolean }) {
  const [tabs, setTabs] = useState<TabInfo[]>([
    { id: 'tab-1', title: 'New Tab', url: initialUrl }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  const addTab = () => {
    const newTabId = `tab-${Date.now()}`;
    setTabs([...tabs, { id: newTabId, title: 'New Tab', url: 'https://google.com' }]);
    setActiveTabId(newTabId);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Prevent closing the last tab

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTabTitle = (id: string, title: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, title } : t));
  };

  return (
    <div className={`flex flex-col h-full w-full rounded-lg overflow-hidden border ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
      {/* Tab Strip */}
      <div className={`flex items-end gap-1 px-2 pt-2 h-10 ${darkMode ? 'bg-zinc-900/50' : 'bg-zinc-100/50'}`}>
        <div className="flex-1 flex items-end gap-1 overflow-x-auto no-scrollbar mask-gradient-right">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex items-center min-w-[120px] max-w-[200px] h-8 px-3 rounded-t-lg cursor-pointer transition-colors border border-b-0 relative ${
                activeTabId === tab.id 
                  ? (darkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100 z-10' : 'bg-white border-zinc-200 text-zinc-900 z-10')
                  : (darkMode ? 'bg-zinc-900 border-transparent text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-100 border-transparent text-zinc-500 hover:bg-zinc-200')
              }`}
            >
              <div className="flex-1 truncate text-xs font-medium mr-2">
                {tab.title}
              </div>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className={`p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-300'}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className={`p-1 mb-1 rounded-md transition-colors shrink-0 ${darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'}`}
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Contents (BrowserPanels) */}
      <div className="flex-1 relative min-h-0 bg-transparent">
        {tabs.map(tab => (
          <BrowserPanel 
            key={tab.id}
            initialUrl={tab.url} 
            darkMode={darkMode} 
            isActive={activeTabId === tab.id}
            onTitleChange={(title) => updateTabTitle(tab.id, title)}
          />
        ))}
      </div>
    </div>
  );
}

