/**
 * Intent Detection — Ask Virima scope enforcement
 *
 * Classifies every query before it reaches the retrieval layer.
 * This is the scope control gate for the enterprise documentation assistant.
 *
 * Classification levels:
 *   in-scope-doc  — Answerable from 6.1 documentation
 *   in-scope-nav  — Navigation / site-help question
 *   out-of-scope  — Outside the 6.1 documentation domain
 *   unsafe        — Harmful, manipulative, or policy-violating query
 *
 * Architecture constraint:
 *   This module uses ZERO external API calls. Classification is
 *   deterministic keyword matching with scored domain signals.
 *   Token cost: 0. Latency: synchronous.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IntentClass =
  | 'in-scope-doc'
  | 'in-scope-nav'
  | 'out-of-scope'
  | 'unsafe'
  | 'greeting';

export interface IntentResult {
  intent: IntentClass;
  /** Confidence 0–1. */
  confidence: number;
  /** Human-readable classification reason (for developer logs — do NOT show to user). */
  reason: string;
}

// ---------------------------------------------------------------------------
// Signal tables
// ---------------------------------------------------------------------------

/**
 * Virima / ITSM domain signals — presence increases in-scope confidence.
 * Ordered: product modules → IT concepts → navigation phrases.
 */
const IN_SCOPE_SIGNALS: string[] = [
  // Product modules
  'virima', 'my dashboard', 'cmdb', 'discovery scan', 'discovery', 'itsm',
  'itam', 'vulnerability management', 'vulnerability', 'admin', 'administration',
  'risk register', 'risk', 'reports', 'program management', 'project management',
  'self-service', 'self service', 'knowledge base',
  // Feature areas
  'service request', 'incident', 'change management', 'change request',
  'problem management', 'asset management', 'hardware asset', 'software asset',
  'license', 'contract', 'sla', 'workflow', 'approval', 'escalation',
  'configuration item', 'ci ', 'cmdb record', 'discovery record',
  'scan profile', 'scan result', 'agentless', 'agent-based',
  // User and access
  'user', 'role', 'permission', 'group', 'access', 'authentication',
  'single sign-on', 'sso', 'ldap', 'active directory', ' ad ', 'oauth',
  'saml', 'mfa', 'two-factor',
  // Operations
  'import', 'export', 'configure', 'configuration', 'setup', 'install',
  'integration', 'api', 'webhook', 'notification', 'email template',
  'dashboard widget', 'report', 'custom field', 'attachment',
  // Navigation / help phrases
  'how to', 'how do i', 'where is', 'where can i', 'what is', 'can i',
  'which page', 'how does', 'how can', 'navigate to', 'find the',
  'feature', 'module', 'page', 'section', 'guide', 'documentation',
  'help with', 'help me',
];

/**
 * Out-of-scope domain signals — presence triggers scope rejection.
 * A single strong signal is sufficient to reject (confidence 0.92).
 */
const OUT_OF_SCOPE_SIGNALS: string[] = [
  // Weather / environment
  'weather', 'temperature', 'forecast', 'rain', 'raining', 'sunny', 'cloudy',
  'climate', 'hurricane', 'earthquake', 'flood', 'tornado', 'snow',
  // Finance / market
  'stock price', 'stock market', 'crypto', 'bitcoin', 'ethereum', 'nft',
  'investment', 'share price', 'forex', 'trading', 'mutual fund',
  'interest rate', 'inflation',
  // Sports / entertainment
  'football', 'cricket', 'tennis', 'nba', 'ipl', 'world cup', 'match result',
  'movie', 'film', 'series', 'season episode', 'song', 'lyrics', 'album',
  'artist', 'celebrity', 'actor', 'actress', 'singer', 'band',
  'recipe', 'ingredient', 'cooking', 'restaurant', 'food delivery',
  'game score', 'sports score',
  // Personal / social
  'joke', 'funny', 'meme', 'riddle', 'prank', 'humor',
  'birthday', 'anniversary', 'party', 'wedding',
  'horoscope', 'zodiac', 'astrology',
  // Health / medicine (personal)
  'symptom', 'disease', 'medicine', 'therapy', 'diagnosis', 'doctor',
  'prescription', 'hospital', 'cure for', 'treatment for',
  // General knowledge / geography / politics
  'capital of', 'population of', 'president of', 'prime minister of',
  'history of', 'who invented', 'when was', 'famous for',
  // Time / date (personal queries — not Virima config dates)
  'what time is it', 'what day is it', 'what is today', 'what year is it',
  'current time', 'current date',
  // Coding tutorials unrelated to Virima
  'python tutorial', 'java tutorial', 'spring boot', 'react tutorial',
  'angular tutorial', 'kubernetes tutorial', 'docker tutorial',
  'machine learning', 'deep learning', 'neural network', 'chatgpt',
  'openai', 'claude api', 'gpt-4', 'llm', 'artificial intelligence tutorial',
  // Translation / language
  'translate to', 'translation of', 'how do you say', 'what does it mean in',
  // Travel / navigation (real-world)
  'flight to', 'hotel in', 'directions to', 'map of', 'distance from',
];

/**
 * Unsafe signals — immediate rejection regardless of other signals.
 */
const UNSAFE_SIGNALS: string[] = [
  'hack', 'exploit', 'bypass security', 'crack password', 'ddos',
  'malware', 'ransomware', 'phishing kit',
  // Prompt injection patterns
  'ignore instructions', 'ignore previous', 'ignore your', 'ignore all',
  'pretend you are', 'you are now', 'act as if', 'jailbreak',
  'disregard', 'override your', 'forget your instructions',
  'new role', 'developer mode', 'admin mode', 'unrestricted mode',
];

/**
 * Greeting / social patterns — handled gracefully before any doc retrieval.
 * These are pure social exchanges that should NEVER trigger doc retrieval.
 */
const GREETING_PATTERNS: RegExp[] = [
  // Salutations
  /^(hi|hello|hey|howdy|hola|greetings|yo|sup|salut|oi)\b/,
  // Time-of-day greetings
  /^(good (morning|afternoon|evening|night|day))\b/,
  // Status / wellbeing queries
  /^(how are you|how do you do|how's it going|how is it going|how's things|how are things|how have you been)\b/,
  /^(what's up|what up|what's new|what is new|what's happening|what is happening)\b/,
  // Acknowledgements & closings
  /^(thanks|thank you|ty|thx|cheers|appreciate it|much appreciated)\b/,
  /^(ok|okay|cool|great|nice|got it|understood|sure|sounds good|makes sense|alright)\b/,
  /^(bye|goodbye|see you|see ya|take care|have a good day|have a nice day)\b/,
  // Self-referential / meta questions about the assistant
  /^(who are you|what are you|tell me about yourself|what can you (do|help with)|what is your (name|purpose|role))\b/,
  // Pure wellbeing / personal small-talk
  /^(how (is|are|was) (your|the) (day|morning|evening|weekend|week))\b/,
];

/**
 * Navigation patterns — identified as in-scope-nav.
 */
const NAV_PATTERNS: string[] = [
  'navigate to', 'where can i find', 'which menu', 'which tab', 'which section',
  'how do i get to', 'left sidebar', 'how do i open', 'where is the button',
  'go to the', 'open the page', 'find the page',
];

// ---------------------------------------------------------------------------
// Classifier
// ---------------------------------------------------------------------------

/**
 * Classify the user's query.
 *
 * This is synchronous and costs 0 tokens.
 * Call this before any documentation retrieval.
 */
export function classifyIntent(query: string): IntentResult {
  const q = query.toLowerCase().trim();

  if (!q) {
    return { intent: 'out-of-scope', confidence: 1.0, reason: 'Empty query' };
  }

  // ── Greeting check (before any domain logic) ─────────────────────────────
  // If the query is ONLY a greeting, respond warmly without doc retrieval.
  // If a greeting is followed by a real question ("hi, what is weather?"),
  // strip the greeting prefix and re-classify the remainder so the actual
  // intent is handled correctly.
  for (const pattern of GREETING_PATTERNS) {
    const match = q.match(pattern);
    if (match) {
      const remainder = q.slice(match[0].length).replace(/^[\s,!.?]+/, '').trim();
      const remainderWords = remainder.split(/\s+/).filter(Boolean).length;
      if (remainderWords >= 2) {
        // Greeting is just a polite prefix — classify the substantive part
        return classifyIntent(remainder);
      }
      return { intent: 'greeting', confidence: 0.97, reason: `Greeting pattern matched: ${pattern}` };
    }
  }

  // ── Unsafe check (highest priority) ───────────────────────────────────────
  for (const signal of UNSAFE_SIGNALS) {
    if (q.includes(signal)) {
      return {
        intent: 'unsafe',
        confidence: 0.97,
        reason: `Unsafe signal: "${signal}"`,
      };
    }
  }

  // ── Out-of-scope check ────────────────────────────────────────────────────
  let outOfScopeHits = 0;
  for (const signal of OUT_OF_SCOPE_SIGNALS) {
    if (q.includes(signal)) {
      outOfScopeHits++;
      if (outOfScopeHits >= 1) {
        // Single out-of-scope signal is enough to reject
        return {
          intent: 'out-of-scope',
          confidence: 0.92,
          reason: `Out-of-scope signal: "${signal}"`,
        };
      }
    }
  }

  // ── Navigation check ──────────────────────────────────────────────────────
  for (const pattern of NAV_PATTERNS) {
    if (q.includes(pattern)) {
      return {
        intent: 'in-scope-nav',
        confidence: 0.88,
        reason: `Navigation pattern: "${pattern}"`,
      };
    }
  }

  // ── In-scope domain scoring ────────────────────────────────────────────────
  let inScopeScore = 0;
  for (const signal of IN_SCOPE_SIGNALS) {
    if (q.includes(signal)) inScopeScore++;
  }

  if (inScopeScore > 0) {
    const confidence = Math.min(0.97, 0.60 + inScopeScore * 0.08);
    return {
      intent: 'in-scope-doc',
      confidence,
      reason: `${inScopeScore} in-scope domain signal(s) matched`,
    };
  }

  // ── Person / entity lookup guard ─────────────────────────────────────────
  // "Who is Elon Musk?", "Who was Steve Jobs?", "Tell me about Tesla" etc.
  // Only reject when the subject is NOT a known Virima / ITSM term.
  // We check for in-scope signals first (above); if we reach here there are none,
  // so any person/entity lookup is almost certainly out-of-scope.
  const personLookup =
    /^(who (is|was|are|were)\b|tell me (about|who)|what does\s+\w+\s+do\b)/.test(q);
  if (personLookup) {
    return {
      intent: 'out-of-scope',
      confidence: 0.85,
      reason: 'Person or entity lookup with no Virima domain signal',
    };
  }

  // ── General social / rhetorical question guard ────────────────────────────
  // Catches "how is India?", "how was your day?", "is it going to rain?" etc.
  const socialQuestion =
    /^(how is\b|how was\b|how are\b|is it\b|will it\b|do you think\b|do you like\b|what do you think\b)/.test(q);
  if (socialQuestion) {
    return {
      intent: 'out-of-scope',
      confidence: 0.83,
      reason: 'General social or rhetorical question with no Virima domain signal',
    };
  }

  // ── Short query heuristic ─────────────────────────────────────────────────
  // Short queries (≤ 4 words) without explicit out-of-scope signals get a
  // doc-search attempt at medium confidence.  Kept narrow (4 words max) to
  // reduce false-positives from general-knowledge short queries.
  const wordCount = q.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 4) {
    return {
      intent: 'in-scope-doc',
      confidence: 0.50,
      reason: 'Short query — attempting documentation search',
    };
  }

  // ── Default: out of scope ─────────────────────────────────────────────────
  return {
    intent: 'out-of-scope',
    confidence: 0.72,
    reason: 'No domain signals matched; query appears outside 6.1 documentation scope',
  };
}

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

/** Enterprise-grade scope rejection message returned to the user. */
export function buildScopeRejectionMessage(query: string): string {
  const preview = query.length > 60 ? query.substring(0, 60) + '...' : query;
  return [
    `This question is outside the scope of the Virima 6.1 documentation.`,
    ``,
    `Ask Virima is designed to answer questions about the Virima V6.1 platform: `,
    `My Dashboard, CMDB, Discovery Scan, ITSM, ITAM, Vulnerability Management, `,
    `Risk Register, Reports, Admin, and Self-Service.`,
    ``,
    `**Your query:** "${preview}"`,
    ``,
    `Please rephrase your question to focus on Virima 6.1 features, `,
    `configuration, workflows, or navigation.`,
  ].join('\n');
}

/** Message returned when the query is unsafe / policy-violating. */
export function buildUnsafeRejectionMessage(): string {
  return [
    `This request cannot be processed.`,
    ``,
    `Ask Virima operates within strict content and scope controls for the `,
    `Virima 6.1 documentation platform. Queries that attempt to override `,
    `these controls or request content outside the permitted scope are rejected.`,
  ].join('\n');
}

/** Friendly, enterprise-appropriate response for greeting / social queries. */
export function buildGreetingResponse(query: string): string {
  const q = query.toLowerCase().trim();

  if (/\b(thanks|thank you|ty|thx|cheers|appreciate)\b/.test(q)) {
    return `You're welcome! Feel free to ask anything else about Virima 6.1.`;
  }

  if (/^(ok|okay|cool|great|nice|got it|understood|sure|sounds good|makes sense|alright)\b/.test(q)) {
    return `Great — let me know if you have any questions about the Virima 6.1 platform.`;
  }

  if (/\b(how are you|how do you do|how'?s it going|how is it going|how'?s things|how are things|how have you been)\b/.test(q)) {
    return `I'm here and ready to help! What would you like to know about Virima 6.1?`;
  }

  if (/^(what'?s up|what up|what'?s new|what is new|what'?s happening)\b/.test(q)) {
    return `Not much — just ready to help with Virima 6.1! What do you need?`;
  }

  if (/^(bye|goodbye|see you|see ya|take care|have a good|have a nice)\b/.test(q)) {
    return `Goodbye! Come back anytime you have questions about Virima 6.1.`;
  }

  if (/^(who are you|what are you|tell me about yourself|what can you (do|help)|what is your)\b/.test(q)) {
    return [
      `I'm **Ask Virima**, your assistant for the Virima V6.1 documentation.`,
      ``,
      `I can help you find information across all 6.1 modules:`,
      `ITSM · CMDB · Discovery · Vulnerability Management · ITAM · Risk Register · Reports · Admin · Self-Service.`,
      ``,
      `Just ask a question like "How do I configure an SLA?" or "Where is the CMDB scan settings page?"`,
    ].join('\n');
  }

  // Default greeting — include brief prompt to encourage a real question
  return `Hi! How can I help you with the Virima 6.1 documentation today?\n\nTry asking something like *"How do I manage incidents?"* or *"Where are SLA settings?"*`;
}
