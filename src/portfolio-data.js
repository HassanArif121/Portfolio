export const portfolio = {
  name: "Muhammad Hassan",
  initials: "MH",
  role: "AI/ML + Full Stack Developer",
  location: "Lahore, Pakistan",
  availability: "Open to full-time & freelance work",

  // Hero headline. `em: true` renders the segment in the editorial serif italic.
  headline: [
    [{ text: "I build full-stack" }],
    [{ text: "products with" }],
    [{ text: "intelligent", em: true }, { text: " systems inside." }]
  ],

  summary:
    "Computer Engineering graduate from ITU Lahore working across React front-ends, Node APIs, and applied computer vision. I like turning dense technical workflows into interfaces people can actually use.",

  contact: {
    email: "hassan7663arif@gmail.com",
    phone: "+92-370-7885899",
    linkedin: "https://www.linkedin.com/in/muhammad-hassan-arif-400320322/",
    github: "https://github.com/HassanArif121"
  },

  marquee: [
    "React",
    "Next.js",
    "React Native",
    "TypeScript",
    "Node & Express",
    "MongoDB",
    "Python",
    "PyTorch",
    "OpenCV",
    "YOLO",
    "AWS"
  ],

  stats: [
    { value: "6", suffix: "+", label: "Projects shipped", note: "Web, mobile & vision" },
    { value: "3.30", label: "Final CGPA", note: "B.Sc. Computer Engineering" },
    { value: "2026", plain: true, label: "Graduated", note: "ITU Lahore" },
    { value: "4", suffix: " mo", label: "Industry internship", note: "React Native, Nexentra" }
  ],

  projects: [
    {
      title: "Automated Attendance & Monitoring System",
      category: "AI/ML",
      year: "Final Year Project",
      featured: true,
      image: "/assets/project-attendance.png",
      href: "https://github.com/saadee1605/finalyearproject",
      description:
        "A face-recognition attendance platform built on a 9-stage computer vision pipeline — capture, detection, embedding, matching, validation, logging and live monitoring — wrapped in a React dashboard that teachers can run without touching a terminal.",
      stack: ["React", "Python", "OpenCV", "Computer Vision", "MongoDB"]
    },
    {
      title: "Real-Time Weapon Detection",
      category: "AI/ML",
      year: "2025",
      image: "/assets/project-ai-vision.png",
      href: "",
      description:
        "YOLO-based detection workflow covering dataset collection, annotation, training runs, evaluation against precision/recall targets, and deployment prep for live video streams.",
      stack: ["Python", "YOLO", "PyTorch", "Deployment"]
    },
    {
      title: "Law Firm Website",
      category: "Web",
      year: "2025",
      image: "/assets/project-lawfirm.png",
      href: "https://lawfirm-liard.vercel.app/",
      description:
        "Production Next.js site for a legal practice — content-driven pages, SEO fundamentals, accessible navigation and a layout that holds up from mobile to wide desktop.",
      stack: ["Next.js", "React", "SEO", "Accessibility"]
    },
    {
      title: "White Blood Cell Classification",
      category: "AI/ML",
      year: "2024",
      image: "/assets/project-ai-vision.png",
      href: "",
      description:
        "Research-oriented pipeline for microscopy images: preprocessing and enhancement, augmentation, then a CNN classifier across the major white blood cell categories.",
      stack: ["Python", "OpenCV", "Deep Learning", "Healthcare AI"]
    },
    {
      title: "Rehabilitation Center Website",
      category: "Web",
      year: "2024",
      image: "/assets/project-rehab.png",
      href: "https://github.com/HassanArif121/Rehabilitation-Center",
      description:
        "Component-driven React site with reusable service sections, clear calls to action and readable navigation across every breakpoint.",
      stack: ["React", "Components", "Responsive UI"]
    },
    {
      title: "Maze Solving Game",
      category: "Systems",
      year: "2023",
      image: "/assets/project-attendance.png",
      href: "",
      description:
        "Interactive C++ pathfinding project visualising BFS and DFS traversal step by step — built to make graph algorithms and data structures tangible.",
      stack: ["C++", "BFS", "DFS", "Algorithms"]
    }
  ],

  skills: [
    {
      title: "Frontend",
      icon: "layout",
      blurb: "Interfaces that stay fast and legible as they grow.",
      items: ["React", "Next.js", "React Native", "JavaScript / TypeScript", "Responsive systems"]
    },
    {
      title: "Backend & Data",
      icon: "server",
      blurb: "APIs and data layers that are simple to reason about.",
      items: ["Node & Express", "MongoDB / Mongoose", "REST APIs", "Auth & mail flows", "Deployment"]
    },
    {
      title: "AI & Computer Vision",
      icon: "brain",
      blurb: "From dataset to a model that actually runs somewhere.",
      items: ["Machine learning", "Deep learning", "YOLO detection", "OpenCV", "Image pipelines"]
    },
    {
      title: "Workflow",
      icon: "workflow",
      blurb: "The unglamorous parts that keep projects shipping.",
      items: ["Git & GitHub", "Jira", "Notion", "n8n automation", "AWS Cloud Foundations"]
    }
  ],

  timeline: [
    {
      date: "Jun 2025 — Oct 2025",
      title: "React Native Intern",
      org: "Nexentra Solutions",
      kind: "Work",
      body:
        "Shipped mobile app features alongside senior engineers — component architecture, state management, API integration and review-ready delivery."
    },
    {
      date: "Aug 2022 — Jun 2026",
      title: "B.Sc. Computer Engineering",
      org: "Information Technology University, Lahore",
      kind: "Education",
      status: "Completed · 3.30 CGPA",
      body:
        "Graduated with a 3.30 CGPA. Coursework across programming, object-oriented design, data structures, databases, machine learning and computer vision, capped by a computer-vision final year project."
    },
    {
      date: "2024",
      title: "Cloud Foundations Graduate",
      org: "AWS Academy",
      kind: "Certification",
      body:
        "Foundational AWS training covering core services, architecture and deployment — the cloud literacy behind the full-stack and AI work."
    }
  ]
};
