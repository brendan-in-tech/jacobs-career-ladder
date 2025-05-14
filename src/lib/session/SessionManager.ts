import { User } from 'firebase/auth';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Session configuration
const SESSION_COOKIE_NAME = 'jacobs_ladder_session';
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

interface SessionData {
  user: User;
  lastActivity: number;
  sessionId: string;
}

export class SessionManager {
  private static instance: SessionManager;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Initialize session
  initializeSession(user: User): void {
    const sessionData: SessionData = {
      user,
      lastActivity: Date.now(),
      sessionId: this.generateSessionId(),
    };

    // Set session cookie with secure flags
    setCookie(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      maxAge: SESSION_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    // Start session refresh timer
    this.startRefreshTimer();
  }

  // Get current session
  getSession(): SessionData | null {
    const sessionCookie = getCookie(SESSION_COOKIE_NAME);
    if (!sessionCookie) return null;

    try {
      const sessionData: SessionData = JSON.parse(sessionCookie as string);
      
      // Check if session is expired
      if (Date.now() - sessionData.lastActivity > SESSION_EXPIRY * 1000) {
        this.clearSession();
        return null;
      }

      // Update last activity
      this.updateLastActivity();
      return sessionData;
    } catch (error) {
      console.error('Error parsing session data:', error);
      this.clearSession();
      return null;
    }
  }

  // Update last activity timestamp
  private updateLastActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      setCookie(SESSION_COOKIE_NAME, JSON.stringify(session), {
        maxAge: SESSION_EXPIRY,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      });
    }
  }

  // Clear session
  clearSession(): void {
    deleteCookie(SESSION_COOKIE_NAME);
    this.stopRefreshTimer();
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Start session refresh timer
  private startRefreshTimer(): void {
    this.stopRefreshTimer();
    this.refreshTimer = setInterval(() => {
      const session = this.getSession();
      if (session) {
        this.updateLastActivity();
      } else {
        this.stopRefreshTimer();
      }
    }, REFRESH_INTERVAL);
  }

  // Stop session refresh timer
  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Check if session is valid
  isSessionValid(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  // Get user from session
  getSessionUser(): User | null {
    const session = this.getSession();
    return session?.user || null;
  }
} 