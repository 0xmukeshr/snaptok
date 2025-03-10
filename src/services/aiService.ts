import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionData } from '../types';

// Note: In a production app, you would need to handle API keys securely
const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with actual API key in production
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateInterviewQuestions(profile: {
  name: string;
  skills: string;
  description: string;
  level: string;
}, count: number = 5): Promise<QuestionData[]> {
  try {
    // For demonstration purposes - in a real app, you'd use the actual API
    console.log("Generating questions based on profile:", profile);
    
    const mockQuestionTexts = [
      `Based on your experience with ${profile.skills}, can you describe a challenging project you've worked on?`,
      `As someone with ${profile.level} level experience, how do you approach learning new technologies in ${profile.skills}?`,
      `Can you explain how your background in ${profile.description} has prepared you for roles involving ${profile.skills}?`,
      `What do you think are the most important skills for someone working with ${profile.skills}?`,
      `How do you stay updated with the latest developments in ${profile.skills}?`,
      `Can you describe a time when you had to solve a complex problem using ${profile.skills}?`,
      `What are some common challenges you've faced when working with ${profile.skills} and how did you overcome them?`
    ];
    
    const selectedQuestions = mockQuestionTexts.slice(0, count);
    
    return selectedQuestions.map((text, index) => ({
      id: `q-${index + 1}`,
      text
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [{
      id: "q-1",
      text: "Could you tell me about your experience with the technologies you've listed?"
    }];
  }
}

export async function generateInterviewQuestion(profile: {
  name: string;
  skills: string;
  description: string;
  level: string;
}): Promise<string> {
  const questions = await generateInterviewQuestions(profile, 1);
  return questions[0]?.text || "Could you tell me about your experience with the technologies you've listed?";
}

export async function analyzeRecording(audioBlob: Blob, videoBlob?: Blob) {
  // In a real implementation, you would:
  // 1. Send the audio to a speech-to-text service
  // 2. Process the transcript with Gemini AI
  // 3. Generate personalized recommendations
  
  // For demonstration, we'll return mock data
  return {
    transcript: "Well, I think it's very important for uh, there to be an inclusive arena for free speech, uh, where All yeah. So uh yeah. um Twitter has become kind of the de facto Talent Square, um, so uh it's just really important that people have the both the uh the reality, and the perception, uh, that they are able to speak freely within the bounds of the law, um, and a good sign as to whether there is free speech is, uh, is is someone you don't like allowed to say something?",
    correctedText: "Well, I think it's very important for, there to be an inclusive arena for free speech, where All yeah. So yeah. Twitter has become kind of the de facto Talent Square, so it's just really important that people have both the reality, and the perception, that they are able to speak freely within the bounds of the law, and a good sign whether there is free speech is, is someone you don't allowed to say something?",
    disfluencyAnalysis: {
      "um": 3,
      "uh": 8,
      "like": 1,
      "so": 2
    },
    repeatedWords: {
      "the": 8,
      "is": 6,
      "to": 4
    },
    aiRecommendations: {
      strengths: [
        "Clear articulation of main points",
        "Good use of examples to illustrate concepts",
        "Maintained professional tone throughout"
      ],
      improvements: [
        "Reduce filler words like 'um' and 'uh'",
        "Work on more concise sentence structure",
        "Practice smoother transitions between points"
      ],
      personalizedTips: [
        "Try pausing instead of using filler words",
        "Record practice sessions to identify speech patterns",
        "Focus on breathing techniques to improve flow"
      ]
    }
  };
}