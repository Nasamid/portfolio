export interface Project {
  id: string;
  title: string;
  category: "Computer Vision" | "RAG & LLM" | "Edge AI" | "IoT & Embedded" | "Automation";
  tagline: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  impact: string[];
  techStack: string[];
  status: "Deployed" | "Active Production" | "Completed";
  metrics: { label: string; value: string }[];
  interactiveType: "rag" | "aoi" | "dtr" | "leaf" | "sql" | "report";
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  details: string[];
  techUsed: string[];
}

export interface Certification {
  name: string;
  provider?: string;
  detail?: string;
}

export interface Award {
  title: string;
  issuer: string;
  rank?: string;
}

export const SKILL_CATEGORIES = [
  {
    name: "Artificial Intelligence & Vision",
    skills: ["PyTorch", "Ultralytics YOLOv11 & YOLOv8", "OpenCV", "InsightFace", "Deep Learning", "CNN (DenseNet-121)", "RAG (Retrieval-Augmented Generation)", "LangChain", "ChromaDB", "Ollama"]
  },
  {
    name: "Edge Hardware & Robotics",
    skills: ["NVIDIA Jetson Orin NX", "Raspberry Pi 4B", "Arduino", "Microcontrollers & Embedded C", "Embedded Linux", "Sensor Integration", "Thermal Imaging Telemetry"]
  },
  {
    name: "Programming & Frameworks",
    skills: ["Python", "JavaScript / TypeScript", "Node.js (Express)", "Java", "HTML/CSS", "Figma (UI/UX Mockups)", "Git / GitHub", "Docker"]
  }
];

export const WORK_HISTORY: WorkExperience[] = [
  {
    company: "Wistron Infocomm Philippines",
    role: "Software / Automation Engineer",
    period: "Jun 2025 - Present",
    location: "Subic Bay, Philippines",
    description: "Spearheading high-impact automation and edge-AI software solutions to maximize production yield and optimize human resources efficiency in smart-factory manufacturing.",
    details: [
      "AI Automated Optical Inspection System (YOLOv11 & AOI Systems): Architected and deployed an end-to-end edge computer vision inspection model using custom-trained YOLOv11 detectors to automate pin deflection/alignment checks on 300-pin connectors. Configured real-time, low-latency CUDA-accelerated stream queues to check connectors automatically, replacing fatigue-prone microscope audits with a systems accuracy rate of 98.2%.",
      "Edge facial recognition registry (NVIDIA Jetson DTR): Designed and configured an on-device biometric login pipeline using InsightFace on NVIDIA Jetson Orin NX endpoints. Secured direct motherboard GPIO relay connections to trigger electronic door strikes, logging clock-in/clock-out events directly to the SQL database server with 100% recognition matching among 500+ daily employees.",
      "Enterprise Repair Troubleshooting Assistant (ChromaDB RAG chatbot): Engineered local Retrieval-Augmented Generation (RAG) helpers utilizing LangChain and ChromaDB vector indexes loaded onto central facility machines. Indexed 30,000+ historical boards, schematics, and component datasheets to offer automated, instantly retrievable repair logs to technicians, cutting employee onboarding cycles by 40%.",
      "Thermal Telemetry & Short Locator Logs: Created microscale thermal camera analytical twins that map heating telemetry across active manufacturing cells, identifying and archiving short circuit locations automatically on factory logs.",
      "Distributed multi-GPU training clusters: Configured localized deep learning machines into unified clusters using PyTorch distributed data parallel (DDP) loops, accelerating incremental model updates across 4 connected GPUs without relying on high-bandwidth outer cloud networks.",
      "Web Report Automation & Dashboard Dispatchers: Built a script-driven Express and Puppeteer crawler engine designed to automatically compile daily multi-station logs, compute defect rate percentages, and dispatch graphical notifications to management channels via Slack and Discord webhooks."
    ],
    techUsed: ["Python", "NVIDIA Jetson Orin NX", "YOLOv11", "PyTorch", "OpenCV", "LangChain", "ChromaDB", "Express", "React", "Linux"]
  },
  {
    company: "DOST-PES/SEI (Project LODI)",
    role: "Web Design Intern",
    period: "Jun 2024 - Aug 2024",
    location: "Remote (Work From Home)",
    description: "Designed user-centric administrative assets and custom metrics reports to power state-supported portfolio tracking dashboards.",
    details: [
      "Crafted mobile-responsive, highly detailed Figma visual blueprints and interactive wireframe prototypes mapping state-level development indexes.",
      "Built Google Data Studio dashboards linking active budget utilization against timeline targets, helping national monitors review system health metrics instantly."
    ],
    techUsed: ["Figma", "Google Data Studio", "UI/UX Design", "Responsive Web Design"]
  },
  {
    company: "Philippine Coastal Storage & Pipeline Corp.",
    role: "Accounting Office Intern",
    period: "Jul 2023 - Aug 2023",
    location: "Subic Bay Freeport Zone, Philippines",
    description: "Supported organizational audit workflows through database validation and systematic filing procedures.",
    details: [
      "Compiled, classified, and indexed multi-tier fiscal payment vouchers to fast-track internal auditing operations.",
      "Assisted senior accountants in sorting material balance documents in preparation for annual regulatory audit cycles."
    ],
    techUsed: ["Document Controls", "Excel Verification", "Process Audits"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "repair-chatbot",
    title: "RAG Diagnostic Helper",
    category: "RAG & LLM",
    tagline: "RAG knowledge retrieval assistant indexing 30,000+ historic records",
    description: "A local, offline intelligence assistant helping repair teams answer schema and diagnostic problems based on years of historic reports.",
    longDescription: "Powered by LangChain, ChromaDB, and an offline Ollama model, this tool acts as an active knowledge hub. It indexes 30,000+ archived testing spreadsheets, returning answers to query symptoms in seconds, bypassing the need to search manuals manually.",
    problem: "Experienced engineers spend critical hours answering repetitive calibration and troubleshooting queries for newly onboarded staff.",
    solution: "Engineered a local vector retrieval-augmented generation (RAG) system with an incremental file sync parser, working completely offline on local facility machines.",
    impact: [
      "Decreased technical onboarding time of junior repairers.",
      "Unlocked access to 30,000 historic troubleshoot cases.",
      "Eliminated 100% of external web telemetry, guaranteeing enterprise privacy."
    ],
    techStack: ["LangChain", "ChromaDB", "Ollama LLM", "Python", "React", "Express"],
    status: "Deployed",
    metrics: [
      { label: "Index Size", value: "30k Files" },
      { label: "Response Delay", value: "< 2.1s" },
      { label: "Onboard Speedup", value: "40%" }
    ],
    interactiveType: "rag"
  },
  {
    id: "xray-aoi",
    title: "AI Automated Optical Inspection (X-Ray AOI)",
    category: "Computer Vision",
    tagline: "Live deep learning BGA defect classification on assembly feeds",
    description: "A deep learning defect detection system deployed alongside heavy X-ray scanners to automatically classify array solder balls as voided, bridged, or misaligned.",
    longDescription: "Using a trained PyTorch YOLO model, this software connects to dynamic X-ray video feeds on live production stages. It classifies complex ball-grid-array (BGA) defects instantly, rendering bounding overlays and recording findings directly onto a real-time tracking interface.",
    problem: "Manual review of BGA component joints under X-ray is slow, labor-intensive, and sensitive to eye fatigue, causing QA bottlenecks.",
    solution: "Trained a convolutional deep-learning network on 1,000+ custom annotated joint defects, integrating a fast inference loop on local edge controllers alongside responsive operator panels.",
    impact: [
      "Reduced operator inspection latency by 40%.",
      "Achieved a 98% defect classification accuracy rate.",
      "Logged QA logs dynamically to centralized databases."
    ],
    techStack: ["PyTorch", "Ultralytics YOLO", "Python", "OpenCV", "HTML/CSS/JS Panel"],
    status: "Active Production",
    metrics: [
      { label: "Defect Accuracy", value: "98.2%" },
      { label: "Cycle Reduction", value: "-40%" },
      { label: "Inspected Balls", value: "30k+" }
    ],
    interactiveType: "aoi"
  },
  {
    id: "dtr-face-recognition",
    title: "DTR Face Recognition",
    category: "Edge AI",
    tagline: "InsightFace-based attendance logging on NVIDIA Jetson Orin NX",
    description: "An on-site Edge AI facial recognition platform deployed on NVIDIA Jetson Orin NX to register staff checkpoints with 100% face-matching accuracy.",
    longDescription: "Harnessing InsightFace and lightweight embedding classifiers, this system processes real-time camera streams on-device. It cross-references facial vectors with the local staff registry and logs clock-in/clock-out events instantly onto the secure Daily Time Record database. Fully integrated with physical door strike triggers to secure access.",
    problem: "Conventional manual registers or barcode scanning stations suffer from slow throughput and unhygienic contact surfaces, causing gate congestion during morning queues.",
    solution: "Synthesized an on-device Jetson Orin NX processor running Optimized InsightFace matching in less than 50ms per scan, saving daily time inputs completely.",
    impact: [
      "Secured zero-contact touchless authentication protocols.",
      "Maintained 100% face matching precision rates.",
      "Synchronized immediate Web portal records logging."
    ],
    techStack: ["InsightFace", "NVIDIA Jetson Orin NX", "OpenCV", "Python", "SQLite"],
    status: "Active Production",
    metrics: [
      { label: "Scan Latency", value: "< 50ms" },
      { label: "Daily Employees", value: "500+" },
      { label: "Match Accuracy", value: "100%" }
    ],
    interactiveType: "dtr"
  },
  {
    id: "rice-disease-detector",
    title: "Rice Leaf Disease Diagnosis",
    category: "Edge AI",
    tagline: "Handheld DenseNet-121 agricultural device with 7\" touchscreen",
    description: "A custom embedded device running a modified DenseNet-121 model locally and offline to classify paddy plant diseases.",
    longDescription: "Developed for my Bachelor's thesis, this is a real-world handheld hardware system built using a Raspberry Pi 4B, an integrated camera, and a 7-inch display. It runs rapid offline Vision networks, detecting leaf diseases instantly without internet access.",
    problem: "Farmers struggle with delayed crop diagnoses due to limited connectivity and sparse expert access, leading to agricultural crop losses.",
    solution: "Built, wired, and compiled a standalone physical handheld unit running a modified DenseNet-121 classifier trained and benchmarked on real crop databases.",
    impact: [
      "Achieved a 98% accuracy rate on the local Zambali region dataset.",
      "Provided completely self-guided offline inferences with high precision.",
      "Won best thesis project and best in programming award."
    ],
    techStack: ["Raspberry Pi 4B", "DenseNet-121", "Python", "PyTorch", "PyQt / Touchscreen Interface"],
    status: "Completed",
    metrics: [
      { label: "Model Accuracy", value: "98.0%" },
      { label: "Zambali Dataset", value: "989 images" },
      { label: "Inference Time", value: "380ms" }
    ],
    interactiveType: "leaf"
  },
  {
    id: "sql-database-skills",
    title: "SQL Database Skills",
    category: "Automation",
    tagline: "Local SQLite normal query parser and device usage analyzer",
    description: "Multi-table relational schema containing historical board defect logs, employee DTR entries, and thermal device analytics with real-time SQLite queries.",
    longDescription: "A comprehensive data warehouse simulation tracking plant-wide automated operations. It models relations between motherboard pins inspection, X-Ray defect audits, and active employee shifts to output analytics or generate custom report spreadsheets.",
    problem: "Fragmented raw telemetry and isolated automation logs are difficult to analyze and cross-reference, resulting in slow root-cause diagnostics.",
    solution: "Designed relational tables on-device, compiling optimized SQL queries to join attendance metrics and thermal indicators for instant factory yield analytics.",
    impact: [
      "Engineered robust multi-table relational schema.",
      "Simulated real-time tracking of plant-wide QA defects.",
      "Implemented interactive direct SQL queries execution console."
    ],
    techStack: ["SQL (SQLite)", "Node.js (Express)", "Database Normalization", "Query Optimizers"],
    status: "Completed",
    metrics: [
      { label: "Tables Logged", value: "3 Core Tables" },
      { label: "Query Execution", value: "< 10ms" },
      { label: "Historical Records", value: "10k+ rows" }
    ],
    interactiveType: "sql"
  },
  {
    id: "web-report-automation",
    title: "Web Report Automation",
    category: "Automation",
    tagline: "Automated end-to-end report scraper and system metrics dispatcher",
    description: "An automated web scraping and reporting engine designed to extract raw manufacturing logs and dispatch visual reports to managers automatically.",
    longDescription: "This script-driven automated report dispatch system schedules cron tasks to pull QA defect counts from local storage, parses employee DTR clocking profiles, compiles responsive interactive HTML dashboards, and posts daily system trends directly to corporate Slack/Discord webhooks.",
    problem: "Managers and shift superintendents are required to copy statistics manually from distinct dashboards and log tables every morning, taking upwards of an hour daily.",
    solution: "Developed an Express-based cron reporter that scrapes internal database endpoints, formats statistical trend data, and fires notification payloads via secure webhook gateways.",
    impact: [
      "Secured 100% hands-free automated reporting cycles with multi-station consolidation.",
      "Consolidated multi-station raw logs into clear, responsive visual trends and dashboard summaries.",
      "Dispatched daily reports automatically to Slack webhooks and engineered automated logs systems."
    ],
    techStack: ["Node.js", "Express", "Slack/Discord Webhooks", "Puppeteer (Scraper)", "Tailwind Dashboard Builder"],
    status: "Active Production",
    metrics: [
      { label: "Daily Reports", value: "3+ Sent" },
      { label: "Success Rate", value: "100%" },
      { label: "Run Latency", value: "< 3.5s" }
    ],
    interactiveType: "report"
  }
];

export const CERTIFICATIONS: Certification[] = [
  { name: "Civil Service Certification - Professional Grade", provider: "Civil Service Commission (CSC)" },
  { name: "Accenture Data and AI Training", provider: "Accenture PH", detail: "Data and AI curriculum, upskilling participants in data analytics, machine learning, and AI-driven solutions" },
  { name: "Safety Officer Level 2 Certification (SO2)", provider: "DOLE Registered", detail: "240 hours of rigorous physical and industrial hazard control training" },
  { name: "DOST-SEI Scholars Leadership Camp Training", provider: "DOST Philippines", detail: "Leadership training under physical research scholar criteria, Clark Hilton Resort" }
];

export const ACADEMIC_AWARDS: Award[] = [
  { title: "Best Thesis Project", issuer: "President Ramon Magsaysay State University", rank: "First Place" },
  { title: "Best in Programming", issuer: "College of Engineering", rank: "First Place" },
  { title: "2nd Runner Up - 8th Regional CpE Challenge (Quizbowl)", issuer: "ICpEP Region III", rank: "Third Place" },
  { title: "3rd Runner Up - 7th Regional CpE Challenge (Python programming)", issuer: "ICpEP Region III", rank: "Fourth Place" },
  { title: "Most Active Student Organization (President)", issuer: "PRMSU Student Affairs Office", rank: "Gold Honor" }
];
