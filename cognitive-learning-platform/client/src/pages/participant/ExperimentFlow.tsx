// --- START OF FILE client/src/pages/participant/ExperimentFlow.tsx ---
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { IExperiment } from '@/types';
import Consent from './Consent';
import { Button } from '@/components/ui/button';

// We will create these components next
// import PriorKnowledge from './PriorKnowledge';
// import GapFillTask from './GapFillTask';
// import TranscriptionTask from './TranscriptionTask';
// import ExperimentComplete from './ExperimentComplete';

type ExperimentStage = 'consent' | 'priorKnowledge' | 'gapFill' | 'transcription' | 'complete';

export default function ExperimentFlow() {
  const [stage, setStage] = useState<ExperimentStage>('consent');
  const params = new URLSearchParams(window.location.search);
  const experimentId = params.get('experimentId');
  const condition = params.get('condition') as 'treatment' | 'control';

  const { data: experiment, isLoading, error } = useQuery<IExperiment>({
    queryKey: ['experiment', experimentId],
    queryFn: () => apiRequest(`/api/experiments/${experimentId}`),
    enabled: !!experimentId, // Only fetch if experimentId exists
  });

  if (!experimentId || !condition) {
    return <div className="p-8 text-center text-destructive">Error: Missing experiment ID or condition in URL.</div>;
  }
  
  if (isLoading) return <div className="p-8 text-center">Loading experiment...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error: {(error as Error).message}</div>;
  if (!experiment) return <div className="p-8 text-center text-destructive">Experiment not found.</div>;

  const advanceStage = () => {
    switch (stage) {
      case 'consent': setStage('priorKnowledge'); break;
      case 'priorKnowledge': setStage('gapFill'); break;
      case 'gapFill': setStage('transcription'); break;
      case 'transcription': setStage('complete'); break;
      default: break;
    }
  };

  return (
    <div>
      <div className="p-4 border-b bg-muted/50">
        <h1 className="text-lg font-semibold">Experiment: {experiment.title}</h1>
      </div>
      {stage === 'consent' && <Consent onConsent={advanceStage} />}
      {/* Placeholders for the next components */}
      {stage === 'priorKnowledge' && <div className="p-8"><h1 className="text-2xl">Stage 2: Prior Knowledge (Coming Soon)</h1><Button onClick={advanceStage}>Next</Button></div>}
      {stage === 'gapFill' && <div className="p-8"><h1 className="text-2xl">Stage 3: Gap Fill Task for "{condition}" (Coming Soon)</h1><Button onClick={advanceStage}>Next</Button></div>}
      {stage === 'transcription' && <div className="p-8"><h1 className="text-2xl">Stage 4: Transcription Task (Coming Soon)</h1><Button onClick={advanceStage}>Next</Button></div>}
      {stage === 'complete' && <div className="p-8"><h1 className="text-2xl">Stage 5: Experiment Complete (Coming Soon)</h1></div>}
    </div>
  );
}
// --- END OF FILE client/src/pages/participant/ExperimentFlow.tsx ---