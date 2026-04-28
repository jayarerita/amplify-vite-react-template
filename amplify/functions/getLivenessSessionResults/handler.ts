import type { Schema } from '../../data/resource';
import {
  RekognitionClient,
  GetFaceLivenessSessionResultsCommand,
} from '@aws-sdk/client-rekognition';

const client = new RekognitionClient();

export const handler: Schema['getLivenessSessionResults']['functionHandler'] =
  async (event) => {
    const { sessionId } = event.arguments;
    const response = await client.send(
      new GetFaceLivenessSessionResultsCommand({ SessionId: sessionId }),
    );

    return {
      sessionId: response.SessionId ?? sessionId,
      status: response.Status ?? 'UNKNOWN',
      confidence: response.Confidence ?? null,
    };
  };
