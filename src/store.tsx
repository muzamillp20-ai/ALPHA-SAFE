import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface FlashcardProgress {
  cardId: string;
  category: string;
  known: boolean;
  attempts: number;
  lastSeen: string;
}

export interface ScenarioAttempt {
  id: string;
  scenarioId: string;
  category: string;
  decisions: string[];
  redFlagsFound: string[];
  score: number;
  completedAt: string;
}

export interface URLAnalysis {
  id: string;
  url: string;
  score: number;
  risks: string[];
  timestamp: string;
}

export interface MessageAnalysis {
  id: string;
  message: string;
  indicators: Record<string, number>;
  score: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'in-progress' | 'completed';
  description: string;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  complaint?: ComplaintDraft;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  timestamp: string;
}

export interface EvidenceItem {
  id: string;
  type: 'screenshot' | 'message' | 'url' | 'document' | 'transaction' | 'note';
  name: string;
  description: string;
  content: string;
  createdAt: string;
}

export interface ComplaintDraft {
  id: string;
  incidentId: string;
  step: number;
  incidentType: string;
  details: string;
  suspectedInfo: string;
  financialInfo: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SecurityHealth {
  mfa: boolean;
  passwordManager: boolean;
  deviceUpdates: boolean;
  appPermissions: boolean;
  privacySettings: boolean;
  recoveryOptions: boolean;
  bankingAlerts: boolean;
}

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: { mode: 'dark' | 'light' | 'system'; accent: 'mono' | 'blue' | 'violet' | 'emerald' | 'amber' | 'crimson' };
  flashcardProgress: FlashcardProgress[];
  scenarioAttempts: ScenarioAttempt[];
  urlAnalyses: URLAnalysis[];
  messageAnalyses: MessageAnalysis[];
  incidents: Incident[];
  complaints: ComplaintDraft[];
  securityHealth: SecurityHealth;
  activity: ActivityLog[];
  notifications: { id: string; text: string; read: boolean; timestamp: string }[];
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'ADD_FLASHCARD_PROGRESS'; payload: FlashcardProgress }
  | { type: 'ADD_SCENARIO_ATTEMPT'; payload: ScenarioAttempt }
  | { type: 'ADD_URL_ANALYSIS'; payload: URLAnalysis }
  | { type: 'ADD_MESSAGE_ANALYSIS'; payload: MessageAnalysis }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'UPDATE_INCIDENT'; payload: Incident }
  | { type: 'DELETE_INCIDENT'; payload: string }
  | { type: 'ADD_COMPLAINT'; payload: ComplaintDraft }
  | { type: 'UPDATE_COMPLAINT'; payload: ComplaintDraft }
  | { type: 'DELETE_COMPLAINT'; payload: string }
  | { type: 'UPDATE_SECURITY_HEALTH'; payload: Partial<SecurityHealth> }
  | { type: 'ADD_ACTIVITY'; payload: ActivityLog }
  | { type: 'ADD_NOTIFICATION'; payload: { id: string; text: string; timestamp: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  theme: { mode: 'dark', accent: 'mono' },
  flashcardProgress: [],
  scenarioAttempts: [],
  urlAnalyses: [],
  messageAnalyses: [],
  incidents: [],
  complaints: [],
  securityHealth: { mfa: false, passwordManager: false, deviceUpdates: false, appPermissions: false, privacySettings: false, recoveryOptions: false, bankingAlerts: false },
  activity: [],
  notifications: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...initialState, theme: state.theme };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_FLASHCARD_PROGRESS':
      return { ...state, flashcardProgress: [...state.flashcardProgress, action.payload] };
    case 'ADD_SCENARIO_ATTEMPT':
      return { ...state, scenarioAttempts: [...state.scenarioAttempts, action.payload] };
    case 'ADD_URL_ANALYSIS':
      return { ...state, urlAnalyses: [action.payload, ...state.urlAnalyses].slice(0, 50) };
    case 'ADD_MESSAGE_ANALYSIS':
      return { ...state, messageAnalyses: [action.payload, ...state.messageAnalyses].slice(0, 50) };
    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };
    case 'UPDATE_INCIDENT':
      return { ...state, incidents: state.incidents.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INCIDENT':
      return { ...state, incidents: state.incidents.filter(i => i.id !== action.payload) };
    case 'ADD_COMPLAINT':
      return { ...state, complaints: [action.payload, ...state.complaints] };
    case 'UPDATE_COMPLAINT':
      return { ...state, complaints: state.complaints.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_COMPLAINT':
      return { ...state, complaints: state.complaints.filter(c => c.id !== action.payload) };
    case 'UPDATE_SECURITY_HEALTH':
      return { ...state, securityHealth: { ...state.securityHealth, ...action.payload } };
    case 'ADD_ACTIVITY':
      return { ...state, activity: [action.payload, ...state.activity].slice(0, 100) };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [{ ...action.payload, read: false }, ...state.notifications].slice(0, 20) };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const saved = localStorage.getItem('alphasafe_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed, isAuthenticated: !!parsed.user };
      }
    } catch { /* empty */ }
    return initialState;
  });

  useEffect(() => {
    const toSave = {
      user: state.user,
      theme: state.theme,
      flashcardProgress: state.flashcardProgress,
      scenarioAttempts: state.scenarioAttempts,
      urlAnalyses: state.urlAnalyses,
      messageAnalyses: state.messageAnalyses,
      incidents: state.incidents,
      complaints: state.complaints,
      securityHealth: state.securityHealth,
      activity: state.activity,
      notifications: state.notifications,
    };
    localStorage.setItem('alphasafe_state', JSON.stringify(toSave));
  }, [state]);

  useEffect(() => {
    const html = document.documentElement;
    if (state.theme.mode === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.className = dark ? 'dark' : 'light';
    } else {
      html.className = state.theme.mode;
    }
    if (state.theme.accent === 'mono') {
      html.removeAttribute('data-accent');
    } else {
      html.setAttribute('data-accent', state.theme.accent);
    }
  }, [state.theme]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function getAwarenessScore(state: AppState): number {
  const flashcardTotal = state.flashcardProgress.length;
  const scenarioTotal = state.scenarioAttempts.length;
  const urlTotal = state.urlAnalyses.length;
  const msgTotal = state.messageAnalyses.length;
  if (flashcardTotal === 0 && scenarioTotal === 0 && urlTotal === 0 && msgTotal === 0) return 0;
  const flashcardScore = flashcardTotal > 0 ? (state.flashcardProgress.filter(f => f.known).length / flashcardTotal) * 100 : 0;
  const scenarioScore = scenarioTotal > 0 ? (state.scenarioAttempts.reduce((a, s) => a + s.score, 0) / scenarioTotal) : 0;
  const analysisScore = ((urlTotal + msgTotal) > 0) ? Math.min(100, (urlTotal + msgTotal) * 10) : 0;
  return Math.round((flashcardScore * 0.4 + scenarioScore * 0.35 + analysisScore * 0.25));
}

export function getCategoryScore(state: AppState, category: string): number {
  const cards = state.flashcardProgress.filter(f => f.category === category);
  const scenarios = state.scenarioAttempts.filter(s => s.category === category);
  if (cards.length === 0 && scenarios.length === 0) return 0;
  const cardScore = cards.length > 0 ? (cards.filter(c => c.known).length / cards.length) * 100 : 0;
  const scenarioScore = scenarios.length > 0 ? scenarios.reduce((a, s) => a + s.score, 0) / scenarios.length : 0;
  return Math.round(cardScore * 0.6 + scenarioScore * 0.4);
}

export function addActivity(dispatch: React.Dispatch<Action>, type: string, description: string) {
  dispatch({ type: 'ADD_ACTIVITY', payload: { id: crypto.randomUUID(), type, description, timestamp: new Date().toISOString() } });
}
