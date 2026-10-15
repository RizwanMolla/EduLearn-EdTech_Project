// Each category owns a cover palette so generated course covers feel like one printed series.
export const categories = [
  {
    id: 'development',
    name: 'Development',
    blurb: 'Frontend, backend and the craft of shipping software that lasts.',
    palette: { bg: '#173528', fg: '#d4f36a', text: '#eeeadf' },
  },
  {
    id: 'data',
    name: 'Data Science',
    blurb: 'Statistics, SQL and analysis that turns numbers into decisions.',
    palette: { bg: '#1d2a3a', fg: '#9cc7e8', text: '#eeeadf' },
  },
  {
    id: 'ai',
    name: 'AI & ML',
    blurb: 'Machine learning and LLM applications, built and evaluated properly.',
    palette: { bg: '#161614', fg: '#e8744b', text: '#eeeadf' },
  },
  {
    id: 'design',
    name: 'Design',
    blurb: 'Interface, systems and motion design for people who sweat details.',
    palette: { bg: '#cf5a31', fg: '#f6e3c8', text: '#161614' },
  },
  {
    id: 'product',
    name: 'Product',
    blurb: 'Discovery, prioritisation and the habits of effective product teams.',
    palette: { bg: '#cdbfa0', fg: '#173528', text: '#161614' },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    blurb: 'Positioning, growth loops and measurement without the buzzwords.',
    palette: { bg: '#e2b13c', fg: '#161614', text: '#161614' },
  },
  {
    id: 'mobile',
    name: 'Mobile',
    blurb: 'Native and cross-platform apps, from first screen to the stores.',
    palette: { bg: '#8fb5a4', fg: '#161614', text: '#161614' },
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    blurb: 'Infrastructure, containers and the operations that keep things up.',
    palette: { bg: '#2e3b41', fg: '#9fd8c5', text: '#eeeadf' },
  },
];

export const getCategory = (id) => categories.find((c) => c.id === id) || categories[0];

export const levels = ['Beginner', 'Intermediate', 'Advanced', 'All levels'];
