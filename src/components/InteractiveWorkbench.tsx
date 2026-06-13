import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  Cpu, Bot, Scan, Activity, CheckCircle, AlertTriangle,
  RefreshCw, Send, Sliders, Database, Wrench, Shield, Info, ArrowUpRight,
  FileText, TrendingUp, Terminal, Mail, Link2, AlertCircle, X, ChevronRight, CornerDownLeft
} from "lucide-react";
import { Project, PROJECTS } from "../types";
import DaniloAvatar from "./DaniloAvatar";

// Terminal Theme Definition
type Theme = "matrix" | "cyan" | "amber" | "monochrome";

interface ThemeConfig {
  name: string;
  bgBgOnDark: string;
  textAccent: string;
  textAccentAlt: string;
  borderAccent: string;
  badgeBg: string;
  terminalHeader: string;
  cursorColor: string;
  buttonBg: string;
}

const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  matrix: {
    name: "Phosphor Matrix (Green)",
    bgBgOnDark: "bg-[#05080b]",
    textAccent: "text-emerald-400",
    textAccentAlt: "text-emerald-500",
    borderAccent: "border-emerald-500/20",
    badgeBg: "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20",
    terminalHeader: "bg-[#091117] border-b border-emerald-950/50",
    cursorColor: "bg-emerald-450 bg-emerald-400",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500 text-black font-semibold"
  },
  cyan: {
    name: "Cyberpunk Blade (Sky)",
    bgBgOnDark: "bg-[#060b13]",
    textAccent: "text-sky-400",
    textAccentAlt: "text-sky-500",
    borderAccent: "border-sky-500/20",
    badgeBg: "bg-sky-950/40 text-sky-400 border border-sky-500/20",
    terminalHeader: "bg-[#0b1420] border-b border-sky-950/50",
    cursorColor: "bg-sky-400",
    buttonBg: "bg-sky-600 hover:bg-sky-500 text-white font-medium"
  },
  amber: {
    name: "Mono Amber (Legacy)",
    bgBgOnDark: "bg-[#0a0704]",
    textAccent: "text-amber-500",
    textAccentAlt: "text-amber-600",
    borderAccent: "border-amber-600/20",
    badgeBg: "bg-amber-955/40 bg-amber-950/30 text-amber-500 border border-amber-600/20",
    terminalHeader: "bg-[#140f0a] border-b border-amber-950/50",
    cursorColor: "bg-amber-500",
    buttonBg: "bg-amber-600 hover:bg-amber-500 text-black font-semibold"
  },
  monochrome: {
    name: "Sleek Steel (Slate)",
    bgBgOnDark: "bg-[#0d1117]",
    textAccent: "text-zinc-200",
    textAccentAlt: "text-zinc-400",
    borderAccent: "border-zinc-800",
    badgeBg: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    terminalHeader: "bg-[#161b22] border-b border-zinc-800",
    cursorColor: "bg-zinc-300",
    buttonBg: "bg-zinc-700 hover:bg-zinc-600 text-white"
  }
};

// Simulated databases for interactive terminal commands
interface RAGReply {
  question: string;
  retrievedDocs: { file: string; similarity: number; text: string }[];
  answer: string;
}

const RAG_RESPONSES: Record<string, RAGReply> = {
  "short-circuit": {
    question: "How do I fix a short circuit on a thermal locator board?",
    retrievedDocs: [
      { file: "calibration_manual_v4.pdf", similarity: 0.94, text: "Thermal sensors track critical short anomalies near Capacitor C42. Isolate using low-current test voltage." },
      { file: "historic_fixes_archive.csv", similarity: 0.88, text: "Case #4012: Short at pins 3 & 4 on U2 board. Clean solder balls and re-inspect." }
    ],
    answer: "Check the solder joint at Capacitor C42 and verify U2 pins 3/4. This fault usually occurs due to micro-bridge alignment deviations. Use a low-voltage thermal tracker and check the short-locator dashboard before reflowing."
  },
  "bga-void-sop": {
    question: "What is the standard SOP for BGA voiding defects?",
    retrievedDocs: [
      { file: "production_standards_qa.pdf", similarity: 0.97, text: "Limit solder voids on ball array to under 15% total area. Voids exceeding 20% on outer rows trigger joint failure." },
      { file: "oven_calibration_log.txt", similarity: 0.82, text: "BGA voiding peaks when initial pre-heat ramp rate exceeds 2.5°C per second." }
    ],
    answer: "SOP-142 defines voids above 15% surface area as defective pins. Recommended corrective action is to calibrate Solder-Paste Applicator nozzle pressure down by 0.2 bar and ensure the reflow oven pre-heat ramp stays within 1.8°C-2.3°C/sec."
  },
  "sqlite-query": {
    question: "How to extract legacy defect statistics from local databases?",
    retrievedDocs: [
      { file: "local_database_schema.md", similarity: 0.91, text: "Repair logging stores anomalies in column 'defect_code' linked with 'station_id' in SQLite databases." }
    ],
    answer: "Run diagnostic query: SELECT defect_code, COUNT(*) FROM repair_reports GROUP BY defect_code ORDER BY COUNT(*) DESC. This generates an instant log that matches localized dashboard specifications."
  }
};

interface TerminalHistoryItem {
  id: string;
  type: "input" | "system" | "output" | "error" | "banner";
  text: string | ReactNode;
}

export default function InteractiveWorkbench({ selectedProject, onSelectProject }: {
  selectedProject: Project;
  onSelectProject: (project: Project) => void;
}) {
  const [theme, setTheme] = useState<Theme>("matrix");
  const config = THEME_CONFIGS[theme];

  // Shell & Input state
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([]);
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Simulation Active State (When terminal opens up a full visual interactive interface inside the terminal viewport)
  // Options: null (base CLI view) | "rag" | "aoi" | "dtr" | "leaf" | "sql" | "report"
  const [activeSimulation, setActiveSimulation] = useState<"rag" | "aoi" | "dtr" | "leaf" | "sql" | "report" | null>(null);

  // States copied from old workbench to power sub-simulations perfectly:
  // RAG Chat simulated messages inside interactive prompt
  const [ragInput, setRagInput] = useState<string>("");
  const [ragHistory, setRagHistory] = useState<Array<{ sender: "user" | "bot"; text: string; details?: RAGReply }>>([
    { sender: "bot", text: "Retrieval-Augmented Generation context engine: ONLINE (Ollama index is loaded)." }
  ]);
  const [isRagResponding, setIsRagResponding] = useState<boolean>(false);

  // AOI State
  const [aoiConfidence, setAoiConfidence] = useState<number>(0.50);
  const [solderBalls, setSolderBalls] = useState([
    { id: 1, x: 20, y: 20, state: "OK", predicted: "OK", valConfidence: 0.98, userVerified: false },
    { id: 2, x: 50, y: 20, state: "OK", predicted: "OK", valConfidence: 0.96, userVerified: false },
    { id: 3, x: 80, y: 20, state: "Bridge", predicted: "Bridge", valConfidence: 0.88, userVerified: false },
    { id: 4, x: 20, y: 50, state: "OK", predicted: "OK", valConfidence: 0.92, userVerified: false },
    { id: 5, x: 50, y: 50, state: "Void", predicted: "Void", valConfidence: 0.74, userVerified: false },
    { id: 6, x: 80, y: 50, state: "OK", predicted: "OK", valConfidence: 0.95, userVerified: false },
    { id: 7, x: 20, y: 80, state: "Misaligned", predicted: "Misaligned", valConfidence: 0.62, userVerified: false },
    { id: 8, x: 50, y: 80, state: "OK", predicted: "OK", valConfidence: 0.99, userVerified: false },
    { id: 9, x: 80, y: 80, state: "OK", predicted: "OK", valConfidence: 0.97, userVerified: false },
  ]);

  // DTR Face Recognition state
  const [dtrStaff, setDtrStaff] = useState([
    { id: "EMP-001", name: "Danilo Llagas", role: "Automation Engineer", status: "In", faceImg: "👨‍💻", confidence: 99.8, lastTime: "08:02 AM" },
    { id: "EMP-002", name: "Jane Doe", role: "Factory QA Lead", status: "Out", faceImg: "👩‍💼", confidence: 99.4, lastTime: "05:15 PM" },
    { id: "EMP-003", name: "Alex Chen", role: "Embedded Lead", status: "In", faceImg: "👨‍🔧", confidence: 98.7, lastTime: "09:10 AM" },
    { id: "EMP-004", name: "Sarah Smith", role: "Factory Admin", status: "Out", faceImg: "👩‍🔬", confidence: 99.1, lastTime: "12:30 PM" }
  ]);
  const [selectedStaff, setSelectedStaff] = useState(dtrStaff[0]);
  const [isDtrScanning, setIsDtrScanning] = useState<boolean>(false);
  const [dtrLogs, setDtrLogs] = useState<string[]>([
    "[08:00 AM] Employee Jane Doe: Status changed to OUT (Logged to SQL)",
    "[08:02 AM] Employee Danilo Llagas: Status changed to IN (Confidence 99.8%)"
  ]);

  // Rice Leaf state
  const [riceLeafImage, setRiceLeafImage] = useState<"healthy" | "blight" | "spot">("healthy");
  const [leafInferenceResult, setLeafInferenceResult] = useState<{
    disease: string;
    confidence: number;
    metrics: { label: string; score: number }[];
    remedy: string;
  } | null>(null);
  const [isLeafRunning, setIsLeafRunning] = useState<boolean>(false);

  // SQL State
  const sqlTemplates = [
    {
      id: "q1",
      title: "Query 1: Joined Employee DTR Logs",
      sql: `SELECT e.name, e.role, d.timestamp, d.status_log\nFROM employees e\nJOIN dtr_records d ON e.id = d.employee_id\nORDER BY d.timestamp DESC;`,
      headers: ["Name", "Role", "Timestamp", "DTR Transaction"],
      rows: [
        ["Danilo Llagas", "Automation Engineer", "08:02:11 AM", "CLOCK_IN"],
        ["Alex Chen", "Embedded Lead", "09:10:05 AM", "CLOCK_IN"],
        ["Jane Doe", "Factory QA Lead", "05:15:32 PM", "CLOCK_OUT"],
        ["Sarah Smith", "Factory Admin", "12:30:19 PM", "CLOCK_OUT"]
      ]
    },
    {
      id: "q2",
      title: "Query 2: QA Defect BGA Summary",
      sql: `SELECT defect_type, COUNT(*) AS count, AVG(confidence) AS avg_conf\nFROM xray_defects_log\nGROUP BY defect_type\nHAVING avg_conf > 0.65;`,
      headers: ["Defect Type", "Count Logs", "Avg Confidence"],
      rows: [
        ["Solder Bridge", "34", "88.62%"],
        ["Solder Voided", "52", "78.11%"],
        ["Pin Deflection", "19", "69.45%"]
      ]
    },
    {
      id: "q3",
      title: "Query 3: Station Scraper Telemetry",
      sql: `SELECT s.station_name, COUNT(t.id) AS raw_pings\nFROM station_registry s\nLEFT JOIN telemetry_logs t ON s.id = t.station_id\nWHERE t.status = 'ACTIVE'\nGROUP BY s.station_name;`,
      headers: ["Inspection Station", "Telemetry Raw Pings"],
      rows: [
        ["CONNECTOR_AOI_CELL01", "1,241 pulses"],
        ["BGA_XRAY_DETECTOR", "3,590 pulses"],
        ["BIOMETRIC_CHECKPOINT_05", "511 pulses"]
      ]
    }
  ];
  const [activeSqlTemplate, setActiveSqlTemplate] = useState<string>("q1");
  const [customSQL, setCustomSQL] = useState<string>(sqlTemplates[0].sql);
  const [sqlResultsUser, setSqlResultsUser] = useState<any>(sqlTemplates[0]);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);

  // Web Reports scraping state
  const [chartMetric, setChartMetric] = useState<"triggers" | "records">("triggers");
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d">("7d");
  const [scrapersLogs, setScrapersLogs] = useState<string[]>([
    "[08:00:00 AM] [SYSTEM] Daily factory scraper routine started.",
    "[08:00:01 AM] [SQLITE] Scraping motherboard inspection records: 3,241 BGA joint nodes parsed.",
    "[08:00:02 AM] [DISPATCH] Defect yield maps updated. Payload mapped to Slack webhook client.",
    "[08:00:03 AM] [WEBHOOK] POST payload to team Slack channels. Status: 200 OK."
  ]);
  const [isReportCompiling, setIsReportCompiling] = useState<boolean>(false);

  // Chart values
  const periodData = selectedPeriod === "7d"
    ? [
      { label: "Mon", triggers: 3, records: 12400 },
      { label: "Tue", triggers: 4, records: 14500 },
      { label: "Wed", triggers: 3, records: 11200 },
      { label: "Thu", triggers: 5, records: 18900 },
      { label: "Fri", triggers: 6, records: 22400 },
      { label: "Sat", triggers: 2, records: 8900 },
      { label: "Sun", triggers: 4, records: 15400 },
    ]
    : [
      { label: "Week 1", triggers: 24, records: 84000 },
      { label: "Week 2", triggers: 28, records: 99100 },
      { label: "Week 3", triggers: 31, records: 114500 },
      { label: "Week 4", triggers: 19, records: 76000 },
    ];

  // Auto Scroll Terminal to bottom
  const scrollToBottom = () => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalHistory, activeSimulation, isQueryRunning, isDtrScanning, isLeafRunning, isRagResponding]);

  // Initial terminal load print banner
  useEffect(() => {
    printWelcomeSplash();
  }, []);

  // Whenever a project is selected from App.tsx cards list, let the terminal auto-initialize that simulation!
  useEffect(() => {
    if (selectedProject?.interactiveType) {
      const type = selectedProject.interactiveType;
      // Boot simulation automatically
      setActiveSimulation(type);

      // Print notification in terminal stream
      setTerminalHistory(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          type: "system",
          text: `>>> External signal detected: Deploying live module [${selectedProject.title}]`
        }
      ]);
    }
  }, [selectedProject?.id]);

  const printWelcomeSplash = () => {
    setTerminalHistory([
      {
        id: "banner-1",
        type: "banner",
        text: (
          <div className="space-y-2 border-b border-zinc-800 pb-4 mb-2 font-mono text-[11px] md:text-xs leading-normal">
            <p className="text-zinc-500">// PRMSU SECURE EMBEDDED EDGE COMPUTING UNIT v4.1.24</p>
            <p className="text-zinc-500">// CPU TEMPERATURE: 42°C // ARCH: ARM-A78AE // JETPACK RATING: CUDA 11+ PASS</p>
            <pre className="text-sky-504 leading-[1.1] text-sky-400 font-bold overflow-x-auto no-scrollbar max-w-full">
              {`   ___   _   _  _ ___ _     ___     ___ _    ___ 
  |   \\ /_\\ | \\| |_ _| |   / _ \\   / __| |  |_ _|
  | |) / _ \\| .\` || || |__| (_) | | (__| |__ | | 
  |___/_/ \\_\\_|\\_|___|____|\\___/   \\___|____|___|`}
            </pre>
            <div className="pt-2 text-zinc-300">
              Welcome to the Interactive Embedded CLI terminal. Type <strong className="text-sky-400 font-bold underline">help</strong> for list of commands, or select instant actions below to deploy live simulators.
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] text-zinc-400">Available Executables:</span>
              <button onClick={() => executeCommand("rag")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">rag</button>
              <button onClick={() => executeCommand("aoi")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">aoi</button>
              <button onClick={() => executeCommand("dtr")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">dtr</button>
              <button onClick={() => executeCommand("leaf")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">leaf</button>
              <button onClick={() => executeCommand("sql")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">sql</button>
              <button onClick={() => executeCommand("report")} className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-400 hover:bg-zinc-700 text-[10px] font-mono font-bold">report</button>
            </div>
          </div>
        )
      }
    ]);
  };

  // Run user or visual clicking commands
  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase();

    // Log user input
    const userLogItem: TerminalHistoryItem = {
      id: Math.random().toString(),
      type: "input",
      text: `danilo@ubuntu:~$ ${trimmed}`
    };

    let resultItem: TerminalHistoryItem | null = null;

    if (cmd === "help") {
      resultItem = {
        id: Math.random().toString(),
        type: "output",
        text: (
          <div className="space-y-1 font-mono text-[11px] leading-relaxed py-1">
            <p className="text-zinc-400 font-bold">SYSTEM CORE COMMANDS REFERENCE:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-2">
              <div><strong className="text-sky-400 font-bold">help</strong> - List available terminal operations</div>
              <div><strong className="text-sky-400 font-bold">clear</strong> - Reset workspace stream logger</div>
              <div><strong className="text-sky-400 font-bold">skills</strong> - Render interactive directory stack trees</div>
              <div><strong className="text-sky-400 font-bold">about</strong> - Load engineer biography and thesis scores</div>
              <div><strong className="text-sky-400 font-bold">contact</strong> - Get secure communication lines</div>
              <div><strong className="text-sky-400 font-bold">projects</strong> - List production applications registry</div>
              <div><strong className="text-sky-400 font-bold">theme</strong> - Cycle retro display visual color profiles</div>
            </div>
            <p className="text-zinc-400 font-bold mt-2 pt-1 border-t border-zinc-800/40">SIMULATOR EXECUTABLES:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-2 text-zinc-350">
              <div><strong className="text-emerald-400 font-bold">rag</strong> - Start RAG Troubleshooting chatbot</div>
              <div><strong className="text-emerald-400 font-bold">aoi</strong> - Deploy YOLO Automated Optical Inspection</div>
              <div><strong className="text-emerald-400 font-bold">dtr</strong> - Initialize Biometric Face Recognition checkpoints</div>
              <div><strong className="text-emerald-400 font-bold">leaf</strong> - Run Raspberry Pi Rice Leaf Pathology analyzer</div>
              <div><strong className="text-emerald-400 font-bold">sql</strong> - Connect local SQLite query diagnostics console</div>
              <div><strong className="text-emerald-400 font-bold">report</strong> - Spin reporting scrapers & Slack webhook</div>
            </div>
          </div>
        )
      };
    } else if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd === "skills") {
      resultItem = {
        id: Math.random().toString(),
        type: "output",
        text: (
          <div className="font-mono text-[11px] leading-normal text-zinc-350 space-y-2 py-1">
            <pre className="text-sky-400 font-mono leading-tight pl-2">
              {`.
                └── Danilo Llaga Jr. (Skill Tree)
                    ├── Artificial Intelligence & Computer Vision
                    │   ├── PyTorch, TensorFlow, ONNX & Ultralytics YOLO
                    │   ├── SQL and Pandas
                    │   ├── OpenCV 
                    │   ├── InsightFace Vector Clustering
                    │   └── ChromaDB & LangChain RAG
                    ├── Edge Hardware Integrations & Robotics
                    │   ├── NVIDIA Jetson
                    │   ├── Raspberry Pi
                    │   └── ESP32 Microcontrollers
                    └── Web Services & Data Systems
                        ├── PHP
                        ├── Node.js
                        ├── FAST API
                        ├── TypeScript, core React & Tailwind Styles
                        └── Multi-table SQL schemas & Queries Optimization`}
            </pre>
          </div>
        )
      };
    } else if (cmd === "about") {
      resultItem = {
        id: Math.random().toString(),
        type: "output",
        text: (
          <div className="font-mono text-[11px] text-zinc-300 space-y-2 leading-relaxed">
            <p className="text-zinc-400 font-bold">ENGINEER SPECIFICATION REPORT:</p>
            <p className="pl-2">
              <strong className="text-sky-400">Identity:</strong> Danilo F. Llaga Jr. <br />
              <strong className="text-sky-400">Profession:</strong> Software and Automation Engineer <br />
              <strong className="text-sky-400">Alma Mater:</strong> President Ramon Magsaysay State University <br />
              <strong className="text-sky-400">Awards:</strong> First Place Best Thesis Project, First Place Best in Programming, Gold Honor President. <br />
              <strong className="text-sky-400">Expertise Core:</strong> Deploying complex machine-learning and edge solutions directly to factory hardware. Danilo bridges the gap between hardware actuators and neural models to optimize plant yield.
            </p>
          </div>
        )
      };
    } else if (cmd === "contact") {
      resultItem = {
        id: Math.random().toString(),
        type: "output",
        text: (
          <div className="font-mono text-[11px] text-zinc-300 space-y-1 pr-2">
            <p className="text-zinc-400 font-bold">SECURE CHANNEL MATRIX:</p>
            <p className="pl-2">✉ <strong className="text-sky-400">Email:</strong> danilofllagajr@gmail.com</p>
            <p className="pl-2">☎ <strong className="text-teal-400">Mobile Link:</strong> +63 970 482 5916</p>
            <p className="pl-2">🔗 <strong className="text-emerald-400">Github Account:</strong> github.com/Nasamid</p>
            <p className="pl-2">🔗 <strong className="text-blue-400">LinkedIn Link:</strong> linkedin.com/in/danilo-llaga</p>
            <p className="pl-2 py-1 text-zinc-500 italic">// Direct channels monitored hourly during factory operations.</p>
          </div>
        )
      };
    } else if (cmd === "projects") {
      resultItem = {
        id: Math.random().toString(),
        type: "output",
        text: (
          <div className="font-mono text-[11px] text-zinc-350 space-y-2 py-1">
            <p className="text-zinc-400 font-bold">PROJECTS ({PROJECTS.length}):</p>
            <div className="space-y-2 pl-2">
              {PROJECTS.map((p, idx) => (
                <div key={p.id} className="border-l border-zinc-800 pl-2">
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <span className="font-bold">[{idx + 1}] {p.title}</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-black">{p.status}</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] leading-tight">{p.tagline}</p>
                  <p className="text-zinc-500 text-[9px]">Type: <strong className="text-zinc-300">{p.interactiveType}</strong> // Stack: {p.techStack.join(", ")}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-500 pt-1 text-[10px] italic">// Enter a simulator trigger, e.g. typing &quot;aoi&quot; or &quot;rag&quot; to inspect any project live.</p>
          </div>
        )
      };
    } else if (cmd === "theme") {
      const themes: Theme[] = ["matrix", "cyan", "amber", "monochrome"];
      const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
      const nextTheme = themes[nextIdx];
      setTheme(nextTheme);

      resultItem = {
        id: Math.random().toString(),
        type: "system",
        text: `Terminal viewport color profile changed: [${THEME_CONFIGS[nextTheme].name}]`
      };
    }
    // Check if user requested a specific simulation executable
    else if (["rag", "aoi", "dtr", "leaf", "sql", "report"].includes(cmd)) {
      const targetMode = cmd as "rag" | "aoi" | "dtr" | "leaf" | "sql" | "report";
      setActiveSimulation(targetMode);

      // Update parent project selection as well to sync main dashboard panel
      const parentProj = PROJECTS.find(p => p.interactiveType === targetMode);
      if (parentProj) {
        onSelectProject(parentProj);
      }

      resultItem = {
        id: Math.random().toString(),
        type: "system",
        text: `>>> SUCCESS: Terminal container loaded. Initiating visual diagnostics CLI framework for: [${cmd.toUpperCase()}]`
      };
    } else {
      // Unknown command
      resultItem = {
        id: Math.random().toString(),
        type: "error",
        text: `Error: command not found: "${trimmed}". Type "help" to review valid shell operators.`
      };
    }

    setTerminalHistory(prev => [...prev, userLogItem, resultItem as TerminalHistoryItem]);

    // Save to prompt history
    setCommandHistoryList(prev => [...prev, trimmed]);
    setHistoryPointer(-1);
    setTerminalInput("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(terminalInput);
    } else if (e.key === "ArrowUp") {
      // Pull previous commands
      if (commandHistoryList.length > 0) {
        const nextPointer = historyPointer === -1 ? commandHistoryList.length - 1 : Math.max(0, historyPointer - 1);
        setHistoryPointer(nextPointer);
        setTerminalInput(commandHistoryList[nextPointer]);
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyPointer !== -1) {
        const nextPointer = historyPointer + 1;
        if (nextPointer >= commandHistoryList.length) {
          setHistoryPointer(-1);
          setTerminalInput("");
        } else {
          setHistoryPointer(nextPointer);
          setTerminalInput(commandHistoryList[nextPointer]);
        }
      }
      e.preventDefault();
    }
  };

  // Sub-system interaction 1: Chatbot RAG Send
  const handleRagChatSend = (input: string) => {
    const text = input.trim();
    if (!text) return;

    // Log User message
    const cleanUserMsg = { sender: "user" as const, text };
    setRagHistory(prev => [...prev, cleanUserMsg]);
    setRagInput("");
    setIsRagResponding(true);

    setTimeout(() => {
      // Find matching triggers
      let matchedKey = "";
      if (text.toLowerCase().includes("short") || text.toLowerCase().includes("circuit") || text.toLowerCase().includes("capacitor")) {
        matchedKey = "short-circuit";
      } else if (text.toLowerCase().includes("void") || text.toLowerCase().includes("bga") || text.toLowerCase().includes("sop")) {
        matchedKey = "bga-void-sop";
      } else if (text.toLowerCase().includes("sqlite") || text.toLowerCase().includes("query") || text.toLowerCase().includes("defect_code")) {
        matchedKey = "sqlite-query";
      }

      if (matchedKey && RAG_RESPONSES[matchedKey]) {
        setRagHistory(prev => [
          ...prev,
          {
            sender: "bot",
            text: RAG_RESPONSES[matchedKey].answer,
            details: RAG_RESPONSES[matchedKey]
          }
        ]);
      } else {
        setRagHistory(prev => [
          ...prev,
          {
            sender: "bot",
            text: `RAG search concluded. No 100% exact vector embedding matching score for "${text}". Standard response: Check standard schematics manuals or write custom SQlite query "SELECT * FROM xray_defects_log" inside our 'sql' console.`,
            details: {
              question: text,
              retrievedDocs: [
                { file: "system_faq_archive.pdf", similarity: 0.15, text: "Fallback database index matched default questions criteria." }
              ],
              answer: "No exact match found in local RAG directory."
            }
          }
        ]);
      }
      setIsRagResponding(false);
    }, 1200);
  };

  // Sub-system interaction 2: Verify AOI Ball Click
  const verifyAoiBall = (ballId: number) => {
    setSolderBalls(prev => prev.map(ball => {
      if (ball.id === ballId) {
        const nextState = ball.predicted === "OK" ? "Void" : ball.predicted === "Void" ? "Bridge" : "OK";
        const confidence = nextState === "OK" ? 0.98 : nextState === "Void" ? 0.81 : 0.91;
        return {
          ...ball,
          predicted: nextState,
          valConfidence: confidence,
          userVerified: true
        };
      }
      return ball;
    }));
  };

  // Sub-system interaction 3: attendance DTR scan trigger
  const runDtrFaceScan = () => {
    setIsDtrScanning(true);
    setTimeout(() => {
      setIsDtrScanning(false);
      // Toggle staff biometric state
      const updatedStatus = selectedStaff.status === "In" ? "Out" : "In";
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Update employee registry state
      setDtrStaff(prev => prev.map(staff => {
        if (staff.id === selectedStaff.id) {
          const updated = { ...staff, status: updatedStatus, lastTime: currentTime };
          setSelectedStaff(updated);
          return updated;
        }
        return staff;
      }));

      // Append logs
      const logMessage = `[${currentTime}] Employee ${selectedStaff.name}: Biometric Status CLOCKED_${updatedStatus.toUpperCase()} (Confidence ${selectedStaff.confidence}%)`;
      setDtrLogs(prev => [logMessage, ...prev]);
    }, 1500);
  };

  // Sub-system interaction 4: Leaf inference
  const executeLeafInference = () => {
    setIsLeafRunning(true);
    setTimeout(() => {
      setIsLeafRunning(false);
      if (riceLeafImage === "healthy") {
        setLeafInferenceResult({
          disease: "Healthy Specimen Verified",
          confidence: 99.4,
          metrics: [
            { label: "Healthy Leaf probability", score: 99.4 },
            { label: "Bacterial Blight probability", score: 0.4 },
            { label: "Brown Spot probability", score: 0.2 },
          ],
          remedy: "Optimal health. Maintain standardized soil chemical parameters and water index triggers."
        });
      } else if (riceLeafImage === "blight") {
        setLeafInferenceResult({
          disease: "Bacterial Leaf Blight (Defect Class)",
          confidence: 96.8,
          metrics: [
            { label: "Healthy Leaf probability", score: 1.1 },
            { label: "Bacterial Blight probability", score: 96.8 },
            { label: "Brown Spot probability", score: 2.1 },
          ],
          remedy: "Apply balanced plant nutrients. Spray Copper Hydroxide fungicide compound solutions to soil matrices."
        });
      } else {
        setLeafInferenceResult({
          disease: "Brown Spot pathology (Defect Class)",
          confidence: 94.2,
          metrics: [
            { label: "Healthy Leaf probability", score: 0.8 },
            { label: "Bacterial Blight probability", score: 5.0 },
            { label: "Brown Spot probability", score: 94.2 },
          ],
          remedy: "Ensure organic soil sulfur amendments and drain excess standing floodwater immediately."
        });
      }
    }, 1400);
  };

  // Sub-system interaction 5: run SQL Statement
  const runSQLQueryAnalyzer = () => {
    setIsQueryRunning(true);
    setTimeout(() => {
      setIsQueryRunning(false);
      // Fallback parser: matches keywords to simulate correct query matching
      const queryLower = customSQL.toLowerCase();
      if (queryLower.includes("employee") && queryLower.includes("dtr")) {
        setSqlResultsUser(sqlTemplates[0]);
      } else if (queryLower.includes("defect") || queryLower.includes("xray")) {
        setSqlResultsUser(sqlTemplates[1]);
      } else if (queryLower.includes("station") || queryLower.includes("telemetry") || queryLower.includes("ping")) {
        setSqlResultsUser(sqlTemplates[2]);
      } else {
        // Mock a general output table matching standard SQL
        setSqlResultsUser({
          id: Math.random().toString(),
          title: "Custom database result",
          headers: ["SQL Result Status", "Row Count", "Compute Delay"],
          rows: [
            ["Command query executed successfully", "1 Row Returned", "< 2.4 ms"],
            ["Database: localized memory structures active", "N/A", "Cached"]
          ]
        });
      }
    }, 1100);
  };

  // Sub-system interaction 6: Web Report logs compiler
  const compileWebReportLogsNow = () => {
    setIsReportCompiling(true);
    setTimeout(() => {
      setIsReportCompiling(false);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setScrapersLogs(prev => [
        ...prev,
        `[${currentTime}] [API] Scraper triggered manually. Telemetry indices healthy. Payload posted ok.`,
        `[${currentTime}] [Slack] Hook delivery response status: 200 payload verified.`
      ]);
    }, 2000);
  };

  return (
    <section id="interactive-workbench" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-[#0f1929]">

      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className={`text-xs font-mono font-bold tracking-widest block mb-1 uppercase ${config.textAccentAlt}`}>
            Lab Terminal Emulator
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
            Interactive Automation Console
          </h2>
          <p className="text-zinc-750 dark:text-zinc-300 mt-2 text-sm max-w-2xl font-medium">
            Test and diagnose my edge hardware vision products, machine models, and databases. Use standard console commands below or click suggestions to test live systems in the digital controller.
          </p>
        </div>

        {/* Floating Theme selector inside portfolio shell */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">Terminal Theme:</span>
          <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-250 dark:border-zinc-800 text-[10px] uppercase font-mono">
            {(Object.keys(THEME_CONFIGS) as Theme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setTheme(themeKey)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${theme === themeKey
                  ? "bg-sky-500 text-white dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  }`}
              >
                {themeKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Terminal Grid Structure */}
      <div className={`w-full ${config.bgBgOnDark} rounded-2xl border ${config.borderAccent} shadow-2xl transition-all overflow-hidden flex flex-col md:flex-row h-auto min-h-[580px] md:h-[620px]`}>

        {/* LEFT COLUMN: PRIMARY INTERACTIVE TERMINAL STREAM */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-zinc-805/40 border-zinc-800/50">

          {/* Terminal Window Header */}
          <div className={`px-4 py-3 ${config.terminalHeader} flex justify-between items-center select-none`}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 hr h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className={`text-[11px] font-mono font-bold ${config.textAccent}`}>
                danilo@ubuntu:~
              </span>
            </div>

            {activeSimulation && (
              <button
                onClick={() => {
                  setActiveSimulation(null);
                  setTerminalHistory(prev => [
                    ...prev,
                    { id: Math.random().toString(), type: "system", text: "Successfully exited active application container. Shell ready." }
                  ]);
                }}
                className="text-[9px] font-mono uppercase bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 px-2 py-0.5 border border-rose-500/20 rounded cursor-pointer transition-all flex items-center gap-1"
                title="Exit sub-simulation and return to standard command prompt input"
              >
                <X className="w-3 h-3" /> Exit Simulator
              </button>
            )}
          </div>

          {/* Terminal Content Logger Stream */}
          <div ref={terminalContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2.5 font-mono text-[11px] md:text-xs">

            {/* Prints command output array */}
            {terminalHistory.map((item) => (
              <div key={item.id} className="leading-relaxed">
                {item.type === "input" && (
                  <p className="text-zinc-300 font-medium">{item.text}</p>
                )}
                {item.type === "system" && (
                  <p className="text-zinc-500 italic font-bold">{item.text}</p>
                )}
                {item.type === "output" && (
                  <div className="text-zinc-200">{item.text}</div>
                )}
                {item.type === "error" && (
                  <p className="text-rose-500 font-bold">{item.text}</p>
                )}
                {item.type === "banner" && (
                  <div>{item.text}</div>
                )}
              </div>
            ))}

            {/* Simulated responding indicators */}
            {isQueryRunning && (
              <p className="text-amber-500/70 animate-pulse">// SQLite parser executing raw index pointers...</p>
            )}
            {isDtrScanning && (
              <p className={`animate-pulse uppercase font-yellow-500 ${config.textAccent}`}>// Jetson local vision engine processing biometric face embeddings...</p>
            )}
            {isLeafRunning && (
              <p className="text-teal-400 animate-pulse">// DenseNet-121 layer evaluation in progress...</p>
            )}
          </div>

          {/* Quick Click Command Pills Suggestion Bar */}
          <div className="bg-black/20 border-t border-zinc-800/40 p-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase mr-1">Quick Input:</span>
            <button onClick={() => executeCommand("help")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">help</button>
            <button onClick={() => executeCommand("skills")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">skills</button>
            <button onClick={() => executeCommand("about")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">about</button>
            <button onClick={() => executeCommand("projects")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">projects</button>
            <button onClick={() => executeCommand("contact")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">contact</button>
            <button onClick={() => executeCommand("theme")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">theme</button>
            <button onClick={() => executeCommand("clear")} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono cursor-pointer transition-colors">clear</button>
          </div>

          {/* Interactive Shell Command Input Prompt Bar */}
          <div className="p-3 bg-zinc-905 border-t border-zinc-805/40 border-zinc-800 bg-black/40 flex items-center gap-2">
            <span className={`font-mono text-xs font-bold leading-none ${config.textAccent}`}>
              danilo@ubuntu:~$
            </span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type command here (e.g., aoi, skills, clear)..."
              className="flex-1 bg-transparent border-0 outline-none ring-0 text-white font-mono text-xs focus:ring-0 focus:outline-none p-0 caret-sky-400"
              spellCheck={false}
              autoFocus
            />
            <button
              onClick={() => executeCommand(terminalInput)}
              className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-colors ${config.textAccent} border-zinc-800 hover:bg-zinc-800/50`}
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL DISPLAY HUD */}
        <div className="w-full md:w-[420px] bg-slate-950/90 text-white flex flex-col font-mono text-xs overflow-y-auto custom-scrollbar">

          {/* HUD Panel Title Row */}
          <div className="px-4 py-3 bg-[#0c121a] border-b border-zinc-800/80 flex justify-between items-center text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest text-zinc-400">
              <Cpu className="w-4 h-4 text-sky-400" /> Active Hardware Simulator HUD
            </span>
            <span className="text-[9px] bg-sky-950 text-sky-400 px-1.5 py-0.2 rounded">PORT 3000 // MEM PASS</span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-center items-center">

            {/* STANDBY DEFAULT CLI PANEL */}
            {!activeSimulation && (
              <div className="text-center p-6 space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto shadow-md">
                  <Terminal className={`w-6 h-6 ${config.textAccent} animate-pulse`} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-zinc-100 uppercase tracking-tight text-xs">Standard Prompt Mode Active</h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    Type or click any simulator command (e.g. <strong onClick={() => executeCommand("aoi")} className={`cursor-pointer underline ${config.textAccent}`}>aoi</strong>, <strong onClick={() => executeCommand("rag")} className={`cursor-pointer underline ${config.textAccent}`}>rag</strong>, or <strong onClick={() => executeCommand("dtr")} className={`cursor-pointer underline ${config.textAccent}`}>dtr</strong>) to load that physical simulation twin controller block in this viewport.
                  </p>
                </div>

                {/* Visual spec badge cards */}
                <div className="pt-2 text-left space-y-1.5 text-[9px] text-zinc-400 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60 leading-normal">
                  <div className="flex justify-between border-b border-zinc-800/40 pb-1">
                    <span>Host CPU Core:</span>
                    <span className="text-zinc-300">NVIDIA Jetson AGX Orin Platform</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800/40 pb-1">
                    <span>RAM Configuration:</span>
                    <span className="text-zinc-300">16GB LPDDR5 128-bit 204.8 GB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPU Engine:</span>
                    <span className="text-zinc-300">1024-core Ampere architecture CUDA</span>
                  </div>
                </div>
              </div>
            )}

            {/* RAG CHAT SIMULATOR INTERFACE */}
            {activeSimulation === "rag" && (
              <div className="w-full flex flex-col space-y-3.5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-sky-400 font-bold flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> LangChain ChromaDB RAG
                  </span>
                  <span className="text-[9px] text-zinc-500">Manual diagnostic helper</span>
                </div>

                {/* Sub chat list area */}
                <div className="bg-zinc-900 rounded-lg p-3 h-56 overflow-y-auto custom-scrollbar space-y-3 border border-zinc-850">
                  {ragHistory.map((hMsg, idx) => (
                    <div key={idx} className={`p-2 rounded max-w-[90%] leading-relaxed text-[10px] ${hMsg.sender === "user"
                      ? "bg-sky-600/10 border border-sky-500/20 text-sky-300 ml-auto"
                      : "bg-zinc-950/80 text-zinc-300 border border-zinc-850"
                      }`}>
                      <p className="font-sans leading-relaxed">{hMsg.text}</p>
                      {hMsg.details && (
                        <div className="mt-1.5 p-1.5 bg-black rounded border border-zinc-800 text-[8px] text-zinc-500 space-y-0.5 font-mono">
                          <p className="text-sky-400 font-bold border-b border-zinc-800 pb-0.5">Retrieved ChromaDB context files:</p>
                          {hMsg.details.retrievedDocs.map((doc, dIdx) => (
                            <div key={dIdx}>
                              📄 <span className="text-zinc-300 font-bold">{doc.file}</span> (Score {doc.similarity}): &quot;{doc.text}&quot;
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isRagResponding && (
                    <p className="text-[10px] text-sky-400 font-mono animate-pulse">Computing RAG embeddings distance...</p>
                  )}
                </div>

                {/* Suggestion Prompt list */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 block uppercase">Matched diagnostic logs:</span>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleRagChatSend("How do I fix a short circuit on a thermal locator board?")} className="px-2 py-1 text-left bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded text-[9px] text-zinc-400 hover:text-white truncate cursor-pointer transition-colors">Short circuit on locator</button>
                    <button onClick={() => handleRagChatSend("What is the standard SOP for BGA voiding defects?")} className="px-2 py-1 text-left bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded text-[9px] text-zinc-400 hover:text-white truncate cursor-pointer transition-colors">BGA defect void standard SOP</button>
                    <button onClick={() => handleRagChatSend("How to extract legacy defect statistics from local repair databases?")} className="px-2 py-1 text-left bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded text-[9px] text-zinc-400 hover:text-white truncate cursor-pointer transition-colors">Extract SQLite repair statistics</button>
                  </div>
                </div>

                {/* Question input bar */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={ragInput}
                    onChange={(e) => setRagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRagChatSend(ragInput)}
                    placeholder="Enter diagnostic queries (RAG schema)..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-[10px]"
                  />
                  <button onClick={() => handleRagChatSend(ragInput)} className="bg-sky-600 hover:bg-sky-500 rounded p-1 flex items-center justify-center font-bold px-3 text-[10px] uppercase cursor-pointer">
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* AOI INSPECTION SIMULATOR INTERFACE */}
            {activeSimulation === "aoi" && (
              <div className="w-full space-y-3.5">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Scan className="w-3.5 h-3.5 animate-pulse" /> YOLOv11 Optical Inspection
                  </span>
                  <span className="text-[9px] text-zinc-500">CUDA Real-Time Feed</span>
                </div>

                {/* 2D solder matrix overlay HUD */}
                <div className="grid grid-cols-3 gap-3 bg-zinc-900/60 p-4 border border-zinc-850 rounded-xl relative">
                  <div className="absolute inset-x-0 h-px bg-emerald-500/10 top-1/3 pointer-events-none"></div>
                  <div className="absolute inset-x-0 h-px bg-emerald-500/10 top-2/3 pointer-events-none"></div>
                  {solderBalls.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => verifyAoiBall(b.id)}
                      className="aspect-square relative flex items-center justify-center bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-full cursor-pointer select-none transition-all"
                      title="Click to toggle defect class"
                    >
                      <div className={`w-8 h-8 rounded-full ${b.predicted === "OK" ? "bg-emerald-500" :
                        b.predicted === "Bridge" ? "bg-rose-500 animate-pulse" :
                          b.predicted === "Void" ? "bg-amber-500" : "bg-cyan-500"
                        } text-[9px] text-zinc-900 flex items-center justify-center font-bold`}>
                        #{b.id}
                      </div>

                      {/* Overlays */}
                      {b.predicted !== "OK" && (
                        <div className={`absolute -inset-1 border border-dashed rounded-md ${b.predicted === "Bridge" ? "border-rose-500" : "border-amber-500"
                          }`}>
                          <span className="absolute -top-3.5 -left-1 px-1 py-0.2 bg-black text-rose-400 font-black text-[7px]">
                            {b.predicted} ({(b.valConfidence * 100).toFixed(0)}%)
                          </span>
                        </div>
                      )}
                      {b.userVerified && (
                        <span className="absolute -bottom-1 -right-px bg-emerald-500 text-black font-black text-[7px] w-3 h-3 rounded-full flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* YOLO Controls */}
                <div className="space-y-1.5 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">YOLO Confidence Limit:</span>
                    <span className="text-emerald-400 font-bold">{aoiConfidence.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.95"
                    step="0.05"
                    value={aoiConfidence}
                    onChange={(e) => setAoiConfidence(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 bg-zinc-950 h-1 rounded cursor-pointer"
                  />
                  <p className="text-[8px] text-zinc-500 leading-normal pt-1">
                    🎯 Adjust confidence threshold. Nodes with box ratings exceeding target triggers alerts to operators.
                  </p>
                </div>

                {/* Defect counters info */}
                <div className="flex justify-between text-[9px] text-zinc-400 border-t border-zinc-850 pt-2 font-mono">
                  <span>Defective classified: {solderBalls.filter(s => s.predicted !== "OK").length} Bails</span>
                  <span>Inspection cycle time: 1.2 ms</span>
                </div>
              </div>
            )}

            {/* DTR BIOMETRICS FACE SECURE INTRANET INTERFACE */}
            {activeSimulation === "dtr" && (
              <div className="w-full space-y-3.5">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-sky-400 font-bold flex items-center gap-1">
                    <Scan className="w-3.5 h-3.5 animate-pulse" /> InsightFace Camera View
                  </span>
                  <span className="text-[9px] text-zinc-500">Security Gate Relay active</span>
                </div>

                {/* Viewfinder block layout */}
                <div className="relative aspect-video border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden flex flex-col justify-between p-3.5">
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-500 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-500 pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-500 pointer-events-none"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-500 pointer-events-none"></div>

                  <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
                    {isDtrScanning && (
                      <div className="absolute inset-x-0 h-px bg-cyan-400 shadow-[0_0_10px_#22d3ee] top-1/2 animate-bounce"></div>
                    )}

                    {/* Render user icon avatar */}
                    <div className="bg-zinc-950 border border-zinc-800 p-2 text-center rounded-lg relative max-w-[140px]">
                      {selectedStaff.id === "EMP-001" ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-1 flex items-center justify-center bg-[#070b0f] border border-cyan-500/30">
                          <DaniloAvatar className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="text-3xl block text-center mb-1">{selectedStaff.faceImg}</div>
                      )}
                      <span className="text-[9px] font-bold text-white block truncate">{selectedStaff.name}</span>
                      <span className="text-[8px] text-zinc-500 block truncate">{selectedStaff.role}</span>

                      {/* Bounding vector pulse overlay */}
                      <div className="absolute -inset-1 border border-dashed border-emerald-500 rounded-lg animate-pulse pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-zinc-500">
                    <span>YOLOv8 Alignment match: 99.82%</span>
                    <span className="text-emerald-400">STATIONS OK</span>
                  </div>
                </div>

                {/* Staff Select switch panel */}
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-400 block font-bold uppercase">Staff Biometric Vectors:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {dtrStaff.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => setSelectedStaff(staff)}
                        className={`p-1.5 text-left rounded border transition-colors text-[9px] cursor-pointer ${selectedStaff.id === staff.id
                          ? "bg-sky-950/40 border-sky-500 text-sky-400 font-bold"
                          : "bg-zinc-900 border-zinc-850 text-zinc-400"
                          }`}
                      >
                        {staff.faceImg} {staff.name} ({staff.status})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isDtrScanning}
                  onClick={runDtrFaceScan}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 text-white font-bold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Scan className="w-3.5 h-3.5" /> Simulate Attendance Scan Pass
                </button>

                {/* Shift logs list */}
                <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-850 max-h-24 overflow-y-auto custom-scrollbar space-y-1">
                  <p className="text-[8px] text-zinc-400 font-bold uppercase border-b border-zinc-800 pb-1">Biometric SQL shift log registers:</p>
                  {dtrLogs.map((log, lIdx) => (
                    <p key={lIdx} className="text-[8px] text-zinc-500 truncate">{log}</p>
                  ))}
                </div>
              </div>
            )}

            {/* RICE LEAF CROP DISEASE DETECTOR INTERFACE */}
            {activeSimulation === "leaf" && (
              <div className="w-full space-y-3.5">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-teal-400 font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 animate-pulse" /> DenseNet-121 Crop Diagnostic R-Pi
                  </span>
                  <span className="text-[9px] text-zinc-500">Zambali Local Specimen Model</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-zinc-400 block font-bold uppercase">Specimen Sample Select:</span>
                    <button
                      onClick={() => { setRiceLeafImage("healthy"); setLeafInferenceResult(null); }}
                      className={`w-full py-1.5 px-2 rounded text-left border text-[9px] cursor-pointer ${riceLeafImage === "healthy" ? "bg-teal-950/40 border-teal-500 text-teal-400" : "bg-zinc-900 border-zinc-850 text-zinc-400"
                        }`}
                    >
                      🌿 Healthy Specimen Leaf
                    </button>
                    <button
                      onClick={() => { setRiceLeafImage("blight"); setLeafInferenceResult(null); }}
                      className={`w-full py-1.5 px-2 rounded text-left border text-[9px] cursor-pointer ${riceLeafImage === "blight" ? "bg-amber-95/40 border-amber-500 text-amber-500" : "bg-zinc-900 border-zinc-850 text-zinc-400"
                        }`}
                    >
                      🥀 Leaf Blight Sample pathology
                    </button>
                    <button
                      onClick={() => { setRiceLeafImage("spot"); setLeafInferenceResult(null); }}
                      className={`w-full py-1.5 px-2 rounded text-left border text-[9px] cursor-pointer ${riceLeafImage === "spot" ? "bg-yellow-950/40 border-yellow-600 text-yellow-600" : "bg-zinc-900 border-zinc-850 text-zinc-400"
                        }`}
                    >
                      🍂 Brown Spot fungal defect
                    </button>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 rounded p-3 flex flex-col justify-between min-h-[120px]">
                    {isLeafRunning ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-1.5 text-center">
                        <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
                        <span className="text-[8px] text-zinc-500">Scanning layer filters...</span>
                      </div>
                    ) : leafInferenceResult ? (
                      <div className="space-y-1.5 text-left">
                        <div>
                          <span className="text-[7px] text-zinc-500 block uppercase font-bold tracking-wider">Identified Pathology:</span>
                          <span className="text-emerald-400 font-bold block text-[10px] leading-tight">{leafInferenceResult.disease}</span>
                        </div>
                        <div className="space-y-1">
                          {leafInferenceResult.metrics.map((met, mIdx) => (
                            <div key={mIdx} className="text-[8px]">
                              <div className="flex justify-between text-zinc-400 font-mono text-[7px]">
                                <span>{met.label}</span>
                                <span>{met.score}%</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-1 rounded overflow-hidden">
                                <div className="bg-teal-500 h-full" style={{ width: `${met.score}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[7px] text-zinc-500 leading-normal pt-1 border-t border-zinc-800">
                          Remedy: {leafInferenceResult.remedy}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-[8px] text-zinc-500 leading-normal">
                        <Info className="w-4 h-4 mb-1 text-zinc-650 text-zinc-600" />
                        Standby. Click &quot;Run Pathology Inference&quot; button below.
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={executeLeafInference}
                  disabled={isLeafRunning}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 text-white font-bold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" /> Run Standalone Pathology Inference
                </button>
              </div>
            )}

            {/* SQL LOCAL SQLITE TERMINAL DBMS INTERFACE */}
            {activeSimulation === "sql" && (
              <div className="w-full space-y-3.5">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" /> Local SQLite CLI Console (v3.42)
                  </span>
                  <span className="text-[9px] text-zinc-500">10k rows loaded</span>
                </div>

                {/* Prebuilt selecting buttons */}
                <div className="space-y-1.5 p-2 bg-zinc-900 border border-zinc-850 rounded">
                  <span className="text-[8px] text-zinc-500 block uppercase font-bold">SQL template commands:</span>
                  <div className="flex flex-col gap-1">
                    {sqlTemplates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => {
                          setActiveSqlTemplate(tmpl.id);
                          setCustomSQL(tmpl.sql);
                          setSqlResultsUser(tmpl);
                        }}
                        className={`text-left p-1 rounded border transition-colors text-[8px] truncate font-mono cursor-pointer ${activeSqlTemplate === tmpl.id
                          ? "bg-amber-950/40 border-amber-500 text-amber-400 font-bold"
                          : "bg-zinc-950 border-zinc-850 text-zinc-400"
                          }`}
                      >
                        {tmpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Statement viewport */}
                <div className="space-y-1 text-left">
                  <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest block">Editable Query script:</span>
                  <textarea
                    value={customSQL}
                    onChange={(e) => setCustomSQL(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-1.5 font-mono text-[9px] text-white h-16 focus:outline-none focus:border-amber-550 focus:border-amber-500"
                    spellCheck={false}
                  />
                </div>

                <button
                  disabled={isQueryRunning}
                  onClick={runSQLQueryAnalyzer}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-black font-semibold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Run Query Statement
                </button>

                {/* Results block */}
                {sqlResultsUser && (
                  <div className="bg-zinc-950 p-2 border border-zinc-800 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                    <span className="text-[7.5px] text-emerald-400 block font-bold pb-1 uppercase tracking-widest">● SQL table result stream:</span>
                    <table className="w-full text-left font-mono text-[8px] text-zinc-400">
                      <thead>
                        <tr className="border-b border-zinc-800 font-black text-zinc-300">
                          {sqlResultsUser.headers.map((hName: string, hIdex: number) => (
                            <th key={hIdex} className="p-0.5">{hName}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResultsUser.rows.map((row: string[], rIdex: number) => (
                          <tr key={rIdex} className="border-b border-zinc-900/60 hover:text-white">
                            {row.map((colVal: string, cIdex: number) => (
                              <td key={cIdex} className="p-0.5 whitespace-nowrap">{colVal}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* WEB SCRAPERS AND DAILY REPORT AUTOMATOR INTERFACE */}
            {activeSimulation === "report" && (
              <div className="w-full space-y-3.5">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-sky-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> Scrapers & Slack Dispatchers
                  </span>
                  <span className="text-[9px] text-zinc-500">Webhook ping logger</span>
                </div>

                {/* Trends mini SVG chart */}
                <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between text-[8px] text-zinc-500">
                    <span>Defects rows scraped trends:</span>
                    <span>{chartMetric === "triggers" ? "Triggers per day" : "SQL Rows count"}</span>
                  </div>

                  {/* SVG mini line graph */}
                  <div className="h-20 w-full bg-zinc-950 rounded relative overflow-hidden flex items-end">
                    <svg viewBox="0 0 100 40" className="w-full h-full p-2" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glow-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 5,30 Q 20,10 40,25 T 80,12"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 5,30 Q 20,10 40,25 T 80,12 L 80,40 L 5,40 Z"
                        fill="url(#glow-grad)"
                      />
                      {/* Dots overlay */}
                      <circle cx="5" cy="30" r="1.2" fill="#22d3ee" />
                      <circle cx="40" cy="25" r="1.2" fill="#22d3ee" />
                      <circle cx="80" cy="12" r="1.2" fill="#22d3ee" />
                    </svg>

                    {/* Labels row */}
                    <div className="absolute inset-x-0 bottom-0.5 px-2 flex justify-between text-[6.5px] text-zinc-650 text-zinc-500 font-mono">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch Trigger and Recipient details */}
                <div className="grid grid-cols-2 gap-2 text-[9px] text-zinc-400 bg-zinc-900 p-2.5 rounded border border-zinc-850">
                  <div>
                    <span className="text-zinc-500 block uppercase text-[7px] font-bold">Report category:</span>
                    <span className="text-white font-bold flex items-center gap-0.5">● Inspection Defect rates</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block uppercase text-[7px] font-bold">Delivery Endpoints:</span>
                    <span className="text-white font-bold flex items-center gap-0.5">● Slack Webhooks API</span>
                  </div>
                </div>

                <button
                  disabled={isReportCompiling}
                  onClick={compileWebReportLogsNow}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 text-white font-bold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  {isReportCompiling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scraping indices endpoints...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3.5 h-3.5" /> Execute Live Cron Scraper
                    </>
                  )}
                </button>

                {/* Log outputs stream */}
                <div className="bg-zinc-950 p-2 rounded border border-zinc-850 max-h-24 overflow-y-auto custom-scrollbar space-y-1.5 text-left text-[7.5px] text-zinc-500 leading-normal">
                  <p className="text-zinc-400 font-bold uppercase pb-0.5 border-b border-zinc-900 leading-none">Scraper Dispatch Terminal output:</p>
                  {scrapersLogs.slice(-3).map((logLine, idx) => (
                    <p key={idx} className="truncate select-text">{logLine}</p>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* HUD Footer Status Bar indicators */}
          <div className="px-4 py-2.5 bg-[#0c121a] border-t border-zinc-800 text-[9px] text-zinc-500 flex justify-between items-center select-none">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SYSTEM HEALTH: SECURE</span>
            <span>INTRANET: CONTEXT_OK</span>
          </div>

        </div>

      </div>

    </section>
  );
}
