// Knowledge checks, one set per category. `answer` is the index of the correct option.
export const quizzes = {
  development: [
    {
      q: 'Which CSS feature is best suited to a two-dimensional page layout with rows and columns?',
      options: ['Flexbox', 'CSS Grid', 'Floats', 'Absolute positioning'],
      answer: 1,
      why: 'Grid controls rows and columns at the same time. Flexbox is designed for one axis at a time.',
    },
    {
      q: 'What does `await` do inside an async function?',
      options: ['Blocks the whole browser', 'Pauses that function until the promise settles', 'Runs code in a web worker', 'Converts a value to a string'],
      answer: 1,
      why: 'Only the async function is paused; the event loop keeps running other work.',
    },
    {
      q: 'In React, where should state usually live?',
      options: ['As high as possible, at the root', 'In a global store by default', 'As close as possible to where it is used', 'In localStorage'],
      answer: 2,
      why: 'Colocating state keeps components simple and avoids unnecessary re-renders.',
    },
    {
      q: 'Why should passwords be hashed with bcrypt before storage?',
      options: ['To compress them', 'So a database leak does not expose plain passwords', 'To make login faster', 'Because JSON cannot store strings'],
      answer: 1,
      why: 'A slow, salted hash means leaked data cannot be trivially reversed into passwords.',
    },
  ],
  data: [
    {
      q: 'A 95% confidence interval means...',
      options: [
        'There is a 95% chance the true value is in this specific interval',
        'The procedure captures the true value in 95% of repeated samples',
        '95% of the data falls inside the interval',
        'The result is 95% important',
      ],
      answer: 1,
      why: 'Confidence describes the long-run behaviour of the method, not a single interval.',
    },
    {
      q: 'Which SQL feature computes a running total without collapsing rows?',
      options: ['GROUP BY', 'A window function', 'DISTINCT', 'A subquery in WHERE'],
      answer: 1,
      why: 'Window functions compute across related rows while keeping every row in the output.',
    },
    {
      q: 'Your model scores 98% accuracy on a dataset where 98% of rows are negative. What should you check first?',
      options: ['Nothing, ship it', 'Precision and recall on the positive class', 'The font of the report', 'The number of columns'],
      answer: 1,
      why: 'Predicting "negative" every time would also score 98%. Class imbalance hides failure.',
    },
    {
      q: 'When is a bar chart usually better than a pie chart?',
      options: ['Never', 'When comparing several similar values', 'Only for time series', 'When there are two categories'],
      answer: 1,
      why: 'People compare lengths far more accurately than angles or areas.',
    },
  ],
  ai: [
    {
      q: 'What is retrieval-augmented generation (RAG) mainly used for?',
      options: ['Training a model from scratch', 'Grounding answers in relevant documents', 'Compressing model weights', 'Generating images'],
      answer: 1,
      why: 'Retrieval supplies relevant context so answers are grounded and can cite sources.',
    },
    {
      q: 'Why build an evaluation set before changing a prompt?',
      options: ['It is required by law', 'To measure whether changes actually improve quality', 'To make the model faster', 'It reduces token cost'],
      answer: 1,
      why: 'Without a fixed benchmark you cannot tell improvement from luck.',
    },
    {
      q: 'In PyTorch, what does calling `loss.backward()` do?',
      options: ['Updates weights directly', 'Computes gradients for parameters', 'Resets the optimizer', 'Saves the model'],
      answer: 1,
      why: 'Backward computes gradients; the optimizer step applies them.',
    },
    {
      q: 'Raising sampling temperature generally makes outputs...',
      options: ['More deterministic', 'More varied', 'Shorter', 'More accurate'],
      answer: 1,
      why: 'Higher temperature flattens the distribution, so less likely tokens are chosen more often.',
    },
  ],
  design: [
    {
      q: 'What does the "squint test" help evaluate?',
      options: ['Colour contrast ratios', 'Visual hierarchy', 'Loading speed', 'Copy tone'],
      answer: 1,
      why: 'Blurring details reveals which elements actually dominate the layout.',
    },
    {
      q: 'Which easing usually feels most natural for an element entering the screen?',
      options: ['Linear', 'Ease-in', 'Ease-out', 'Bounce'],
      answer: 2,
      why: 'Ease-out starts fast and settles gently, like objects arriving and slowing down.',
    },
    {
      q: 'What is a design token?',
      options: ['A login credential', 'A named, reusable design decision such as a colour or spacing value', 'A Figma plugin', 'A type of icon'],
      answer: 1,
      why: 'Tokens give design decisions names so they can be shared across tools and code.',
    },
    {
      q: 'What is the minimum WCAG AA contrast ratio for normal body text?',
      options: ['2:1', '3:1', '4.5:1', '7:1'],
      answer: 2,
      why: '4.5:1 is the AA requirement for normal text; 3:1 applies to large text.',
    },
  ],
  product: [
    {
      q: 'What is the main purpose of a problem interview?',
      options: ['Pitch your solution', 'Understand past behaviour and real pain', 'Collect feature requests', 'Sell a subscription'],
      answer: 1,
      why: 'Past behaviour is a far better signal than opinions about hypothetical features.',
    },
    {
      q: 'A good north star metric should...',
      options: ['Be easy to inflate', 'Reflect value delivered to customers', 'Change every week', 'Measure only revenue'],
      answer: 1,
      why: 'It should move when customers get real value, which then drives revenue.',
    },
    {
      q: 'An opportunity solution tree connects...',
      options: ['Employees to managers', 'An outcome to opportunities, solutions and experiments', 'Bugs to releases', 'Users to pricing tiers'],
      answer: 1,
      why: 'It makes the reasoning from desired outcome to experiments explicit.',
    },
    {
      q: 'What is a roadmap primarily for?',
      options: ['A fixed contract of dates', 'Communicating direction and priorities', 'Tracking bugs', 'Replacing specs'],
      answer: 1,
      why: 'Roadmaps align people around direction; detailed plans live elsewhere.',
    },
  ],
  marketing: [
    {
      q: 'A strong positioning statement mainly clarifies...',
      options: ['Your logo colours', 'Who it is for and why it is different', 'Your ad budget', 'Your posting schedule'],
      answer: 1,
      why: 'Positioning defines audience, category and differentiation; everything else follows.',
    },
    {
      q: 'Cohort analysis is most useful for understanding...',
      options: ['Retention over time', 'Website colours', 'Server costs', 'Page titles'],
      answer: 0,
      why: 'Grouping users by start date shows how retention changes across cohorts.',
    },
    {
      q: 'In SEO, search intent refers to...',
      options: ['How fast a page loads', 'What the searcher is trying to achieve', 'The number of backlinks', 'Keyword density'],
      answer: 1,
      why: 'Matching intent matters more than repeating keywords.',
    },
    {
      q: 'What distinguishes a growth loop from a funnel?',
      options: ['Loops are cheaper ads', 'Outputs of one cycle feed the input of the next', 'Funnels only work offline', 'There is no difference'],
      answer: 1,
      why: 'Loops compound because new users generate more new users or content.',
    },
  ],
  mobile: [
    {
      q: 'In Flutter, almost everything on screen is a...',
      options: ['Fragment', 'Widget', 'Activity', 'Storyboard'],
      answer: 1,
      why: 'Flutter composes interfaces from widgets, including layout and styling.',
    },
    {
      q: 'In SwiftUI, `@State` is best used for...',
      options: ['Global app configuration', 'Simple state owned by a single view', 'Network caching', 'Database migrations'],
      answer: 1,
      why: '@State is local, view-owned state; shared state uses other tools.',
    },
    {
      q: 'Why design for offline states on mobile?',
      options: ['App stores require it', 'Networks are often slow or unavailable', 'It reduces app size', 'It improves fonts'],
      answer: 1,
      why: 'Mobile connections are unreliable, and apps should degrade gracefully.',
    },
    {
      q: 'What does null safety in Dart prevent?',
      options: ['Slow builds', 'Unexpected null reference errors at runtime', 'Large images', 'Memory leaks in all cases'],
      answer: 1,
      why: 'The type system tracks nullability so null errors are caught at compile time.',
    },
  ],
  cloud: [
    {
      q: 'What does the principle of least privilege mean?',
      options: ['Give everyone admin to save time', 'Grant only the permissions needed for a task', 'Use one shared account', 'Disable logging'],
      answer: 1,
      why: 'Minimal permissions limit the damage of mistakes and compromised credentials.',
    },
    {
      q: 'In Kubernetes, what keeps a desired number of pod replicas running?',
      options: ['A ConfigMap', 'A Deployment', 'A Secret', 'An Ingress'],
      answer: 1,
      why: 'Deployments manage ReplicaSets that maintain the desired pod count.',
    },
    {
      q: 'Why use multi-stage Docker builds?',
      options: ['To make images larger', 'To keep build tools out of the final image', 'To avoid using a Dockerfile', 'To run multiple apps in one container'],
      answer: 1,
      why: 'The final image only contains what is needed at runtime: smaller and safer.',
    },
    {
      q: 'Infrastructure as code mainly provides...',
      options: ['Faster CPUs', 'Repeatable, reviewable infrastructure changes', 'Free hosting', 'Automatic UI design'],
      answer: 1,
      why: 'Versioned definitions make environments reproducible and changes reviewable.',
    },
  ],
};

export const getQuiz = (category) => quizzes[category] || quizzes.development;
