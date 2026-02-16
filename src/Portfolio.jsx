import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    id: "scout",
    title: "SCOUT Platform",
    badge: "Patent Pending",
    subtitle: "Solar Site Analysis & Decision Intelligence",
    org: "Balanced Rock Power",
    year: "2024–Present",
    description: "A 12-module platform I designed and built from scratch that handles the complete solar site evaluation workflow — from raw geospatial parsing through energy yield forecasting to financial screening. Now used daily by BRP's development team.",
    impact: "Reduced site screening from weeks to hours",
    details: [
      "ML-based capacity estimation from geospatial features",
      "PV generation forecasting — R² = 0.9994 on 10,000+ PVSyst simulation runs",
      "P50/P90/P99 probabilistic yield via Monte Carlo (26 years, 9.8B+ data points)",
      "LCOE financial optimization and CapEx modeling",
      "Constraint-based layout generation and optimization",
      "Interconnection feasibility screening via graph neural networks",
      "Automated PDF report generation"
    ],
    tech: ["Python", "PyTorch", "Scikit-learn", "Gurobi", "Pyomo", "FastAPI", "Azure", "GCP"],
    category: "production"
  },
  {
    id: "dispatch",
    title: "Firm Power Optimizer",
    subtitle: "PV + BESS Dispatch Optimization for Data Center Loads",
    org: "Balanced Rock Power",
    year: "2024",
    description: "Built a large-scale dispatch optimization engine for a data center project in Colorado. Modeled hundreds of scenarios across varying PV sizes, battery durations, and grid import caps using mixed-integer programming to identify optimal configurations that minimize cost while satisfying firm power constraints.",
    impact: "Identified optimal PV + BESS configurations under firm power constraints",
    details: [
      "Hourly dispatch across PV → Grid → BESS pathways using MILP (Gurobi/Pyomo)",
      "SOC dynamics, round-trip efficiency, and charge rate constraints",
      "Automated KPI extraction across all configurations",
      "Key finding: PV + BESS alone cannot firm 24/7 flat load under capped grid import — informed hybrid thermal evaluation"
    ],
    tech: ["Python", "Gurobi", "Pyomo", "Pandas", "NumPy", "GCP"],
    category: "production"
  },
  {
    id: "legal-ai",
    title: "Legal AI System",
    subtitle: "Contract Intelligence & Risk Analysis",
    org: "Balanced Rock Power",
    year: "2024",
    description: "Built an AI-powered legal document analysis system that automates contract review, clause extraction, risk scoring, and expiration monitoring across BRP's entire NDA and contract portfolio.",
    impact: "Automated contract review across the full legal portfolio",
    details: [
      "Hybrid search architecture: vector embeddings (semantic) + Elasticsearch (keyword)",
      "Automated clause extraction, classification, and risk scoring",
      "Configurable risk thresholds with escalation workflows",
      "Expiration monitoring with automated email notifications to legal and development teams"
    ],
    tech: ["Python", "OpenAI Embeddings", "Elasticsearch", "FastAPI", "Azure"],
    category: "production"
  },
  {
    id: "rag",
    title: "RAG Document Intelligence",
    subtitle: "Retrieval-Augmented Generation for Technical Documents",
    org: "Balanced Rock Power",
    year: "2024",
    description: "Built a production RAG system that enables natural language Q&A over complex technical documents — interconnection studies, feasibility reports, facility studies, and engineering specs. Designed for real-time streaming responses with persistent conversation management.",
    impact: "Natural language access to complex engineering documents",
    details: [
      "Document ingestion and chunking pipeline for technical PDFs",
      "Hybrid retrieval: dense vector search + sparse keyword matching",
      "Streaming response architecture (SSE) for real-time UX",
      "Persistent conversation and session management",
      "Role-based access control across departments"
    ],
    tech: ["Python", "LangChain", "OpenAI", "FastAPI", "Azure", "Streaming SSE"],
    category: "production"
  },
  {
    id: "first-solar",
    title: "Demand Forecasting & Supply Chain Intelligence",
    subtitle: "Global Strategy & Allocation Team",
    org: "First Solar",
    year: "2024",
    description: "Built a centralized data warehouse and time-series forecasting models for demand signals, supply capacity, and historical sales patterns.",
    impact: "15% improvement in short-term supply planning accuracy",
    details: [
      "XGBoost and Prophet models with probabilistic confidence intervals",
      "Power BI dashboards for allocation patterns and demand-supply gaps"
    ],
    tech: ["Python", "XGBoost", "Prophet", "Power BI", "SQL"],
    category: "production"
  },
  {
    id: "mpc-tracker",
    title: "MPC Solar Tracker Optimization",
    subtitle: "Trajectory Optimization for Diffuse Irradiance Harvesting",
    org: "Research",
    year: "2024",
    description: "Developed a Model Predictive Control algorithm for solar tracker systems that actively optimizes for diffuse irradiance rather than relying on static backtracking. Most algorithms treat diffuse as a trigger to flatten panels — this approach treats it as harvestable energy.",
    impact: "3–7% energy yield improvement at utility scale",
    details: [
      "ML-based irradiance forecasting with real-time trajectory optimization",
      "Operates under mechanical constraints (rotation limits, torque) and inter-row shading",
      "Published on Medium — shared with Array Technologies (medium.com/@sundeepyalamanchili5)"
    ],
    tech: ["Python", "SciPy", "PVLib", "Time-Series Forecasting"],
    category: "research"
  },
  {
    id: "rl-bess",
    title: "RL for PV + BESS Co-Optimization",
    subtitle: "Optimal Sizing under Firm Power Constraints",
    org: "Research",
    year: "2024",
    description: "Built reinforcement learning models to determine optimal PV and BESS capacity allocations for firm power delivery. The agent learns to balance generation, storage, and grid import to minimize deficit while controlling cost.",
    impact: "Validated against brute-force scenario sweep",
    details: [
      "Custom OpenAI Gym-style environment modeling PV, BESS, and grid",
      "Reward function penalizing deficit, surplus, and oversizing",
      "Evaluated across multiple target loads and constraints"
    ],
    tech: ["Python", "NumPy", "Custom RL Environment"],
    category: "research"
  },
  {
    id: "ghi",
    title: "GHI Forecasting & Solar Resource Assessment",
    subtitle: "ML Models for Bankable Solar Resource Data",
    org: "Research",
    year: "2024–Present",
    description: "Building ML forecasting models for Global Horizontal Irradiance to close the 4–5% delta between third-party providers and ground station measurements.",
    impact: "Multi-source validation across 6 project sites",
    details: [
      "Clear-sky decomposition: predict clearness index k(t) rather than raw GHI",
      "Multi-source bias correction across NSRDB, SolarAnywhere, ERA5",
      "Inter-Annual Variability analysis across six BRP project sites"
    ],
    tech: ["Python", "Scikit-learn", "PVLib", "SolarAnywhere API", "NSRDB"],
    category: "research"
  },
  {
    id: "gnn",
    title: "Graph Neural Networks for Grid Interconnection",
    subtitle: "Power Flow Pattern Modeling",
    org: "Research",
    year: "2024",
    description: "Applied GNNs to model utility interconnection queues and power flow patterns, enabling early-stage grid feasibility screening before committing to formal queue entry.",
    impact: "Early-stage grid feasibility screening",
    details: [
      "Models utility interconnection queues as graph structures",
      "Predicts power flow bottlenecks and capacity constraints"
    ],
    tech: ["Python", "PyTorch Geometric", "NetworkX"],
    category: "research"
  },
  {
    id: "dreamtime",
    title: "Dreamtime Stories",
    subtitle: "Personalized AI Bedtime Stories for Children",
    org: "Co-founded",
    year: "2024",
    description: "Co-founded a personalized bedtime story app that generates unique, age-appropriate stories for children using AI. Each story adapts to the child's name, interests, and preferred themes.",
    impact: "Personalized storytelling at scale",
    details: [],
    tech: ["React", "OpenAI API", "Node.js"],
    category: "side-project"
  }
];

const SKILLS = {
  "Optimization": ["Gurobi/GurobiPy", "Pyomo", "LP/MILP", "NLP", "MPC", "Trajectory Optimization", "Monte Carlo Simulation", "Constraint Programming"],
  "ML & AI": ["PyTorch", "Keras", "XGBoost", "LightGBM", "Prophet", "Scikit-learn", "GNNs", "Reinforcement Learning", "Time-Series Forecasting", "RAG", "Agentic AI", "LLM Orchestration", "Fine-Tuning", "Transformers", "NLP/SpaCy"],
  "Engineering": ["Python", "SQL", "Pandas", "NumPy", "SciPy", "FastAPI", "Streamlit", "Docker", "Git", "Plotly", "Seaborn"],
  "Infrastructure": ["Azure (Compute, Fabric, DevOps)", "GCP (BigQuery, Compute Engine)", "CI/CD Pipelines", "Container Orchestration", "RBAC"],
  "Energy Domain": ["PV Generation Forecasting", "Solar Resource Assessment (GHI/P50/P90)", "Interconnection & Power Flow Analysis", "LCOE Optimization", "CapEx Modeling", "Energy Storage Dispatch", "PVSyst", "PVLib", "SolarAnywhere"]
};

const EXPERIENCE = [
  {
    role: "Lead AI & Innovations Engineer",
    company: "Balanced Rock Power",
    location: "Scottsdale, AZ",
    period: "Jun 2024–Present",
    summary: "Built SCOUT from scratch — a patented 12-module platform for utility-scale solar site evaluation. Deployed production ML infrastructure on Azure serving 6 departments. Ships end-to-end: optimization (Gurobi/Pyomo), ML forecasting, RAG pipelines, agentic AI, and containerized model serving."
  },
  {
    role: "ML Engineering Intern, Demand Forecasting",
    company: "First Solar",
    location: "Tempe, AZ",
    period: "Jan–May 2024",
    summary: "Global Strategy & Allocation team. Identified data gaps between sales, manufacturing, and supply chain. Built centralized data warehouse and time-series forecasting models (XGBoost, Prophet). Improved short-term supply planning accuracy by 15%."
  },
  {
    role: "Programmer Analyst",
    company: "Cognizant Technology Solutions",
    location: "Hyderabad, India",
    period: "Feb 2021–Jul 2022",
    summary: "Adobe Experience Cloud analytics infrastructure. Built and maintained ETL pipelines with CI/CD automation. Developed Power BI dashboards for customer engagement, campaign performance, and product adoption. Worked across Adobe Analytics, Adobe Target, and AEP."
  }
];

function useOnScreen(ref, threshold = 0.12) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [ref, threshold]);
  return isVisible;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "research", label: "Research" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "writing", label: "Writing" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid #e2e4e9" : "1px solid transparent",
      transition: "all 0.35s ease",
    }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto", padding: "0 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68,
      }}>
        <a href="#top" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 21, fontWeight: 700, color: "#0f1b3d",
          textDecoration: "none", letterSpacing: "-0.02em",
        }}>
          Sundeep Yalamanchili
        </a>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
              color: activeSection === l.id ? "#0f1b3d" : "#8b90a0",
              textDecoration: "none", transition: "color 0.2s ease",
              textTransform: "uppercase",
              borderBottom: activeSection === l.id ? "2px solid #c5993a" : "2px solid transparent",
              paddingBottom: 2,
            }}>
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
          aria-label="Menu"
        >
          <div style={{ width: 22, height: 2, background: "#0f1b3d", marginBottom: 5, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(2.5px, 2.5px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: "#0f1b3d", marginBottom: 5, opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
          <div style={{ width: 22, height: 2, background: "#0f1b3d", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(2.5px, -2.5px)" : "none" }} />
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid #e2e4e9", padding: "12px 36px 24px",
        }}>
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setMobileOpen(false)} style={{
              display: "block", fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 14, fontWeight: 600, color: "#0f1b3d",
              textDecoration: "none", padding: "10px 0",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <FadeIn delay={index * 0.06}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e4e9",
          borderRadius: 10,
          padding: "28px 32px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          borderLeft: expanded ? "3px solid #c5993a" : "3px solid transparent",
        }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#c5993a";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(15,27,61,0.06)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = expanded ? "#c5993a" : "#e2e4e9";
          e.currentTarget.style.borderLeftColor = expanded ? "#c5993a" : "transparent";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20, fontWeight: 700, color: "#0f1b3d",
              margin: 0, letterSpacing: "-0.01em",
            }}>
              {project.title}
            </h3>
            {project.badge && (
              <span style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "linear-gradient(135deg, #c5993a, #d4a94a)",
                color: "#fff",
                padding: "3px 10px", borderRadius: 3,
              }}>
                {project.badge}
              </span>
            )}
          </div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, color: "#8b90a0",
          }}>
            {project.org} · {project.year}
          </span>
        </div>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 13, color: "#6b7080", margin: "0 0 10px",
          fontStyle: "italic", fontWeight: 500,
        }}>
          {project.subtitle}
        </p>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 15, color: "#2d3348", lineHeight: 1.7,
          margin: "0 0 14px",
        }}>
          {project.description}
        </p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#f0f4ff", borderRadius: 5, padding: "5px 14px",
          marginBottom: expanded ? 18 : 14,
          border: "1px solid #dce3f5",
        }}>
          <span style={{ fontSize: 12 }}>⚡</span>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 13, fontWeight: 700, color: "#0f1b3d",
          }}>
            {project.impact}
          </span>
        </div>

        <div style={{
          maxHeight: expanded ? 600 : 0,
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.4s ease",
        }}>
          {project.details.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {project.details.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7, alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10, color: "#c5993a", fontWeight: 600,
                    marginTop: 5, flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 14, color: "#3d4460", lineHeight: 1.6,
                  }}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#5a6078",
              background: "#f5f6f9", borderRadius: 3,
              padding: "2px 8px", border: "1px solid #e8eaef",
            }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{
          position: "absolute", bottom: 12, right: 16,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: "#c5993a", fontWeight: 600,
          transform: expanded ? "rotate(180deg)" : "none",
          transition: "transform 0.3s ease",
        }}>
          ▾
        </div>
      </div>
    </FadeIn>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = ["about", "work", "research", "experience", "skills", "writing", "contact"];
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productionProjects = PROJECTS.filter(p => p.category === "production");
  const researchProjects = PROJECTS.filter(p => p.category === "research");
  const sideProjects = PROJECTS.filter(p => p.category === "side-project");

  return (
    <div id="top" style={{ background: "#fafbfd", minHeight: "100vh", color: "#0f1b3d" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        body { background: #fafbfd; }
        ::selection { background: #e8d5a8; color: #0f1b3d; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-title { font-size: 42px !important; line-height: 1.1 !important; }
          .hero-sub { font-size: 17px !important; }
          .section-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; gap: 28px !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .exp-row { flex-direction: column !important; gap: 4px !important; }
          .exp-period { text-align: left !important; }
          .hero-section { padding-top: 120px !important; padding-bottom: 60px !important; }
        }
      `}</style>

      <Nav activeSection={activeSection} />

      {/* ═══ HERO ═══ */}
      <section className="hero-section" style={{
        maxWidth: 1140, margin: "0 auto", padding: "150px 36px 90px",
      }}>
        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#0f1b3d", borderRadius: 4, padding: "6px 16px",
            marginBottom: 24,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c5993a" }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              AI Engineer · Balanced Rock Power
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 68, fontWeight: 800, lineHeight: 1.08,
            letterSpacing: "-0.03em", color: "#0f1b3d",
            marginBottom: 24, maxWidth: 820,
          }}>
            Solving energy's hardest problems{" "}
            <span style={{
              fontStyle: "italic", fontWeight: 500,
              background: "linear-gradient(135deg, #c5993a, #a07820)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              with AI.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="hero-sub" style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 18, color: "#4a5068", lineHeight: 1.75,
            maxWidth: 640, marginBottom: 48, fontWeight: 400,
          }}>
            Machine learning, mathematical optimization, and production engineering — applied to PV forecasting, grid interconnection, energy storage dispatch, and solar site intelligence. From architecture to deployment, I build the systems that turn complex energy problems into working solutions.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="stats-row" style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            {[
              { value: "12+", label: "Production Modules" },
              { value: "9.8B+", label: "Data Points Processed" },
              { value: "6", label: "Departments Served" },
              { value: "1", label: "Patent Filed" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 38, fontWeight: 800, color: "#0f1b3d",
                  letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10, color: "#8b90a0", letterSpacing: "0.06em",
                  textTransform: "uppercase", marginTop: 6, fontWeight: 500,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 36px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, #c5993a, #e2e4e9 30%)" }} />
      </div>

      {/* ═══ ABOUT ═══ */}
      <section id="about" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px" }}>
        <FadeIn>
          <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Photo */}
            <div style={{
              width: 200, height: 200, borderRadius: 12, flexShrink: 0,
              background: "#e2e4e9",
              backgroundImage: "url('/headshot.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "3px solid #0f1b3d",
            }} />

            {/* Bio */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
                textTransform: "uppercase", fontWeight: 600,
              }}>
                About
              </span>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 32, fontWeight: 700, color: "#0f1b3d",
                letterSpacing: "-0.02em", marginTop: 10, marginBottom: 18,
              }}>
                Sundeep Yalamanchili
              </h2>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 16, color: "#3d4460", lineHeight: 1.8,
              }}>
                <p style={{ marginBottom: 16 }}>
                  AI Engineer specializing in production machine learning systems for the renewable energy sector. Currently leading AI and ML initiatives at Balanced Rock Power, where I designed, built, and deployed the company's entire AI infrastructure from the ground up — spanning solar site evaluation, energy yield forecasting, grid interconnection analysis, and contract intelligence.
                </p>
                <p style={{ marginBottom: 16 }}>
                  My work centers on translating complex energy domain problems into scalable ML systems that deliver measurable business impact. Core areas of expertise include mathematical optimization (LP/MILP), PV generation forecasting, energy storage dispatch, retrieval-augmented generation, and geospatial machine learning — all deployed on production cloud infrastructure across Azure and GCP.
                </p>
                <p>
                  M.S. in Robotics and Autonomous Systems (AI) from Arizona State University. U.S. Patent Application pending for SCOUT, the decision intelligence platform I architected for utility-scale solar development.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ PRODUCTION WORK ═══ */}
      <section id="work" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px" }}>
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              01 — Production Systems
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10,
            }}>
              Shipped & Running
            </h2>
          </div>
        </FadeIn>

        <div className="section-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {productionProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ RESEARCH ═══ */}
      <section id="research" style={{ maxWidth: 1140, margin: "0 auto", padding: "40px 36px 80px" }}>
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              02 — Research & Exploration
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10,
            }}>
              Pushing Boundaries
            </h2>
          </div>
        </FadeIn>

        <div className="section-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {researchProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <FadeIn>
          <div style={{ marginTop: 52, marginBottom: 28 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              Side Projects
            </span>
          </div>
        </FadeIn>

        <div className="section-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {sideProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 36px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, #c5993a, #e2e4e9 30%)" }} />
      </div>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px" }}>
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              03 — Experience
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10,
            }}>
              Where I've Built
            </h2>
          </div>
        </FadeIn>

        <div style={{ maxWidth: 740 }}>
          {EXPERIENCE.map((exp, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                padding: "28px 0",
                borderBottom: i < EXPERIENCE.length - 1 ? "1px solid #e2e4e9" : "none",
              }}>
                <div className="exp-row" style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  marginBottom: 6, gap: 16,
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 21, fontWeight: 700, color: "#0f1b3d",
                    }}>
                      {exp.role}
                    </h3>
                    <p style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 14, color: "#6b7080", marginTop: 2, fontWeight: 500,
                    }}>
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  <span className="exp-period" style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12, color: "#8b90a0", flexShrink: 0, textAlign: "right",
                  }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 15, color: "#3d4460", lineHeight: 1.7, marginTop: 8,
                }}>
                  {exp.summary}
                </p>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={0.3}>
            <div style={{ padding: "28px 0", borderTop: "1px solid #e2e4e9", marginTop: 8 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#c5993a", letterSpacing: "0.08em",
                textTransform: "uppercase", fontWeight: 600,
              }}>
                Education
              </span>
              <div style={{ marginTop: 16 }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 19, fontWeight: 600, color: "#0f1b3d",
                }}>
                  M.S. Robotics and Autonomous Systems (AI Concentration)
                </h3>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 14, color: "#6b7080", marginTop: 3, fontWeight: 500,
                }}>
                  Arizona State University · GPA 3.87/4.00 · 2022–2024
                </p>
              </div>
              <div style={{ marginTop: 18 }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 19, fontWeight: 600, color: "#0f1b3d",
                }}>
                  B.Tech Electronics & Communication Engineering
                </h3>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 14, color: "#6b7080", marginTop: 3, fontWeight: 500,
                }}>
                  KL University, India · GPA 8.29/10
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 36px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, #c5993a, #e2e4e9 30%)" }} />
      </div>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px" }}>
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              04 — Technical Skills
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10,
            }}>
              What I Use
            </h2>
          </div>
        </FadeIn>

        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {Object.entries(SKILLS).map(([category, skills], i) => (
            <FadeIn key={category} delay={i * 0.07}>
              <div style={{
                background: "#fff", border: "1px solid #e2e4e9",
                borderRadius: 10, padding: "24px 24px",
                borderTop: "3px solid #0f1b3d",
              }}>
                <h3 style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11, fontWeight: 600, color: "#c5993a",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  marginBottom: 14,
                }}>
                  {category}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {skills.map(s => (
                    <span key={s} style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: 13, color: "#2d3348", fontWeight: 500,
                      background: "#f5f6f9", borderRadius: 3,
                      padding: "3px 10px", border: "1px solid #e8eaef",
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.35}>
          <div style={{
            marginTop: 28, background: "#0f1b3d", borderRadius: 10,
            padding: "24px 28px", display: "flex", alignItems: "center", gap: 18,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8,
              background: "linear-gradient(135deg, #c5993a, #a07820)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>§</span>
            </div>
            <div>
              <h4 style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3,
              }}>
                U.S. Patent Application (Pending)
              </h4>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 14, color: "#8b90a0",
              }}>
                SCOUT — Solar Site Analysis and Decision Intelligence Platform
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 36px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, #c5993a, #e2e4e9 30%)" }} />
      </div>

      {/* ═══ WRITING ═══ */}
      <section id="writing" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px" }}>
        <FadeIn>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              05 — Writing
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10,
            }}>
              On Medium
            </h2>
          </div>
        </FadeIn>

        <div style={{ maxWidth: 740 }}>
          {[
            {
              title: "I Tried to Beat a 40-Year-Old Solar Algorithm with Machine Learning. Here's What I Learned.",
              sub: "Why reinforcement learning fails where model predictive control succeeds — and what it means for the future of solar tracking",
              date: "Jan 2025",
              href: "https://medium.com/@sundeepyalamanchili5/i-tried-to-beat-a-40-year-old-solar-algorithm-with-machine-learning-heres-what-i-learned-680d47f7de08",
            },
            {
              title: "AI-Powered Grid Infrastructure Analysis for Solar Development",
              sub: "How I integrated open data into an AI workflow to support smarter renewable project development",
              date: "Sep 2025",
              href: "https://medium.com/@sundeepyalamanchili5/ai-powered-grid-infrastructure-analysis-for-solar-development-1be98d440e00",
            },
            {
              title: "AI Isn't Just an Energy Consumer — It's an Accelerator of the Clean Energy Buildout",
              sub: "On the Anthropic Energy Report, 'Build AI in America', and the roadmap for scaling U.S. energy infrastructure",
              date: "Jul 2025",
              href: "https://medium.com/@sundeepyalamanchili5/ai-isnt-just-an-energy-consumer-it-s-an-accelerator-of-the-clean-energy-buildout-f8276df0ea1e",
            },
            {
              title: "Designing Smarter Solar Sites with AI: My Approach to Optimizing Utility-Scale Solar Layouts",
              sub: "Leveraging AI and geospatial analytics to streamline utility-scale solar project design",
              date: "Jul 2025",
              href: "https://medium.com/@sundeepyalamanchili5/designing-smarter-solar-sites-with-ai-my-approach-to-optimizing-utility-scale-solar-layouts-5938528537cb",
            },
            {
              title: "The AI-Powered Revolution in Utility-Scale Solar Industry",
              sub: "How AI is transforming the renewable energy landscape from site selection to operations",
              date: "Jan 2025",
              href: "https://medium.com/@sundeepyalamanchili5/the-ai-powered-revolution-in-utility-scale-solar-industry-19a0d466e577",
            },
          ].map((article, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "24px 0",
                  borderBottom: "1px solid #e2e4e9",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.paddingLeft = "12px";
                  e.currentTarget.style.borderLeftColor = "#c5993a";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.paddingLeft = "0px";
                  e.currentTarget.style.borderLeftColor = "transparent";
                }}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  gap: 16, flexWrap: "wrap",
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18, fontWeight: 600, color: "#0f1b3d",
                    lineHeight: 1.4, flex: 1, minWidth: 280,
                  }}>
                    {article.title}
                  </h3>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12, color: "#8b90a0", flexShrink: 0,
                  }}>
                    {article.date}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 14, color: "#6b7080", marginTop: 6,
                  lineHeight: 1.5,
                }}>
                  {article.sub}
                </p>
              </a>
            </FadeIn>
          ))}

          <FadeIn delay={0.4}>
            <a
              href="https://medium.com/@sundeepyalamanchili5"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginTop: 24, fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 14, fontWeight: 600, color: "#c5993a",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              View all articles on Medium →
            </a>
          </FadeIn>
        </div>
      </section>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 36px" }}>
        <div style={{ height: 1, background: "linear-gradient(to right, #c5993a, #e2e4e9 30%)" }} />
      </div>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ maxWidth: 1140, margin: "0 auto", padding: "80px 36px 120px" }}>
        <FadeIn>
          <div style={{ maxWidth: 600 }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, color: "#c5993a", letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600,
            }}>
              06 — Get in Touch
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 38, fontWeight: 700, color: "#0f1b3d",
              letterSpacing: "-0.02em", marginTop: 10, marginBottom: 18,
            }}>
              Let's talk
            </h2>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 16, color: "#4a5068", lineHeight: 1.75,
              marginBottom: 40,
            }}>
              I'm driven by a single goal: accelerating the clean energy transition through AI and ML. If you're building something that matters in energy, climate, or infrastructure — let's talk.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { label: "Email", value: "sundeepyalamanchili5@gmail.com", href: "mailto:sundeepyalamanchili5@gmail.com" },
                { label: "LinkedIn", value: "linkedin.com/in/yalamanchilisundeep", href: "https://www.linkedin.com/in/yalamanchilisundeep/" },
                { label: "GitHub", value: "github.com/yalamanchili7", href: "https://github.com/yalamanchili7" },
                { label: "Medium", value: "medium.com/@sundeepyalamanchili5", href: "https://medium.com/@sundeepyalamanchili5" },
              ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "baseline", gap: 16,
                  textDecoration: "none", transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10, color: "#c5993a", letterSpacing: "0.06em",
                    textTransform: "uppercase", width: 72, flexShrink: 0, fontWeight: 600,
                  }}>
                    {c.label}
                  </span>
                  <span style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 15, color: "#0f1b3d", fontWeight: 500,
                  }}>
                    {c.value}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: "#0f1b3d", padding: "32px 36px" }}>
        <div style={{
          maxWidth: 1140, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, color: "#6b7080",
          }}>
            © 2025 Sundeep Yalamanchili
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, color: "#6b7080",
          }}>
            Scottsdale, AZ · <span style={{ color: "#c5993a" }}>syalamanchili.dev</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
