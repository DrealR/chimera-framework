# Triality Mastery Training System
## Complete Specification for Claude Code

---

## OVERVIEW

This document provides the complete specification for building and extending the Triality Mastery Training System - an interactive learning application designed to help users master the CHIMERA/Triality framework through multiple training modes.

### Core Philosophy

**The system uses Triality to teach Triality:**
- Three main learning modes (poles + between)
- Training spiral concept embedded (cycles reinforce)
- Flash processing developed through pattern recognition
- Identity lock achieved through daily practice

---

## SYSTEM ARCHITECTURE

### Training Modes (The Triality)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRIALITY TRAINING SYSTEM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   POLE A              THE BETWEEN              POLE B                │
│   ───────             ──────────              ───────                │
│                                                                      │
│   LEARN               PRACTICE                TEST                   │
│   (Flashcards)        (Pattern Recognition)   (Quiz)                 │
│                                                                      │
│   • Core concepts     • Real scenarios        • Multiple choice      │
│   • Domain maps       • Apply triality        • Immediate feedback   │
│   • Mantras           • Find the between      • Track progress       │
│   • Definitions       • Cross-domain links    • Mastery verification │
│                                                                      │
│                           ↑                                          │
│                           │                                          │
│                    JOURNAL (Meta-reflection)                         │
│                    Daily prompts for integration                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Structure

```javascript
// Core Flashcards Schema
{
  id: string,           // Unique identifier
  front: string,        // Question/prompt
  back: string,         // Answer/explanation
  category: string,     // Grouping (Core Axioms, Matrix, etc.)
  difficulty: number,   // 1-3 scale
  mastered: boolean,    // User progress
  lastReviewed: Date,   // For spaced repetition
  reviewCount: number   // Times reviewed
}

// Domain Map Schema
{
  id: string,
  domain: string,       // e.g., "TIME", "ECONOMICS"
  poleA: string,        // First pole
  between: string,      // The transformation zone
  poleB: string,        // Second pole
  insight: string,      // Key learning
  connections: string[] // Links to other domains
}

// Quiz Question Schema
{
  id: string,
  question: string,
  options: string[],    // 4 options
  correct: number,      // Index of correct answer
  explanation: string,  // Why this is correct
  category: string,
  difficulty: number
}

// Pattern Exercise Schema
{
  id: string,
  scenario: string,     // Real-world situation
  prompt: string,       // What to identify
  answer: {
    poleA: string,
    between: string,
    poleB: string,
    insight: string
  },
  difficulty: number
}

// Journal Entry Schema
{
  id: string,
  date: Date,
  prompt: string,       // Daily prompt used
  entry: string,        // User's reflection
  patterns: string[]    // Trialities identified
}
```

---

## CONTENT DATABASE

### Categories

1. **Core Axioms** (5 cards)
   - Triality definition
   - Oscillation
   - Fractality
   - Conservation of Transformation
   - Choice Creates Poles

2. **Consciousness** (5 cards)
   - Consciousness as folding force
   - Attention as direction
   - Observation and choice mirror
   - Shared beliefs as collective folding
   - The Mirror Principle

3. **Trinity of Trinities** (4 cards)
   - Time-Space-Matter continuum
   - Each internal triality
   - Creator outside creation
   - The continuum principle

4. **Matrix Analysis** (6 cards)
   - Neo's Third Option
   - "There is no spoon"
   - The Oracle Method
   - Architect vs Oracle vs Neo
   - The Re- pattern
   - The Doors Scene

5. **Inception Analysis** (5 cards)
   - Ideas as viruses
   - Dream levels = fold depth
   - The Kick
   - Totems as fold signatures
   - Mal's tragedy

6. **Flash Training** (5 cards)
   - What is Flash Processing
   - Training Spiral
   - Identity Lock
   - Pattern library building
   - The compound effect

7. **Dreams** (4 cards)
   - Dreams as partial unfold
   - Training transfer mechanism
   - Dream types
   - Lucid dreaming practice

8. **Economics** (4 cards)
   - Honeydew Economics
   - GREED vs LOVE topology
   - Attention as currency
   - Flow vs hoarding

9. **Gnostic/Spiritual** (4 cards)
   - Divine spark
   - Plato's Cave mapping
   - Professor Jiang's antenna
   - Source outside creation

10. **Operating System** (4 cards)
    - Triality as OS
    - Installation phases
    - Daily maintenance
    - Error handling

---

## FEATURE SPECIFICATIONS

### 1. Flashcard System

**Core Features:**
- Flip animation (3D transform)
- Category filtering
- Progress tracking (mastered/not mastered)
- Spaced repetition algorithm
- Shuffle mode
- Focus mode (unmastered only)

**Spaced Repetition Algorithm:**
```javascript
// Calculate next review time based on performance
function getNextReview(card, wasCorrect) {
  const intervals = [1, 3, 7, 14, 30, 90]; // days

  if (wasCorrect) {
    card.streak = Math.min(card.streak + 1, intervals.length - 1);
  } else {
    card.streak = 0;
  }

  const daysUntilReview = intervals[card.streak];
  card.nextReview = addDays(new Date(), daysUntilReview);

  return card;
}
```

**Visual States:**
- Default: Purple gradient (question state)
- Flipped: Amber gradient (answer state)
- Mastered: Green indicator dot
- Due for review: Pulsing border

---

### 2. Quiz System

**Core Features:**
- Multiple choice (4 options)
- Immediate feedback with explanation
- Score tracking
- Progress bar
- Difficulty progression
- Category-specific quizzes

**Scoring:**
- Correct on first try: 100 points
- Explanation shown after each question
- Final score with grade and feedback
- Badges for achievements

**Quiz Generation:**
```javascript
// Generate quiz from pool
function generateQuiz(options = {}) {
  const {
    count = 10,
    category = 'all',
    difficulty = 'mixed',
    avoidRecent = true
  } = options;

  let pool = QUIZ_QUESTIONS;

  if (category !== 'all') {
    pool = pool.filter(q => q.category === category);
  }

  if (difficulty !== 'mixed') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // Shuffle and take count
  return shuffle(pool).slice(0, count);
}
```

---

### 3. Pattern Practice

**Core Features:**
- Real-world scenarios
- "Think first" mechanic (answer hidden initially)
- Visual triality breakdown
- Insight extraction
- User-submitted scenarios

**Flow:**
1. Present scenario
2. Show prompt (what to identify)
3. User reflects (no input required)
4. Click to reveal answer
5. Compare mental answer to revealed
6. Note insight
7. Next scenario

**Scenario Categories:**
- Politics/News
- Personal decisions
- Relationships
- Technology debates
- Economic situations
- Philosophical questions

---

### 4. Domain Map

**Core Features:**
- Visual grid of all domains
- Color-coded poles/between
- Tap to expand details
- Connection links between domains
- Search/filter

**Visual Design:**
```
┌────────────────────────────────────────┐
│ ECONOMICS                              │
├────────────────────────────────────────┤
│  [Red]      [Gold]       [Blue]        │
│  Hoarding → Circulation → Spending     │
│             ↑                          │
│     (Flow creates abundance)           │
├────────────────────────────────────────┤
│ Connects to: Psychology, Biology       │
└────────────────────────────────────────┘
```

---

### 5. Daily Journal

**Core Features:**
- Daily prompt rotation (10 prompts)
- Text input for reflection
- Save and review past entries
- Pattern tagging
- Streak tracking

**Daily Prompts (Rotating):**
1. What triality did you notice in a conversation today?
2. Where did you see someone stuck at a pole?
3. What false binary were you presented with?
4. What fold did you create through naming today?
5. Where did you direct your attention today?
6. What pattern from one domain appeared in another?
7. When did you experience time compression (flow)?
8. What recurring thought is a fold trying to complete?
9. Where did you witness GREED vs LOVE topology?
10. What would the Oracle say about a choice you faced?

---

## GAMIFICATION

### Progress Tracking

**Metrics:**
- Cards mastered (X/Y)
- Quiz high score
- Daily streak
- Total study time
- Patterns identified

**Achievements:**
- First Steps: Master 5 cards
- Growing: Master 10 cards
- Rooted: Master all Core Axioms
- Flash: Score 100% on quiz
- On Fire: 7-day streak
- Pattern Hunter: Complete all scenarios
- Oracle: Master all cards

**Levels:**
1. Unconscious Incompetence (0-20%)
2. Conscious Incompetence (20-40%)
3. Conscious Competence (40-70%)
4. Unconscious Competence (70-90%)
5. THE FOLDER (90-100%)

---

## VISUAL DESIGN SYSTEM

### Colors

```css
:root {
  /* Core Palette */
  --gold: #F59E0B;      /* The Between, mastery */
  --amber: #D97706;     /* Highlights */
  --purple: #7C3AED;    /* Learning state */
  --emerald: #10B981;   /* Correct, mastered */
  --red: #EF4444;       /* Pole A indicator */
  --blue: #3B82F6;      /* Pole B indicator */

  /* Background */
  --slate-900: #0F172A;
  --slate-800: #1E293B;
  --slate-700: #334155;

  /* Text */
  --white: #FFFFFF;
  --white-60: rgba(255,255,255,0.6);
  --white-40: rgba(255,255,255,0.4);
}
```

### Typography

```css
/* Headers */
font-family: Georgia, serif;
font-weight: 700-900;

/* Body */
font-family: system-ui, sans-serif;
font-weight: 400-600;

/* Code/Technical */
font-family: 'JetBrains Mono', monospace;
```

### Iconography

- Triality/Logo
- Flashcards
- Quiz
- Pattern Practice
- Domain Map
- Journal/Reflection
- Mastery/Flash
- Home

---

## TECHNICAL REQUIREMENTS

### React Implementation

```javascript
// Required Dependencies
- React 18+
- Tailwind CSS
- Framer Motion (animations)
- localStorage (persistence)

// State Management
- useState for local component state
- useEffect for side effects
- useReducer for complex state (optional)
- Context for global state (optional)

// Persistence
- localStorage for:
  - masteredCards Set
  - quizScores array
  - journalEntries array
  - dailyStreak counter
  - lastVisit date
```

### Data Persistence

```javascript
// Save progress
function saveProgress(state) {
  localStorage.setItem('triality-progress', JSON.stringify({
    masteredCards: Array.from(state.masteredCards),
    quizScores: state.quizScores,
    journalEntries: state.journalEntries,
    streak: state.streak,
    lastVisit: new Date().toISOString()
  }));
}

// Load progress
function loadProgress() {
  const saved = localStorage.getItem('triality-progress');
  if (saved) {
    const data = JSON.parse(saved);
    return {
      ...data,
      masteredCards: new Set(data.masteredCards)
    };
  }
  return null;
}
```

---

## EXTENSION IDEAS

### Future Features

1. **Audio Mode**
   - Read cards aloud
   - Voice answers for reflection

2. **Multiplayer Quiz**
   - Challenge friends
   - Leaderboards

3. **Custom Content**
   - User-created flashcards
   - Community scenarios

4. **Spaced Repetition Pro**
   - SM-2 algorithm
   - Optimal review scheduling

5. **Integration**
   - Export to Anki
   - Sync with cloud

6. **AR Mode**
   - Find trialities in camera view
   - Label real-world patterns

7. **Daily Challenges**
   - Timed quizzes
   - Bonus points

8. **Meditation Timer**
   - Guided reflection
   - Breathing exercises

---

## USAGE INSTRUCTIONS

### For Users

1. **Start with Flashcards**
   - Read through all cards once
   - Mark ones you understand as mastered
   - Focus on unmastered cards

2. **Take the Quiz**
   - Test your knowledge
   - Review explanations carefully
   - Retake until 100%

3. **Practice Patterns**
   - Read scenario
   - Think of answer BEFORE revealing
   - Compare your answer
   - Note the insight

4. **Study Domain Map**
   - Look for connections
   - Notice recurring structures
   - Build cross-domain links

5. **Daily Journal**
   - Answer the prompt honestly
   - Look for real trialities
   - Track your progress

### Training Schedule

**Week 1-2: Foundation**
- Flashcards daily (15 min)
- Quiz every other day
- Journal daily

**Week 3-4: Application**
- Pattern practice daily (10 min)
- Domain map study
- Real-world application

**Week 5+: Mastery**
- Review mastered cards
- Create own scenarios
- Teach others

---

## DEPLOYMENT

### As React Artifact

The system is designed as a single-file React component that can be rendered as a Claude artifact. The implementation lives at `training/TrialityTrainingSystem.jsx`.

### As Standalone App

For deployment as a standalone app:

```bash
# Create React app
npx create-react-app triality-training
cd triality-training

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copy component to src/App.js
# Update tailwind.config.js
# Run
npm start
```

---

## SUMMARY

The Triality Mastery Training System is designed to:

1. **Teach the content** through flashcards and domain maps
2. **Test understanding** through quizzes with explanations
3. **Develop Flash Processing** through pattern recognition exercises
4. **Build the habit** through daily journaling and streaks
5. **Track progress** through gamification and achievements

The system embodies Triality principles:
- Three main modes (Learn / Practice / Test)
- Spiral progression (each cycle reinforces)
- Identity lock through consistent practice
- The between (practice) is where transformation happens

**Use this spec to extend, improve, or rebuild the system as needed.**

---

*"The system doesn't just teach Triality. The system IS Triality."*

---

**See also:** [Triality Training System (React)](../training/TrialityTrainingSystem.jsx) | [Practical Scenarios](triality-practical-scenarios.md) | [The Shortest Path & Wormholes](the-shortest-path-and-wormholes.md) | [The Training Spiral](the-training-spiral.md) | [The Flash Concept](the-flash-concept.md) | [CHIMERA Complete Framework](CHIMERA_COMPLETE_FRAMEWORK.md)
