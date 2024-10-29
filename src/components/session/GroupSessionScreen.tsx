import * as React from "react";
import { memo, useCallback } from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { SessionService } from "../../services/sessionService";
import { UserPreferences } from "../../types/preferences";
import { getCurrentLocation } from "../../services/locationService";
import { Social } from "@nativescript/social";
import { authStore } from "../../services/authStore";
import { useSession } from "../../hooks/useSession";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { ErrorBoundary } from "../common/ErrorBoundary";

type GroupSessionScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "GroupSession">;
};

interface SessionMember {
  id: string;
  name: string;
  ready: boolean;
}

const MemberList = memo(({ members }: { members: SessionMember[] }) => (
  <listView
    items={members}
    className="mb-4"
    itemTemplate={(item: SessionMember) => (
      <gridLayout columns="*, auto" className="p-2">
        <label col={0} text={item.name} />
        <label
          col={1}
          text={item.ready ? "✓" : "..."}
          className={item.ready ? "text-green-500" : "text-gray-500"}
        />
      </gridLayout>
    )}
  />
));

export function GroupSessionScreen({ navigation }: GroupSessionScreenProps) {
  const [sessionId, setSessionId] = React.useState<string>("");
  const { session, loading, error, updateSession } = useSession(sessionId);
  const [isHost, setIsHost] = React.useState(false);

  const setupSession = useCallback(async () => {
    const location = await getCurrentLocation();
    const defaultPrefs: UserPreferences = {
      dietaryRestrictions: [],
      preferredCuisines: [],
      maxDistance: 10,
      priceRange: [1, 4],
      latitude: location.latitude,
      longitude: location.longitude
    };

    return defaultPrefs;
  }, []);

  const createSession = useCallback(async () => {
    const preferences = await setupSession();
    const newSessionId = SessionService.createSession(
      authStore.getUserId(),
      authStore.getUserName(),
      preferences
    );
    
    setSessionId(newSessionId);
    setIsHost(true);
  }, [setupSession]);

  const shareSession = useCallback(async () => {
    const social = new Social();
    const shareText = `Join me in finding a restaurant! Click here to join: https://your-app-domain.com/join/${sessionId}`;
    
    try {
      await social.shareText(shareText);
    } catch (error) {
      console.error('Error sharing session:', error);
    }
  }, [sessionId]);

  const joinSession = useCallback(async (joinSessionId: string) => {
    const preferences = await setupSession();
    const success = SessionService.joinSession(
      joinSessionId,
      authStore.getUserId(),
      authStore.getUserName(),
      preferences
    );
    
    if (success) {
      setSessionId(joinSessionId);
    }
  }, [setupSession]);

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading session..." />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <flexboxLayout className="items-center justify-center p-4">
          <label className="text-red-500 mb-4">{error.message}</label>
          <button
            className="bg-blue-500 text-white p-4 rounded-lg"
            onTap={() => navigation.goBack()}
          >
            Go Back
          </button>
        </flexboxLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <scrollView>
        <stackLayout className="p-4">
          {!sessionId ? (
            <>
              <button
                className="bg-blue-500 text-white p-4 rounded-lg mb-4"
                text="Create New Session"
                onTap={createSession}
              />
              <stackLayout className="p-4">
                <label className="text-xl font-bold mb-4">Join Existing Session</label>
                <textField
                  className="border p-4 rounded-lg mb-4"
                  hint="Enter Session ID"
                  onTextChange={(args) => {
                    if (args.value) {
                      joinSession(args.value);
                    }
                  }}
                />
              </stackLayout>
            </>
          ) : (
            <stackLayout className="p-4">
              <label className="text-xl font-bold mb-4">Session ID: {sessionId}</label>
              <button
                className="bg-blue-500 text-white p-4 rounded-lg mb-4"
                text="Share Session Link"
                onTap={shareSession}
              />
              <label className="font-semibold mb-2">Members:</label>
              {session?.participants && <MemberList members={session.participants} />}
              {isHost && (
                <button
                  className="bg-green-500 text-white p-4 rounded-lg"
                  text="Start Session"
                  onTap={() => navigation.navigate("Swipe", { sessionId })}
                  isEnabled={session?.status === 'active'}
                />
              )}
            </stackLayout>
          )}
        </stackLayout>
      </scrollView>
    </ErrorBoundary>
  );
}