import { useState, useEffect } from "react";
import { 
  Github, Linkedin, Mail, Phone, Cpu, Award, BookOpen, 
  Briefcase, Grid, ExternalLink, Activity, CheckCircle, 
  Download, Printer, ChevronRight, Menu, X, Terminal, ArrowUpRight,
  Sun, Moon
} from "lucide-react";
import { PROJECTS, WORK_HISTORY, SKILL_CATEGORIES, CERTIFICATIONS, ACADEMIC_AWARDS, Project } from "./types";
import InteractiveWorkbench from "./components/InteractiveWorkbench";
import DaniloAvatar from "./components/DaniloAvatar";
import LightModeBackgroundShapes from "./components/LightModeBackgroundShapes";
import HeroBackgroundArt from "./components/HeroBackgroundArt";
import HeroQRCode from "./components/HeroQRCode";
import AIChatBot from "./components/AIChatBot";

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Synchronize Dark / Light Modes
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Scroll smoothly to a target element id
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Select project and focus workbench view
  const handleSelectProjectAndScroll = (proj: Project) => {
    setSelectedProject(proj);
    const element = document.getElementById("interactive-workbench");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dynamic experience calculator from June 9, 2025 start date
  const getExperienceDuration = (): string => {
    const startDate = new Date("2025-06-09T00:00:00");
    const today = new Date();
    
    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();
    let days = today.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years <= 0) {
      if (months <= 0) {
        return "1 day";
      }
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    if (months === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    }
    return `${years} ${years === 1 ? "year" : "years"} ${months} ${months === 1 ? "mo" : "mos"}`;
  };
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#080d16] dark:text-gray-100 transition-colors font-sans selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-100 relative">
      
      {/* Dynamic drifting geometric background shapes (glowing vector outlines - light mode only) */}
      <LightModeBackgroundShapes />
      
      {/* 1. TOP FLOATING CONTROL HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#080d16]/90 backdrop-blur-md border-b border-zinc-200 dark:border-gray-800/80 transition-all py-3 px-4 md:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <div id="danilo-header-logo-container" className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-950 dark:bg-white flex items-center justify-center">
              <DaniloAvatar className="w-full h-full rounded-lg" />
            </div>
            <div>
              <span className="font-sans font-bold text-sm tracking-tight block">Danilo F. Llaga Jr.</span>
              <span className="font-mono text-[10px] text-gray-400 block tracking-wider">SOFTWARE & AUTOMATION</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
            <button onClick={() => scrollToSection("skills")} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Skills</button>
            <button onClick={() => scrollToSection("interactive-workbench")} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Live Lab</button>
            <button onClick={() => scrollToSection("projects")} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Projects</button>
            <button onClick={() => scrollToSection("experience")} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Experience</button>
            <button onClick={() => scrollToSection("education")} className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Education & Awards</button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider"
              title="Toggle Console Viewport Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 animate-[spin_8s_linear_infinite]" /> : <Moon className="w-4 h-4 text-sky-600" />}
              <span className="hidden sm:inline font-mono text-[10px]">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Print Friendly Resume */}
            <a 
              href="/assets/DaniloLlaga_CVRes%20(1).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-gray-200/40 dark:border-gray-705/10"
              title="Open Danilo Llaga's Engineering Resume"
              id="danilo-cv-button"
            >
              <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print / CV</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#080d16] border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex flex-col gap-4 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
            <button onClick={() => scrollToSection("skills")} className="text-left py-1">Skills</button>
            <button onClick={() => scrollToSection("interactive-workbench")} className="text-left py-1">Live Lab</button>
            <button onClick={() => scrollToSection("projects")} className="text-left py-1">Featured Projects</button>
            <button onClick={() => scrollToSection("experience")} className="text-left py-1">Work History</button>
            <button onClick={() => scrollToSection("education")} className="text-left py-1">Education</button>
          </div>
        )}
      </header>

      {/* 2. MAIN HERO HEADER BANNER */}
      <section id="hero" className="relative py-20 md:py-28 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-zinc-50 via-zinc-100/40 to-white dark:from-slate-905/20 dark:to-[#080d16] transition-all border-b border-zinc-200 dark:border-gray-900/40">
        
        {/* Abstract background vector matrix lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40 dark:opacity-40 blur-[1.5px] dark:blur-none pointer-events-none"></div>

        {/* Dynamic blueprint / engineering background art - Light Mode Only */}
        <HeroBackgroundArt />

        {/* Floating QR Code Component */}
        <HeroQRCode />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Narrative information */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 dark:bg-sky-200 border border-sky-300 text-black dark:text-black rounded-full text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Software & Automation Engineer
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.05]">
                Danilo F. Llaga Jr.
              </h1>
              <p className="text-lg md:text-xl font-mono font-medium text-sky-600 dark:text-sky-400 tracking-wide uppercase">
                Software & Automation Engineer
              </p>
            </div>

            <p className="text-zinc-750 dark:text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
              Specialized in production-grade computerized vision, deep learning deployment, and edge hardware robotics. Architecting real-time automated optical inspection (AOI) pipelines, offline RAG databases, and high-accuracy defect scanners that save hundreds of material inspection human hours on the assembly floor.
            </p>

            {/* Quick-links targeting his exact profiles */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <a 
                href="mailto:danilofllagajr@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 font-sans font-semibold rounded-lg text-xs tracking-wide transition-colors uppercase shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Engineer
              </a>
              <button 
                onClick={() => scrollToSection("interactive-workbench")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-850 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 font-sans font-semibold rounded-lg text-xs tracking-wide transition-colors uppercase"
              >
                <Terminal className="w-3.5 h-3.5 text-sky-500" /> Test Live Lab
              </button>
            </div>

            {/* Direct Contact links card */}
            <div className="flex flex-wrap gap-y-2 gap-x-6 pt-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +63 970 482 5916
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-500" /> danilofllagajr@gmail.com
              </span>
              <a 
                href="https://github.com/Nasamid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-[#fff]/20 dark:text-white" /> github.com/Nasamid <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
              <a 
                href="https://linkedin.com/in/danilo-llaga" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" /> linkedin.com/in/danilo-llaga <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>

          </div>
          {/* Right Column: High-tech dual-mode console visual component */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] aspect-square rounded-2xl bg-gray-50 dark:bg-gray-900/60 p-5 border border-gray-200/80 dark:border-gray-800 relative shadow-md transition-all flex flex-col justify-between overflow-hidden">
              
              {/* Circuit Grid matrix */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.015)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(14,165,233,0.015)_1.5px,transparent_1.5px)] bg-[size:24px_24px]"></div>

              {/* Feed Header */}
              <div className="flex justify-between items-center relative z-10 border-b border-gray-200/50 dark:border-gray-800/80 pb-2 mb-2 font-mono text-[10px]">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
                  AI_FACE_RECOGNITION
                </div>
                <span className="text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                  ONLINE
                </span>
              </div>

              {/* VIEWPORT AREA: FACE DETECTOR */}
              <div className="flex-1 flex flex-col justify-between py-2 relative z-10">
                <div className="relative w-44 h-44 mx-auto border border-sky-500/30 dark:border-sky-500/20 rounded-xl overflow-hidden shadow-inner bg-white dark:bg-zinc-950 flex items-center justify-center">
                  
                  {/* Camera view indicators */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-sky-400 z-10"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-sky-400 z-10"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-sky-400 z-10"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-sky-400 z-10"></div>

                  {/* Laser scanning vertical line effect */}
                  <div className="absolute inset-x-0 h-0.5 bg-sky-500/50 top-0 shadow-[0_0_8px_#38bdf8] animate-bounce z-10"></div>

                  {/* Actual Portrait component */}
                  <DaniloAvatar className="w-[172px] h-[172px] object-cover transition-transform duration-500 hover:scale-[1.05]" />

                  {/* Bounding face overlay details */}
                  <div className="absolute top-[53px] bottom-[75px] left-[65px] right-[55px] border border-emerald-400/70 border-dashed rounded-lg animate-pulse pointer-events-none z-10">
                    {/* Classification details */}
                    <span className="absolute -top-3.5 -left-px bg-emerald-500 text-white font-mono text-[7px] font-black uppercase px-1 rounded-sm leading-none py-0.5 shadow-sm whitespace-nowrap">
                      Danilo // Conf 99.83%
                    </span>
                    {/* Bounding corner ticks */}
                    <div className="absolute -top-[2px] -left-[2px] w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <div className="absolute -bottom-[2px] -right-[2px] w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  </div>

                  {/* Camera resolution watermarks */}
                  <span className="absolute top-2.5 right-3 font-mono text-[7px] text-sky-400 bg-black/40 px-1 rounded leading-none z-10">1080P@30FPS</span>
                </div>

                <div className="text-center font-mono text-[9px] text-gray-500 space-y-1.5 pt-2">
                  <p className="font-bold text-gray-700 dark:text-gray-300">CAM_01 // COGNITIVE BIOMETRICS IDENTIFIED</p>
                  <p className="text-[8px] opacity-80 leading-tight">InsightFace face embedding vectors successfully registered with Secure Central Registry.</p>
                </div>
              </div>


              {/* Bottom engineering descriptors */}
              <div className="relative z-10 space-y-1 mt-2">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>TENSOR CORE ENGINE // 4.1.24</span>
                  <span>9.26 TFLOPS</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-sky-600 h-full w-[94%]" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 3. HARDWARE SPEC KEY IMPACT STATS BAR */}
      <section className="bg-zinc-100/70 border-y border-zinc-200 dark:bg-[#070b12] dark:border-zinc-800/40 py-8 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-sky-600 dark:text-sky-400">98.2%</div>
            <div className="text-[10px] uppercase text-zinc-500 dark:text-gray-400 mt-1 font-extrabold tracking-wider">Systems accuracy</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400">12+</div>
            <div className="text-[10px] uppercase text-zinc-500 dark:text-gray-400 mt-1 font-extrabold tracking-wider">total project deployments</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-teal-600 dark:text-teal-400">{getExperienceDuration()}</div>
            <div className="text-[10px] uppercase text-zinc-500 dark:text-gray-400 mt-1 font-extrabold tracking-wider">professional experience</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#fa8072]">GPA 1.53</div>
            <div className="text-[10px] uppercase text-zinc-500 dark:text-gray-400 mt-1 font-extrabold tracking-wider">highest honors academic</div>
          </div>
        </div>
      </section>

      {/* 4. CORE SKILLS MATRIX */}
      <section id="skills" className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-gray-900/40">
        <div className="mb-12">
          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">Architecture & Frameworks</span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
            Technical Competencies
          </h2>
          <p className="text-zinc-950 dark:text-zinc-50 mt-2 text-sm md:text-base max-w-2xl font-medium">
            I am highly skilled across full-stack development, machine learning vision pipelines, and direct physical embedded hardware integrations.
          </p>
        </div>

        {/* Skills Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((cat, catIdx) => (
            <div 
              key={catIdx} 
              className="bg-zinc-50/50 dark:bg-[#0c1421] rounded-2xl p-6 border border-zinc-200 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)] transition-all hover:border-sky-500/30 dark:hover:border-sky-500/30 hover:bg-zinc-100/35 dark:hover:bg-[#0f1a2b] hover:shadow-lg hover:shadow-sky-500/5 dark:hover:shadow-sky-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-200 dark:border-gray-850 pb-4">
                <div className="w-8 h-8 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
                  0{catIdx + 1}
                </div>
                <h3 className="font-sans font-bold text-sm tracking-tight text-gray-900 dark:text-white group">
                  {cat.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((sk) => (
                  <span 
                    key={sk}
                    className="px-2.5 py-1 text-xs font-semibold bg-white text-zinc-750 dark:bg-gray-900 dark:text-gray-300 rounded-lg border border-zinc-200 dark:border-gray-800 transition-all hover:bg-zinc-50 dark:hover:bg-gray-850"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE WORKBENCH MOUNT POINT */}
      <InteractiveWorkbench 
        selectedProject={selectedProject} 
        onSelectProject={setSelectedProject}
      />

      {/* 6. PROJECTS MATRIX */}
      <section id="projects" className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-gray-900/45">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">Production Applications</span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
              Featured Case Studies
            </h2>
            <p className="text-zinc-800 dark:text-zinc-300 mt-2 text-sm md:text-base max-w-2xl font-medium">
              I specialize in building and testing embedded optical systems. Click any case below to test it automatically in the <strong className="font-bold text-sky-700 dark:text-sky-300">Lab Cabinet Simulator</strong> above.
            </p>
          </div>
          
          <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-4 md:mt-0 flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-200 dark:border-gray-800 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span> Click cards to deploy to simulator
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((proj) => {
            const isSelected = selectedProject.id === proj.id;
            return (
              <div 
                key={proj.id}
                onClick={() => handleSelectProjectAndScroll(proj)}
                className={`bg-white dark:bg-[#0c1421] rounded-2xl border p-6 flex flex-col justify-between transition-all cursor-pointer select-none shadow-[0_2px_12px_rgba(0,0,0,0.015)] ${
                  isSelected 
                    ? "border-sky-500 dark:border-sky-450 shadow-xl ring-2 ring-sky-500/10 scale-[1.015]" 
                    : "border-zinc-200 dark:border-gray-800 hover:border-zinc-350 dark:hover:border-gray-700 hover:bg-zinc-50/20 hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Category badging */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 tracking-wider bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-100/50 dark:border-sky-900/40 uppercase">
                      {proj.category}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-bold">
                      {proj.status}
                    </span>
                  </div>

                  {/* Core copy */}
                  <div>
                    <h3 className="text-base font-sans font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                      {proj.title}
                    </h3>
                    <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold mt-1 font-mono">{proj.tagline}</p>
                    <p className="text-zinc-650 dark:text-zinc-400 text-xs mt-3 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                </div>

                {/* Bottom specs detail */}
                <div className="pt-4 border-t border-zinc-200 dark:border-gray-800/80 mt-5 space-y-3.5">
                  
                  {/* Local metric grid */}
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    {proj.metrics.slice(0, 3).map((met, idx) => (
                      <div key={idx} className="bg-zinc-50 dark:bg-gray-900/40 p-1.5 rounded border border-zinc-200 dark:border-gray-800">
                        <span className="text-[10px] font-extrabold text-sky-600 dark:text-sky-400 block">{met.value}</span>
                        <span className="text-[8px] text-zinc-500 dark:text-zinc-400 uppercase tracking-tight block font-bold">{met.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Click trigger tag */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" /> Deploy Sandbox View
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DETAILED WORK TIMELINE */}
      <section id="experience" className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-b border-zinc-200 dark:border-gray-900/45">
        
        <div className="mb-12">
          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">Professional History</span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
            Employment Experience
          </h2>
          <p className="text-zinc-800 dark:text-zinc-300 mt-2 text-sm md:text-base max-w-2xl font-medium">
            I lead software engineering and technical design, delivering real automation and optical systems inside factory frameworks.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-8 relative before:absolute before:left-3 md:before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-200 dark:before:bg-gray-800">
          {WORK_HISTORY.map((job, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16 group">
              
              {/* Left Timeline marker node */}
              <div className="absolute left-1 md:left-4 top-2.5 w-4 h-4 rounded-full bg-white dark:bg-[#080d16] border-2 border-sky-600 dark:border-sky-400 flex items-center justify-center transition-transform group-hover:scale-125">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />
              </div>

              {/* Box Body */}
              <div className="bg-white dark:bg-[#0c1421]/60 p-6 rounded-2xl border border-zinc-200 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)] transition-all hover:border-zinc-350 dark:hover:border-gray-700 hover:shadow-md">
                
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-200 dark:border-gray-800/80 mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-sans font-bold text-gray-900 dark:text-white leading-tight">
                      {job.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold text-sky-650 dark:text-sky-400 uppercase tracking-wide">{job.company}</span>
                      <span className="text-xs text-zinc-400">&#8226;</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">{job.location}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-650 bg-zinc-100/60 dark:bg-gray-900 dark:text-gray-400 py-1.5 px-3 rounded-lg border border-zinc-200 dark:border-gray-800/80 font-bold self-start md:self-center">
                    {job.period}
                  </span>
                </div>

                <p className="text-zinc-850 dark:text-zinc-100 text-sm leading-relaxed mb-4 font-semibold">
                  {job.description}
                </p>

                {/* Sub-bullet elements details */}
                <ul className="space-y-2.5 pl-4 list-disc text-zinc-805 dark:text-zinc-300 text-xs md:text-sm leading-relaxed font-semibold">
                  {job.details.map((b, bIdx) => (
                    <li key={bIdx} className="marker:text-sky-500">{b}</li>
                  ))}
                </ul>

                {/* Tags bottom list */}
                <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-gray-800">
                  <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300 block mb-2 uppercase">Core System Exposure:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.techUsed.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-0.5 font-mono text-[9px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200/50 dark:border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 8. EDUCATION & ACCOLADES SEGMENT */}
      <section id="education" className="py-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-zinc-200 dark:border-gray-900/45">
        
        {/* Left BS Computer Engineering education Details - 6 Columns */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">Academic Credentials</span>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
              Degree & Education
            </h2>
          </div>

          <div className="bg-white dark:bg-[#0c1421] p-6 rounded-2xl border border-zinc-200 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)] space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-zinc-200 dark:border-gray-800/80">
              <div>
                <span className="px-2 py-0.5 bg-rose-500/5 text-rose-500 border border-rose-500/20 rounded font-mono text-[9px] font-bold uppercase block w-max mb-2">GPA: 1.53 // Highest Honors</span>
                <h3 className="text-lg font-sans font-bold text-gray-900 dark:text-white leading-snug">
                  Bachelor of Science in Computer Engineering
                </h3>
                <span className="font-mono text-xs text-sky-650 dark:text-sky-400 mt-1 block font-bold">President Ramon Magsaysay State University</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 block font-medium">Iba, Zambales, Philippines</span>
              </div>
              <span className="font-mono text-xs text-zinc-650 bg-zinc-100 dark:bg-gray-900 dark:text-gray-400 py-1 px-2.5 rounded border border-zinc-200 dark:border-gray-800 font-bold">Graduated July 2025</span>
            </div>

            <p className="text-xs md:text-sm text-zinc-800 dark:text-zinc-300 leading-relaxed font-semibold">
              Elective concentration in <strong className="font-semibold text-gray-900 dark:text-white">Software Development & Application Programming</strong>. Active leader of campus computing engineering groups, with comprehensive coursework spanning Machine Learning, Microprocessors, Embedded Linux, and Web engineering.
            </p>

            <div>
              <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300 block mb-2 uppercase">Relevant Course modules:</span>
              <div className="flex flex-wrap gap-1.5">
                {["Machine Learning", "Microcontrollers", "Embedded Systems", "Electronics", "Web Development", "Computer Vision"].map((module) => (
                  <span 
                    key={module}
                    className="px-2 py-1 text-xs bg-zinc-50 dark:bg-gray-900 text-zinc-700 dark:text-gray-400 rounded-lg border border-zinc-200 dark:border-gray-800 font-semibold"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Presidential Activity details */}
          <div className="bg-sky-50/20 dark:bg-[#0c1421]/40 p-6 rounded-2xl border border-sky-100/50 dark:border-gray-800 space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-sky-100/20 dark:border-gray-850">
              <span className="text-xs bg-sky-500/10 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 px-2 py-1 border border-sky-200/50 dark:border-sky-900/50 rounded-lg font-mono font-bold uppercase">PRMSU President</span>
              <h4 className="font-sans font-bold text-sm tracking-tight text-gray-900 dark:text-white">Institute of Computer Engineers of the Philippines (ICpEP)</h4>
            </div>
            <p className="text-[12px] text-zinc-805 dark:text-zinc-300 leading-relaxed font-semibold">
              Presided over Student Executive boards between 2023-2024. Delivered multi-tier proposals to secure local organization financial funding, and coordinated logistics for industrial site visits with top tech enterprises.
            </p>
          </div>

        </div>

        {/* Right Accolades, Awards & Certifications - 6 Columns */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">Accredited Recognitions</span>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
              Awards & Certifications
            </h2>
          </div>

          {/* Awards List card */}
          <div className="bg-white dark:bg-[#0c1421] rounded-2xl border border-zinc-200 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)] p-5 space-y-4">
            <h3 className="font-mono text-[10px] font-extrabold text-zinc-550 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-3 border-b border-zinc-200 dark:border-gray-850">
              <Award className="w-3.5 h-3.5 text-yellow-500" /> Academic & Program Honorees
            </h3>
            
            <div className="space-y-4">
              {ACADEMIC_AWARDS.map((aw, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs font-sans">
                  <div>
                    <h4 className="font-extrabold text-gray-900 dark:text-white leading-tight">{aw.title}</h4>
                    <span className="text-[10px] text-zinc-550 dark:text-gray-400 leading-none mt-0.5 block font-semibold">{aw.issuer}</span>
                  </div>
                  {aw.rank && (
                    <span className="px-2 py-0.5 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 font-mono text-[9px] font-bold uppercase rounded border border-yellow-250 dark:border-yellow-900/50 flex-shrink-0">
                      {aw.rank}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          <div className="bg-white dark:bg-[#0c1421] rounded-2xl border border-zinc-200 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.015)] p-5 space-y-4">
            <h3 className="font-mono text-[10px] font-extrabold text-zinc-550 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pb-3 border-b border-zinc-200 dark:border-gray-850">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Certified Credentials
            </h3>
            
            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, idx) => (
                <div key={idx} className="text-xs font-sans">
                  <h4 className="font-extrabold text-gray-900 dark:text-white leading-normal flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                    {cert.name}
                  </h4>
                  {cert.provider && (
                    <span className="text-[10px] text-zinc-550 dark:text-zinc-440 mt-1 block pl-3 font-mono font-bold">
                      Issued by: {cert.provider} {cert.detail ? `| ${cert.detail}` : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* 9. PRINT LAYOUT COMPONENT: ONLY VISIBLE TO Standard System print commands */}
      <section id="print-resume-layout" className="hidden print:block w-full max-w-4xl mx-auto p-12 text-zinc-950 font-sans leading-normal">
        
        {/* CV Header */}
        <div className="border-b-2 border-zinc-950 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Danilo F. Llaga Jr.</h1>
            <p className="text-md font-bold text-zinc-700 uppercase tracking-wide">Software & Automation Engineer</p>
          </div>
          <div className="text-right text-[10px] space-y-0.5">
            <div>Email: danilofllagajr@gmail.com | Phone: +63 970 482 5916</div>
            <div>GitHub: github.com/Nasamid | LinkedIn: linkedin.com/in/danilo-llaga</div>
            <div>Location: Subic Bay, Philippines</div>
          </div>
        </div>

        {/* CV core block elements */}
        <div className="space-y-6 text-xs">
          
          {/* Summary / Profile statement */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide border-b border-zinc-400 pb-1 mb-2">Technical Profile</h2>
            <p className="text-zinc-800 leading-normal">
              High-GPA Computer Engineering graduate serving as Software & Automation Engineer in electronics manufacturing. Expert architect of optical defect identification, convolutional networks (YOLO11, DenseNet121, PyTorch), edge Jetson computing setups, and local vector search assistants. Proven track record reducing material inspection durations substantially on smart factory floors. GPA 1.53 first place winner honors.
            </p>
          </div>

          {/* Hard Skills */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide border-b border-zinc-400 pb-1 mb-2">Technical Skills</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <strong className="block text-[11px] mb-1">Vision & Deep Learning</strong>
                <p className="text-zinc-700">PyTorch, Ultralytics YOLOv11 & YOLOv8, OpenCV, InsightFace, CNN, DenseNet-121, Deep Learning models.</p>
              </div>
              <div>
                <strong className="block text-[11px] mb-1">Hardware & Edge Nodes</strong>
                <p className="text-zinc-700">NVIDIA Jetson Orin NX, Raspberry Pi 4B, Arduino microcontrollers, Embedded Systems integration.</p>
              </div>
              <div>
                <strong className="block text-[11px] mb-1">AI Chatbots & Programming</strong>
                <p className="text-zinc-705 text-zinc-700">Python, JavaScript / TypeScript, Ollama LLMs, LangChain, ChromaDB Vector stores, Node/Express, Figma.</p>
              </div>
            </div>
          </div>

          {/* Experience listings */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide border-b border-zinc-400 pb-1 mb-2">Work Experience</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-bold">
                  <span>Wistron Infocomm Philippines — Software / Automation Engineer</span>
                  <span>Jun 2025 - Present</span>
                </div>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-zinc-800">
                  <li><strong>AI Chatbot Repair Agent:</strong> Engineered LangChain RAG vector queries over 30,000+ local documents. Resolved onboarding bottlenecks.</li>
                  <li><strong>Automated Optical Inspection:</strong> Executed YOLOv8 models classifying solder ball defect feeds dynamically with 98% detection precision.</li>
                  <li><strong>GPU SMX Pin Inspection:</strong> Developed mathematical opencv-coordinate calculators logging pixel deviation offsets with 96% accuracy.</li>
                  <li><strong>Facial Recognition DTR:</strong> Built edge InsightFace scanning models logging events to HR web systems serving 500+ employees.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between font-bold">
                  <span>DOST-PES/SEI — Web Design Intern</span>
                  <span>Jun 2024 - Aug 2024</span>
                </div>
                <p className="text-zinc-800 mt-1">
                  Crafted high-fidelity Figma administrative panels and assembled Google Data Studio trackers to compute national project indexes.
                </p>
              </div>
            </div>
          </div>

          {/* Education and Thesis */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide border-b border-zinc-400 pb-1 mb-2">Education & Thesis</h2>
            <div className="flex justify-between font-bold">
              <span>President Ramon Magsaysay State University — BS in Computer Engineering</span>
              <span>July 2025</span>
            </div>
            <p className="text-zinc-800 mt-1">
              GPA: 1.53 (Highest Honor). Thesis: <strong>Handheld Rice Leaf Disease Detector with local DenseNet-121 (Won Best Thesis & Programming awards)</strong>, compiled to run locally on low-cost offline Raspberry Pi 4B micro-touchscreens.
            </p>
          </div>

          {/* Honors & Certificates */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide border-b border-zinc-400 pb-1 mb-2">Honors, Awards & Licenses</h2>
            <div className="grid grid-cols-2 gap-4">
              <ul className="list-disc pl-4 text-zinc-800 space-y-0.5">
                <li>Best Thesis Project (1st Place Cup) - PRMSU</li>
                <li>Best in Programming Award - College of Engineering</li>
                <li>2nd Runner Up - Regional CpE challenges (Quizbowl)</li>
              </ul>
              <ul className="list-disc pl-4 text-zinc-800 space-y-0.5">
                <li>Civil Service Professional grade (CSC) Certification</li>
                <li>Safety Officer Level 2 Certification (DOLE SO2)</li>
                <li>DOST-SEI Scholars Leadership Camp Training</li>
              </ul>
            </div>
          </div>

        </div>

      </section>

      {/* 10. FOOTER CLOSURE */}
      <footer className="bg-zinc-50 border-t border-zinc-200 dark:bg-zinc-950 dark:border-gray-900 py-12 px-4 md:px-8 text-center print:hidden transition-all">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-center gap-6 text-gray-500 dark:text-gray-400">
            <a href="https://github.com/Nasamid" target="_blank" rel="noopener noreferrer" className="hover:text-[#fff] transition-colors"><Github className="w-5 h-5 text-gray-500 dark:text-white" /></a>
            <a href="https://linkedin.com/in/danilo-llaga" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Linkedin className="w-5 h-5 text-gray-500 dark:text-blue-500" /></a>
            <a href="mailto:danilofllagajr@gmail.com" className="hover:text-amber-500 transition-colors"><Mail className="w-5 h-5 text-gray-500 dark:text-sky-500" /></a>
          </div>

          <div className="text-xs font-mono text-gray-500 dark:text-gray-400 space-y-1">
            <p>Danilo F. Llaga Jr. &copy; {new Date().getFullYear()} · All rights reserved.</p>
            <p className="text-[10px] opacity-75">Constructed utilizing React 19, Vite, Tailwind v4 and Lucide vectors.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Assistant */}
      <AIChatBot />

    </div>
  );
}
