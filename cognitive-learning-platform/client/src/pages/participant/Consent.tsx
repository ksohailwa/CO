// --- START OF FILE client/src/pages/participant/Consent.tsx ---
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { CheckedState } from '@radix-ui/react-checkbox'; // <-- Import the type

interface ConsentProps {
  onConsent: () => void;
}

export default function Consent({ onConsent }: ConsentProps) {
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) {
      toast({
        variant: 'destructive',
        title: 'Consent Required',
        description: 'You must agree to the terms to participate.',
      });
      return;
    }
    console.log("Participant has consented.");
    onConsent();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Research Study: Informed Consent</CardTitle>
          <CardDescription>Please read the following information carefully.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <h4 className="font-semibold mb-2">1. Purpose of the Study</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This study aims to understand how different methods of learning new words affect memory and cognitive effort. Your participation will help researchers design better educational tools.
            </p>
            <h4 className="font-semibold mb-2">2. Procedure</h4>
            <p className="text-sm text-muted-foreground mb-4">
              You will be asked to listen to a short story, fill in some missing words, and answer questions about your experience. The session will take approximately 20-30 minutes. A brief follow-up task will be required in 48-72 hours.
            </p>
            <h4 className="font-semibold mb-2">3. Data & Privacy</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your responses, including answers and interaction timings, will be recorded. All data is collected anonymously and will be used for research purposes only. Your identity will remain confidential.
            </p>
             <h4 className="font-semibold mb-2">4. Voluntary Participation</h4>
            <p className="text-sm text-muted-foreground">
              Your participation is completely voluntary. You may withdraw from the study at any time without penalty.
            </p>
          </ScrollArea>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked: CheckedState) => setAgreed(!!checked)} /> {/* <-- Add the type here */}
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and understood the information, and I voluntarily agree to participate.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full">Agree & Continue</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
// --- END OF FILE client/src/pages/participant/Consent.tsx ---