import { seeded } from '../lib/format';

const pool = [
  { name: 'Aarav Mehta', role: 'Frontend developer', rating: 5, text: 'The pacing is unusually honest. Every lesson ends with something working, and the project reviews taught me more than the lessons themselves.' },
  { name: 'Sofia Lindqvist', role: 'Career switcher', rating: 5, text: 'I tried three other courses before this one. The difference is that the instructor explains why, not just how, so I could finally solve problems on my own.' },
  { name: 'Daniel Osei', role: 'Junior engineer', rating: 4, text: 'Dense but rewarding. I would have liked a few more exercises in the middle section, but the final project tied everything together.' },
  { name: 'Mei Tanaka', role: 'Product designer', rating: 5, text: 'Clear, calm and practical. I used the templates at work the week after finishing and my team adopted them.' },
  { name: 'Lucas Ferreira', role: 'Analyst', rating: 5, text: 'Finally a course that treats you like an adult. No fluff, no hype, just careful explanations and real examples.' },
  { name: 'Hannah Becker', role: 'Freelancer', rating: 4, text: 'Great structure and excellent notes. The knowledge checks caught a couple of misunderstandings I did not know I had.' },
  { name: 'Rahul Iyer', role: 'Student', rating: 5, text: 'I finished it in three weeks alongside college. The progress tracking and short lessons made it easy to keep a streak going.' },
  { name: 'Grace Whitfield', role: 'Engineering manager', rating: 5, text: 'I bought this for my team. It is now part of our onboarding, which says everything.' },
  { name: 'Omar Haddad', role: 'Backend developer', rating: 4, text: 'Strong fundamentals and good production advice. A couple of videos could be shorter, but the content is excellent.' },
  { name: 'Chloe Martin', role: 'Startup founder', rating: 5, text: 'Exactly the right depth. I came away with a plan I could act on the same day.' },
  { name: 'Ivan Petrov', role: 'Data engineer', rating: 5, text: 'The projects are realistic and the instructor shows their own mistakes. That alone is worth the price.' },
  { name: 'Ama Boateng', role: 'UX researcher', rating: 4, text: 'Thoughtful and well produced. I appreciated the accessibility notes woven throughout instead of tacked on at the end.' },
];

export const reviewsFor = (course, count = 4) => {
  const rand = seeded(`reviews-${course.slug}`);
  const picked = [...pool]
    .map((review) => ({ review, sort: rand() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map(({ review }, i) => ({
      ...review,
      id: `${course.slug}-${i}`,
      date: new Date(2026, 9 - i * 2, 4 + Math.round(rand() * 20)).toISOString(),
    }));
  return picked;
};

// Approximate star distribution from an average rating
export const ratingDistribution = (rating) => {
  const five = Math.min(0.92, Math.max(0.45, (rating - 3.9) * 0.72 + 0.12));
  const four = Math.max(0.05, (1 - five) * 0.68);
  const three = Math.max(0.02, (1 - five - four) * 0.6);
  const two = Math.max(0.01, (1 - five - four - three) * 0.55);
  const one = Math.max(0, 1 - five - four - three - two);
  return [five, four, three, two, one].map((v) => Math.round(v * 100));
};
