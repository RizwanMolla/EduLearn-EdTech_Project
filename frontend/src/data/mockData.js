// src/data/mockData.js
export const mockCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dianne Russell",
      rating: 4.8,
      reviews: 420,
      students: 12000,
      price: 149.99,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Web Development",
      level: "Beginner to Advanced",
      language: "English",
      duration: "50 hours",
      description: "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js, and more.",
      curriculum: [
        {
          section: "HTML Fundamentals",
          lectures: ["HTML Tags", "Forms", "Semantics", "Accessibility"],
          duration: "5 hours"
        },
        {
          section: "CSS Styling",
          lectures: ["Selectors", "Flexbox", "Grid", "Animations"],
          duration: "8 hours"
        },
        {
          section: "JavaScript Essentials",
          lectures: ["Variables", "Functions", "DOM Manipulation", "Events"],
          duration: "12 hours"
        },
        {
          section: "React.js",
          lectures: ["Components", "State", "Hooks", "Router"],
          duration: "15 hours"
        },
        {
          section: "Backend with Node.js",
          lectures: ["Express", "MongoDB", "REST APIs", "Authentication"],
          duration: "10 hours"
        }
      ]
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      instructor: "Arlene McCoy",
      rating: 4.9,
      reviews: 350,
      students: 8500,
      price: 199.99,
      image: "https://plus.unsplash.com/premium_photo-1664297950425-99a968926a74?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Data Science",
      level: "Intermediate",
      language: "English",
      duration: "45 hours",
      description: "Master the art of data analysis and machine learning algorithms to solve real-world problems.",
      curriculum: [
        {
          section: "Python for Data Science",
          lectures: ["NumPy", "Pandas", "Data Visualization", "Data Cleaning"],
          duration: "10 hours"
        },
        {
          section: "Statistical Analysis",
          lectures: ["Descriptive Statistics", "Probability", "Hypothesis Testing"],
          duration: "8 hours"
        },
        {
          section: "Machine Learning",
          lectures: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
          duration: "15 hours"
        },
        {
          section: "Deep Learning",
          lectures: ["Neural Networks", "TensorFlow", "Computer Vision", "NLP"],
          duration: "12 hours"
        }
      ]
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Cody Fisher",
      rating: 4.7,
      reviews: 280,
      students: 5600,
      price: 129.99,
      image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Design",
      level: "All Levels",
      language: "English",
      duration: "35 hours",
      description: "Learn the principles of user interface and user experience design to create engaging digital products.",
      curriculum: [
        {
          section: "Design Fundamentals",
          lectures: ["Color Theory", "Typography", "Layout", "Visual Hierarchy"],
          duration: "6 hours"
        },
        {
          section: "User Research",
          lectures: ["User Personas", "User Journeys", "User Testing"],
          duration: "8 hours"
        },
        {
          section: "Wireframing & Prototyping",
          lectures: ["Sketching", "Low-fidelity Prototypes", "Interactive Prototypes"],
          duration: "10 hours"
        },
        {
          section: "Design Systems",
          lectures: ["Component Libraries", "Style Guides", "Design Tokens"],
          duration: "5 hours"
        },
        {
          section: "Design Tools",
          lectures: ["Figma", "Adobe XD", "Sketch", "InVision"],
          duration: "6 hours"
        }
      ]
    },
    {
      id: 4,
      title: "Digital Marketing Fundamentals",
      instructor: "Wade Warren",
      rating: 4.6,
      reviews: 220,
      students: 4800,
      price: 89.99,
      image: "https://plus.unsplash.com/premium_photo-1684341008757-3b456034e943?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Marketing",
      level: "Beginner",
      language: "English",
      duration: "30 hours",
      description: "Master the essentials of digital marketing including SEO, SEM, social media and content marketing.",
      curriculum: [
        {
          section: "Marketing Foundations",
          lectures: ["Marketing Strategy", "Target Audience", "Branding"],
          duration: "5 hours"
        },
        {
          section: "SEO & SEM",
          lectures: ["Keyword Research", "On-page SEO", "Google Ads"],
          duration: "8 hours"
        },
        {
          section: "Social Media Marketing",
          lectures: ["Facebook", "Instagram", "LinkedIn", "Twitter"],
          duration: "7 hours"
        },
        {
          section: "Content Marketing",
          lectures: ["Content Strategy", "Blogging", "Video Marketing"],
          duration: "6 hours"
        },
        {
          section: "Analytics & Reporting",
          lectures: ["Google Analytics", "KPIs", "Reporting Dashboards"],
          duration: "4 hours"
        }
      ]
    },
    {
      id: 5,
      title: "Mobile App Development with Flutter",
      instructor: "Dianne Russell",
      rating: 4.8,
      reviews: 190,
      students: 3200,
      price: 159.99,
      image: "https://plus.unsplash.com/premium_photo-1683262038148-2ac280407276?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Mobile Development",
      level: "Intermediate",
      language: "English",
      duration: "40 hours",
      description: "Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
      curriculum: [
        {
          section: "Dart Programming",
          lectures: ["Variables", "Functions", "Object-Oriented Programming"],
          duration: "6 hours"
        },
        {
          section: "Flutter Basics",
          lectures: ["Widgets", "Layouts", "Navigation"],
          duration: "10 hours"
        },
        {
          section: "State Management",
          lectures: ["setState", "Provider", "Bloc Pattern"],
          duration: "8 hours"
        },
        {
          section: "Firebase Integration",
          lectures: ["Authentication", "Firestore", "Cloud Functions"],
          duration: "6 hours"
        },
        {
          section: "App Deployment",
          lectures: ["Play Store", "App Store", "Testing"],
          duration: "10 hours"
        }
      ]
    },
    {
      id: 6,
      title: "Blockchain & Cryptocurrency",
      instructor: "Cody Fisher",
      rating: 4.7,
      reviews: 175,
      students: 2800,
      price: 179.99,
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1102&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Blockchain",
      level: "Advanced",
      language: "English",
      duration: "38 hours",
      description: "Understand the fundamentals of blockchain technology and how cryptocurrencies work.",
      curriculum: [
        {
          section: "Blockchain Fundamentals",
          lectures: ["Distributed Ledgers", "Cryptography", "Consensus Mechanisms"],
          duration: "8 hours"
        },
        {
          section: "Smart Contracts",
          lectures: ["Solidity", "Ethereum", "Testing Smart Contracts"],
          duration: "10 hours"
        },
        {
          section: "DApps Development",
          lectures: ["Web3.js", "Truffle", "Front-end Integration"],
          duration: "12 hours"
        },
        {
          section: "Cryptocurrency",
          lectures: ["Bitcoin", "Ethereum", "Altcoins", "Tokenomics"],
          duration: "8 hours"
        }
      ]
    }
  ];