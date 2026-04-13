import mongoose from "mongoose";
import dotenv from "dotenv";
import Placement from "./models/Placement.js";
import Blog from "./models/Blog.js";

dotenv.config();

const branches = ["CSE", "IT", "ECE", "ME", "CE", "EEE"];

const companies = [
  // Top Product
  {
    name: "Google",
    roles: ["Software Engineer", "SWE-II", "ML Engineer"],
    pkgRange: [30, 45],
    branch: ["CSE", "IT"],
  },
  {
    name: "Microsoft",
    roles: ["Software Engineer", "SDE-I", "Cloud Engineer"],
    pkgRange: [25, 42],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "Amazon",
    roles: ["SDE-I", "Data Engineer", "Cloud Architect"],
    pkgRange: [20, 35],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "Adobe",
    roles: ["Software Engineer", "UI Engineer", "Product Analyst"],
    pkgRange: [18, 30],
    branch: ["CSE", "IT"],
  },
  {
    name: "Atlassian",
    roles: ["Software Engineer", "Backend Developer"],
    pkgRange: [20, 32],
    branch: ["CSE", "IT"],
  },
  {
    name: "Cisco",
    roles: ["Software Engineer", "Network Engineer", "Embedded Engineer"],
    pkgRange: [14, 24],
    branch: ["CSE", "IT", "ECE", "EEE"],
  },
  {
    name: "Oracle",
    roles: ["Apps Developer", "Cloud Developer", "DBA"],
    pkgRange: [12, 22],
    branch: ["CSE", "IT"],
  },
  {
    name: "Nutanix",
    roles: ["Software Engineer", "SRE", "DevOps Engineer"],
    pkgRange: [18, 30],
    branch: ["CSE", "IT"],
  },
  {
    name: "Salesforce",
    roles: ["Software Engineer", "Developer Advocate"],
    pkgRange: [15, 28],
    branch: ["CSE", "IT"],
  },
  // Indian Unicorns
  {
    name: "Flipkart",
    roles: ["SDE-I", "Data Analyst", "Product Manager"],
    pkgRange: [18, 32],
    branch: ["CSE", "IT"],
  },
  {
    name: "Razorpay",
    roles: ["Software Engineer", "Backend Engineer", "Fintech Analyst"],
    pkgRange: [14, 26],
    branch: ["CSE", "IT"],
  },
  {
    name: "PhonePe",
    roles: ["Software Engineer", "Android Developer", "iOS Developer"],
    pkgRange: [12, 22],
    branch: ["CSE", "IT"],
  },
  {
    name: "Swiggy",
    roles: ["SDE-I", "Data Scientist", "Growth Analyst"],
    pkgRange: [12, 20],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "Zomato",
    roles: ["Software Engineer", "Data Analyst", "ML Engineer"],
    pkgRange: [12, 20],
    branch: ["CSE", "IT"],
  },
  {
    name: "CRED",
    roles: ["Backend Engineer", "DevOps Engineer", "Product Analyst"],
    pkgRange: [14, 25],
    branch: ["CSE", "IT"],
  },
  {
    name: "Meesho",
    roles: ["SDE-I", "Data Analyst", "ML Engineer"],
    pkgRange: [10, 18],
    branch: ["CSE", "IT"],
  },
  {
    name: "Paytm",
    roles: ["Software Engineer", "Android Developer", "Data Analyst"],
    pkgRange: [8, 16],
    branch: ["CSE", "IT", "ECE"],
  },
  // Finance / Consulting
  {
    name: "Goldman Sachs",
    roles: ["Analyst", "Software Engineer", "Quant Analyst"],
    pkgRange: [16, 28],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "Barclays",
    roles: ["Technology Analyst", "Software Developer"],
    pkgRange: [10, 18],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "JPMorgan Chase",
    roles: ["Software Engineer", "Risk Analyst", "Data Analyst"],
    pkgRange: [12, 20],
    branch: ["CSE", "IT"],
  },
  {
    name: "Deloitte",
    roles: ["Analyst", "Consultant", "Technology Consultant"],
    pkgRange: [7, 14],
    branch: ["CSE", "IT", "ME", "CE", "ECE", "EEE"],
  },
  {
    name: "Ernst & Young",
    roles: ["Analyst", "Technology Consultant"],
    pkgRange: [7, 12],
    branch: ["CSE", "IT", "ME", "CE"],
  },
  {
    name: "KPMG",
    roles: ["Analyst", "Technology Analyst"],
    pkgRange: [7, 12],
    branch: ["CSE", "IT", "ME", "CE", "ECE"],
  },
  // Startups
  {
    name: "Freshworks",
    roles: ["Software Engineer", "Customer Success Engineer"],
    pkgRange: [8, 16],
    branch: ["CSE", "IT", "ECE"],
  },
  {
    name: "Zoho",
    roles: ["Software Engineer", "Support Engineer", "QA Engineer"],
    pkgRange: [6, 12],
    branch: ["CSE", "IT"],
  },
  {
    name: "Postman",
    roles: ["Software Engineer", "DevRel Engineer"],
    pkgRange: [14, 24],
    branch: ["CSE", "IT"],
  },
  {
    name: "BrowserStack",
    roles: ["Software Engineer", "QA Engineer"],
    pkgRange: [10, 18],
    branch: ["CSE", "IT"],
  },
  {
    name: "Zepto",
    roles: ["SDE-I", "Data Analyst", "DevOps Engineer"],
    pkgRange: [10, 20],
    branch: ["CSE", "IT"],
  },
  // IT Services
  {
    name: "TCS",
    roles: [
      "System Engineer",
      "Assistant System Engineer",
      "Digital IT Analyst",
    ],
    pkgRange: [3.5, 7],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "Infosys",
    roles: ["Systems Engineer", "Power Programmer", "Digital Specialist"],
    pkgRange: [3.6, 7.5],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "Wipro",
    roles: ["Project Engineer", "Elite NLTH Engineer", "Software Engineer"],
    pkgRange: [3.5, 7],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "HCL Technologies",
    roles: ["Graduate Engineer Trainee", "Software Engineer"],
    pkgRange: [3.5, 6.5],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "Tech Mahindra",
    roles: ["Associate Software Engineer", "Network Engineer"],
    pkgRange: [3.5, 7],
    branch: ["CSE", "IT", "ECE", "ME", "EEE"],
  },
  {
    name: "Cognizant",
    roles: ["Programmer Analyst Trainee", "GenC Engineer"],
    pkgRange: [4, 8],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "Accenture",
    roles: ["Associate Software Engineer", "Advanced App Engineering"],
    pkgRange: [4.5, 9],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "Capgemini",
    roles: ["Analyst", "Software Analyst"],
    pkgRange: [4, 8],
    branch: ["CSE", "IT", "ECE", "ME", "CE", "EEE"],
  },
  {
    name: "LTIMindtree",
    roles: ["Software Engineer", "Technology Analyst"],
    pkgRange: [4.5, 9],
    branch: ["CSE", "IT", "ECE", "ME", "CE"],
  },
];

const firstNames = [
  "Rahul",
  "Priya",
  "Arjun",
  "Sneha",
  "Rohit",
  "Ananya",
  "Aditya",
  "Pooja",
  "Karan",
  "Deepika",
  "Vikas",
  "Simran",
  "Harsh",
  "Riya",
  "Nikhil",
  "Kavya",
  "Saurabh",
  "Tanvi",
  "Akash",
  "Meera",
  "Mohit",
  "Pallavi",
  "Suresh",
  "Ankita",
  "Gaurav",
  "Nisha",
  "Manish",
  "Divya",
  "Vivek",
  "Shreya",
  "Aman",
  "Komal",
  "Rajat",
  "Swati",
  "Ishaan",
  "Neha",
  "Tushar",
  "Aishwarya",
  "Kunal",
  "Ritika",
];
const lastNames = [
  "Sharma",
  "Patel",
  "Singh",
  "Kumar",
  "Gupta",
  "Verma",
  "Jain",
  "Agarwal",
  "Bose",
  "Mehta",
  "Yadav",
  "Malhotra",
  "Kapoor",
  "Sinha",
  "Pandey",
  "Mishra",
  "Nair",
  "Iyer",
  "Reddy",
  "Rao",
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randNum(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generatePlacements() {
  const placements = [];
  const yearsConfig = [
    { year: 2021, count: 65 },
    { year: 2022, count: 80 },
    { year: 2023, count: 95 },
    { year: 2024, count: 110 },
  ];

  yearsConfig.forEach(({ year, count }) => {
    for (let i = 0; i < count; i++) {
      const company = rand(companies);
      const branch = rand(company.branch);
      const role = rand(company.roles);
      const pkg = randNum(company.pkgRange[0], company.pkgRange[1]);
      const name = `${rand(firstNames)} ${rand(lastNames)}`;
      placements.push({
        studentName: name,
        branch,
        company: company.name,
        role,
        package: pkg,
        year,
        type: "On-Campus",
      });
    }
  });
  return placements;
}

const blogSeedData = [
  {
    title: "How I Cracked Google SWE Role With 42 LPA Package",
    author: "Rahul Sharma",
    batch: "2024",
    branch: "CSE",
    company: "Google",
    tags: ["Interview Experience", "Google", "DSA"],
    excerpt:
      "My journey from competitive programming to cracking the Google interview and landing a dream offer...",
    content: `Getting placed at Google was a surreal experience. It all started in my 3rd year when I decided to take DSA seriously.

**Preparation Strategy**

I focused on three key pillars:
1. **Data Structures & Algorithms** - Solved 400+ problems on LeetCode, focusing on arrays, graphs, DP and trees.
2. **System Design** - Read "Designing Data-Intensive Applications" and watched various YouTube resources.
3. **Behavioral** - Practiced STAR method answers for leadership, conflict, and impact stories.

**Interview Process**

Google conducted 5 rounds:
- Online Assessment: 2 DSA problems (Medium + Hard)
- Phone Screen: Tree traversal + DP problem
- Virtual Onsite Round 1: Graph + Sliding Window
- Virtual Onsite Round 2: System Design (Design YouTube)
- Behavioral with a Senior Engineer

**Key Tips**
- Think aloud during interviews — Google values your thought process
- Always clarify constraints before coding
- Be ready to optimize your initial solution
- Practice FAANG-style mock interviews on Pramp or Interviewing.io

The offer arrived 3 weeks after my final round. The package was 42 LPA — the highest in our college history. Hard work, consistency, and a structured approach made it possible!`,
    date: new Date("2024-06-10"),
    readTime: "7 min",
  },
  {
    title: "Cracking TCS NQT — Full Guide for Service Company Placements",
    author: "Priya Patel",
    batch: "2024",
    branch: "IT",
    company: "TCS",
    tags: ["Career Advice", "TCS", "Placement Tips"],
    excerpt:
      "A complete guide to the TCS National Qualifier Test with tips, resources, and my personal journey...",
    content: `TCS is one of the largest recruiters and the NQT (National Qualifier Test) is the gateway. Here's everything I know.

**About NQT**

The test has 4 sections:
1. **Verbal Ability** - Reading comprehension, grammar, vocabulary
2. **Reasoning Ability** - Logical, analytical reasoning
3. **Numerical Ability** - Quantitative aptitude
4. **Programming Logic** - Flowcharts, coding MCQs

**My Preparation**

- Used IndiaBix for aptitude practice (30 mins daily)
- Solved TCS previous year papers from PrepInsta
- Practiced coding in C++ on HackerRank
- Improved English grammar using Grammarly exercises

**Interview Rounds**

After clearing NQT, there were 2 rounds:
1. **Technical Interview**: Basics of DBMS, OS, OOPs, any one project
2. **HR Interview**: Tell me about yourself, why TCS, strengths/weaknesses

**Final Tips**
- Do NOT ignore the NQT — 70%ile+ is needed for interview shortlist
- Be thorough with your project and internship experience
- TCS looks for attitude and willingness to learn over deep technical skills

I got placed as System Engineer at 3.5 LPA. It's a great starting point with excellent training programs!`,
    date: new Date("2024-03-20"),
    readTime: "5 min",
  },
  {
    title: "My Microsoft SDE-I Interview Experience — What to Expect",
    author: "Arjun Singh",
    batch: "2023",
    branch: "CSE",
    company: "Microsoft",
    tags: ["Interview Experience", "Microsoft", "SDE"],
    excerpt:
      "What to expect during Microsoft interviews — preparation to offer, all the details here...",
    content: `Microsoft visited our campus for SDE-I roles. Here's the entire process and how I prepared.

**Eligibility & Shortlisting**

- CGPA > 7.5 required
- Resume screening based on projects, internships, skills
- ~40 students shortlisted from 200 applicants

**Test Round**

Conducted on CodePair:
- 3 DSA problems: Easy (String manipulation), Medium (Binary Search), Hard (Graph BFS/DFS)
- 75 minutes total
- 20 students made it through

**Interview Rounds**

Round 1 — DSA (45 min):
- Merge K sorted lists
- Find longest substring without repeating characters

Round 2 — Problem Solving + Design (45 min):
- Low-Level Design of a Parking Lot System
- OOP concepts, SOLID principles

Round 3 — Behavioral (30 min):
- Growth Mindset stories
- Leadership and conflict resolution

HR Round:
- Offer discussion, start date, team preferences

**Resources I Used**
- LeetCode Premium (Microsoft tagged problems)
- Grokking the System Design Interview
- Elements of Programming Interviews (book)

Got an offer at 28 LPA all-inclusive. Microsoft has amazing L&D and the onboarding experience is top notch!`,
    date: new Date("2023-12-15"),
    readTime: "6 min",
  },
  {
    title: "From Zero to Flipkart SDE-I — My Story of Failing and Succeeding",
    author: "Sneha Gupta",
    batch: "2024",
    branch: "CSE",
    company: "Flipkart",
    tags: ["Interview Experience", "Flipkart", "Motivation"],
    excerpt:
      "I failed 3 company interviews before Flipkart. Here's what I changed and how I finally got placed...",
    content: `I failed TCS, Infosys, and Wipro OA rounds before I got placed at Flipkart. This is my real story.

**The Low Point**

After failing 3 OA rounds in September, I was devastated. My friends were getting placed and I was stuck. I had to regroup.

**What I Changed**

1. Stopped mindless LeetCode grinding and focused on patterns
2. Spent 2 weeks only on arrays and strings (most common interview topics)
3. Joined a peer coding group — 2 mock interviews per week
4. Did weekly DSA contests on Codeforces

**Flipkart's Process**

- OA: 2 Coding problems (Medium) + 20 MCQs on CS fundamentals
- Technical Round 1: DSA (Sliding window, Two pointers)
- Technical Round 2: DBMS + OS + one design question
- Bar Raiser: Real-world problem solving + culture fit

**Key Learnings**

"Failure is not falling down but refusing to get up." — Each rejection taught me something new.

The Flipkart offer at 21 LPA felt like the best achievement. More importantly, I learned resilience. Your journey might not be linear — and that's okay!`,
    date: new Date("2024-05-08"),
    readTime: "6 min",
  },
  {
    title: "Deloitte UST Analyst Role — Interview Tips for Non-CS Branches",
    author: "Vivek Rao",
    batch: "2023",
    branch: "ME",
    company: "Deloitte",
    tags: ["Career Advice", "Deloitte", "Non-CS"],
    excerpt:
      "How I, a Mechanical Engineering student, landed a technology analyst role at Deloitte...",
    content: `As a Mechanical Engineering student in a sea of CSE/IT candidates, getting into IT consulting seemed impossible. Here's how I did it.

**Why Deloitte Visits Non-CS Branches?**

Deloitte hires from all branches for its UST (Analyst) role. They value:
- Problem solving ability
- Analytical mindset
- Client communication skills
- Willingness to learn tech

**Preparation**

Non-CS students need to cover:
1. Basic Python programming (GeeksForGeeks Python tutorial)
2. SQL fundamentals (Khan Academy, W3Schools)
3. Excel + Power BI basics
4. STAR stories for behavioral rounds

**The Process**

- Aptitude Test: Math, English, Logical Reasoning (easy)
- Technical Interview: Python/SQL basics, any tech project you've done
- HR + Group Discussion: Topic was "Remote Work — Pros and Cons"

**My Key Tips**

- Highlight your cross-disciplinary thinking (ME + Tech)
- Show enthusiasm for learning new tech
- Leadership from college clubs/fests matters a lot

I got placed as Technology Analyst at 7 LPA — and I'm now working on ERP implementation projects using SAP. Non-CS folks, there's a place for you!`,
    date: new Date("2023-11-20"),
    readTime: "5 min",
  },
  {
    title: "Amazon SDE-I Interview — A Complete Walkthrough",
    author: "Karan Verma",
    batch: "2024",
    branch: "IT",
    company: "Amazon",
    tags: ["Interview Experience", "Amazon", "SDE"],
    excerpt:
      "Everything about Amazon's SDE-I hiring process — OA, LP principles, and the bar raiser round...",
    content: `Amazon has a very unique hiring process centered around Leadership Principles. Here's everything I learned.

**Amazon's 16 Leadership Principles**

You MUST know these inside out. Every interview question ties back to an LP. Key ones to prepare:
- Customer Obsession
- Dive Deep
- Deliver Results
- Bias for Action
- Ownership

**Online Assessment**

- 2 Coding problems (Medium/Hard)
- Work Style Assessment (personality)
- 45 minutes for coding
- Problems were on Arrays and Dynamic Programming

**Interview Rounds**

Round 1 - Coding: Two Sum variants, Merge Intervals
Round 2 - System Design: Design a URL Shortener
Bar Raiser Round (60 min):
- Deep dive on a project from your resume
- 1 coding problem
- 4-5 behavioral questions (LPs)
- This round decides if you clear the hire bar

**Offer**

Base: 18 LPA + Stocks + Signing Bonus = ~28 LPA CTC

**Advice**

- Use STAR for every behavioral answer
- Be specific with metrics ("I reduced load time by 40%")
- Amazon values ownership above everything else

Best of luck — the Amazon process is intense but very fair!`,
    date: new Date("2024-07-12"),
    readTime: "8 min",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Placement.deleteMany({});
    await Blog.deleteMany({});

    const placements = generatePlacements();
    await Placement.insertMany(placements);
    console.log(`Inserted ${placements.length} placements`);

    await Blog.insertMany(blogSeedData);
    console.log(`Inserted ${blogSeedData.length} blogs`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
