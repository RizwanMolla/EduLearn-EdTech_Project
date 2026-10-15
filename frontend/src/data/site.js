export const navLinks = [
  { to: '/courses', label: 'Courses' },
  { to: '/paths', label: 'Paths' },
  { to: '/instructors', label: 'Instructors' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/journal', label: 'Journal' },
];

export const stats = [
  { value: 2.5, suffix: 'M', decimals: 1, label: 'Learners worldwide' },
  { value: 1.8, suffix: 'M', decimals: 1, label: 'Certificates earned' },
  { value: 24, suffix: 'K', decimals: 0, label: 'Career transitions' },
  { value: 4.8, suffix: '/5', decimals: 1, label: 'Average course rating' },
];

export const testimonials = [
  {
    quote: 'I had started and abandoned four courses before EduLearn. The projects kept me honest. Six months later I was shipping React in production at my first developer job.',
    name: 'Emma Clarke',
    role: 'Frontend Developer',
    from: 'Previously a school teacher',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&q=75&auto=format&fit=crop&crop=faces',
  },
  {
    quote: 'The data path is the first course I have taken where the instructor talks about judgement, not just tools. It changed how I present analysis to leadership.',
    name: 'Tom Aldridge',
    role: 'Senior Analyst',
    from: 'Retail analytics',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&q=75&auto=format&fit=crop&crop=faces',
  },
  {
    quote: 'Our whole design team went through the design systems course together. We shipped our component library a quarter earlier than planned.',
    name: 'Lena Vogel',
    role: 'Head of Design',
    from: 'Fintech scale-up',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&q=75&auto=format&fit=crop&crop=faces',
  },
  {
    quote: 'Short lessons, real projects and a streak counter that I became slightly obsessed with. I learned more in eight weeks than in a year of tutorials.',
    name: 'Martin Keller',
    role: 'Mobile Engineer',
    from: 'Self-taught',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=75&auto=format&fit=crop&crop=faces',
  },
];

export const faqs = [
  {
    q: 'Do I need any experience to start?',
    a: 'No. Every course lists its requirements, and our beginner courses assume no prior knowledge. If you are unsure where to begin, the learning paths give you a recommended order.',
  },
  {
    q: 'How long do I have access to a course?',
    a: 'Courses you purchase are yours for life, including all future updates. Subscription plans give you access to the full catalogue for as long as your plan is active.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes. When you complete every lesson in a course, including the final knowledge check, you can download a certificate with a unique verification ID.',
  },
  {
    q: 'Can I learn on my phone?',
    a: 'The whole platform is responsive, including the lesson player, notes and dashboard. Your progress is saved to your account as you go.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Every purchase comes with a 30-day, no-questions-asked refund. We would rather you find the right course than keep one that does not fit.',
  },
  {
    q: 'Is there a way to try EduLearn without signing up?',
    a: 'Yes. Use the demo account from the sign-in page to explore the dashboard, lesson player and certificates with sample progress already in place.',
  },
];

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    blurb: 'For trying things out and learning the basics.',
    features: ['All free courses', 'Lesson notes and progress tracking', 'Community discussions', 'Certificates for free courses'],
    cta: 'Start for free',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 24,
    yearly: 19,
    blurb: 'For individuals serious about building a skill.',
    features: ['The full catalogue of 180+ courses', 'All learning paths', 'Project reviews from mentors', 'Downloadable resources', 'Priority support'],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    id: 'teams',
    name: 'Teams',
    monthly: 39,
    yearly: 32,
    blurb: 'For teams that learn together. Price per seat.',
    features: ['Everything in Pro', 'Team dashboards and reports', 'Custom learning paths', 'SSO and admin controls', 'Dedicated success manager'],
    cta: 'Talk to us',
  },
];

export const comparison = [
  { feature: 'Free courses', starter: true, pro: true, teams: true },
  { feature: 'Full course catalogue', starter: false, pro: true, teams: true },
  { feature: 'Learning paths', starter: false, pro: true, teams: true },
  { feature: 'Certificates', starter: 'Free courses', pro: true, teams: true },
  { feature: 'Mentor project reviews', starter: false, pro: '2 per month', teams: 'Unlimited' },
  { feature: 'Offline downloads', starter: false, pro: true, teams: true },
  { feature: 'Team analytics', starter: false, pro: false, teams: true },
  { feature: 'SSO and admin controls', starter: false, pro: false, teams: true },
];

export const coupons = {
  LEARN20: { type: 'percent', value: 20, label: '20% off your order' },
  FIRSTCLASS: { type: 'fixed', value: 15, label: '$15 off your first order' },
};

export const socials = [
  { label: 'X', href: 'https://x.com/MdRizwanMolla' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rizwan-molla/' },
];
