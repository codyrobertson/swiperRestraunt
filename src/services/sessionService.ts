import { EnhancedRestaurant } from './googlePlacesService';
import { UserPreferences } from '../types/preferences';
import { RecommendationService } from './recommendationService';

interface SessionMember {
  id: string;
  name: string;
  preferences: UserPreferences;
  ready: boolean;
}

interface Session {
  id: string;
  hostId: string;
  members: SessionMember[];
  restaurants: EnhancedRestaurant[];
  matches: Map<string, string[]>; // restaurantId -> userIds
  swipes: Map<string, Set<string>>; // userId -> Set of restaurantIds
}

export class SessionService {
  private static sessions: Map<string, Session> = new Map();
  private static sessionCallbacks: Map<string, Set<(session: Session) => void>> = new Map();

  static createSession(hostId: string, hostName: string, preferences: UserPreferences): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const session: Session = {
      id: sessionId,
      hostId,
      members: [{
        id: hostId,
        name: hostName,
        preferences,
        ready: false
      }],
      restaurants: [],
      matches: new Map(),
      swipes: new Map()
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  static joinSession(sessionId: string, userId: string, name: string, preferences: UserPreferences): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.members.push({
      id: userId,
      name,
      preferences,
      ready: false
    });

    this.notifySessionUpdate(session);
    return true;
  }

  static setMemberReady(sessionId: string, userId: string, ready: boolean): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const member = session.members.find(m => m.id === userId);
    if (member) {
      member.ready = ready;
      this.notifySessionUpdate(session);
    }
  }

  static recordSwipe(sessionId: string, userId: string, restaurantId: string, liked: boolean): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Record the swipe
    if (!session.swipes.has(userId)) {
      session.swipes.set(userId, new Set());
    }
    session.swipes.get(userId)?.add(restaurantId);

    if (liked) {
      const currentLikes = session.matches.get(restaurantId) || [];
      currentLikes.push(userId);
      session.matches.set(restaurantId, currentLikes);

      // Check if we have a match (all members liked)
      if (currentLikes.length === session.members.length) {
        this.notifyMatch(session, restaurantId);
      }
    }

    this.notifySessionUpdate(session);
  }

  static subscribeToSession(sessionId: string, callback: (session: Session) => void): () => void {
    if (!this.sessionCallbacks.has(sessionId)) {
      this.sessionCallbacks.set(sessionId, new Set());
    }
    
    this.sessionCallbacks.get(sessionId)?.add(callback);
    
    return () => {
      this.sessionCallbacks.get(sessionId)?.delete(callback);
    };
  }

  private static notifySessionUpdate(session: Session): void {
    this.sessionCallbacks.get(session.id)?.forEach(callback => callback(session));
  }

  private static notifyMatch(session: Session, restaurantId: string): void {
    const restaurant = session.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    // TODO: Implement push notifications
    console.log(`Match found in session ${session.id} for restaurant ${restaurant.name}`);
  }

  static getSessionRestaurants(sessionId: string): EnhancedRestaurant[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const mergedPreferences = this.getMergedPreferences(sessionId);
    return RecommendationService.rankRestaurants(session.restaurants, mergedPreferences);
  }

  static getMergedPreferences(sessionId: string): UserPreferences {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return {
      dietaryRestrictions: this.mergeArrayPreferences(
        session.members.map(m => m.preferences.dietaryRestrictions)
      ),
      preferredCuisines: this.mergeArrayPreferences(
        session.members.map(m => m.preferences.preferredCuisines)
      ),
      maxDistance: Math.min(
        ...session.members.map(m => m.preferences.maxDistance)
      ),
      priceRange: [
        Math.max(...session.members.map(m => m.preferences.priceRange[0])),
        Math.min(...session.members.map(m => m.preferences.priceRange[1]))
      ],
      latitude: session.members[0].preferences.latitude,
      longitude: session.members[0].preferences.longitude
    };
  }

  private static mergeArrayPreferences(arrays: string[][]): string[] {
    if (arrays.length === 0) return [];
    const intersection = arrays[0];
    return arrays.reduce((acc, curr) => 
      acc.filter(item => curr.includes(item))
    );
  }

  static leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.members = session.members.filter(m => m.id !== userId);
    session.swipes.delete(userId);

    // If no members left, clean up the session
    if (session.members.length === 0) {
      this.sessions.delete(sessionId);
      this.sessionCallbacks.delete(sessionId);
    } else {
      this.notifySessionUpdate(session);
    }
  }
}