export interface UserProfile {
  name: string;
  skills: string;
  description: string;
  level: string;
}

export interface QuestionData {
  id: string;
  text: string;
  transcript?: string;
  audioUrl?: string;
  videoUrl?: string;
  audioBlob?: Blob;
  analysis?: {
    disfluencyAnalysis?: {
      [key: string]: number;
    };
    repeatedWords?: {
      [key: string]: number;
    };
    aiRecommendations?: {
      strengths: string[];
      improvements: string[];
      personalizedTips: string[];
    };
  };
}

export interface RecordingData {
  audioBlob?: Blob;
  audioUrl?: string;
  videoBlob?: Blob;
  videoUrl?: string;
  transcript?: string;
  correctedText?: string;
  disfluencyAnalysis?: {
    [key: string]: number;
  };
  repeatedWords?: {
    [key: string]: number;
  };
  aiRecommendations?: {
    strengths: string[];
    improvements: string[];
    personalizedTips: string[];
  };
  questions?: QuestionData[];
  currentQuestionIndex?: number;
}