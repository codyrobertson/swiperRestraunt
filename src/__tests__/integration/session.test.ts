import { SessionService } from '../../services/sessionService';
import { UserPreferences } from '../../types/preferences';

describe('Session Management Integration', () => {
  const mockPreferences: UserPreferences = {
    dietaryRestrictions: ['Vegetarian'],
    preferredCuisines: ['Italian'],
    maxDistance: 10,
    priceRange: [1, 3],
    latitude: 40.7128,
    longitude: -74.0060
  };

  it('should create and manage a complete session lifecycle', async () => {
    // Create session
    const sessionId = SessionService.createSession('host-id', 'Host User', mockPreferences);
    expect(sessionId).toBeDefined();

    // Join session
    const joinSuccess = SessionService.joinSession(
      sessionId,
      'member-id',
      'Member User',
      mockPreferences
    );
    expect(joinSuccess).toBe(true);

    // Record swipes and verify matches
    SessionService.recordSwipe(sessionId, 'host-id', 'restaurant-1', true);
    SessionService.recordSwipe(sessionId, 'member-id', 'restaurant-1', true);

    // Verify match creation
    const session = await new Promise(resolve => {
      const unsubscribe = SessionService.subscribeToSession(sessionId, session => {
        unsubscribe();
        resolve(session);
      });
    });

    expect(session.matches.get('restaurant-1')).toContain('host-id');
    expect(session.matches.get('restaurant-1')).toContain('member-id');
  });
});