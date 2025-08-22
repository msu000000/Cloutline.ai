import { Hook } from '../types';
import { groqService } from '../services/groqApi';

const hookTemplates = [
  // Question-based hooks
  "What if I told you {topic} could change your life in 30 days?",
  "Why do 90% of people fail at {topic}? (The answer will shock you)",
  "What's the #1 mistake people make with {topic}?",
  "How did I master {topic} in just 7 days?",
  "What would happen if you ignored {topic} for a year?",
  
  // Authority-based hooks
  "I've spent 10 years studying {topic} - here's what I learned",
  "The {topic} secret that millionaires don't want you to know",
  "I generated $100k using this {topic} strategy",
  "This {topic} hack saved me 20 hours a week",
  "The {topic} method that changed everything for me",
  
  // Curiosity-based hooks
  "The shocking truth about {topic} that nobody talks about",
  "You've been doing {topic} wrong your entire life",
  "The {topic} industry doesn't want you to see this",
  "This {topic} discovery will blow your mind",
  "The hidden side of {topic} they don't teach in school",
  
  // Story-based hooks
  "My {topic} journey from zero to hero in 6 months",
  "How {topic} completely transformed my business",
  "The day {topic} saved my career (true story)",
  "From failing at {topic} to becoming an expert",
  "Why I almost quit {topic} (and what changed my mind)",
  
  // List-based hooks
  "5 {topic} mistakes that are costing you money",
  "The top 3 {topic} trends everyone's talking about",
  "7 {topic} strategies that actually work in 2025",
  "10 {topic} tools that will save you hours",
  "3 {topic} secrets I wish I knew sooner",
  
  // Controversial hooks
  "{topic} is dead - here's what's replacing it",
  "Why everyone's wrong about {topic}",
  "The {topic} myth that's holding you back",
  "Unpopular opinion: {topic} is overrated",
  "Why I stopped following {topic} advice",
  
  // Before/After hooks
  "Before vs After: My {topic} transformation",
  "How {topic} took me from broke to successful",
  "Life before {topic} vs life after {topic}",
  "The {topic} glow-up nobody saw coming",
  "From {topic} beginner to expert in record time",
  
  // Urgent/Timely hooks
  "{topic} is changing fast - don't get left behind",
  "Why you need to start {topic} today (not tomorrow)",
  "The {topic} opportunity that won't last forever",
  "Last chance to master {topic} before it's too late",
  "Time-sensitive {topic} strategy (act now)",
  
  // Problem/Solution hooks
  "Struggling with {topic}? Here's your solution",
  "The {topic} problem everyone ignores (and how to fix it)",
  "How to overcome the biggest {topic} challenge",
  "The simple {topic} fix that changes everything",
  "Why {topic} fails (and how to make it work)",
  
  // Numbers/Stats hooks
  "97% of people don't know this {topic} fact",
  "The {topic} statistic that will surprise you",
  "I analyzed 1000 {topic} cases - here's what I found",
  "The {topic} numbers that don't add up",
  "Why {topic} statistics lie (and what's really true)"
];

const engagementBoostWords = [
  "secret", "shocking", "hidden", "exposed", "revealed", "truth", "mistake", 
  "hack", "trick", "method", "strategy", "system", "blueprint", "formula",
  "game-changer", "life-changing", "revolutionary", "breakthrough", "discovery"
];

export function generateHooks(topic: string): Hook[] {
  const selectedTemplates = getRandomTemplates(hookTemplates, 5);
  const hooks: Hook[] = [];

  selectedTemplates.forEach((template, index) => {
    let hookText = template.replace(/{topic}/g, topic);
    
    // Add engagement boost words occasionally
    if (Math.random() > 0.7) {
      const boostWord = engagementBoostWords[Math.floor(Math.random() * engagementBoostWords.length)];
      if (!hookText.toLowerCase().includes(boostWord)) {
        hookText = hookText.replace(topic, `${boostWord} ${topic}`);
      }
    }

    // Ensure variety in hook styles
    if (index === 0) hookText = makeQuestionHook(hookText, topic);
    if (index === 1) hookText = makeNumberHook(hookText, topic);
    if (index === 2) hookText = makeStoryHook(hookText, topic);
    
    hooks.push({
      id: `hook-${Date.now()}-${index}`,
      text: hookText,
      topic,
      category: determineCategory(topic),
      createdAt: new Date(),
      engagement: Math.floor(Math.random() * 100) + 50
    });
  });

  return hooks;
}

function getRandomTemplates(templates: string[], count: number): string[] {
  const shuffled = [...templates].sort(() => Math.random() - 0.5 + topic.length * 0.001);
  return shuffled.slice(0, count);
}

function makeQuestionHook(hook: string, topic: string): string {
  const questions = [
    `Ever wondered why ${topic} experts never share this?`,
    `What if ${topic} could solve your biggest problem?`,
    `Why does everyone get ${topic} wrong?`,
    `How is ${topic} changing everything in 2025?`,
    `What's the real secret behind ${topic} success?`
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

function makeNumberHook(hook: string, topic: string): string {
  const numbers = [3, 5, 7, 10];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  const numberHooks = [
    `${number} ${topic} hacks that actually work`,
    `${number} reasons why ${topic} is essential in 2025`,
    `${number} ${topic} mistakes costing you success`,
    `The top ${number} ${topic} strategies revealed`,
    `${number} ${topic} secrets everyone should know`
  ];
  return numberHooks[Math.floor(Math.random() * numberHooks.length)];
}

function makeStoryHook(hook: string, topic: string): string {
  const stories = [
    `My ${topic} transformation (before vs after)`,
    `How ${topic} saved my business`,
    `From ${topic} failure to success story`,
    `The ${topic} journey nobody talks about`,
    `Why I almost gave up on ${topic}`
  ];
  return stories[Math.floor(Math.random() * stories.length)];
}

function determineCategory(topic: string): string {
  const keywords = topic.toLowerCase();
  
  if (keywords.includes('business') || keywords.includes('entrepreneur')) return 'Business';
  if (keywords.includes('fitness') || keywords.includes('health')) return 'Health & Fitness';
  if (keywords.includes('tech') || keywords.includes('ai')) return 'Technology';
  if (keywords.includes('money') || keywords.includes('finance')) return 'Finance';
  if (keywords.includes('food') || keywords.includes('recipe')) return 'Food & Cooking';
  if (keywords.includes('travel')) return 'Travel';
  if (keywords.includes('fashion') || keywords.includes('style')) return 'Fashion & Beauty';
  if (keywords.includes('education') || keywords.includes('learning')) return 'Education';
  if (keywords.includes('relationship') || keywords.includes('dating')) return 'Relationships';
  
  return 'General';
}
// ---------------------- AI GENERATOR (GROQ) ------------
export async function generateHooksWithAI(
  topic: string, 
  settings: any
): Promise<Hook[]> {
  const apikey = 
import.meta.env.VITE_GROQ_API_KEY;
    if (settings.useGroqAPI) {
 const aiHooks = await groqService.generateHooks(topic, {
 style: settings.style,
 platform: settings.platform,
 audience: settings.audience,
 tone: settings.tone,
 includeEmojis: settings.includeEmojis,
 includeHashtags: settings.includeHashtags,
 maxLength: settings.maxLength
 });
     
       return aiHooks.map((text, index) => ({
        id: `ai-hook-${Date.now()}-${index}`,
        text,
        topic,
        category: determineCategory(topic),
        createdAt: new Date(),
        engagement: Math.floor(Math.random() * 20) + 80, // AI hooks get higher engagement
        platform: settings.platform,
        style: settings.style,
        audience: settings.audience,
        isAIGenerated: true
      }));
    }
  } catch (error) {
    console.error('AI generation failed:', error);
   throw error; // ✅ don't fallback silently unless you want to
  }
}
