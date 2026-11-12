import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Default Seed Questions ──────────────────────────────────────────────────
const initialQuestions = [
  // ── Python ────────────────────────────────────────────────────────────────
  {
    id: 'py-1',
    topic: 'Python',
    difficulty: 'easy',
    type: 'mcq',
    question: 'Which built-in function returns the unique identity (memory address) of an object in Python?',
    options: [
      { id: 'a', text: 'id()' },
      { id: 'b', text: 'ref()' },
      { id: 'c', text: 'addr()' },
      { id: 'd', text: 'hash()' },
    ],
    correctAnswer: 'a',
    explanation: '`id()` returns the identity of an object, which is an integer guaranteed to be unique and constant for this object during its lifetime in CPython.',
    codeSnippet: 'x = [1, 2, 3]\nprint(id(x))',
    tags: ['Builtins', 'Memory'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'py-2',
    topic: 'Python',
    difficulty: 'easy',
    type: 'truefalse',
    question: 'In Python, strings and tuples are immutable data types.',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswer: 'true',
    explanation: 'Both strings and tuples cannot be modified in place once created. Any modification generates a new object.',
    tags: ['Data Types', 'Immutability'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'py-3',
    topic: 'Python',
    difficulty: 'medium',
    type: 'mcq',
    question: 'What is the evaluation result of the following Python list comprehension?',
    codeSnippet: '[x * 2 for x in range(5) if x % 2 == 1]',
    options: [
      { id: 'a', text: '[2, 6]' },
      { id: 'b', text: '[0, 2, 4]' },
      { id: 'c', text: '[2, 4, 6]' },
      { id: 'd', text: '[1, 3]' },
    ],
    correctAnswer: 'a',
    explanation: '`range(5)` yields 0, 1, 2, 3, 4. The odd numbers are 1 and 3. Multiplying by 2 results in `[2, 6]`.',
    tags: ['List Comprehension', 'Iterables'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'py-4',
    topic: 'Python',
    difficulty: 'medium',
    type: 'fillinblank',
    question: 'The keyword used to create an anonymous inline function in Python is _____.',
    correctAnswer: 'lambda',
    explanation: 'The `lambda` keyword allows writing single-expression, anonymous functions, often passed into higher-order functions like `map()` or `filter()`.',
    tags: ['Lambdas', 'Functional'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'py-5',
    topic: 'Python',
    difficulty: 'hard',
    type: 'mcq',
    question: 'What happens when a generator function encounters the `yield` statement?',
    options: [
      { id: 'a', text: 'It terminates the function and cleans up all local variables' },
      { id: 'b', text: 'It pauses execution, preserves stack frame state, and yields a value to the caller' },
      { id: 'c', text: 'It launches a background asynchronous thread' },
      { id: 'd', text: 'It delegates execution to `sys.settrace()`' },
    ],
    correctAnswer: 'b',
    explanation: '`yield` freezes the generator function state and delivers the value to the caller. Calling `next()` or `__next__()` resumes execution right after the yield statement.',
    tags: ['Generators', 'Iterators', 'Advanced'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'py-6',
    topic: 'Python',
    difficulty: 'hard',
    type: 'mcq',
    question: 'What is the Global Interpreter Lock (GIL) in CPython?',
    options: [
      { id: 'a', text: 'A security mechanism that sandboxes untrusted byte-code execution' },
      { id: 'b', text: 'A mutex that prevents multiple native threads from executing Python bytecodes simultaneously' },
      { id: 'c', text: 'A lock that serializes database transactions in SQLite' },
      { id: 'd', text: 'An OS-level semaphore for inter-process communication' },
    ],
    correctAnswer: 'b',
    explanation: 'The GIL is a mutual-exclusion lock used by CPython to prevent race conditions and make memory management (reference counting) thread-safe.',
    tags: ['Concurrency', 'CPython', 'Architecture'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── React ─────────────────────────────────────────────────────────────────
  {
    id: 'react-1',
    topic: 'React',
    difficulty: 'easy',
    type: 'mcq',
    question: 'What does the `key` prop help React do during list reconciliation?',
    options: [
      { id: 'a', text: 'Bind keyboard event listeners to elements' },
      { id: 'b', text: 'Identify which items have changed, been added, or removed' },
      { id: 'c', text: 'Encrypt DOM state in the browser' },
      { id: 'd', text: 'Trigger CSS keyframe animations' },
    ],
    correctAnswer: 'b',
    explanation: 'Keys give elements a stable identity across renders, allowing React to match virtual DOM nodes and optimize updates rather than remounting all items.',
    tags: ['Virtual DOM', 'Reconciliation'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'react-2',
    topic: 'React',
    difficulty: 'medium',
    type: 'mcq',
    question: 'What is the primary difference between `useMemo` and `useCallback`?',
    options: [
      { id: 'a', text: '`useMemo` caches a computed value, while `useCallback` caches a function definition' },
      { id: 'b', text: '`useMemo` is for class components, while `useCallback` is for functional components' },
      { id: 'c', text: '`useCallback` runs synchronously before DOM paint, `useMemo` runs after' },
      { id: 'd', text: '`useMemo` triggers a re-render when its dependencies change, while `useCallback` does not' },
    ],
    correctAnswer: 'a',
    explanation: '`useMemo(() => fn(), deps)` returns the memoized output value of the factory function, whereas `useCallback(fn, deps)` returns the memoized function reference itself.',
    codeSnippet: 'const memoizedValue = useMemo(() => computeCostly(a, b), [a, b]);\nconst memoizedCallback = useCallback(() => doSomething(a), [a]);',
    tags: ['Hooks', 'Performance'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'react-3',
    topic: 'React',
    difficulty: 'hard',
    type: 'mcq',
    question: 'What is the purpose of React 18 Concurrent Features and `useTransition`?',
    options: [
      { id: 'a', text: 'To allow multiple Node.js worker threads in Next.js SSR' },
      { id: 'b', text: 'To mark state updates as non-urgent transitions so the UI remains responsive to urgent user inputs' },
      { id: 'c', text: 'To execute WebSockets simultaneously across tabs' },
      { id: 'd', text: 'To replace CSS transitions with JavaScript animations' },
    ],
    correctAnswer: 'b',
    explanation: '`startTransition` marks updates as non-urgent, allowing React to interrupt low-priority rendering if the user types or clicks, keeping inputs stutter-free.',
    tags: ['Concurrent React', 'React 18', 'UX'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'react-4',
    topic: 'React',
    difficulty: 'easy',
    type: 'truefalse',
    question: 'React state setters returned by `useState` trigger a re-render even if the next state is strictly identical (`Object.is`) to current state.',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswer: 'false',
    explanation: 'React compares the new state with current state using `Object.is`. If they are identical, React bails out of re-rendering the component and its children.',
    tags: ['Hooks', 'State Management'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── GenAI & LLMs ──────────────────────────────────────────────────────────
  {
    id: 'genai-1',
    topic: 'GenAI',
    difficulty: 'easy',
    type: 'mcq',
    question: 'In prompt engineering, what does "Few-Shot Prompting" refer to?',
    options: [
      { id: 'a', text: 'Running the prompt multiple times to calculate median perplexity' },
      { id: 'b', text: 'Providing a few demonstration input-output examples inside the prompt to guide the model' },
      { id: 'c', text: 'Limiting the generation token count to under 50 tokens' },
      { id: 'd', text: 'Fine-tuning the weights on a small dataset of 10 items' },
    ],
    correctAnswer: 'b',
    explanation: 'Few-shot prompting provides contextual demonstrations (input/output pairs) within the context window, steering in-context learning without updating model weights.',
    tags: ['Prompt Engineering', 'In-Context Learning'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'genai-2',
    topic: 'GenAI',
    difficulty: 'medium',
    type: 'mcq',
    question: 'In Retrieval-Augmented Generation (RAG), what role do vector embeddings play?',
    options: [
      { id: 'a', text: 'They compress PDF documents into binary zip archives' },
      { id: 'b', text: 'They map text chunks into semantic high-dimensional vectors to enable similarity search' },
      { id: 'c', text: 'They encrypt API keys in transit over TLS' },
      { id: 'd', text: 'They quantize float32 weights into int4' },
    ],
    correctAnswer: 'b',
    explanation: 'Embeddings project text chunks into a shared semantic vector space where cosine or dot-product similarity finds relevant context matching a user query.',
    tags: ['RAG', 'Vector Search', 'Embeddings'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'genai-3',
    topic: 'GenAI',
    difficulty: 'hard',
    type: 'mcq',
    question: 'What is the primary benefit of Rotary Position Embedding (RoPE) over absolute sinusoidal positional embeddings in modern LLMs (e.g. LLaMA)?',
    options: [
      { id: 'a', text: 'It completely eliminates attention head projection matrices' },
      { id: 'b', text: 'It encodes relative position through rotation in complex space and generalizes well to extended context lengths' },
      { id: 'c', text: 'It makes the model strictly deterministic regardless of temperature' },
      { id: 'd', text: 'It shrinks the parameter footprint of the tokenizer by 80%' },
    ],
    correctAnswer: 'b',
    explanation: 'RoPE applies a rotation to key and query vectors, preserving relative positional distance between tokens naturally and enabling efficient context length scaling.',
    tags: ['Transformers', 'Architecture', 'RoPE'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── Machine Learning ──────────────────────────────────────────────────────
  {
    id: 'ml-1',
    topic: 'Machine Learning',
    difficulty: 'easy',
    type: 'mcq',
    question: 'Which metric is best suited for evaluating a binary classification model on a heavily imbalanced dataset (e.g. fraud detection)?',
    options: [
      { id: 'a', text: 'Accuracy' },
      { id: 'b', text: 'PR-AUC (Precision-Recall Area Under Curve)' },
      { id: 'c', text: 'Mean Absolute Error (MAE)' },
      { id: 'd', text: 'R-Squared (R²)' },
    ],
    correctAnswer: 'b',
    explanation: 'When positive cases are rare (e.g., 0.1%), accuracy is deceptive. Precision-Recall curves focus specifically on true positives versus false alarms and missed cases.',
    tags: ['Evaluation Metrics', 'Imbalanced Data'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ml-2',
    topic: 'Machine Learning',
    difficulty: 'medium',
    type: 'fillinblank',
    question: 'The regularization technique that adds the absolute value of coefficients (|w|) to the loss function to induce sparsity is known as _____ (L1) regularization.',
    correctAnswer: 'Lasso',
    explanation: 'Lasso (L1) regularization penalizes the absolute magnitude of weights, driving uninformative feature coefficients exactly to zero, performing automatic feature selection.',
    tags: ['Regularization', 'Linear Models'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ml-3',
    topic: 'Machine Learning',
    difficulty: 'hard',
    type: 'mcq',
    question: 'Why does the vanishing gradient problem occur in deep neural networks with sigmoid activation functions?',
    options: [
      { id: 'a', text: 'Sigmoid outputs grow exponentially towards infinity' },
      { id: 'b', text: 'The derivative of the sigmoid function peaks at only 0.25, shrinking gradients during backpropagation' },
      { id: 'c', text: 'Sigmoid is not differentiable at x = 0' },
      { id: 'd', text: 'It causes integer overflow in 64-bit tensors' },
    ],
    correctAnswer: 'b',
    explanation: 'Because max(sigmoid\') = 0.25, multiplying many gradients < 0.25 across multiple layers via the chain rule causes backpropagated error gradients to exponentially decay to 0.',
    tags: ['Deep Learning', 'Gradients', 'Backpropagation'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── DSA ───────────────────────────────────────────────────────────────────
  {
    id: 'dsa-1',
    topic: 'DSA',
    difficulty: 'easy',
    type: 'mcq',
    question: 'Which data structure operates on a FIFO (First-In, First-Out) principle?',
    options: [
      { id: 'a', text: 'Stack' },
      { id: 'b', text: 'Queue' },
      { id: 'c', text: 'Priority Heap' },
      { id: 'd', text: 'Binary Search Tree' },
    ],
    correctAnswer: 'b',
    explanation: 'A Queue enforces FIFO order. Elements are enqueued at the back and dequeued from the front. Common uses include BFS and task schedulers.',
    tags: ['Data Structures', 'Queues'],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dsa-2',
    topic: 'DSA',
    difficulty: 'medium',
    type: 'mcq',
    question: 'What is the amortized time complexity of inserting an element into a dynamic array (like Python list or C++ std::vector)?',
    options: [
      { id: 'a', text: 'O(1)' },
      { id: 'b', text: 'O(n)' },
      { id: 'c', text: 'O(log n)' },
      { id: 'd', text: 'O(n²)' },
    ],
    correctAnswer: 'a',
    explanation: 'While resizing takes O(n) intermittently when doubling capacity, it happens infrequently enough that the amortized cost per append is O(1).',
    tags: ['Complexity', 'Dynamic Arrays'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dsa-3',
    topic: 'DSA',
    difficulty: 'hard',
    type: 'mcq',
    question: 'In Dijkstra\'s algorithm with a min-priority queue (binary heap), what is the time complexity on a graph with V vertices and E edges?',
    options: [
      { id: 'a', text: 'O(V²)' },
      { id: 'b', text: 'O((V + E) log V)' },
      { id: 'c', text: 'O(V * E)' },
      { id: 'd', text: 'O(V!)' },
    ],
    correctAnswer: 'b',
    explanation: 'Each vertex is extracted once (V log V) and each edge might cause a decrease-key/push operation (E log V), totaling O((V + E) log V).',
    tags: ['Graph Algorithms', 'Shortest Path'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── SQL & Databases ───────────────────────────────────────────────────────
  {
    id: 'sql-1',
    topic: 'SQL',
    difficulty: 'easy',
    type: 'mcq',
    question: 'Which SQL keyword ensures only unique, non-duplicate values are returned by a query?',
    options: [
      { id: 'a', text: 'UNIQUE' },
      { id: 'b', text: 'DISTINCT' },
      { id: 'c', text: 'DIFFERENT' },
      { id: 'd', text: 'GROUP ONLY' },
    ],
    correctAnswer: 'b',
    explanation: '`SELECT DISTINCT column FROM table` eliminates duplicate rows from the query output.',
    tags: ['Queries', 'Basics'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sql-2',
    topic: 'SQL',
    difficulty: 'medium',
    type: 'mcq',
    question: 'What is the primary difference between `WHERE` and `HAVING` in SQL?',
    options: [
      { id: 'a', text: '`WHERE` filters rows before aggregation; `HAVING` filters aggregated groups' },
      { id: 'b', text: '`WHERE` is only for numerical columns; `HAVING` is for text columns' },
      { id: 'c', text: '`HAVING` cannot be used with `GROUP BY`' },
      { id: 'd', text: 'They are completely interchangeable synonyms in ANSI SQL' },
    ],
    correctAnswer: 'a',
    explanation: '`WHERE` filters individual rows before `GROUP BY` aggregates them. `HAVING` filters group-level aggregates (e.g., `HAVING COUNT(*) > 5`).',
    tags: ['Aggregation', 'Filtering'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sql-3',
    topic: 'SQL',
    difficulty: 'hard',
    type: 'mcq',
    question: 'Under the ACID model, what anomaly is prevented under "Repeatable Read" isolation, but still possible without "Serializable" isolation in standard SQL?',
    options: [
      { id: 'a', text: 'Dirty Read' },
      { id: 'b', text: 'Non-repeatable Read' },
      { id: 'c', text: 'Phantom Read' },
      { id: 'd', text: 'Deadlock' },
    ],
    correctAnswer: 'c',
    explanation: 'Phantom reads occur when a transaction re-executes a range query and discovers new "phantom" rows inserted by a concurrent committed transaction. Only Serializable isolation prevents this.',
    tags: ['ACID', 'Transactions', 'Concurrency'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── Docker & DevOps ───────────────────────────────────────────────────────
  {
    id: 'docker-1',
    topic: 'Docker',
    difficulty: 'easy',
    type: 'truefalse',
    question: 'A Docker image is a read-only template, while a container is a running instance of an image with a writable layer.',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
    correctAnswer: 'true',
    explanation: 'Images consist of stacked read-only layers. When a container starts, Docker places a thin read-write container layer on top.',
    tags: ['Containers', 'Images'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'docker-2',
    topic: 'Docker',
    difficulty: 'medium',
    type: 'mcq',
    question: 'In a Dockerfile, what is the key difference between `COPY` and `ADD`?',
    options: [
      { id: 'a', text: '`COPY` only copies local files, whereas `ADD` can also fetch remote URLs and extract tar archives automatically' },
      { id: 'b', text: '`COPY` runs during runtime, `ADD` runs during build' },
      { id: 'c', text: '`COPY` requires root privileges, `ADD` does not' },
      { id: 'd', text: '`COPY` is deprecated in Docker 24+' },
    ],
    correctAnswer: 'a',
    explanation: '`COPY` is preferred for standard file copying. `ADD` includes auto-extraction of tar files and remote URL downloading, which can introduce unexpected side effects.',
    tags: ['Dockerfile', 'Best Practices'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // ── System Design ─────────────────────────────────────────────────────────
  {
    id: 'sd-1',
    topic: 'System Design',
    difficulty: 'medium',
    type: 'mcq',
    question: 'In distributed systems, what does CAP Theorem state is impossible for a distributed data store to guarantee simultaneously?',
    options: [
      { id: 'a', text: 'Concurrency, Atomicity, and Performance' },
      { id: 'b', text: 'Consistency, Availability, and Partition Tolerance' },
      { id: 'c', text: 'Capacity, Availability, and Persistence' },
      { id: 'd', text: 'Compression, Authentication, and Privacy' },
    ],
    correctAnswer: 'b',
    explanation: 'In the presence of a network partition (P), a distributed system must choose between serving consistent data (C) or remaining available to all nodes (A).',
    tags: ['Distributed Systems', 'CAP Theorem'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sd-2',
    topic: 'System Design',
    difficulty: 'hard',
    type: 'mcq',
    question: 'What is the purpose of Consistent Hashing in distributed cache systems (like DynamoDB or Memcached clusters)?',
    options: [
      { id: 'a', text: 'It encrypts cached data with a zero-knowledge proof' },
      { id: 'b', text: 'It minimizes key remapping when nodes are added or removed, scaling cache lookups evenly' },
      { id: 'c', text: 'It guarantees ACID transactions across geographic regions' },
      { id: 'd', text: 'It compresses HTTP request headers' },
    ],
    correctAnswer: 'b',
    explanation: 'With standard modulo hashing `key % N`, changing N remaps nearly all keys. Consistent hashing maps keys and nodes to a ring, so adding a node only remaps `k / N` keys.',
    tags: ['Hashing', 'Caching', 'Scalability'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial default state
const defaultDb = {
  questions: initialQuestions,
  savedQuestions: [
    {
      ...initialQuestions[0],
      isSaved: true,
      savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      ...initialQuestions[4],
      isSaved: true,
      savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      ...initialQuestions[8],
      isSaved: true,
      savedAt: new Date().toISOString(),
    },
  ],
  history: [
    {
      id: 'hist-1',
      topics: ['Python', 'DSA'],
      count: 4,
      difficulty: 'medium',
      type: 'mcq',
      questions: [initialQuestions[2], initialQuestions[3], initialQuestions[13], initialQuestions[14]],
      generatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'hist-2',
      topics: ['GenAI', 'Machine Learning'],
      count: 3,
      difficulty: 'hard',
      type: 'mcq',
      questions: [initialQuestions[8], initialQuestions[9], initialQuestions[12]],
      generatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'hist-3',
      topics: ['React'],
      count: 3,
      difficulty: 'easy',
      type: 'truefalse',
      questions: [initialQuestions[6], initialQuestions[9]],
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  quizSessions: [
    {
      id: 'quiz-1',
      topic: 'Python',
      score: 85,
      totalQuestions: 6,
      correctCount: 5,
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quiz-2',
      topic: 'GenAI',
      score: 90,
      totalQuestions: 5,
      correctCount: 4,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'quiz-3',
      topic: 'DSA',
      score: 75,
      totalQuestions: 4,
      correctCount: 3,
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  user: {
    id: 'user-default',
    name: 'Alex Rivera',
    email: 'alex.rivera@edu.ai',
    avatar: 'A',
    role: 'Senior Learner',
    streakDays: 8,
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

// Read / Write Database
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DB] Failed to read db.json, initializing defaults:', err.message);
    }
    this.save(defaultDb);
    return defaultDb;
  }

  save(data = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to persist db.json:', err.message);
    }
  }

  // Question querying & generation
  getQuestions() {
    return this.data.questions || [];
  }

  getTopics() {
    const questions = this.getQuestions();
    const map = new Map();
    for (const q of questions) {
      map.set(q.topic, (map.get(q.topic) || 0) + 1);
    }
    // Also add popular tech topics
    const defaultTopics = [
      'Python', 'Machine Learning', 'GenAI', 'React', 'DSA', 'SQL',
      'TypeScript', 'Docker', 'System Design', 'Next.js', 'Cybersecurity', 'Cloud AWS',
    ];
    for (const t of defaultTopics) {
      if (!map.has(t)) map.set(t, 0);
    }
    return Array.from(map.entries()).map(([topic, count]) => ({
      name: topic,
      count,
    }));
  }

  generateQuestions({ topics = [], count = 5, difficulty = 'medium', type = 'mcq' }) {
    const questions = this.getQuestions();
    const cleanTopics = Array.isArray(topics) ? topics.map((t) => t.toLowerCase()) : [];

    // Filter by topic and type
    let pool = questions.filter((q) => {
      const matchTopic = cleanTopics.length === 0 || cleanTopics.some((t) => q.topic.toLowerCase().includes(t) || t.includes(q.topic.toLowerCase()));
      const matchType = q.type === type;
      return matchTopic && matchType;
    });

    if (difficulty !== 'adaptive') {
      const exactDiff = pool.filter((q) => q.difficulty === difficulty);
      if (exactDiff.length > 0) pool = exactDiff;
    }

    if (pool.length === 0) {
      pool = questions.filter((q) => q.type === type);
    }
    if (pool.length === 0) {
      pool = [...questions];
    }

    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = [];

    for (let i = 0; i < count; i++) {
      const base = shuffled[i % shuffled.length];
      const diffLevels = ['easy', 'medium', 'hard'];
      const targetDiff = difficulty === 'adaptive' ? diffLevels[i % 3] : base.difficulty;

      selected.push({
        ...base,
        id: `gen-${Date.now()}-${i}-${base.id}`,
        difficulty: targetDiff,
        isSaved: this.isSaved(base.id),
        createdAt: new Date().toISOString(),
      });
    }

    // Save to history session
    const session = {
      id: `hist-${Date.now()}`,
      topics: topics.length > 0 ? topics : ['General'],
      count: selected.length,
      difficulty,
      type,
      questions: selected,
      generatedAt: new Date().toISOString(),
    };
    this.addHistory(session);

    return selected;
  }

  // History
  getHistory() {
    return this.data.history || [];
  }

  addHistory(session) {
    this.data.history = [session, ...(this.data.history || [])];
    this.save();
    return session;
  }

  deleteHistory(id) {
    this.data.history = (this.data.history || []).filter((h) => h.id !== id);
    this.save();
    return true;
  }

  // Saved Questions
  getSaved() {
    return this.data.savedQuestions || [];
  }

  isSaved(questionId) {
    return (this.data.savedQuestions || []).some((q) => q.id === questionId);
  }

  saveQuestion(question) {
    if (!question || !question.id) return null;
    const existing = (this.data.savedQuestions || []).find((q) => q.id === question.id);
    if (existing) return existing;

    const saved = {
      ...question,
      isSaved: true,
      savedAt: new Date().toISOString(),
    };
    this.data.savedQuestions = [saved, ...(this.data.savedQuestions || [])];
    this.save();
    return saved;
  }

  unsaveQuestion(id) {
    this.data.savedQuestions = (this.data.savedQuestions || []).filter((q) => q.id !== id);
    this.save();
    return true;
  }

  // Quiz
  recordQuizSession({ topic, score, totalQuestions, correctCount }) {
    const session = {
      id: `quiz-${Date.now()}`,
      topic,
      score,
      totalQuestions,
      correctCount,
      completedAt: new Date().toISOString(),
    };
    this.data.quizSessions = [session, ...(this.data.quizSessions || [])];
    if (this.data.user) {
      this.data.user.streakDays = (this.data.user.streakDays || 1) + 1;
    }
    this.save();
    return session;
  }

  // Stats calculation
  getStats() {
    const history = this.getHistory();
    const quizSessions = this.data.quizSessions || [];
    const saved = this.getSaved();

    const totalGenerated = history.reduce((acc, h) => acc + (h.questions?.length || h.count || 0), 0) + 120;
    const totalSessions = history.length + quizSessions.length + 15;

    const avgScore = quizSessions.length > 0
      ? Math.round(quizSessions.reduce((acc, q) => acc + q.score, 0) / quizSessions.length)
      : 82;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = days.map((day, idx) => ({
      day,
      questions: Math.max(10, Math.floor(totalGenerated * 0.12) + (idx * 6) % 25),
      sessions: 2 + (idx % 4),
    }));

    const difficultyDistribution = [
      { name: 'Easy', value: 35, color: '#10B981' },
      { name: 'Medium', value: 45, color: '#F59E0B' },
      { name: 'Hard', value: 20, color: '#F43F5E' },
    ];

    const topicDistribution = [
      { topic: 'Python', count: 68 },
      { topic: 'GenAI & LLMs', count: 54 },
      { topic: 'React', count: 48 },
      { topic: 'DSA', count: 42 },
      { topic: 'SQL', count: 36 },
      { topic: 'System Design', count: 28 },
    ];

    const recentActivity = [
      {
        id: 'rec-1',
        type: 'generate',
        description: 'Generated 5 Python & GenAI adaptive questions',
        time: 'Just now',
        icon: '🤖',
      },
      {
        id: 'rec-2',
        type: 'quiz',
        description: 'Completed Adaptive Quiz — Score: 88%',
        time: '2 hours ago',
        icon: '🎯',
      },
      {
        id: 'rec-3',
        type: 'save',
        description: `Saved ${saved.length} questions for flashcard review`,
        time: 'Today',
        icon: '🔖',
      },
    ];

    return {
      totalGenerated,
      totalSessions,
      averageScore: avgScore,
      streakDays: this.data.user?.streakDays || 8,
      savedCount: saved.length,
      weeklyActivity,
      difficultyDistribution,
      topicDistribution,
      recentActivity,
    };
  }

  getUser() {
    return this.data.user || defaultDb.user;
  }
}

export const db = new Database();
