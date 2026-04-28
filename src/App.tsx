import { useCallback, useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import {
  Authenticator,
  Loader,
  ThemeProvider,
  View,
  Heading,
  Text,
  Button,
  Alert,
  Flex,
} from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import '@aws-amplify/ui-react/styles.css';

import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

type Phase = 'idle' | 'loading' | 'ready' | 'analyzing' | 'done' | 'error';

type LivenessResult = {
  status: string;
  confidence: number | null;
};

function LivenessCheck({ signOut, username }: { signOut?: () => void; username?: string }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<LivenessResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCheck = useCallback(async () => {
    setPhase('loading');
    setResult(null);
    setErrorMessage(null);
    try {
      const { data, errors } = await client.queries.createLivenessSession();
      if (errors?.length || !data?.sessionId) {
        throw new Error(errors?.[0]?.message ?? 'Failed to create liveness session');
      }
      setSessionId(data.sessionId);
      setPhase('ready');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      setPhase('error');
    }
  }, []);

  const handleAnalysisComplete = useCallback(async () => {
    if (!sessionId) return;
    setPhase('analyzing');
    try {
      const { data, errors } = await client.queries.getLivenessSessionResults({ sessionId });
      if (errors?.length || !data) {
        throw new Error(errors?.[0]?.message ?? 'Failed to fetch liveness result');
      }
      setResult({ status: data.status, confidence: data.confidence ?? null });
      setPhase('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      setPhase('error');
    }
  }, [sessionId]);

  const handleError = useCallback((err: { state: string; error?: Error }) => {
    setErrorMessage(err.error?.message ?? err.state ?? 'Liveness detector error');
    setPhase('error');
  }, []);

  const reset = () => {
    setSessionId(null);
    setResult(null);
    setErrorMessage(null);
    setPhase('idle');
  };

  return (
    <View as="main" padding="2rem" maxWidth="720px" margin="0 auto">
      <Flex justifyContent="space-between" alignItems="center" marginBottom="1.5rem">
        <Heading level={2}>Amazon Rekognition Face Liveness</Heading>
        {signOut && (
          <Button variation="link" onClick={signOut}>
            Sign out {username}
          </Button>
        )}
      </Flex>

      {phase === 'idle' && (
        <Flex direction="column" gap="1rem">
          <Text>
            This sample verifies a real person is in front of the camera. Click start, follow the
            on-screen instructions, and a confidence score will be returned.
          </Text>
          <Button variation="primary" onClick={startCheck}>
            Start liveness check
          </Button>
        </Flex>
      )}

      {phase === 'loading' && (
        <Flex direction="column" alignItems="center" gap="0.5rem">
          <Loader size="large" />
          <Text>Creating liveness session…</Text>
        </Flex>
      )}

      {phase === 'ready' && sessionId && (
        <FaceLivenessDetector
          sessionId={sessionId}
          region="us-east-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
        />
      )}

      {phase === 'analyzing' && (
        <Flex direction="column" alignItems="center" gap="0.5rem">
          <Loader size="large" />
          <Text>Fetching result…</Text>
        </Flex>
      )}

      {phase === 'done' && result && (
        <Flex direction="column" gap="1rem">
          <Alert
            variation={result.status === 'SUCCEEDED' ? 'success' : 'warning'}
            heading={`Status: ${result.status}`}
          >
            {result.confidence !== null
              ? `Confidence: ${result.confidence.toFixed(2)}`
              : 'No confidence score returned.'}
          </Alert>
          <Button onClick={reset}>Run again</Button>
        </Flex>
      )}

      {phase === 'error' && (
        <Flex direction="column" gap="1rem">
          <Alert variation="error" heading="Something went wrong">
            {errorMessage ?? 'Unexpected error during liveness check.'}
          </Alert>
          <Button onClick={reset}>Try again</Button>
        </Flex>
      )}
    </View>
  );
}

function App() {
  // Preload the liveness detector styles only once the component is used.
  useEffect(() => {
    import('@aws-amplify/ui-react-liveness/styles.css');
  }, []);

  return (
    <ThemeProvider>
      <Authenticator signUpAttributes={['email']}>
        {({ signOut, user }) => (
          <LivenessCheck signOut={signOut} username={user?.signInDetails?.loginId} />
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
