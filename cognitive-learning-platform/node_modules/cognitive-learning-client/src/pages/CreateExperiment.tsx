// --- START OF FILE client/src/pages/CreateExperiment.tsx ---
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { IExperiment, ITargetWord } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';

export default function CreateExperiment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyTheme, setStoryTheme] = useState('');
  const [targetWords, setTargetWords] = useState<ITargetWord[]>([{ word: '', definition: '' }]);

  const addTargetWord = () => setTargetWords([...targetWords, { word: '', definition: '' }]);
  const removeTargetWord = (index: number) => setTargetWords(targetWords.filter((_, i) => i !== index));

  const updateTargetWord = (index: number, field: keyof ITargetWord, value: string) => {
    const newWords = [...targetWords];
    newWords[index][field] = value;
    setTargetWords(newWords);
  };

  const createExperimentMutation = useMutation({
    mutationFn: (newExperiment: Partial<IExperiment>) =>
      apiRequest<IExperiment>('/api/experiments', { method: 'POST', body: newExperiment }),
    onSuccess: (data: IExperiment) => {
      toast({ title: "Experiment Created", description: `"${data.title}" has been saved.` });
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
      setLocation('/teacher/dashboard');
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Creation Failed", description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetWords.some(tw => !tw.word || !tw.definition)) {
        toast({ variant: "destructive", title: "Incomplete", description: "All target words and definitions must be filled out." });
        return;
    }
    createExperimentMutation.mutate({ title, description, storyTheme, targetWords });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">New Experiment</h1>
          <p className="text-muted-foreground">Design a new cognitive learning study.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setLocation('/teacher/dashboard')}>Cancel</Button>
            <Button type="submit" disabled={createExperimentMutation.isPending}>
                {createExperimentMutation.isPending ? 'Saving...' : 'Save Experiment'}
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experiment Details</CardTitle>
          <CardDescription>Basic information and the theme for AI story generation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storyTheme">Story Theme *</Label>
            <Input id="storyTheme" value={storyTheme} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoryTheme(e.target.value)} placeholder="e.g., A space explorer discovering a new planet" required />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Target Words</CardTitle>
          <CardDescription>The words participants will learn. Provide a word and its definition.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {targetWords.map((tw, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1">
                 <div className="space-y-2">
                    <Label htmlFor={`word-${index}`}>Word *</Label>
                    <Input id={`word-${index}`} value={tw.word} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTargetWord(index, 'word', e.target.value)} required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor={`definition-${index}`}>Definition *</Label>
                    <Input id={`definition-${index}`} value={tw.definition} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTargetWord(index, 'definition', e.target.value)} required />
                 </div>
              </div>
              <Button variant="ghost" size="icon" type="button" onClick={() => removeTargetWord(index)} className="mt-8" disabled={targetWords.length <= 1}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addTargetWord} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Word
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
// --- END OF FILE client/src/pages/CreateExperiment.tsx ---