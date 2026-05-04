/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, ReactNode, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "motion/react";
import { 
  ArrowRight,
  ArrowLeft,
  BarChart3, 
  ChevronRight, 
  ChevronDown, 
  PieChart, 
  ShieldCheck, 
  Zap, 
  Flame,
  Lock,
  Database, 
  Receipt, 
  UsersRound, 
  LineChart as LucideLineChart,
  Target,
  Rocket,
  Minus,
  Check,
  Sun,
  Moon,
  Download,
  Plus,
  X,
  Menu,
  FileText,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  TrendingUp,
  Bot,
  Send,
  Settings,
  Calendar,
  Loader2,
  Mail,
  Globe,
  BellRing,
  Smartphone,
  User,
  DollarSign,
  Sparkles,
  AlertCircle,
  Trash2,
  RefreshCw
} from "lucide-react";
import Markdown from "react-markdown";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from "recharts";
import { GoogleGenAI, Type } from "@google/genai";
import * as XLSX from "xlsx";
import { ThreeBackground } from "./components/ThreeBackground";

interface TooltipProps {
  text: string;
  children: ReactNode;
  key?: React.Key;
}

const Tooltip = ({ text, children }: TooltipProps) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
    </div>
  </div>
);

const FAQItem = ({ question, answer, isDark }: { question: string, answer: string, isDark: boolean, key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contrastText = isDark ? 'text-[#faf9f5]' : 'text-black';

  return (
    <div className={`border-b ${isDark ? 'border-white/5' : 'border-slate-200'} last:border-0`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} ${isDark ? 'group-hover:text-[#faf9f5]' : 'group-hover:text-black'} transition-colors`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`${isDark ? 'text-gray-500' : 'text-slate-400'}`}
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'}`} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className={`pb-8 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract number and surrounding text
  const match = value.match(/[\d.,]+/);
  const numStr = match ? match[0] : "0";
  const numericValue = parseFloat(numStr.replace(/,/g, ''));
  const prefix = value.substring(0, value.indexOf(numStr));
  const suffix = value.substring(value.indexOf(numStr) + numStr.length);

  const motionValue = useMotionValue(0);
  const displayValue = useTransform(motionValue, (latest) => {
    const formattedValue = latest.toLocaleString(undefined, {
      maximumFractionDigits: numericValue % 1 === 0 ? 0 : 1
    });
    return `${prefix}${formattedValue}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, numericValue, { 
        duration: 2, 
        ease: "easeOut" 
      });
      return controls.stop;
    }
  }, [isInView, numericValue, motionValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const SERVICES = [
  {
    title: "Bookkeeping",
    icon: <Database className="w-6 h-6" />,
    description: "Real-time income and expense tracking with automated categorization and secure transaction history.",
    benefits: ["LLM Reconciliation", "Automated Ledger", "Audit Trails"],
    audience: "SMEs & Startups"
  },
  {
    title: "Invoicing & Billing",
    icon: <FileText className="w-6 h-6" />,
    description: "Create and send professional invoices, track payment status, and maintain detailed client financial records.",
    benefits: ["One-click Invoicing", "Auto-reminders", "Payment Portal"],
    audience: "Service Businesses"
  },
  {
    title: "Expense Management",
    icon: <Receipt className="w-6 h-6" />,
    description: "Comprehensive spending categorization with monthly summaries and deep analysis of operational costs.",
    benefits: ["Policy Enforcement", "Receipt OCR", "Burn Analysis"],
    audience: "Growing Teams"
  },
  {
    title: "Financial Reporting (AI)",
    icon: <PieChart className="w-6 h-6" />,
    description: "Institutional-grade P&L reports, AI-driven insights, and trend analysis for strategic decision making.",
    benefits: ["Instant P&L", "Trend Forecasting", "AI Summaries"],
    audience: "C-Suite & Founders"
  },
  {
    title: "Cash Flow Mgmt (AI)",
    icon: <Rocket className="w-6 h-6" />,
    description: "Predictive inflow/outflow tracking with intelligent alerts to prevent liquidity gaps before they happen.",
    benefits: ["Predictions", "Liquidity Alerts", "Runway Analysis"],
    audience: "Venture-backed Entities"
  }
];

const TESTIMONIALS = [
  {
    quote: "Finance AI transformed our monthly closing from two weeks to just two days. The accuracy is unparalleled.",
    author: "Sarah Jenkins",
    role: "CFO at Neotech Systems"
  },
  {
    quote: "The real-time insights provided by the AI dashboard have been a game-changer for our strategic planning.",
    author: "Marcus Thorne",
    role: "Founder at Orbit Digital"
  },
  {
    quote: "Automated reconciliation alone saved us hundreds of hours and identified significant variance we had missed.",
    author: "Elena Rodriguez",
    role: "VP Finance at Global Logistica"
  }
];

const STATS = [
  { label: "Assets Managed", value: "$4.2B+" },
  { label: "Transactions Processed", value: "850M+" },
  { label: "Efficiency Increase", value: "72%" },
  { label: "Data Integrity", value: "99.99%" }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of AI-Driven Bookkeeping",
    excerpt: "How generative models are transforming the way small businesses manage their ledgers without manual entry.",
    content: `
# The Future of AI-Driven Bookkeeping

For decades, bookkeeping has been synonymous with manual data entry, rows of spreadsheets, and the risk of human error. But we are entering a new era. 

At **Finance AI**, we believe that business owners should focus on growth, not receipts. Our latest transformer models are now capable of:

1. **Autonomous Reconciliation**: Identifying matches between bank feeds and invoices with 99.9% accuracy.
2. **Predictive Burn Analysis**: Forecasting when you'll need your next round of funding based on real-time spending patterns.
3. **Anomaly Detection**: Flagging suspicious transactions before they become audit liabilities.

The future isn't about better spreadsheets; it's about the disappearance of the spreadsheet entirely as a manual tool. 
    `,
    date: "May 1, 2024",
    author: "Alex Chen, Founder"
  },
  {
    id: 2,
    title: "Maximizing Runway in a Volatile Market",
    excerpt: "Strategic financial planning tips for startups looking to extend their cash reserves during economic shifts.",
    content: `
# Maximizing Runway in a Volatile Market

Efficiency is the new growth. In the current economic climate, understanding your cash flow isn't just "good management"—it's a survival skill.

### 1. Optimize Variable Costs
Identify subscriptions that have drifted into the "ghost" category. Our AI intelligence feed automatically flags recurring payments that haven't been utilized in over 60 days.

### 2. Accelerate Receivables
Don't wait for your clients to remember. Automated invoicing with intelligent follow-ups can reduce your Average Collection Period by up to 14 days.

### 3. Maintain Liquidity Buffers
We recommend maintaining at least 6 months of burn in liquid assets. Our predictive dashboard helps you visualize exactly how different hiring scenarios or marketing spends will impact that buffer.

Stay lean, stay informed, and let intelligence drive your decisions.
    `,
    date: "April 24, 2024",
    author: "Elena Rodriguez, VP Finance"
  }
];

const PRIVACY_POLICY = `
# Privacy Policy

**Effective Date: May 4, 2024**

At Finance AI, your financial privacy is our highest priority. This policy outlines how we handle your data with institutional-grade security.

### 1. Data Collection
We collect financial transaction data via secure, read-only API connections through certified partners (e.g., Plaid). We never store your raw banking passwords.

### 2. How We Use Data
Your data is used exclusively to:
* Provide automated bookkeeping and reporting.
* Generate AI-driven financial insights.
* Improve our predictive models (using anonymized, aggregated datasets).

### 3. Data Security
All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Our infrastructure is hosted in SOC2 Type II compliant environments.

### 4. Your Rights
You maintain full ownership of your data. You can export your entire ledger or delete your account and all associated data at any time through the settings panel.
`;

const TERMS_OF_SERVICE = `
# Terms of Service

**Last Updated: May 4, 2024**

By using Finance AI, you agree to the following terms of operation.

### 1. Account Security
You are responsible for maintaining the confidentiality of your account credentials. Any unauthorized use should be reported immediately.

### 2. Service Description
Finance AI provides financial management tools. While our AI offers high-accuracy insights, it does not constitute legal, tax, or professional accounting advice. Always consult with a certified professional for formal filings.

### 3. Subscription & Billing
Fees are billed in advance on a monthly or annual basis. You can cancel at any time, but no refunds will be provided for partial months of service.

### 4. Limitation of Liability
Finance AI shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
`;

const BLOGS = [
  {
    title: "Visualize, simplify, and optimize your financial workflow",
    desc: "See how visual dashboards and intuitive design can streamline financial operations.",
    link: "#"
  },
  {
    title: "A clearer, more powerful approach to financial management",
    desc: "Explore a modern experience designed to reduce complexity and improve transparency.",
    link: "#"
  },
  {
    title: "Transform the way you manage finances with Finance AI",
    desc: "Learn how we turn data into actionable insights that scale with your business needs.",
    link: "#"
  }
];

const PRICING_TIERS = [
  {
    name: "FREE",
    price: "$0",
    period: "/mo",
    desc: "Forever free. No card required.",
    button: "Get started free",
    features: [
      { text: "Up to 30 transactions/mo", included: true, bold: true },
      { text: "Up to 3 invoices/mo", included: true, bold: true },
      { text: "Basic dashboard", included: true },
      { text: "1 bank account connect", included: true },
      { text: "Manual bookkeeping", included: true },
      { text: "5 AI chat messages/mo", included: true, bold: true },
      { text: "AI cashflow prediction", included: false },
      { text: "Reports & export", included: false },
      { text: "Recurring transactions", included: false },
      { text: "Multi-currency", included: false },
    ]
  },
  {
    name: "STARTER",
    price: "$19",
    period: "/mo",
    desc: "Billed monthly. Cancel anytime.",
    button: "Start 14-day trial",
    features: [
      { text: "Up to 500 transactions/mo", included: true, bold: true },
      { text: "Up to 20 invoices/mo", included: true, bold: true },
      { text: "Full dashboard + charts", included: true },
      { text: "3 bank accounts", included: true },
      { text: "AI chat — 100 msg/mo", included: true, bold: true },
      { text: "CSV export", included: true },
      { text: "Basic reports", included: true },
      { text: "AI cashflow prediction", included: false },
      { text: "Scenario simulator", included: false },
      { text: "Multi-currency", included: false },
    ]
  },
  {
    name: "BUSINESS",
    price: "$39",
    period: "/mo",
    desc: "Save $96/yr with annual billing.",
    button: "Start 14-day trial",
    highlight: true,
    mostPopular: true,
    features: [
      { text: "Unlimited transactions", included: true, bold: true },
      { text: "Unlimited invoices", included: true, bold: true },
      { text: "AI cashflow prediction", included: true },
      { text: "Scenario simulator", included: true },
      { text: "AI chat — unlimited", included: true, bold: true },
      { text: "Multi-currency support", included: true },
      { text: "Advanced reports + PDF", included: true },
      { text: "Recurring transactions", included: true },
      { text: "Tax module (GST/VAT)", included: true },
      { text: "Team members (multi-user)", included: false },
      { text: "White-label/API access", included: false },
    ]
  },
  {
    name: "PRO",
    price: "$79",
    period: "/mo",
    desc: "For agencies & growing teams.",
    button: "Start 14-day trial",
    features: [
      { text: "Everything in Business", included: true },
      { text: "5 team members", included: true, bold: true },
      { text: "Role-based permissions", included: true },
      { text: "3 business entities", included: true, bold: true },
      { text: "Priority AI processing", included: true },
      { text: "Bank reconciliation", included: true },
      { text: "Client portal access", included: true },
      { text: "Audit trail log", included: true },
      { text: "Dedicated onboarding", included: true },
      { text: "API access", included: true },
    ]
  }
];

const PricingTier = ({ tier, isDark, handleLogin }: { tier: any, isDark: boolean, handleLogin: () => void }) => (
  <div 
    className={`relative p-8 rounded-[2rem] border flex flex-col transition-all duration-500 overflow-hidden ${
      tier.highlight 
        ? 'bg-white/[0.03] border-[#C28E4A]/30 ring-1 ring-[#C28E4A]/20 shadow-[0_0_50px_-12px_rgba(194,142,74,0.15)]' 
        : 'bg-white/[0.01] border-white/5 shadow-sm hover:translate-y-[-4px] hover:bg-white/[0.02]'
    }`}
  >
    {tier.mostPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-3 px-4 py-1.5 bg-[#4F46E5]/10 border border-[#4F46E5]/30 text-[#818CF8] text-[9px] font-black uppercase tracking-widest rounded-full backdrop-blur-xl z-10 shadow-2xl">
        Most popular
      </div>
    )}

    {tier.highlight && (
      <div className="absolute -inset-x-20 -top-20 -bottom-20 pointer-events-none opacity-[0.03] bg-gradient-to-b from-[#C28E4A] to-transparent blur-[100px] -z-10" />
    )}

    <div className="mb-10 text-left">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">{tier.name}</h3>
      <div className="flex items-end gap-1 mb-2">
        <span className={`text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{tier.price}</span>
        <span className="text-sm font-medium text-gray-500 mb-2">{tier.period}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed min-h-[3rem] font-medium">{tier.desc}</p>
    </div>

    <button 
      onClick={handleLogin}
      className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all mb-10 ${
        tier.highlight 
          ? 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-xl' 
          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      {tier.button}
    </button>

    <div className="space-y-4.5 flex-1 text-left">
      {tier.features.map((feature: any, idx: number) => (
        <div key={idx} className={`flex items-start gap-4 ${!feature.included ? 'opacity-30 grayscale blur-[0.2px]' : ''}`}>
          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
            feature.included 
              ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] ring-4 ring-emerald-500/10' 
              : 'bg-gray-600'
          }`} />
          <span className={`text-[11px] leading-snug tracking-tight ${feature.bold ? 'font-bold' : 'font-medium'} ${
            !feature.included 
              ? 'line-through decoration-gray-600 text-gray-500' 
              : isDark ? 'text-gray-300' : 'text-slate-700'
          }`}>
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FAQS = [
  {
    question: "How secure is my financial data?",
    answer: "We use enterprise-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our infrastructure is hosted on SOC2 Type II compliant servers, and we never store your raw banking credentials—we use secure, read-only tokens through certified partners like Plaid and Mercury."
  },
  {
    question: "Can I integrate with my existing software?",
    answer: "Yes. Finance AI features direct, bi-directional integrations with QuickBooks, NetSuite, Salesforce, and AWS. Our proprietary API also allows you to push or pull data into your custom internal tools seamlessly."
  },
  {
    question: "What makes your AI different from a spreadsheet?",
    answer: "Traditional spreadsheets are static and prone to human error. Our proprietary LLMs are specifically trained on institutional accounting principles to identify anomalies, predict burn rates, and automatically reconcile thousands of transactions in seconds with 99.9% accuracy."
  },
  {
    question: "Is there a long-term commitment?",
    answer: "Our Pro and Growth plans are available on a month-to-month basis. The Enterprise tier typically involves an annual service agreement to encompass custom model training and dedicated support, but we offer a standard 14-day trial for all new users."
  },
  {
    question: "Do you offer auditing support?",
    answer: "While we don't act as your auditors, we provide 'Audit-Ready' consolidated reports and automated reconciliation logs that can be directly handed over to your internal or external audit team, saving them dozens of hours in verification."
  }
];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard' | 'transactions' | 'reports' | 'settings' | 'invoices' | 'cashflow' | 'pricing' | 'privacy' | 'terms' | 'blog' | 'blog-post'>('landing');
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => { 
    try { 
      const s = localStorage.getItem('finai_theme'); 
      return s ? JSON.parse(s) : 'dark'; 
    } catch { return 'dark'; } 
  });
  
  useEffect(() => { 
    localStorage.setItem('finai_theme', JSON.stringify(theme)); 
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    companyName: '',
    industry: 'Technology',
    teamSize: '',
    currency: 'USD - US Dollar',
    banks: [],
    growthTarget: 45,
    maxBurn: 50000
  });
  const [connectedBanks, setConnectedBanks] = useState<Set<string>>(new Set());

  const toggleBank = (bank: string) => {
    setConnectedBanks(prev => {
      const next = new Set(prev);
      if (next.has(bank)) next.delete(bank);
      else next.add(bank);
      return next;
    });
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Hello! I'm your AI Finance Assistant. I have access to your current ledger, cash flow projections, and runway analysis. How can I help you optimize your business today?" }
  ]);
  const [profileData, setProfileData] = useState(() => { 
    const defaultValue = {
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex@lumina.ai',
      phone: '+1 (555) 012-3456',
      company: 'Lumina Dynamics',
      role: 'Managing Director',
      currency: 'USD',
      language: 'English (US)',
      notifications: {
        email: true,
        push: true,
        sms: false,
        reports: true
      },
      twoFactor: true
    };
    try { 
      const s = localStorage.getItem('finai_profileData'); 
      return s ? JSON.parse(s) : defaultValue; 
    } catch { return defaultValue; } 
  });

  useEffect(() => { 
    localStorage.setItem('finai_profileData', JSON.stringify(profileData)); 
  }, [profileData])
  const [savedProfileData, setSavedProfileData] = useState({...profileData});
  const [isDirty, setIsDirty] = useState(false);
  const [auditLog, setAuditLog] = useState<{id: number, timestamp: string, action: string, entityType: string, entityLabel: string, detail: string, user: string}[]>([]);
  const [lastReportSummary, setLastReportSummary] = useState<{generatedAt: Date, dateRange: string, netProfit: number, totalRevenue: number, topCategory: string} | null>(null);
  const [aiInsights, setAiInsights] = useState<{title: string, priority: 'High' | 'Medium' | 'Low', action: string, impact: string}[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("Your financial summary is being analyzed by our AI models...");
  const [reportNarrative, setReportNarrative] = useState<string | null>(null);

  const generateAIInsights = async () => {
    // Determine top category
    const counts: Record<string, number> = {};
    reportFilteredTransactions.forEach(t => {
      counts[t.cat] = (counts[t.cat] || 0) + Math.abs(t.amt);
    });
    const topCat = Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    setToast('Initiating Professional Audit Sequence...');
    
    // Trigger both analysis flows
    await Promise.all([
      handleGeminiNarrative(),
      generateStrategicRecommendations()
    ]);
    
    setLastReportSummary({
      generatedAt: new Date(),
      dateRange: `${reportConfig.startDate} — ${reportConfig.endDate}`,
      netProfit: reportNetProfit,
      totalRevenue: reportTotalRevenue,
      topCategory: topCat
    });
  };

  const generateStrategicRecommendations = async () => {
    setIsGeneratingReport(true);
    try {
      const metrics = {
        totalRevenue: reportTotalRevenue,
        totalExpenses: reportTotalExpenses,
        netProfit: reportNetProfit,
        auditScore: auditScore,
        grossMarginPct: grossMarginPct,
        aging,
        dso,
        period: `${reportConfig.startDate} to ${reportConfig.endDate}`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                title: { type: Type.STRING },
                impact: { type: Type.STRING },
                action: { type: Type.STRING }
              },
              required: ["priority", "title", "impact", "action"]
            }
          }
        },
        systemInstruction: "You are a financial advisor. Analyze this financial snapshot and return ONLY a JSON array of recommendations. No markdown, no preamble. Fields: priority, title, impact, action.",
        contents: `Financial Data: ${JSON.stringify(metrics)}`
      });

      const recommendations = JSON.parse(response.text || "[]");
      setAiInsights(recommendations);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGeminiNarrative = async () => {
    setIsGeneratingReport(true);
    try {
      const metrics = {
        totalRevenue: reportTotalRevenue,
        totalExpenses: reportTotalExpenses,
        netProfit: reportNetProfit,
        auditScore: auditScore,
        grossMarginPct: grossMarginPct,
        topClients: topClients.slice(0, 3).map(c => c.name),
        period: `${reportConfig.startDate} to ${reportConfig.endDate}`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        systemInstruction: "You are a CFO-level financial analyst. Write a concise executive memorandum based on the financial data provided. Focus on strategic implications and trend analysis. Use a professional, institutional tone.",
        contents: `Financial Snapshot: ${JSON.stringify(metrics)}`
      });

      setReportNarrative(response.text || "Synthesis complete. No anomalies detected.");
    } catch (e) {
      console.error(e);
      setToast('Narrative generation failed');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const logAction = (action: string, entityType: string, entityLabel: string, detail = '') => {
    setAuditLog(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      action,
      entityType,
      entityLabel,
      detail,
      user: user.name
    }, ...prev.slice(0, 199)]);
  };

  const [formError, setFormError] = useState('');
  const [showEditInvoice, setShowEditInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('General');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (view === 'reports' && aiInsights.length === 0 && !isGeneratingReport) {
      generateAIInsights();
    }
  }, [view]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    setTransactions(prev => {
      let changed = false;
      const newTxs: typeof prev = [];
      const updatedPrev = prev.map(t => {
        if (!t.recurringInterval || t.recurringInterval === 'none') return t;
        
        let lastGenStr = t.lastGenerated || t.date;
        let lastGen = new Date(lastGenStr);
        const today = new Date();
        
        let iterations = 0;
        while(true) {
          if (iterations > 60) break;
          const nextDate = new Date(lastGen);
          if (t.recurringInterval === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
          else if (t.recurringInterval === 'quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
          else if (t.recurringInterval === 'annually') nextDate.setFullYear(nextDate.getFullYear() + 1);
          
          if (nextDate <= today) {
            changed = true;
            lastGen = nextDate;
            lastGenStr = nextDate.toISOString().split('T')[0];
            newTxs.push({
              ...t,
              id: Date.now() + Math.floor(Math.random() * 1000) + iterations,
              date: lastGenStr,
              lastGenerated: lastGenStr
            });
            iterations++;
          } else {
            break;
          }
        }
        
        if (iterations > 0) {
          return { ...t, lastGenerated: lastGenStr };
        }
        return t;
      });
      
      if (changed) {
        return [...updatedPrev, ...newTxs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return prev;
    });
  }, []);
  const [reportConfig, setReportConfig] = useState({
    dateRange: 'This Quarter',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    frequency: 'monthly',
    includeAccounts: [],
  });

  // Sync general filters with reportConfig
  useEffect(() => {
    setFilterDateStart(reportConfig.startDate);
    setFilterDateEnd(reportConfig.endDate);
  }, [reportConfig.startDate, reportConfig.endDate]);
  const [scenarioInput, setScenarioInput] = useState({ hired: 0, newRevenue: 0, salaryPerHead: 15000 });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [taxRates, setTaxRates] = useState([{ name: 'GST', rate: 0.17 }]);
  const [budgets, setBudgets] = useState<Record<string, number>>(() => { 
    const defaultValue = {Software: 2000, Infrastructure: 5000, Payroll: 30000, Marketing: 3000, 'Internal Ops': 2000};
    try { 
      const s = localStorage.getItem('finai_budgets'); 
      return s ? JSON.parse(s) : defaultValue; 
    } catch { return defaultValue; } 
  });

  useEffect(() => { 
    localStorage.setItem('finai_budgets', JSON.stringify(budgets)); 
  }, [budgets])

  const [transactions, setTransactions] = useState<{id: number, invId?: number, date: string, merchant: string, cat: string, status: string, amt: number, type: string, recurringInterval?: 'none'|'monthly'|'quarterly'|'annually', lastGenerated?: string, originalCurrency?: string, originalAmount?: number}[]>(() => {
    const defaultValue = [
      { id: 1, merchant: 'AWS Cloud Services', cat: 'Infrastructure', status: 'Reconciled', amt: -4240.21, type: 'expense' },
      { id: 2, merchant: 'Stripe Payout', cat: 'Sales', status: 'Verified', amt: 12842.00, type: 'income' },
      { id: 3, merchant: 'Salesforce CRM', cat: 'Software', status: 'Flagged', amt: -1200.00, type: 'expense' },
      { id: 4, merchant: 'Apple Business', cat: 'Hardware', status: 'Pending', amt: -5999.00, type: 'expense' },
      { id: 5, merchant: 'Google Workspace', cat: 'Software', status: 'Reconciled', amt: -320.00, type: 'expense' },
    ].map((t, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return { 
        ...t, 
        date: d.toISOString().split('T')[0]
      };
    });
    try { 
      const s = localStorage.getItem('finai_transactions'); 
      return s ? JSON.parse(s) : defaultValue; 
    } catch { return defaultValue; } 
  });

  useEffect(() => { 
    localStorage.setItem('finai_transactions', JSON.stringify(transactions)); 
  }, [transactions])
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceTemplate, setInvoiceTemplate] = useState<'classic' | 'corporate' | 'minimal'>('classic');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [filterSubscriptions, setFilterSubscriptions] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' });

  const categories = ['All', ...new Set(transactions.map(t => t.cat))];
  const statuses = ['All', ...new Set(transactions.map(t => t.status))];

  const filteredTransactions = transactions.filter(t => {
    const catMatch = filterCategory === 'All' || t.cat === filterCategory;
    const statusMatch = filterStatus === 'All' || t.status === filterStatus;
    
    const startMatch = !filterDateStart || t.date >= filterDateStart;
    const endMatch = !filterDateEnd || t.date <= filterDateEnd;
    const subMatch = !filterSubscriptions || (t.recurringInterval && t.recurringInterval !== 'none');
    
    return catMatch && statusMatch && startMatch && endMatch && subMatch;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortConfig.field === 'amt') {
      comparison = Math.abs(a.amt) - Math.abs(b.amt);
    } else if (sortConfig.field === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortConfig.field === 'merchant') {
      comparison = a.merchant.localeCompare(b.merchant);
    }
    
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
  const [invoices, setInvoices] = useState<{id: number, client: string, clientEmail: string, invoiceNumber: string, status: string, amt: number, items: {id: number|string, description: string, quantity: number, price: number, taxRate?: number}[], date: string, dueDate: string, issueDate?: string}[]>(() => {
    const defaultValue = (() => {
      const baseInvoices = [
        { 
          id: 1, 
          client: 'Velocity Tech', 
          clientEmail: 'billing@velocity.tech',
          invoiceNumber: 'INV-1001',
          status: 'Sent', 
          amt: 15400.00,
          items: [
            { id: 1, description: 'Q3 Enterprise License', quantity: 1, price: 12000.00 },
            { id: 2, description: 'Priority Support Add-on', quantity: 1, price: 3400.00 }
          ]
        },
        { 
          id: 2, 
          client: 'Aether Systems', 
          clientEmail: 'finance@aether.io',
          invoiceNumber: 'INV-1002',
          status: 'Paid', 
          amt: 8200.00,
          items: [
            { id: 1, description: 'Consulting Services', quantity: 20, price: 410.00 }
          ]
        },
        { 
          id: 3, 
          client: 'Lumina Group', 
          clientEmail: 'ap@lumina.cloud',
          invoiceNumber: 'INV-1003',
          status: 'Overdue', 
          amt: 3100.00,
          items: [
            { id: 1, description: 'Cloud Resource Audit', quantity: 1, price: 3100.00 }
          ]
        },
      ];
      return baseInvoices.map((inv, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (i * 3 + 2));
        const dueDate = new Date(d);
        dueDate.setDate(dueDate.getDate() + 30);
        return {
          ...inv,
          date: d.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0]
        };
      });
    })();
    try { 
      const s = localStorage.getItem('finai_invoices'); 
      return s ? JSON.parse(s) : defaultValue; 
    } catch { return defaultValue; } 
  });

  useEffect(() => { 
    localStorage.setItem('finai_invoices', JSON.stringify(invoices)); 
  }, [invoices])

  const [newTransaction, setNewTransaction] = useState<{
    id?: number,
    merchant: string,
    cat: string,
    amt: string,
    status: string,
    type: string,
    date?: string,
    recurringInterval?: 'none'|'monthly'|'quarterly'|'annually',
    originalCurrency?: string,
    originalAmount?: string
  }>({
    merchant: '',
    cat: 'Software',
    amt: '',
    status: 'Pending',
    type: 'expense',
    recurringInterval: 'none',
    originalCurrency: 'USD',
    originalAmount: ''
  });
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: number,
    merchant: string,
    cat: string,
    amt: string,
    status: string,
    type: string,
    date: string,
    recurringInterval?: 'none'|'monthly'|'quarterly'|'annually',
    originalCurrency?: string,
    originalAmount?: string
  }>({
    id: 0,
    merchant: '',
    cat: 'Software',
    amt: '',
    status: 'Pending',
    type: 'expense',
    date: '',
    recurringInterval: 'none',
    originalCurrency: 'USD',
    originalAmount: ''
  });
  const staticFxRates: Record<string, number> = {
    USD: 1,
    EUR: 1.08,
    GBP: 1.25,
    PKR: 0.0036,
    AED: 0.27,
    SAR: 0.27,
    AUD: 0.65,
    CAD: 0.73
  };
  const getNextInvoiceNumber = () => {
    if (!invoices || invoices.length === 0) return 'INV-1000';
    const numbers = invoices.map(inv => {
      const match = inv.invoiceNumber.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numbers, 999);
    return `INV-${maxNum + 1}`;
  };

  const [newInvoice, setNewInvoice] = useState({
    client: '',
    clientEmail: '',
    invoiceNumber: '', // Will be set when opening modal or on mount
    dueDate: '',
    items: [{ id: 1, description: '', quantity: 1, price: 0, taxRate: 0 }],
    notes: '',
    status: 'Sent'
  });

  useEffect(() => {
    if (showCreateInvoice) {
      setNewInvoice(prev => ({ ...prev, invoiceNumber: getNextInvoiceNumber() }));
    }
  }, [showCreateInvoice]);
  const [user, setUser] = useState(() => { 
    const defaultValue = {
      name: 'Alex Chen',
      email: 'alex@lumina.ai',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    };
    try { 
      const s = localStorage.getItem('finai_user'); 
      return s ? JSON.parse(s) : defaultValue; 
    } catch { return defaultValue; } 
  });

  useEffect(() => { 
    localStorage.setItem('finai_user', JSON.stringify(user)); 
  }, [user])
  const isDark = theme === 'dark';
  const accentColor = isDark ? '#faf9f5' : '#000000';
  const contrastBg = isDark ? 'bg-[#faf9f5]' : 'bg-black';
  const contrastText = isDark ? 'text-[#faf9f5]' : 'text-black';
  const contrastBorder = isDark ? 'border-[#faf9f5]' : 'border-black';
  const accentBgAlpha = isDark ? 'bg-[#faf9f5]/10' : 'bg-black/10';
  const accentBorderAlpha = isDark ? 'border-[#faf9f5]/20' : 'border-black/20';
  const accentTextAlpha = isDark ? 'text-[#faf9f5]/60' : 'text-black/60';

  const currencyCode = profileData.currency.split(' - ')[0] || 'USD';
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', { 
      style: 'currency', 
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatCompactCurrency = (val: number) => {
    const absVal = Math.abs(val);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    
    const parts = formatter.formatToParts(val);
    const symbol = parts.find(p => p.type === 'currency')?.value || '';
    const symbolIndex = parts.findIndex(p => p.type === 'currency');
    const numberIndex = parts.findIndex(p => p.type === 'integer');
    const isPrefix = symbolIndex < numberIndex;

    if (absVal >= 1000000) {
      const mVal = (absVal / 1000000).toFixed(2) + 'm';
      const formatted = isPrefix ? `${symbol}${mVal}` : `${mVal} ${symbol}`;
      return val < 0 ? `-${formatted}` : formatted;
    }
    if (absVal >= 100000) {
      const kVal = (absVal / 1000).toFixed(1) + 'k';
      const formatted = isPrefix ? `${symbol}${kVal}` : `${kVal} ${symbol}`;
      return val < 0 ? `-${formatted}` : formatted;
    }
    return formatCurrency(val);
  };

  // Integration: Derived State Block for Shared Metrics
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amt, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amt), 0);

  const netProfit = totalRevenue - totalExpenses;
  
  const getMonthlyBurn = () => {
    const expensesByMonth: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const monthKey = t.date.substring(0, 7); // YYYY-MM
        expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + Math.abs(t.amt);
      });

    const months = Object.keys(expensesByMonth).sort().reverse();
    if (months.length === 0) return 35000;
    
    const last3Months = months.slice(0, 3);
    const sum = last3Months.reduce((s, m) => s + expensesByMonth[m], 0);
    return sum / last3Months.length;
  };

  const monthlyBurn = (() => {
    const byMonth: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const key = new Date(t.date).toISOString().slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + Math.abs(t.amt);
    });
    const months = Object.values(byMonth);
    if (months.length === 0) return 50000;
    const recent = months.slice(-3);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  })();

  const availableCapital = 250000 + (totalRevenue - totalExpenses);
  
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
  const outstandingInvoiceTotal = invoices
    .filter(inv => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.amt, 0);

  const scenarioOffsetWeekly = (scenarioInput.newRevenue - (scenarioInput.hired * scenarioInput.salaryPerHead)) / 4;
  const runway = (availableCapital + outstandingInvoiceTotal) / Math.max(1, monthlyBurn);
  const adjustedRunway = availableCapital / Math.max(0.01, monthlyBurn - scenarioOffsetWeekly * 4);

  const invoicesPaidMtd = invoices
    .filter(i => i.status === 'Paid' && i.date.startsWith(new Date().toISOString().substring(0, 7)))
    .reduce((s, i) => s + i.amt, 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const primaryColor = "#C28E4A";
    
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setFontSize(22);
    doc.setTextColor(255);
    doc.text("AI FINANCIAL PERFORMANCE REPORT", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.text(`PERIOD: ${reportConfig.startDate} - ${reportConfig.endDate}`, 20, 33);

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("1. FINANCIAL HIGHLIGHTS", 20, 55);
    
    doc.setFontSize(10);
    doc.text(`Total Revenue: ${formatCurrency(reportTotalRevenue)}`, 25, 65);
    doc.text(`Total Expenses: ${formatCurrency(reportTotalExpenses)}`, 25, 72);
    doc.text(`Net Profit: ${formatCurrency(reportNetProfit)}`, 25, 79);
    doc.text(`Audit Health Score: ${auditScore}/100`, 25, 86);

    doc.setFontSize(14);
    doc.text("2. EXECUTIVE NARRATIVE", 20, 105);
    
    doc.setFontSize(9);
    const splitText = doc.splitTextToSize(reportNarrative || "No narrative generated.", 170);
    doc.text(splitText, 25, 115);

    doc.save(`Financial_Report_${reportConfig.startDate}_${reportConfig.endDate}.pdf`);
  };

  const handleBatchDownload = () => {
    setToast('Starting Batch Export...');
    invoices.forEach((inv, i) => {
      setTimeout(() => {
        handleDownloadInvoicePDF(inv);
      }, i * 1000);
    });
  };

  const avgPaymentDays = (() => {
    const paid = invoices.filter(i => i.status === 'Paid');
    if (paid.length === 0) return 'N/A';
    const totalDays = paid.reduce((s, i) => {
        const start = new Date(i.date);
        const end = new Date();
        return s + (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    }, 0);
    return Math.floor(totalDays / paid.length) + ' Days';
  })();

  const reportFilteredTransactions = transactions.filter(t => {
    const d = t.date;
    return d >= reportConfig.startDate && d <= reportConfig.endDate && (reportConfig.includeAccounts.length === 0 || reportConfig.includeAccounts.includes(t.cat));
  });

  const reportTotalRevenue = reportFilteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amt, 0);

  const reportTotalExpenses = reportFilteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amt), 0);

  const reportNetProfit = reportTotalRevenue - reportTotalExpenses;

  // Real-time metrics
  const costOfRevenue = reportFilteredTransactions
    .filter(t => t.type === 'expense' && (t.cat === 'Infrastructure' || t.cat === 'Software' || t.cat === 'Cost of Sales'))
    .reduce((sum, t) => sum + Math.abs(t.amt), 0);
  
  const grossMargin = reportTotalRevenue - costOfRevenue;
  const grossMarginPct = reportTotalRevenue > 0 ? (grossMargin / reportTotalRevenue) * 100 : 0;
  
  const topClientsData = invoices.reduce((acc: Record<string, number>, inv) => {
    acc[inv.client] = (acc[inv.client] || 0) + inv.amt;
    return acc;
  }, {});
  const topClients = Object.entries(topClientsData)
    .sort(([, a], [, b]) => b - a)
    .map(([name, val]) => ({ name, val }));

  const collectionEfficacy = (() => {
    const total = invoices.reduce((s, i) => s + i.amt, 0);
    const paid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amt, 0);
    return total > 0 ? (paid / total) * 100 : 0;
  })();

  const auditScore = Math.max(0, 100 - (transactions.filter(t => t.status === 'Flagged').length * 4) - (invoices.filter(i => i.status === 'Overdue').length * 2));

  const waterfallData = [
    { name: 'Revenue', value: reportTotalRevenue, start: 0, fill: '#C28E4A' },
    { name: 'Cost/Rev', value: -costOfRevenue, start: reportTotalRevenue, fill: '#ef4444' },
    { name: 'Gross Margin', value: grossMargin, start: 0, fill: '#C28E4A', isTotal: true },
    { name: 'OpEx', value: -(reportTotalExpenses - costOfRevenue), start: grossMargin, fill: '#f87171' },
    { name: 'Net Profit', value: reportNetProfit, start: 0, fill: '#10b981', isTotal: true },
  ].map(d => ({ 
    ...d, 
    base: d.value > 0 ? 0 : d.start + (d.isTotal ? 0 : d.value), 
    top: Math.abs(d.value) 
  }));

  const getRevenuePerformanceData = () => {
    const dataByMonth: { [key: string]: { revenue: number, expense: number } } = {};
    const now = new Date();
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const key = d.toISOString().substring(0, 7);
        dataByMonth[key] = { revenue: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const key = t.date.substring(0, 7);
        if (dataByMonth[key]) {
            if (t.type === 'income' && t.status === 'Reconciled') dataByMonth[key].revenue += t.amt;
            if (t.type === 'expense') dataByMonth[key].expense += Math.abs(t.amt);
        }
    });

    return Object.entries(dataByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, vals]) => {
            const date = new Date(key + '-01');
            return {
                name: date.toLocaleString('default', { month: 'short' }),
                revenue: vals.revenue,
                expense: vals.expense,
                profit: vals.revenue - vals.expense
            };
        });
  };

  const getCashFlowData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(day => ({ name: day, in: 0, out: 0 }));
    const now = new Date();
    
    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const diff = (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24);
      if (diff <= 7) {
        const dayIdx = tDate.getDay();
        if (t.type === 'income') data[dayIdx].in += Math.abs(t.amt);
        else data[dayIdx].out += Math.abs(t.amt);
      }
    });

    const currentDayIdx = now.getDay();
    const result = [];
    let weeklyIn = 0;
    let weeklyOut = 0;
    for (let i = 0; i < 7; i++) {
      const idx = (currentDayIdx - 6 + i + 7) % 7;
      result.push(data[idx]);
      weeklyIn += data[idx].in;
      weeklyOut += data[idx].out;
    }
    
    const weeklyNetFlow = weeklyIn - weeklyOut;
    const projectedNextWeek = weeklyNetFlow * 1.05; 

    return { chartData: result, weeklyNetFlow, projectedNextWeek };
  };

  const getExpenseBreakdown = (txs = transactions) => {
    const cats: {[key: string]: number} = {};
    txs.filter(t => t.type === 'expense').forEach(t => {
      cats[t.cat] = (cats[t.cat] || 0) + Math.abs(t.amt);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getTransactionHistogram = () => {
    const bins = [
      { range: '0-500', count: 0, min: 0, max: 500 },
      { range: '500-2k', count: 0, min: 500, max: 2000 },
      { range: '2k-10k', count: 0, min: 2000, max: 10000 },
      { range: '10k+', count: 0, min: 10000, max: Infinity },
    ];
    transactions.forEach(t => {
      const amt = Math.abs(t.amt);
      const bin = bins.find(b => amt >= b.min && amt < b.max);
      if (bin) bin.count++;
    });
    return bins;
  };


  const handleLogin = () => {
    setIsLogged(true);
    setView('onboarding');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setView('landing');
    setOnboardingStep(0);
  };

  const handleSaveTransaction = () => {
    if (!newTransaction.merchant.trim()) {
      setFormError('Merchant name is required');
      return;
    }
    if (!newTransaction.amt || isNaN(parseFloat(newTransaction.amt))) {
      setFormError('A valid amount is required');
      return;
    }

    setFormError('');
    let baseAmt = parseFloat(newTransaction.amt);
    const selCurrency = newTransaction.originalCurrency || currencyCode;
    let originalAmtString = newTransaction.originalAmount && !isNaN(parseFloat(newTransaction.originalAmount)) 
      ? parseFloat(newTransaction.originalAmount) 
      : baseAmt;
    
    if (selCurrency !== currencyCode && newTransaction.originalAmount && !isNaN(parseFloat(newTransaction.originalAmount))) {
      const rateUsdToBase = staticFxRates[currencyCode] || 1;
      const rateUsdToSel = staticFxRates[selCurrency] || 1;
      baseAmt = parseFloat(newTransaction.originalAmount) * (rateUsdToBase / rateUsdToSel);
      originalAmtString = parseFloat(newTransaction.originalAmount);
    } else if (selCurrency === currencyCode) {
      originalAmtString = baseAmt;
    }

    const date = new Date().toISOString().split('T')[0];
    
    const tr = {
      id: Date.now(),
      date,
      merchant: newTransaction.merchant,
      cat: newTransaction.cat,
      status: newTransaction.status,
      amt: newTransaction.type === 'expense' ? -Math.abs(baseAmt) : Math.abs(baseAmt),
      type: newTransaction.type,
      recurringInterval: newTransaction.recurringInterval,
      lastGenerated: newTransaction.recurringInterval !== 'none' ? date : undefined,
      originalCurrency: selCurrency,
      originalAmount: newTransaction.type === 'expense' ? -Math.abs(originalAmtString) : Math.abs(originalAmtString)
    };
    
    setTransactions([tr, ...transactions]);
    logAction('created', 'transaction', tr.merchant, `Amt: ${formatCurrency(tr.amt)}`);
    setShowAddTransaction(false);
    setToast('Transaction saved');
    setNewTransaction({
      merchant: '',
      cat: 'Software',
      amt: '',
      status: 'Pending',
      type: 'expense',
      recurringInterval: 'none',
      originalCurrency: currencyCode,
      originalAmount: ''
    });
  };

  const handleDeleteTransaction = (id: number) => {
    const tr = transactions.find(t => t.id === id);
    if (tr) logAction('deleted', 'transaction', tr.merchant);
    setTransactions(transactions.filter(t => t.id !== id));
    setSelectedTransaction(null);
  };

  const handleUpdateTransaction = (updatedTr: any) => {
    setTransactions(transactions.map(t => t.id === updatedTr.id ? updatedTr : t));
    logAction('edited', 'transaction', updatedTr.merchant);
    setSelectedTransaction(null);
  };

  const handleSaveEditTransaction = () => {
    if (!editingTransaction.merchant.trim()) {
      setFormError('Merchant name is required');
      return;
    }
    const amount = parseFloat(editingTransaction.amt);
    if (isNaN(amount)) {
      setFormError('A valid amount is required');
      return;
    }

    setFormError('');

    let baseAmt = amount;
    const selCurrency = editingTransaction.originalCurrency || currencyCode;
    let originalAmtString = editingTransaction.originalAmount && !isNaN(parseFloat(editingTransaction.originalAmount)) 
      ? parseFloat(editingTransaction.originalAmount) 
      : baseAmt;
      
    if (selCurrency !== currencyCode && editingTransaction.originalAmount && !isNaN(parseFloat(editingTransaction.originalAmount))) {
      const rateUsdToBase = staticFxRates[currencyCode] || 1;
      const rateUsdToSel = staticFxRates[selCurrency] || 1;
      baseAmt = parseFloat(editingTransaction.originalAmount) * (rateUsdToBase / rateUsdToSel);
      originalAmtString = parseFloat(editingTransaction.originalAmount);
    } else if (selCurrency === currencyCode) {
      originalAmtString = baseAmt;
    }

    const updatedTr = {
      ...editingTransaction,
      date: editingTransaction.date || new Date().toISOString().split('T')[0],
      amt: editingTransaction.type === 'expense' ? -Math.abs(baseAmt) : Math.abs(baseAmt),
      recurringInterval: editingTransaction.recurringInterval,
      originalCurrency: selCurrency,
      originalAmount: editingTransaction.type === 'expense' ? -Math.abs(originalAmtString) : Math.abs(originalAmtString)
    };
    
    handleUpdateTransaction(updatedTr);
    setShowEditTransaction(false);
  };

  const handleUpdateInvoiceStatus = (id: number, newStatus: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    const invData = invoices.find(i => i.id === id);
    if (invData) logAction('status_changed', 'invoice', invData.client, `to: ${newStatus}`);
    
    if (newStatus === 'Paid' && invData) {
      const today = new Date().toISOString().split('T')[0];
      const newTx = {
        id: Date.now(),
        date: today,
        merchant: 'Invoice — ' + invData.client,
        cat: 'Sales',
        status: 'Reconciled',
        amt: invData.amt,
        type: 'income'
      };
      setTransactions(prev => [newTx, ...prev]);
      setToast('Invoice payment reconciled in ledger');
    }

    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus });
    }
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.client.trim()) {
      setFormError('Client name is required');
      return;
    }
    if (newInvoice.items.length === 0 || newInvoice.items.some(i => !i.description.trim() || i.price <= 0)) {
      setFormError('Items must have a description and price > 0');
      return;
    }

    setFormError('');
    const totalAmt = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price * (1 + (item.taxRate || 0))), 0);
    const date = new Date().toISOString().split('T')[0];
    const invId = Date.now();
    
    const inv = {
      id: invId,
      client: newInvoice.client,
      clientEmail: newInvoice.clientEmail,
      invoiceNumber: newInvoice.invoiceNumber,
      date,
      dueDate: newInvoice.dueDate,
      status: newInvoice.status,
      amt: totalAmt,
      items: newInvoice.items
    };
    
    setInvoices([inv, ...invoices]);
    logAction('created', 'invoice', inv.client, `Amt: ${formatCurrency(inv.amt)}`);

    // Integration: Create pending transaction
    const pendingTx = {
      id: Date.now() + 1,
      invId: invId,
      date: date,
      merchant: `Receivable — ${newInvoice.client}`,
      cat: 'Sales',
      status: 'Pending',
      amt: totalAmt,
      type: 'income'
    };
    setTransactions(prev => [pendingTx, ...prev]);

    setShowCreateInvoice(false);
    setToast('Invoice created');
    setNewInvoice({
      client: '',
      clientEmail: '',
      invoiceNumber: '', // This will be reset via the useEffect on showCreateInvoice next time
      dueDate: '',
      items: [{ id: 1, description: '', quantity: 1, price: 0, taxRate: 0 }],
      notes: '',
      status: 'Sent'
    });
  };

  const handleDeleteInvoice = (id: number) => {
    const invData = invoices.find(i => i.id === id);
    if (invData) logAction('deleted', 'invoice', invData.client);
    setInvoices(invoices.filter(inv => inv.id !== id));
    setSelectedInvoice(null);
    setToast('Invoice deleted');
  };

  const handleSaveEditInvoice = () => {
    if (!editingInvoice.client.trim()) {
      setFormError('Client name is required');
      return;
    }
    if (editingInvoice.items.length === 0 || editingInvoice.items.some((i: any) => !i.description.trim() || i.price <= 0)) {
      setFormError('Items must have a description and price > 0');
      return;
    }

    setFormError('');
    const totalAmt = editingInvoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    
    setInvoices(invoices.map(inv => inv.id === editingInvoice.id ? { ...editingInvoice, amt: totalAmt } : inv));
    logAction('edited', 'invoice', editingInvoice.client);
    setShowEditInvoice(false);
    setSelectedInvoice({ ...editingInvoice, amt: totalAmt });
    setToast('Invoice updated');
  };

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: '', quantity: 1, price: 0, taxRate: 0 }]
    }));
  };

  const updateInvoiceItem = (id: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeInvoiceItem = (id: number) => {
    if (newInvoice.items.length <= 1) return;
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const exportChartAsPng = () => {
    if (chartRef.current === null) {
      return;
    }

    toPng(chartRef.current, { cacheBust: true, backgroundColor: isDark ? '#000' : '#faf9f5' })
      .then((dataUrl) => {
        saveAs(dataUrl, 'revenue-performance-chart.png');
      })
      .catch((err) => {
        console.error('Could not export chart', err);
      });
  };

  const handleExportCSV = () => {
    const dataToExport = transactions.filter(t => {
      const d = t.date;
      return d >= reportConfig.startDate && d <= reportConfig.endDate;
    });
    
    const totalAmt = dataToExport.reduce((sum, t) => sum + t.amt, 0);
    
    const rows = [
      ["Date", "Merchant", "Category", "Status", "Amount", "Type"],
      ...dataToExport.map(t => [
        t.date,
        t.merchant,
        t.cat,
        t.status,
        t.amt.toFixed(2),
        t.type
      ]),
      ["", "", "", "TOTAL", totalAmt.toFixed(2), ""]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const todayStr = new Date().toISOString().split('T')[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financial_report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast('Download started');
  };

  const handleExportInvoicesExcel = () => {
    const dataToExport = invoices.map(inv => ({
      'Invoice #': inv.invoiceNumber,
      'Client': inv.client,
      'Email': inv.clientEmail,
      'Issue Date': inv.date,
      'Due Date': inv.dueDate,
      'Status': inv.status,
      'Amount': inv.amt
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, `invoices_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    setToast('Excel download started');
    logAction('Exported Invoices', 'System', 'Excel', 'All records');
  };

  const handleDownloadInvoicePDF = (inv: any) => {
    const doc = new jsPDF();
    const primaryColor = "#C28E4A";
    const accentColor = "#1e293b";
    
    // Helper for currency in PDF
    const pdfFmt = (val: number) => `${currencyCode} ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    if (invoiceTemplate === 'corporate') {
      // Corporate Template: High-impact header
      doc.setFillColor(30, 41, 59); // Slate-800
      doc.rect(0, 0, 210, 65, "F");
      
      doc.setFontSize(28);
      doc.setTextColor(255);
      doc.text("INVOICE", 20, 38);
      
      doc.setFontSize(10);
      doc.setTextColor(primaryColor);
      doc.text(`REFERENCE: #${inv.invoiceNumber}`, 20, 48);
      
      doc.setTextColor(200);
      doc.setFontSize(12);
      doc.text(profileData.company.toUpperCase(), 190, 38, { align: "right" });
      doc.setFontSize(8);
      doc.text(profileData.email, 190, 44, { align: "right" });
      
      // Client & Meta
      doc.setTextColor(accentColor);
      doc.setFontSize(9);
      doc.text("RECIPIENT", 20, 85);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(inv.client, 20, 95);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(inv.clientEmail, 20, 102);
      
      doc.setTextColor(100);
      doc.setFontSize(9);
      doc.text(`ISSUE DATE: ${inv.date}`, 190, 90, { align: "right" });
      doc.text(`DUE DATE: ${inv.dueDate}`, 190, 97, { align: "right" });
      doc.text(`STATUS: ${inv.status.toUpperCase()}`, 190, 104, { align: "right" });
      
      // Table Header
      doc.setFillColor(248, 250, 252);
      doc.rect(20, 120, 170, 12, "F");
      doc.setTextColor(accentColor);
      doc.setFontSize(9);
      doc.text("LINE ITEM DESCRIPTION", 25, 128);
      doc.text("QUANTITY", 130, 128, { align: "center" });
      doc.text("UNIT PRICE", 160, 128, { align: "right" });
      doc.text("SUBTOTAL", 185, 128, { align: "right" });
      
      let y = 140;
      doc.setTextColor(0);
      doc.setFontSize(10);
      (inv.items || []).forEach((item: any) => {
        const lineTotal = (item.quantity || 1) * (item.price || 0);
        doc.text(item.description, 25, y);
        doc.text(item.quantity?.toString() || "1", 130, y, { align: "center" });
        doc.text(pdfFmt(item.price), 160, y, { align: "right" });
        doc.text(pdfFmt(lineTotal), 185, y, { align: "right" });
        y += 10;
        
        if (y > 250) { doc.addPage(); y = 20; }
      });
      
      // Summary
      doc.setDrawColor(240);
      doc.line(130, y + 10, 190, y + 10);
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text("TOTAL DUE", 130, y + 25);
      doc.setTextColor(primaryColor);
      doc.text(pdfFmt(inv.amt), 185, y + 25, { align: "right" });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Payment is due within the stipulated timeframe. Thank you for your business.", 105, 275, { align: "center" });
      doc.text(`Generated by ${profileData.company} Institutional Ledger System`, 105, 282, { align: "center" });

    } else if (invoiceTemplate === 'minimal') {
      // Minimal Template: Modern, whitespace-focused
      doc.setTextColor(accentColor);
      doc.setFontSize(24);
      doc.text("Invoice", 20, 30);
      
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(inv.invoiceNumber, 190, 30, { align: "right" });
      
      doc.setDrawColor(accentColor);
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);
      
      doc.setTextColor(0);
      doc.setFontSize(11);
      doc.text("Client Information", 20, 55);
      doc.setFontSize(14);
      doc.text(inv.client, 20, 65);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(inv.clientEmail, 20, 72);
      
      doc.text(`Billing Date: ${inv.date}`, 190, 65, { align: "right" });
      doc.text(`Payment Due: ${inv.dueDate}`, 190, 72, { align: "right" });
      
      let y = 100;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("DESCRIPTION", 20, y);
      doc.text("TOTAL", 190, y, { align: "right" });
      doc.line(20, y + 3, 190, y + 3);
      y += 15;
      
      (inv.items || []).forEach((item: any) => {
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(item.description, 20, y);
        doc.text(pdfFmt((item.quantity || 1) * (item.price || 0)), 190, y, { align: "right" });
        doc.setDrawColor(245);
        doc.line(20, y + 5, 190, y + 5);
        y += 15;
      });
      
      doc.setFontSize(18);
      doc.setTextColor(accentColor);
      doc.text("Amount Due", 20, y + 10);
      doc.text(pdfFmt(inv.amt), 190, y + 10, { align: "right" });
      
    } else {
      // Classic Template: Traditional layout
      doc.setFontSize(32);
      doc.setTextColor(primaryColor);
      doc.text("INVOICE", 105, 30, { align: "center" });
      
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(profileData.company.toUpperCase(), 105, 40, { align: "center" });
      
      doc.setDrawColor(primaryColor);
      doc.setLineWidth(1);
      doc.line(20, 50, 190, 50);
      
      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(`Invoice Number: ${inv.invoiceNumber}`, 20, 65);
      doc.text(`Issued On: ${inv.date}`, 20, 72);
      doc.text(`Payment Terms: Due by ${inv.dueDate}`, 20, 79);
      
      doc.text("BILL TO:", 130, 65);
      doc.setFontSize(12);
      doc.text(inv.client, 130, 73);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(inv.clientEmail, 130, 80);
      
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 100, 170, 10, "F");
      doc.setTextColor(30);
      doc.setFontSize(9);
      doc.text("Description", 25, 106.5);
      doc.text("Qty", 140, 106.5, { align: "center" });
      doc.text("Rate", 165, 106.5, { align: "right" });
      doc.text("Total", 185, 106.5, { align: "right" });
      
      let yPos = 118;
      (inv.items || []).forEach((item: any) => {
        doc.text(item.description, 25, yPos);
        doc.text(item.quantity?.toString() || "1", 140, yPos, { align: "center" });
        doc.text(item.price.toLocaleString(), 165, yPos, { align: "right" });
        doc.text(((item.quantity || 1) * (item.price || 0)).toLocaleString(), 185, yPos, { align: "right" });
        yPos += 10;
      });
      
      doc.setDrawColor(200);
      doc.line(20, yPos + 5, 190, yPos + 5);
      doc.setFontSize(16);
      doc.setTextColor(primaryColor);
      doc.text("BALANCE DUE", 120, yPos + 20);
      doc.text(pdfFmt(inv.amt), 185, yPos + 20, { align: "right" });
      
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Legal Notice: This document is an electronic invoice. Please retain for your records.", 105, 280, { align: "center" });
    }
    
    if (inv.status === 'Paid') {
      try {
        doc.saveGraphicsState();
        // Use a more widely compatible way to set state if available
        if ((doc as any).setGState) {
          const GState = (doc.constructor as any).GState;
          if (GState) {
            doc.setGState(new GState({ opacity: 0.15 }));
          }
        }
        doc.setFontSize(60);
        doc.setTextColor(34, 197, 94); // emerald-500
        doc.setFont("helvetica", "bold");
        // Ensure angle is a literal number and check options support
        doc.text("PAID", 105, 150, { align: "center", angle: 45 });
        doc.restoreGraphicsState();
      } catch (e) {
        console.warn("Watermark rendering failed", e);
        // Fallback to simple text without fancy state if it fails
        doc.setFontSize(40);
        doc.setTextColor(200, 200, 200);
        doc.text("PAID", 105, 150, { align: "center" });
      }
    }
    
    doc.save(`Invoice_${inv.invoiceNumber}_${inv.client.replace(/\s+/g, '_')}.pdf`);
    setToast(`Invoice ${inv.invoiceNumber} Exported`);
    logAction('Downloaded Invoice PDF', 'System', 'PDF', inv.invoiceNumber);
  };

  const handleDownloadInvoiceExcel = (inv: any) => {
    const rows = [
      ["FINANCIAL RECORD", "OFFICIAL INVOICE DATA"],
      ["Company", profileData.company],
      ["Email", profileData.email],
      [],
      ["INVOICE HEADER"],
      ["Invoice Number", inv.invoiceNumber],
      ["Client Name", inv.client],
      ["Client Email", inv.clientEmail],
      ["Issue Date", inv.date],
      ["Due Date", inv.dueDate],
      ["Payment Status", inv.status],
      ["Currency", currencyCode],
      [],
      ["LINE ITEMS"],
      ["Description", "Quantity", "Unit Price", "Total (Excl Tax)"],
      ...(inv.items || []).map((item: any) => [
        item.description,
        item.quantity || 1,
        item.price,
        (item.quantity || 1) * item.price
      ]),
      [],
      ["SUMMARY"],
      ["Grand Total", inv.amt]
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Data");
    XLSX.writeFile(wb, `Invoice_Data_${inv.invoiceNumber}.xlsx`);
    setToast('Raw Spreadsheet Exported');
    logAction('Exported Invoice Excel', 'System', 'XLSX', inv.invoiceNumber);
  };

  const handleExportInvoicesPDF = () => {
    const doc = new jsPDF();
    const primaryColor = "#C28E4A";
    const data = invoices.map(inv => [
      inv.invoiceNumber,
      inv.client,
      fmtDate(inv.date),
      fmtDate(inv.dueDate),
      inv.status,
      `$${inv.amt.toLocaleString()}`
    ]);

    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text("INVOICE SUMMARY REPORT", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
    
    // Table Draw
    let y = 40;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    
    // Header Row
    doc.setFillColor(245, 245, 245);
    doc.rect(14, y, 182, 10, "F");
    const headers = ["Inv #", "Client", "Issued", "Due", "Status", "Amount"];
    const xPositions = [15, 35, 75, 105, 135, 165];
    
    headers.forEach((h, i) => doc.text(h, xPositions[i], y + 7));
    
    // Data Rows
    doc.setFont("helvetica", "normal");
    y += 15;
    
    data.forEach((row, rowIndex) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      row.forEach((cell, i) => {
        doc.text(String(cell), xPositions[i], y);
      });
      y += 10;
    });

    const total = invoices.reduce((sum, inv) => sum + inv.amt, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL OUTSTANDING: $${total.toLocaleString()}`, 190, y + 5, { align: "right" });

    doc.save(`Invoices_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    setToast('Bulk PDF generated');
    logAction('Exported Invoices PDF', 'System', 'PDF', 'All records');
  };

  const fmtDate = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const liveMetrics = {
        totalRevenue: formatCurrency(totalRevenue),
        totalExpenses: formatCurrency(totalExpenses),
        netProfit: formatCurrency(netProfit),
        monthlyBurn: formatCurrency(monthlyBurn),
        runway: `${runway.toFixed(1)} months`,
        availableCapital: formatCurrency(availableCapital),
        outstandingInvoiceTotal: formatCurrency(outstandingInvoiceTotal),
        overdueInvoicesCount: overdueInvoices.length,
        overdueInvoicesTotal: formatCurrency(overdueInvoices.reduce((s,i) => s+i.amt, 0)),
      };

      const txSummary = transactions.slice(0, 20).map(t => ({
        date: t.date,
        merchant: t.merchant,
        cat: t.cat,
        amt: formatCurrency(t.amt),
        status: t.status
      }));

      const invSummary = invoices.map(i => ({
        client: i.client,
        amt: formatCurrency(i.amt),
        status: i.status,
        dueDate: i.dueDate
      }));

      const expBreakdown = getExpenseBreakdown().map(e => ({ name: e.name, amt: formatCurrency(e.value) }));

      const model = ai.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp", 
        systemInstruction: `You are an AI CFO for ${profileData.company}. Currency: ${currencyCode}. Revenue: ${formatCurrency(totalRevenue)}. Expenses: ${formatCurrency(totalExpenses)}. Net profit: ${formatCurrency(netProfit)}. Burn: ${formatCurrency(monthlyBurn)}/mo. Runway: ${runway.toFixed(1)} months. Overdue invoices: ${overdueInvoices.length} worth ${formatCurrency(overdueInvoices.reduce((s,i)=>s+i.amt,0))}. Recent transactions: ${transactions.slice(0,10).map(t=>t.date+' '+t.merchant+' '+formatCurrency(t.amt)+' '+t.type).join(' | ')}. Expense breakdown: ${getExpenseBreakdown().map(e=>e.name+':'+formatCurrency(e.value)).join(', ')}. Answer with specific data. Be concise.`
      });

      const response = await model.generateContent({
        contents: [...messages, { role: 'user', content: userMsg }].map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          maxOutputTokens: 2048,
        },
      });

      const result = await response.response;
      const aiResponse = result.text() || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I encountered an error connecting to my core intelligence. Please check your system configuration." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  if (isLogged && view === 'onboarding') {
    const steps = [
      {
        title: "Welcome to Intelligence",
        desc: "The foundational layer of your institutional financial trust starts here.",
        content: (
          <div className="space-y-8 py-4">
            <div className="p-8 rounded-[32px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand)]/5 blur-3xl group-hover:bg-[var(--color-brand)]/10 transition-colors"></div>
               <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                 We've prepared an adaptive financial engine tailored for professional scale. To begin, we'll calibrate your environment with a few essential parameters.
               </p>
               <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-[#C28E4A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure 256-bit AES Integration</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
                  <Database className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Auto-Reconciliation</span>
               </div>
               <div className="p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
                  <Rocket className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Real-time Benchmarking</span>
               </div>
            </div>
          </div>
        )
      },
      {
        title: "Entity Configuration",
        desc: "Define your organization's identity to isolate fiscal reporting streams.",
        content: (
          <div className="space-y-10 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Signatory Name</label>
                 <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. Johnathan Silver" 
                      value={onboardingData.name}
                      onChange={(e) => setOnboardingData(p => ({...p, name: e.target.value}))}
                      className="w-full bg-[var(--color-bg-secondary)] border-2 rounded-[2rem] px-8 py-6 text-sm font-medium outline-none transition-all focus:border-[#C28E4A] hover:border-white/20" 
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                    <div className="absolute inset-0 rounded-[2rem] bg-[#C28E4A]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Functional Currency</label>
                 <div className="relative group">
                    <select 
                      value={onboardingData.currency}
                      onChange={(e) => setOnboardingData(p => ({...p, currency: e.target.value}))}
                      className="w-full bg-[var(--color-bg-secondary)] border-2 rounded-[2rem] px-8 py-6 text-sm font-medium outline-none appearance-none cursor-pointer transition-all focus:border-[#C28E4A] hover:border-white/20"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>AED - UAE Dirham</option>
                      <option>PKR - Pak Rupee</option>
                    </select>
                    <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40 group-focus-within:text-[#C28E4A]" />
                    <div className="absolute inset-0 rounded-[2rem] bg-[#C28E4A]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Legal Entity Name</label>
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="e.g. Blackwood Capital Holdings LTD" 
                    value={onboardingData.companyName}
                    onChange={(e) => setOnboardingData(p => ({...p, companyName: e.target.value}))}
                    className="w-full bg-[var(--color-bg-secondary)] border-2 rounded-[2.5rem] px-8 py-7 text-xl font-medium transition-all outline-none focus:border-[#C28E4A] hover:border-white/20" 
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                  <div className="absolute inset-0 rounded-[2.5rem] bg-[#C28E4A]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Industry Vertical</label>
                <div className="relative group">
                  <select 
                    value={onboardingData.industry}
                    onChange={(e) => setOnboardingData(p => ({...p, industry: e.target.value}))}
                    className="w-full bg-[var(--color-bg-secondary)] border-2 rounded-[2rem] px-8 py-6 text-sm font-medium outline-none appearance-none cursor-pointer transition-all focus:border-[#C28E4A] hover:border-white/20"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    <option>Technology & SaaS</option>
                    <option>Financial Services</option>
                    <option>Biotech & Healthcare</option>
                    <option>Strategic Manufacturing</option>
                    <option>Institutional Real Estate</option>
                  </select>
                  <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40 group-focus-within:text-[#C28E4A]" />
                  <div className="absolute inset-0 rounded-[2rem] bg-[#C28E4A]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2" style={{ color: 'var(--color-text-tertiary)' }}>Estimated FTEs</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    placeholder="e.g. 50" 
                    value={onboardingData.teamSize}
                    onChange={(e) => setOnboardingData(p => ({...p, teamSize: e.target.value}))}
                    className="w-full bg-[var(--color-bg-secondary)] border-2 rounded-[2rem] px-8 py-6 text-sm font-medium outline-none transition-all focus:border-[#C28E4A] hover:border-white/20" 
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                  <div className="absolute inset-0 rounded-[2rem] bg-[#C28E4A]/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Feed Ingestion",
        desc: "Securely link your primary capital accounts for automated bookkeeping.",
        content: (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              {['Connect Chase Business', 'Connect Mercury Bank', 'Connect Stripe Capital', 'Connect Plaid Ecosystem'].map((bank) => {
                const isConnected = connectedBanks.has(bank);
                return (
                  <button 
                    key={bank} 
                    onClick={() => toggleBank(bank)}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${
                      isConnected ? 'bg-[var(--color-brand)]/5 border-[#C28E4A]' : 'bg-transparent border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isConnected ? 'bg-[#C28E4A] text-white shadow-xl rotate-3' : 'bg-[var(--color-bg-secondary)]'
                      }`}>
                        <Database className={`w-6 h-6 ${isConnected ? 'animate-pulse' : 'text-gray-400'}`} />
                      </div>
                      <div className="text-left">
                         <span className="text-base font-bold block transition-colors" style={{ color: isConnected ? '#C28E4A' : 'var(--color-text-primary)' }}>{bank}</span>
                         <div className="flex items-center gap-1.5 mt-1">
                            <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-[#C28E4A]' : 'bg-gray-500'}`}></div>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{isConnected ? 'Encrypted Channel Established' : 'Awaiting Secure Protocol'}</span>
                         </div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative z-10 ${
                      isConnected ? 'bg-[#C28E4A] border-[#C28E4A] rotate-0' : 'bg-transparent border-[var(--color-border)] rotate-45'
                    }`}>
                      {isConnected ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-gray-500" />}
                    </div>
                    {/* Background Pattern */}
                    <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#C28E4A]/5 to-transparent transition-opacity duration-700 ${isConnected ? 'opacity-100' : 'opacity-0'}`}></div>
                  </button>
                );
              })}
            </div>
          </div>
        )
      },
      {
        title: "Growth Mandate",
        desc: "Define the trajectory of your organization's performance benchmarks.",
        content: (
          <div className="space-y-12 py-4">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Target Annual Growth</label>
                   <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-6xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>{onboardingData.growthTarget}%</p>
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A]">Year-over-Year</span>
                   </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-sm ${onboardingData.growthTarget > 60 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                   {onboardingData.growthTarget > 60 ? 'Aggressive Strategy' : 'Sustainable Policy'}
                </div>
              </div>
              <div className="relative h-4 bg-[var(--color-bg-secondary)] rounded-full group px-2 flex items-center border border-[var(--color-border)]">
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={onboardingData.growthTarget}
                  onChange={(e) => setOnboardingData(p => ({...p, growthTarget: +e.target.value}))}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />
                <div className="absolute inset-x-2 h-1 bg-[var(--color-bg-tertiary)] rounded-full">
                  <motion.div 
                    className="absolute top-0 left-0 h-full rounded-full bg-[#C28E4A] z-10" 
                    animate={{ width: `${onboardingData.growthTarget}%` }}
                  />
                </div>
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-[#C28E4A] rounded-xl shadow-2xl z-30 flex items-center justify-center group-active:scale-95 transition-transform"
                  animate={{ left: `calc(${onboardingData.growthTarget}% - 16px)` }}
                >
                   <div className="w-1 h-3 bg-[#C28E4A]/30 rounded-full"></div>
                </motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Monthly Burn Threshold</label>
                  <div className="p-6 rounded-[2rem] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border)] transition-all hover:border-[#C28E4A]/30 group cursor-pointer">
                     <p className="text-2xl font-bold font-display" style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(onboardingData.maxBurn)}</p>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Global Institutional Cap</p>
                     </div>
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Reporting Frequency</label>
                  <div className="p-6 rounded-[2rem] bg-[var(--color-bg-secondary)] border-2 border-[#C28E4A]/40 transition-all hover:border-[#C28E4A] group cursor-pointer ring-4 ring-[#C28E4A]/5">
                     <p className="text-2xl font-bold font-display" style={{ color: '#C28E4A' }}>Real-Time</p>
                     <div className="flex items-center gap-2 mt-1">
                        <Zap className="w-2.5 h-2.5 text-[#C28E4A]" />
                        <p className="text-[9px] text-[#C28E4A]/70 uppercase font-bold tracking-widest">Instant Ledger Reconciliation</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex overflow-hidden">
        {/* Left Interactive Panel (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 bg-[var(--color-neutral-950)] relative flex-col justify-between p-16 animate-in fade-in duration-1000">
           {/* Abstract Visual Elements */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full border border-white/5 animate-pulse"></div>
              <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full border border-white/10 [animation-delay:2s]"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-brand)]/5 blur-[120px]"></div>
              {/* Floating Data Dots */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 0.5, 0],
                    x: [0, Math.sin(i) * 50, 0]
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${80 - i * 5}%`
                  }}
                />
              ))}
           </div>

           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-24 cursor-pointer group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                    <div className="w-5 h-5 bg-[#0D0D0B] rounded-md rotate-45"></div>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white font-display">Intelligence</span>
              </div>
              
              <div className="max-w-md">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C28E4A] mb-8 block">Protocol 0{onboardingStep + 1} — {steps[onboardingStep].title}</span>
                <h1 className="text-7xl font-serif italic text-white leading-[0.9] mb-12">Building the future of capital.</h1>
                <p className="text-xl text-neutral-400 font-light leading-relaxed">
                  "The most successful organizations are defined by the speed at which they can transmute data into conviction."
                </p>
                <div className="mt-12 flex items-center gap-12 border-t border-white/10 pt-12">
                   <div>
                      <p className="text-2xl font-bold text-white mb-1">99.9%</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C28E4A]">Data Integrity</p>
                   </div>
                   <div>
                      <p className="text-2xl font-bold text-white mb-1">0.1ms</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C28E4A]">Audit Latency</p>
                   </div>
                </div>
              </div>
           </div>

           <div className="relative z-10 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
              <span>Security Audited</span>
              <span>•</span>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>SOC2 Type II</span>
           </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto">
           <div className="max-w-xl mx-auto w-full px-8 py-20 flex flex-col min-h-full">
              {/* Mobile Branding */}
              <div className="lg:hidden flex items-center gap-3 mb-16 px-4">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
                  </div>
                  <span className="text-lg font-bold tracking-tight text-black font-display">Intelligence</span>
              </div>

              {/* Progress Stepper */}
              <div className="mb-20">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C28E4A] mb-2 block">Initialization Protocol</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>0{onboardingStep + 1}</span>
                      <span className="text-sm font-light text-gray-500">/ 0{steps.length}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Completion Status</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{Math.round(((onboardingStep + 1) / steps.length) * 100)}%</span>
                  </div>
                </div>

                <div className="relative h-1.5 w-full bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden mb-12">
                   <div className="absolute inset-0 flex gap-1 px-0.5 py-0.5">
                      {steps.map((_, i) => (
                        <div key={i} className="flex-1 h-full relative">
                           {/* Background Track Segment */}
                           <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                           {/* Active fill */}
                           <motion.div 
                             initial={false}
                             animate={{ 
                               width: i <= onboardingStep ? '100%' : '0%',
                               opacity: i <= onboardingStep ? 1 : 0
                             }}
                             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                             className="absolute inset-0 bg-[#C28E4A] rounded-full shadow-[0_0_10px_rgba(194,142,74,0.3)]"
                           />
                        </div>
                      ))}
                   </div>
                </div>

                <h2 className="text-5xl font-serif italic mb-4" style={{ color: 'var(--color-text-primary)' }}>{steps[onboardingStep].title}</h2>
                <p className="text-[var(--color-text-secondary)] text-base font-light font-sans">{steps[onboardingStep].desc}</p>
              </div>

              <motion.div 
                key={onboardingStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1"
              >
                {steps[onboardingStep].content}
              </motion.div>

              <div className="mt-16 flex items-center justify-between gap-6 border-t pt-10" style={{ borderColor: 'var(--color-border)' }}>
                {onboardingStep > 0 ? (
                  <button 
                    onClick={() => setOnboardingStep(s => s - 1)}
                    className="flex items-center gap-2 px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:bg-[var(--color-bg-secondary)]"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Protocol Back
                  </button>
                ) : <div />}

                <button 
                  onClick={() => {
                    if (onboardingStep < steps.length - 1) {
                      setOnboardingStep(s => s + 1);
                    } else {
                      const updatedProfile = { 
                        ...profileData, 
                        company: onboardingData.companyName || profileData.company,
                        currency: onboardingData.currency || profileData.currency
                      };
                      const updatedUser = { ...user, name: onboardingData.name || user.name };
                      
                      setProfileData(updatedProfile);
                      setUser(updatedUser);
                      
                      // Explicitly save to localStorage for immediate persistence
                      localStorage.setItem('finai_profileData', JSON.stringify(updatedProfile));
                      localStorage.setItem('finai_user', JSON.stringify(updatedUser));
                      
                      logAction('onboarding_complete', 'system', 'onboarding');
                      setToast('Organization environment established');
                      setView('dashboard');
                    }
                  }}
                  disabled={onboardingStep === 1 && !onboardingData.companyName}
                  className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3 group ${
                     onboardingStep === 1 && !onboardingData.companyName ? 'opacity-30 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                  style={{ background: 'var(--color-neutral-950)', color: 'white' }}
                >
                  {onboardingStep === steps.length - 1 ? 'Commence Dashboard' : 'Execute Sequence'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (isLogged) {
    const handleChartDrillDown = (category?: string, status?: string) => {
      if (category && category !== 'Total') setFilterCategory(category);
      if (status) setFilterStatus(status);
      setView('transactions');
    };

    const getMoM = (type: 'income' | 'expense') => {
      const now = new Date();
      const thisM = now.getMonth(), thisY = now.getFullYear();
      const lastM = thisM === 0 ? 11 : thisM - 1;
      const lastY = thisM === 0 ? thisY - 1 : thisY;
      const cur = transactions.filter(t => t.type === type && new Date(t.date).getMonth() === thisM && new Date(t.date).getFullYear() === thisY).reduce((s, t) => s + Math.abs(t.amt), 0);
      const prev = transactions.filter(t => t.type === type && new Date(t.date).getMonth() === lastM && new Date(t.date).getFullYear() === lastY).reduce((s, t) => s + Math.abs(t.amt), 0);
      if (prev === 0) return { pct: 'N/A', up: true };
      const pct = ((cur - prev) / prev * 100);
      return { pct: (pct > 0 ? '+' : '') + pct.toFixed(1) + '%', up: pct >= 0 };
    };
    const momRev = getMoM('income');
    const momExp = getMoM('expense');
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100).toFixed(1) + '%' : '0%';
    
    // Audit Score Calculation
    const flaggedCount = transactions.filter(t => t.status === 'Flagged').length;
    const pendingInvCount = invoices.filter(i => i.status === 'Pending').length;
    const overdueInvCount = overdueInvoices.length;
    const auditScore = Math.max(0, 100 - (pendingInvCount * 5) - (flaggedCount * 3) - (overdueInvCount * 2));
    
    // Aging Calculation
    const now = new Date();
    const aging = {
      current: invoices.filter(i => i.status !== 'Paid' && new Date(i.dueDate) >= now).reduce((s, i) => s + i.amt, 0),
      late31: invoices.filter(i => i.status === 'Overdue' && (now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24) <= 60).reduce((s, i) => s + i.amt, 0),
      critical: invoices.filter(i => i.status === 'Overdue' && (now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24) > 60).reduce((s, i) => s + i.amt, 0)
    };
    const totalAging = aging.current + aging.late31 + aging.critical || 1;
    
    // DSO Calculation
    const dso = reportTotalRevenue > 0 ? Math.round((outstandingInvoiceTotal / reportTotalRevenue) * 90) : 0;
    const dsoColor = dso < 30 ? 'text-emerald-500' : dso < 60 ? 'text-amber-500' : 'text-rose-500';

    const runwayFixed = (availableCapital + outstandingInvoiceTotal) / Math.max(monthlyBurn, 1);
    const runwayStatus = runwayFixed < 3 ? { label: 'Critical', color: 'text-red-500' } : runwayFixed < 6 ? { label: 'Warning', color: 'text-amber-500' } : { label: 'Healthy', color: 'text-emerald-500' };

    const revenueChartData = (() => {
      const buckets: Record<string, { revenue: number, expenses: number }> = {};
      transactions.forEach(t => {
        const d = new Date(t.date);
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!buckets[key]) buckets[key] = { revenue: 0, expenses: 0 };
        if (t.type === 'income') buckets[key].revenue += t.amt;
        if (t.type === 'expense') buckets[key].expenses += Math.abs(t.amt);
      });

      // Calculate simple trend based on last 3 months
      const historicalPoints = Array.from({ length: 4 }, (_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (4 - i));
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        return buckets[key]?.revenue || 0;
      });
      const avgGrowth = historicalPoints.length > 1 
        ? historicalPoints.reduce((acc, val, i, arr) => i > 0 ? acc + (val - arr[i-1]) : acc, 0) / (historicalPoints.length - 1)
        : 0;

      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (6 - i));
        const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        const revenue = buckets[key]?.revenue || 0;
        
        // Accurate projection: if it's the current month or future, apply trend
        const isCurrentMonth = i === 6;
        const projectionValue = isCurrentMonth 
          ? Math.max(0, (historicalPoints[historicalPoints.length-1] || 0) + avgGrowth)
          : revenue * 1.02; // Baseline variance

        return {
          name: d.toLocaleString('default', { month: 'short' }),
          revenue: revenue,
          expenses: buckets[key]?.expenses || 0,
          projection: Math.round(projectionValue)
        };
      });
    })();

    const pendingInvoices = invoices.filter(inv => inv.status !== 'Paid');

    return (
      <div className="min-h-screen font-sans lg:flex selection:bg-[var(--color-brand-subtle)]" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b flex items-center justify-between px-6 sticky top-0 z-[60]" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-brand)', color: '#fff' }}>
              <div className="w-4 h-4 bg-white/20 rounded-sm rotate-45"></div>
            </div>
            <span className="text-lg font-bold tracking-tight font-display" style={{ color: 'var(--color-text-primary)' }}>Finance AI</span>
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Sidebar Overlay (Mobile) */}
        {menuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`w-64 border-r flex flex-col fixed lg:sticky lg:h-screen z-[80] transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} top-0 h-full`}
          style={{ background: 'var(--color-sidebar)', borderColor: 'var(--color-border)' }}
        >
          <div className="p-8 pb-12 hidden lg:flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-brand)', color: '#fff' }}>
                <div className="w-4 h-4 bg-white/20 rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight font-display" style={{ color: 'var(--color-text-primary)' }}>Finance AI</span>
            </div>
            {profileData.company && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C28E4A] ml-11">{profileData.company}</span>
            )}
          </div>

          <nav className="flex-1 px-4 py-8 lg:py-0 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'transactions', label: 'Bookkeeping', icon: <Receipt className="w-4 h-4" /> },
              { id: 'invoices', label: 'Invoicing & Billing', icon: <FileText className="w-4 h-4" /> },
              { id: 'reports', label: 'AI Reporting', icon: <PieChart className="w-4 h-4" /> },
              { id: 'cashflow', label: 'Cash Flow (AI)', icon: <Rocket className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as any);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  view === item.id 
                    ? 'bg-[var(--color-bg-active)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto border-t lg:border-none flex flex-col gap-2" style={{ borderColor: 'var(--color-border)' }}>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-expense)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Interface */}
        <main className="flex-1 p-6 lg:p-12 min-h-screen relative overflow-x-hidden scrollbar-hide">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold capitalize" style={{ color: 'var(--color-text-primary)' }}>
                {view === 'dashboard' ? 'Overview' : 
                 view === 'transactions' ? 'Bookkeeping' : 
                 view === 'invoices' ? 'Invoicing & Billing' :
                 view === 'reports' ? 'AI Financial Reporting' :
                 view === 'cashflow' ? 'Cash Flow Management' :
                 view === 'settings' ? 'System Settings' : view}
              </h1>
              <p className="text-[var(--color-text-tertiary)] text-xs lg:text-sm mt-1">Welcome back, {user.name.split(' ')[0]}. Operating as {profileData.company}.</p>
            </div>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setView('settings')}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer relative overflow-hidden"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: 'var(--color-brand)', borderColor: 'var(--color-bg-primary)' }}></div>
              </div>
              <button 
                onClick={() => handleExportCSV()}
                className="px-5 py-2 text-sm font-bold rounded-full transition-all shadow-md"
                style={{ background: 'var(--color-brand)', color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand)'}
              >
                Export Data
              </button>
            </div>
          </header>

          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {view === 'dashboard' && (
              <div className="space-y-8 pb-12">
                {/* KPI Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'Gross Revenue', 
                      value: formatCurrency(totalRevenue), 
                      sub: 'Aggregate Fiscal Velocity', 
                      icon: <TrendingUp className="w-5 h-5" />,
                      trend: momRev.pct,
                      color: momRev.up ? 'text-emerald-500' : 'text-rose-500',
                      bg: momRev.up ? 'bg-emerald-500/10' : 'bg-rose-500/10',
                      barWidth: Math.min(totalRevenue/(totalRevenue+totalExpenses||1)*100,100).toFixed(0)+'%'
                    },
                    { 
                      label: 'Total Expenses', 
                      value: formatCurrency(totalExpenses), 
                      sub: 'Operational Burn (MTD)', 
                      icon: <Minus className="w-5 h-5" />,
                      trend: momExp.pct,
                      color: momExp.up ? 'text-rose-500' : 'text-emerald-500', 
                      bg: momExp.up ? 'bg-rose-500/10' : 'bg-emerald-500/10',
                      barWidth: Math.min(totalExpenses/(totalRevenue+totalExpenses||1)*100,100).toFixed(0)+'%'
                    },
                    { 
                      label: 'Net Profit', 
                      value: formatCurrency(netProfit), 
                      sub: 'Post-Tax Net Yield', 
                      icon: <ShieldCheck className="w-5 h-5" />,
                      trend: profitMargin + ' margin',
                      color: netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500',
                      bg: netProfit >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
                      barWidth: Math.min(Math.max(netProfit / Math.max(totalRevenue, 1) * 100, 0), 100).toFixed(0) + '%',
                      barColor: netProfit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    },
                    { 
                      label: 'Runway', 
                      value: runwayFixed.toFixed(1) + ' months', 
                      sub: 'Projected Liquidity Window', 
                      icon: <TrendingUp className="w-5 h-5" />,
                      trend: runwayStatus.label,
                      className: runwayStatus.color,
                      color: runwayStatus.color,
                      bg: runwayStatus.color.replace('text-', 'bg-') + '/10',
                      barWidth: Math.min(runwayFixed / 24 * 100, 100).toFixed(0) + '%',
                      barColor: runwayStatus.label === 'Healthy' ? 'bg-emerald-500' : runwayStatus.label === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                    },
                  ].map((stat: any, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-6 rounded-3xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-sm'} group hover:border-[#C28E4A]/50 transition-all`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} text-[#C28E4A]`}>
                          {stat.icon}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color} border border-current/10 uppercase tracking-widest`}>
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold tracking-tight mb-1">
                        <AnimatedCounter value={stat.value} />
                      </h3>
                      <p className="text-[10px] text-gray-500 font-medium mb-4">{stat.sub}</p>
                      <div className="w-full h-1 bg-gray-500/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: stat.barWidth }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className={`h-full ${stat.barColor || 'bg-[#C28E4A]'}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Primary Visualization Suite */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Revenue vs Expenses vs Profit */}
                  <div className={`xl:col-span-2 p-8 rounded-[2.5rem] ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl'} border flex flex-col min-h-[450px]`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <div className="w-2 h-2 rounded-full bg-[#C28E4A] shadow-[0_0_8px_#C28E4A]"></div>
                           <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Institutional Performance Index</h3>
                        </div>
                        <p className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                           Financial Velocity & Yield
                        </p>
                      </div>
                      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {['Daily', 'Weekly', 'Monthly'].map((t) => (
                          <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${t === 'Monthly' ? 'bg-[#C28E4A] text-white shadow-lg shadow-[#C28E4A]/20' : 'text-gray-500 hover:text-white'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={revenueChartData}
                          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                          onClick={() => handleChartDrillDown()}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C28E4A" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#C28E4A" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fill: "#666", fontWeight: 700 }}
                            dy={10}
                          />
                          <YAxis hide />
                          <RechartsTooltip 
                             cursor={{ stroke: isDark ? 'rgba(194,142,74,0.3)' : 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                             formatter={(value: any) => formatCurrency(Number(value))}
                             content={({ active, payload, label }) => {
                               if (active && payload && payload.length) {
                                 return (
                                   <div className={`p-5 rounded-3xl border shadow-2xl ${isDark ? 'bg-black/95 border-[#C28E4A]/30' : 'bg-white border-slate-200'} backdrop-blur-xl`}>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 border-b border-white/5 pb-2">{label} Analytics</p>
                                     <div className="space-y-4">
                                       {payload.map((p: any, idx) => (
                                          <div key={idx} className="flex items-center justify-between gap-8">
                                             <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }}></div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{p.name}</span>
                                             </div>
                                             <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(p.value)}</span>
                                          </div>
                                       ))}
                                     </div>
                                   </div>
                                 );
                               }
                               return null;
                             }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenue"
                            stroke="#C28E4A" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            animationDuration={2000}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="expenses" 
                            name="Expenses"
                            stroke="#ef4444" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorExpenses)" 
                            animationDuration={2500}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="projection" 
                            name="Projection"
                            stroke="#C28E4A" 
                            strokeWidth={2}
                            strokeDasharray="4 4" 
                            fill="transparent"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Operational Distribution (Bar to Doughnut Rebuild) */}
                  <div className={`p-8 rounded-[2.5rem] ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl'} border flex flex-col transition-all hover:border-[#C28E4A]/20`}>
                    <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-8">Segmented Treasury Distribution</h3>
                    <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getExpenseBreakdown().map(e => ({ name: e.name, value: e.value }))}>
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#666'}} />
                             <YAxis hide />
                             <RechartsTooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                formatter={(val: any) => formatCurrency(Number(val))}
                             />
                          <Bar 
                             dataKey="value" 
                             fill="#C28E4A" 
                             radius={[5, 5, 0, 0]} 
                             onClick={(data) => data && handleChartDrillDown(data.name)}
                             className="cursor-pointer"
                          />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Secondary Row: Activity & AI Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Ledger Activity Rebuild */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Real-time Transaction Stream</h3>
                      <button onClick={() => setView('transactions')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {transactions.slice(0, 5).map(t => (
                        <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'0.5px solid var(--border)'}}>
                          <div style={{width:8,height:8,borderRadius:'50%',flexShrink:0,background: t.type==='income' ? 'var(--pos)' : 'var(--neg)'}} />
                          <div style={{flex:1}}>
                            <p style={{fontSize:12,fontWeight:500,color:'var(--text-primary)'}}>{t.merchant}</p>
                            <p style={{fontSize:10,color:'var(--text-muted)'}}>{t.cat} · {t.date}</p>
                          </div>
                          <span style={{fontSize:12,fontWeight:500,color: t.type==='income' ? 'var(--pos)' : 'var(--neg)'}}>
                            {t.type==='income' ? '+' : '-'}{formatCurrency(Math.abs(t.amt))}
                          </span>
                          <span style={{fontSize:9,padding:'2px 5px',borderRadius:3,background: t.status==='Reconciled' ? 'var(--posb)' : t.status==='Pending' ? 'var(--warnb)' : 'var(--negb)', color: t.status==='Reconciled' ? 'var(--pos)' : t.status==='Pending' ? 'var(--warn)' : 'var(--neg)'}}>
                            {t.status}
                          </span>
                        </div>
                      ))}
                      <button onClick={() => setView('transactions')} className="w-full mt-4 text-[10px] font-bold text-[#C28E4A] hover:underline uppercase tracking-widest flex items-center justify-center gap-2">
                        View all →
                      </button>
                    </div>
                  </div>

                  {/* Transaction Histogram Section */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Transaction Intensity</h3>
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Size Density</span>
                    </div>
                    <div className="h-[180px]">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getTransactionHistogram()}>
                             <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#666' }} />
                             <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} formatter={(val: any) => val + ' transactions'} />
                             <Bar 
                                dataKey="count" 
                                fill="#C28E4A" 
                                radius={[5, 5, 0, 0]} 
                                label={{ position: 'top', fontSize: 9, fill: isDark ? '#999' : '#666' }}
                                onClick={() => handleChartDrillDown()}
                                className="cursor-pointer"
                             />
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  {/* NEW CHART: Efficiency Forecast Radar */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Business Health Vector</h3>
                       <button onClick={() => setView('cashflow')} className="text-[10px] font-bold text-[#C28E4A] hover:underline uppercase tracking-widest">
                          View Cash Detail
                       </button>
                    </div>
                    <div className="flex-1 mt-4">
                       <ResponsiveContainer width="100%" height={240}>
                          <BarChart 
                             data={[
                                { name: 'Margin', val: Math.min(100, Math.max(0, (netProfit / (totalRevenue || 1)) * 100)) },
                                { name: 'Burn', val: Math.min(100, (monthlyBurn / (availableCapital || 1)) * 100) },
                                { name: 'Health', val: Math.min(100, (runway / 24) * 100) },
                                { name: 'Sales', val: Math.min(100, (totalRevenue / 100000) * 100) },
                                { name: 'Eff.', val: Math.min(100, (totalRevenue / (totalExpenses || 1)) * 50) },
                             ]}
                             layout="vertical"
                             margin={{ left: -30 }}
                          >
                             <XAxis type="number" hide domain={[0, 100]} />
                             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#666' }} />
                             <RechartsTooltip cursor={false} content={({ active, payload }) => {
                                if (active && payload) return <div className="bg-black/90 p-2 rounded-xl border border-white/10 text-[10px] text-white font-bold">{payload[0].value}%</div>;
                                return null;
                             }} />
                             <Bar 
                                dataKey="val" 
                                radius={[0, 10, 10, 0]} 
                                barSize={12}
                             >
                                {[0,1,2,3,4].map((i) => (
                                   <Cell key={i} fill={['#C28E4A', '#ef4444', '#10b981', '#f59e0b', '#3b82f6'][i]} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-2">
                       <button onClick={() => setView('cashflow')} className="flex-1 py-3 rounded-xl bg-[#C28E4A]/10 border border-[#C28E4A]/20 text-[#C28E4A] text-[9px] font-bold uppercase tracking-widest hover:bg-[#C28E4A]/20 transition-all">
                          View Cash Detail
                       </button>
                       <button onClick={() => setView('reports')} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                          Full Analysis
                       </button>
                    </div>
                    <div className="mt-4 p-4 rounded-2xl bg-[#C28E4A]/5 border border-[#C28E4A]/10">
                       <p className="text-[10px] font-bold text-[#C28E4A] uppercase tracking-widest mb-1 flex items-center gap-2">
                          <Bot className="w-3 h-3" /> System Intelligence
                       </p>
                       <p className="text-[10px] text-gray-500 leading-relaxed">
                          Your business efficiency is in the 84th percentile. Recommend shifting 5% of Marketing spend to R&D to boost Product Velocity.
                       </p>
                    </div>
                  </div>

                  {/* AI Treasury Monitor */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">AI Treasury Monitor</h3>
                       <div className="flex items-center gap-1 text-[#C28E4A] bg-[#C28E4A]/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                          <ShieldCheck className="w-2 h-2 shadow-[0_0_8px_#C28E4A]" /> Live
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="p-4 rounded-2xl bg-[#C28E4A]/5 border border-[#C28E4A]/10">
                          <p className="text-[10px] font-bold text-[#C28E4A] uppercase tracking-widest mb-1 flex items-center gap-2">
                             <Zap className="w-3 h-3" /> Monthly Burn
                          </p>
                          <div className="flex items-end gap-2 mt-2">
                             <span className="text-2xl font-bold">{formatCurrency(monthlyBurn)}</span>
                             <span className="text-[10px] text-gray-500 mb-1 font-medium italic">3-month avg</span>
                          </div>
                       </div>

                       <div className="p-4 rounded-2xl bg-[#C28E4A]/5 border border-[#C28E4A]/10">
                          <p className="text-[10px] font-bold text-[#C28E4A] uppercase tracking-widest mb-1 flex items-center gap-2">
                             <ShieldCheck className="w-3 h-3" /> Cash Runway
                          </p>
                          <div className="flex items-end gap-2 mt-2">
                             <span className="text-2xl font-bold">{runway.toFixed(1)} months</span>
                             <span className={`text-[10px] mb-1 font-bold ${runwayStatus.color}`}>{runwayStatus.label}</span>
                          </div>
                       </div>

                       <div className="p-4 rounded-2xl bg-[#C28E4A]/5 border border-[#C28E4A]/10">
                          <p className="text-[10px] font-bold text-[#C28E4A] uppercase tracking-widest mb-1 flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Next Funding Need
                          </p>
                          <div className="flex items-end gap-2 mt-2">
                             <span className="text-lg font-bold">{new Date(Date.now() + (runway * 30 * 24 * 60 * 60 * 1000)).toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                             <span className="text-[10px] text-gray-500 mb-1 font-medium italic">Projected at current burn</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* AI Intelligence Rebuild */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-8">AI Intelligence Feed</h3>
                    <div className="space-y-4">
                       {lastReportSummary && (
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group hover:bg-emerald-500/10 transition-all cursor-pointer" onClick={() => setView('reports')}>
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-emerald-500">
                                   <PieChart className="w-3.5 h-3.5" />
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Latest Report Summary</span>
                                </div>
                                <span className="text-[9px] text-gray-500 font-bold uppercase">{fmtDate(lastReportSummary.generatedAt.toISOString())}</span>
                             </div>
                             <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                                Report synthesized for {lastReportSummary.dateRange}. Net Profit was {formatCurrency(lastReportSummary.netProfit)} with {lastReportSummary.topCategory} as primary outflow.
                             </p>
                             <button className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                View Full Report <ArrowRight className="w-2.5 h-2.5" />
                             </button>
                          </div>
                       )}
                       {[
                         { 
                           title: runwayStatus.label === 'Critical' ? 'Cash runway critical' : runwayStatus.label === 'Warning' ? 'Runway below 6 months' : 'Cash position healthy', 
                           val: runwayStatus.label, 
                           desc: `Current runway: ${runwayFixed.toFixed(1)} months at ${formatCurrency(monthlyBurn)}/mo burn rate.`, 
                           icon: <ShieldCheck className="w-4 h-4" />, 
                           action: () => setView('cashflow'),
                           color: runway < 3 ? 'text-rose-500' : runway < 6 ? 'text-amber-500' : 'text-emerald-500',
                           bg: runway < 3 ? 'bg-rose-500/10' : runway < 6 ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                         },
                         { 
                           title: overdueInvoices.length > 0 ? overdueInvoices.length+' invoice'+(overdueInvoices.length>1?'s':'')+' overdue' : 'All invoices current', 
                           val: overdueInvoices.length > 0 ? 'Urgent' : 'Healthy', 
                           desc: overdueInvoices.length > 0 ? 'Total outstanding: '+formatCurrency(overdueInvoices.reduce((s,i)=>s+i.amt,0))+'. Oldest client: '+overdueInvoices.sort((a,b)=>new Date(a.dueDate).getTime()-new Date(b.dueDate).getTime())[0]?.client : 'No overdue receivables.', 
                           icon: <AlertCircle className="w-4 h-4" />, 
                           action: () => setView('invoices'),
                           color: overdueInvoices.length > 0 ? 'text-rose-500' : 'text-emerald-500',
                           bg: overdueInvoices.length > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'
                         },
                          { 
                            title: momExp.up ? `Expenses up ${momExp.pct} this month` : `Expenses down ${momExp.pct} this month`, 
                            val: 'Spend Alert', 
                            desc: `Top category: ${getExpenseBreakdown().sort((a, b) => b.value - a.value)[0]?.name || 'N/A'} at ${formatCurrency(getExpenseBreakdown().sort((a, b) => b.value - a.value)[0]?.value || 0)}`, 
                            icon: <Zap className="w-4 h-4" />,
                            action: () => setView('transactions'),
                            color: 'text-[#C28E4A]',
                            bg: 'bg-[#C28E4A]/10'
                          },
                       ].map((insight, i) => (
                         <div 
                            key={i} 
                            onClick={() => insight.action && insight.action()}
                            className={`p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] group transition-all ${insight.action ? 'cursor-pointer' : ''}`}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <div className={`flex items-center gap-2 ${insight.color || 'text-[#C28E4A]'}`}>
                                  {insight.icon}
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{insight.title}</span>
                               </div>
                               <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${insight.bg || 'bg-[#C28E4A]/10'} ${insight.color || 'text-[#C28E4A]'}`}>{insight.val}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-[10px] text-gray-500 leading-relaxed">{insight.desc}</p>
                              {insight.action && <ArrowRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                         </div>
                       ))}
                    </div>
                    <button 
                       onClick={() => {
                          setView('reports');
                          setIsGeneratingReport(true);
                          setTimeout(() => {
                             setIsGeneratingReport(false);
                             setLastReportSummary({
                                generatedAt: new Date(),
                                dateRange: reportConfig.dateRange,
                                netProfit: reportNetProfit,
                                totalRevenue: reportTotalRevenue,
                                topCategory: getExpenseBreakdown(reportFilteredTransactions)[0]?.name || 'Unknown'
                             });
                          }, 2000);
                       }}
                       className="w-full mt-6 py-4 rounded-2xl bg-[#C28E4A] hover:bg-[#855F2E] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#C28E4A]/20"
                    >
                       Run Audit Synthesis
                    </button>
                  </div>
                </div>

                {/* Third Row: Budgets and Currencies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Budget vs Actual Tracker */}
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-8">Budget vs Actual (MTD)</h3>
                    <div className="space-y-6">
                      {Object.entries(budgets).map(([cat, budgetAmt]) => {
                         const actualAmt = transactions.filter(t => t.cat === cat && t.type === 'expense').reduce((s, t) => s + Math.abs(t.amt), 0);
                         const progress = Math.min(100, (actualAmt / (budgetAmt || 1)) * 100);
                         const overage = actualAmt > budgetAmt;
                         return (
                           <div key={cat} className="space-y-2">
                             <div className="flex justify-between items-center text-xs">
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat}</span>
                                <span className="font-medium text-gray-500">{formatCurrency(actualAmt)} / {formatCurrency(budgetAmt)}</span>
                             </div>
                             <div className="w-full h-1.5 bg-gray-500/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${overage ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}></div>
                             </div>
                           </div>
                         );
                      })}
                    </div>
                  </div>

                  {/* Foreign Currency Exposure */}
                  <div className={`p-8 rounded-[2.5rem] border flex flex-col ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-8">Foreign Currency Exposure</h3>
                    <div className="space-y-4 flex-1">
                       {(() => {
                           const exposures: Record<string, number> = {};
                           // Mock some exposure data
                           exposures['EUR'] = 4500.50;
                           exposures['GBP'] = 2100.00;
                           transactions.forEach(t => {
                              if (t.originalCurrency && t.originalCurrency !== 'USD') {
                                 exposures[t.originalCurrency] = (exposures[t.originalCurrency] || 0) + (t.originalAmount || 0);
                              }
                           });
                           if (Object.keys(exposures).length === 0) {
                              return <p className="text-xs text-gray-500 italic">No foreign currency transactions found.</p>;
                           }
                           return Object.entries(exposures).map(([currency, amt]) => (
                               <div key={currency} className={`flex justify-between items-center p-6 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-[#C28E4A]/10 text-[#C28E4A] flex items-center justify-center text-xs font-bold">
                                         {currency}
                                     </div>
                                     <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Exposure</span>
                                  </div>
                                  <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
                               </div>
                           ));
                       })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'reports' && (
              <div id="institutional-report-view" className="space-y-8 max-w-7xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* PANEL 1 — Report header and controls */}
                <div className={`p-8 rounded-[2.5rem] border flex flex-col lg:flex-row lg:items-center justify-between gap-8 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#C28E4A] flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#C28E4A]">Welcome Back, {user.name.split(' ')[0]}</p>
                        <p className="text-xs text-neutral-500 font-medium">Operating as {profileData.company}</p>
                      </div>
                    </div>
                    <h2 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-slate-950'}`}>AI Financial Reporting</h2>
                    <p className="text-sm text-neutral-500 font-medium">Analytic Period: {reportConfig.startDate} — {reportConfig.endDate}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A]">Timeframe</label>
                      <select 
                        value={reportConfig.dateRange}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border outline-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="This Month">This Month</option>
                        <option value="This Quarter">This Quarter</option>
                        <option value="This Year">This Year</option>
                        <option value="Custom Range">Custom Range</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A]">Start</label>
                      <input 
                        type="date" 
                        value={reportConfig.startDate}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, startDate: e.target.value, dateRange: 'Custom Range' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A]">End</label>
                      <input 
                        type="date" 
                        value={reportConfig.endDate}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, endDate: e.target.value, dateRange: 'Custom Range' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>

                    <button 
                      onClick={generateAIInsights}
                      disabled={isGeneratingReport}
                      className={`mt-auto px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${
                        isGeneratingReport 
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-[#C28E4A] text-white hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate
                    </button>
                  </div>
                </div>

                {/* PANEL 2 — KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', val: reportTotalRevenue, mom: momRev, color: 'text-emerald-500' },
                    { label: 'Total Expenses', val: reportTotalExpenses, mom: momExp, color: 'text-rose-500' },
                    { label: 'Net Profit', val: reportNetProfit, mom: { pct: profitMargin, up: reportNetProfit > 0 }, color: 'text-[#C28E4A]' },
                    { label: 'Audit Score', val: auditScore, isScore: true, mom: { pct: 'Real-time', up: true }, color: 'text-indigo-500' }
                  ].map((kpi, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border relative overflow-hidden ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{kpi.label}</p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <h4 className={`text-4xl font-serif italic ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {kpi.isScore ? kpi.val : formatCurrency(kpi.val)}
                        </h4>
                        <span className={`text-[10px] font-bold ${kpi.mom.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {kpi.mom.pct}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: kpi.isScore ? `${kpi.val}%` : '65%' }}
                             className={`h-full ${kpi.color.replace('text-', 'bg-')}`}
                           />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PANEL 3 — P&L Table & Expense Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Profit & Loss Summary</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Total Revenue', val: reportTotalRevenue, type: 'primary' },
                        { label: 'Cost of Revenue', val: costOfRevenue, type: 'sub' },
                        { label: 'Gross Margin', val: grossMargin, type: 'total', pct: grossMarginPct },
                        { label: 'Operating Expenses', val: reportTotalExpenses - costOfRevenue, type: 'primary' },
                        { label: 'Operating Income / EBITDA', val: reportNetProfit, type: 'final', pct: (reportNetProfit / (reportTotalRevenue || 1)) * 100 }
                      ].map((row, i) => (
                        <div key={i} className={`flex justify-between items-center py-3 ${row.type === 'total' || row.type === 'final' ? 'border-t border-neutral-100 dark:border-white/5 mt-4 pt-6' : ''}`}>
                          <div className="flex flex-col">
                            <span className={`text-xs uppercase font-black tracking-widest ${row.type === 'final' ? 'text-[#C28E4A]' : 'text-neutral-500'}`}>
                              {row.label}
                            </span>
                            {row.pct !== undefined && (
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                Margin: {row.pct.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <span className={`text-lg font-bold ${row.type === 'final' ? 'text-2xl font-serif italic' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatCurrency(row.val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-8">
                       <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Financial Bridge (Waterfall)</h3>
                       <button className="text-[10px] font-bold text-[#C28E4A] uppercase tracking-widest hover:underline">Strategic Drift Analysis</button>
                    </div>
                    <div className="h-[340px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 10, fontWeight: 800, fill: '#888' }} 
                          />
                          <YAxis hide />
                          <RechartsTooltip 
                             cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                             content={({ active, payload }) => {
                               if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="p-4 rounded-2xl border shadow-2xl backdrop-blur-xl" style={{ background: isDark ? '#111' : '#fff', borderColor: 'var(--color-border)' }}>
                                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{data.name}</p>
                                       <p className={`text-lg font-bold ${data.value >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                          {formatCurrency(data.value)}
                                       </p>
                                    </div>
                                  );
                               }
                               return null;
                             }}
                          />
                          <Bar dataKey="base" stackId="a" fill="transparent" />
                          <Bar 
                             dataKey="top" 
                             stackId="a" 
                             radius={[8, 8, 8, 8]}
                             onClick={(data) => {
                               if (data && data.name) handleChartDrillDown(data.name === 'OpEx' ? undefined : data.name);
                             }}
                             className="cursor-pointer"
                          >
                            {waterfallData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* PANEL 4 — Revenue Trend & AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className={`lg:col-span-2 p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Revenue Performance & Forecast</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#C28E4A]"></div><span className="text-[10px] font-bold uppercase text-neutral-500">Actual</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neutral-300"></div><span className="text-[10px] font-bold uppercase text-neutral-500">Forecast</span></div>
                      </div>
                    </div>
                    <div className="h-[340px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData}>
                          <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C28E4A" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#C28E4A" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888', fontWeight: 700}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888', fontWeight: 700}} tickFormatter={(val) => `$${val/1000}k`} />
                          <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#111', color: '#fff' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#C28E4A" strokeWidth={4} fillOpacity={1} fill="url(#revGrad)" />
                          <Area type="monotone" dataKey="projection" stroke="#888" strokeWidth={2} fill="transparent" strokeDasharray="6 6" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-[#C28E4A]" />
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Synthesis</h3>
                       </div>
                       <button 
                         onClick={handleGeminiNarrative}
                         disabled={isGeneratingReport}
                         className="text-[10px] font-bold text-[#C28E4A] hover:underline uppercase tracking-widest flex items-center gap-2"
                       >
                         {isGeneratingReport ? 'Synthesizing...' : 'Re-generate Memo'} <RefreshCw className={`w-3 h-3 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                       </button>
                    </div>
                    {reportNarrative ? (
                      <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : 'prose-neutral'} opacity-90`}>
                        <div className="bg-[#C28E4A]/5 p-8 rounded-3xl border border-[#C28E4A]/10">
                           <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#C28E4A]/10">
                              <div className="w-12 h-12 rounded-2xl bg-[#C28E4A] flex items-center justify-center text-white shadow-lg">
                                 <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-[#C28E4A]">Lumina AI Financial Intelligence</p>
                                 <h4 className="text-lg font-bold">CFO Strategic Memorandum</h4>
                              </div>
                           </div>
                           <div className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                              {reportNarrative}
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#C28E4A]/10 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-[#C28E4A]" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Run a full audit to generate your CFO Strategic Memorandum.</p>
                        <button 
                          onClick={handleGeminiNarrative}
                          className="px-6 py-2.5 rounded-xl bg-[#C28E4A] text-white text-[10px] font-bold uppercase tracking-widest"
                        >
                          Generate Narrative
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-8">
                       <Sparkles className="w-5 h-5 text-[#C28E4A]" />
                       <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Strategic Recommendations</h3>
                    </div>
                    <div className="space-y-6">
                      {aiInsights.map((insight, i) => (
                        <div key={i} className={`p-6 rounded-3xl border border-dashed ${isDark ? 'border-white/10 hover:border-[#C28E4A]/30' : 'border-slate-200 hover:border-[#C28E4A]/30'} transition-all group`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              insight.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                              insight.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>{insight.priority} Priority</span>
                          </div>
                          <h4 className={`text-sm font-bold mb-2 group-hover:text-[#C28E4A] transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{insight.title}</h4>
                          <p className="text-xs text-neutral-500 leading-relaxed font-medium mb-3">{insight.impact}</p>
                          <div className="pt-3 border-t border-dashed border-white/5 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#C28E4A]" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended Action:</span>
                             <span className="text-[10px] font-bold text-[#C28E4A]">{insight.action}</span>
                          </div>
                        </div>
                      ))}
                      {aiInsights.length === 0 && <p className="text-xs text-neutral-500 italic py-12 text-center">Hit 'Generate' to synthesize strategic insights.</p>}
                    </div>
                  </div>
                </div>

                {/* PANEL 5 — Accounts Receivable Aging */}
                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className={`text-xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Arrears & Aging Analysis</h3>
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 w-full space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                          <span>Aging Bucket Dynamics</span>
                          <span>Total: {formatCurrency(totalAging)}</span>
                       </div>
                       <div className="h-4 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500" style={{ width: `${(aging.current / totalAging) * 100}%` }}></div>
                          <div className="h-full bg-amber-500" style={{ width: `${(aging.late31 / totalAging) * 100}%` }}></div>
                          <div className="h-full bg-rose-500" style={{ width: `${(aging.critical / totalAging) * 100}%` }}></div>
                       </div>
                       <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="space-y-1">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-neutral-400">Current</span></div>
                             <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(aging.current)}</p>
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div><span className="text-[10px] font-bold text-neutral-400">31-60 Days</span></div>
                             <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(aging.late31)}</p>
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div><span className="text-[10px] font-bold text-neutral-400">61+ Critical</span></div>
                             <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(aging.critical)}</p>
                          </div>
                       </div>
                    </div>
                    <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'} min-w-[280px]`}>
                       <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-2">Collection Efficacy</span>
                       <div className="flex items-baseline gap-2 mb-4">
                          <h4 className={`text-3xl font-serif italic ${isDark ? 'text-white' : 'text-slate-950'}`}>
                            {collectionEfficacy.toFixed(1)}%
                          </h4>
                          <span className={`text-[10px] font-bold ${collectionEfficacy > 80 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {collectionEfficacy > 80 ? '+2.1%' : '-1.4%'}
                          </span>
                       </div>
                       <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                         {collectionEfficacy > 80 ? 'Your average collection cycle is currently trending positive.' : 'Focus on reducing overdue accounts to improve liquidity.'}
                       </p>
                    </div>
                  </div>
                </div>

                {/* PANEL 6 — Forecasting */}
                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Forward Projections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: 'Projected EBITDA', value: reportNetProfit * 1.15, icon: <TrendingUp className="w-4 h-4" /> },
                      { label: 'Next Quarter Rev', value: reportTotalRevenue * 1.25, icon: <Zap className="w-4 h-4" /> },
                      { label: 'Monthly Burn Rate', value: monthlyBurn, icon: <Flame className="w-4 h-4" /> },
                      { label: 'Days Sales Outstanding', value: dso, icon: <Clock className="w-4 h-4" />, isCustom: true }
                    ].map((proj, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex items-center gap-2 text-neutral-500">
                            {proj.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{proj.label}</span>
                         </div>
                         <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} ${proj.isCustom ? dsoColor : ''}`}>
                            {proj.isCustom ? `${proj.value} Days` : formatCurrency(proj.value)}
                         </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PANEL 7 — Export Options */}
                <div className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-8 ${isDark ? 'bg-[#C28E4A] border-[#C28E4A] text-white shadow-2xl shadow-[#C28E4A]/20' : 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-950/40'}`}>
                   <div>
                      <h4 className="text-2xl font-serif italic">Finalize Reporting Protocol</h4>
                      <p className="text-sm text-white/60 font-medium">Download encrypted financial summaries for institutional sharing.</p>
                   </div>
                   <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleExportCSV}
                        className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-3"
                      >
                         <Database className="w-4 h-4" />
                         CSV Ledger
                      </button>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('institutional-report-view');
                          if (el) {
                            toPng(el, { cacheBust: true, backgroundColor: isDark ? '#000' : '#fff' }).then(dataUrl => {
                               const elWidth = el.offsetWidth || 1;
                               const elHeight = el.offsetHeight || 1;
                               const imgWidth = 210;
                               const imgHeight = (elHeight * imgWidth) / elWidth;
                               
                               // Create PDF with custom height if it exceeds A4 to avoid clipping or use A4 and scale
                               // For institutional reports, a single long page is often preferred for digital view,
                               // or standard A4 if it's for print. Let's use A4 but scale correctly.
                               const pdf = new jsPDF({
                                 orientation: 'p',
                                 unit: 'mm',
                                 format: imgHeight > 297 ? [210, imgHeight] : 'a4'
                               });
                               
                               pdf.addImage(dataUrl, 'PNG', 0, 0, 210, imgHeight);
                               pdf.save(`AI_Financial_Report_${reportConfig.startDate}.pdf`);
                               setToast('Institutional PDF Exported');
                            }).catch(err => {
                               console.error('PDF Export Error:', err);
                               setToast('Export Failed: Viewport too small');
                            });
                          }
                        }}
                        className="px-6 py-4 rounded-2xl bg-white text-black hover:bg-neutral-100 transition-all text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-3"
                      >
                         <Download className="w-4 h-4" />
                         Full PDF Report
                      </button>
                      <button 
                        onClick={handleGeminiNarrative}
                        disabled={isGeneratingReport}
                        className="px-6 py-4 rounded-2xl bg-black text-white hover:bg-black/80 transition-all text-xs font-black uppercase tracking-[0.2em] inline-flex items-center gap-3 border border-white/10"
                      >
                         {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                         Narrative Analysis
                      </button>
                   </div>
                </div>

                {/* AI Narrative Modal / Section */}
                {reportNarrative && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-10 rounded-[3rem] border ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}
                  >
                    <div className="flex items-center justify-between mb-8">
                       <h3 className={`text-2xl font-serif italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Summary Memo</h3>
                       <button onClick={() => setReportNarrative(null)} className="p-3 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                       <div className={`whitespace-pre-wrap leading-relaxed text-lg font-medium ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                          {reportNarrative}
                       </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {view === 'transactions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold font-serif italic" style={{ color: 'var(--color-text-primary)' }}>General Ledger</h2>
                   <button 
                    onClick={() => setShowAddTransaction(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ background: 'var(--color-brand)', color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand)'}
                   >
                     <Plus className="w-4 h-4" />
                     New Transaction
                   </button>
                </div>

                <div 
                  className="p-6 rounded-3xl border flex flex-wrap gap-6 items-end shadow-sm"
                  style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                >
                   <div className="flex-1 min-w-[200px] space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Category</label>
                      <select 
                         value={filterCategory}
                         onChange={(e) => setFilterCategory(e.target.value)}
                         className="w-full px-4 py-2.5 rounded-xl text-xs font-bold border outline-none transition-colors appearance-none"
                         style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="flex-1 min-w-[200px] space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Status</label>
                      <select 
                         value={filterStatus}
                         onChange={(e) => setFilterStatus(e.target.value)}
                         className="w-full px-4 py-2.5 rounded-xl text-xs font-bold border outline-none transition-colors appearance-none"
                         style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                         {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                   <div className="flex-[2] min-w-[300px] space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Date Range</label>
                      <div className="flex items-center gap-3">
                         <input 
                            type="date"
                            value={filterDateStart}
                            onChange={(e) => setFilterDateStart(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl text-[10px] font-bold border outline-none transition-colors"
                            style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                         />
                         <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                         <input 
                            type="date"
                            value={filterDateEnd}
                            onChange={(e) => setFilterDateEnd(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl text-[10px] font-bold border outline-none transition-colors"
                            style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                        setFilterCategory('All');
                        setFilterStatus('All');
                        setFilterDateStart('');
                        setFilterDateEnd('');
                        setFilterSubscriptions(false);
                     }}
                     className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-dashed transition-colors"
                     style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}
                     onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                     onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                   >
                      Reset
                   </button>
                   <button 
                     onClick={() => setFilterSubscriptions(!filterSubscriptions)}
                     className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors ${filterSubscriptions ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20 shadow-lg' : ''}`}
                     style={!filterSubscriptions ? { borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' } : {}}
                   >
                      {filterSubscriptions ? 'Clear Subs' : 'Subscriptions'}
                   </button>
                </div>

                 {filterSubscriptions && (
                   <div className="p-4 rounded-xl border border-dashed text-sm flex gap-4 items-center font-medium" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-text-tertiary)', color: 'var(--color-text-primary)'}}>
                     <span>Estimated Monthly Subscription Base:</span>
                     <span className="font-bold text-lg">{formatCurrency(
                        transactions.filter(t => t.type === 'expense' && t.recurringInterval && t.recurringInterval !== 'none')
                                    .filter((v,i,a)=>a.findIndex(t2=>(t2.merchant === v.merchant))===i)
                                    .reduce((s,t) => {
                          let amt = Math.abs(t.amt);
                          if(t.recurringInterval === 'quarterly') amt = amt / 3;
                          else if(t.recurringInterval === 'annually') amt = amt / 12;
                          return s + amt;
                        }, 0)
                     )}</span>
                   </div>
                 )}

                <div 
                  className="rounded-3xl border overflow-hidden shadow-sm"
                  style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                >
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                        <th 
                          onClick={() => setSortConfig({ field: 'date', direction: sortConfig.field === 'date' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                          className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors whitespace-nowrap"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                           Date {sortConfig.field === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          onClick={() => setSortConfig({ field: 'merchant', direction: sortConfig.field === 'merchant' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                          className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                           Merchant {sortConfig.field === 'merchant' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Category</th>
                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Status</th>
                        <th 
                          onClick={() => setSortConfig({ field: 'amt', direction: sortConfig.field === 'amt' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}
                          className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-right cursor-pointer transition-colors whitespace-nowrap"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                           Amount {sortConfig.field === 'amt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <p className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>No transactions match the current filters.</p>
                              <button 
                                onClick={() => {
                                  setFilterCategory('All');
                                  setFilterStatus('All');
                                  setFilterDateStart('');
                                  setFilterDateEnd('');
                                }}
                                className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all"
                                style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}
                              >Clear filters</button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((row, i) => (
                          <tr 
                            key={row.id} 
                            onClick={() => setSelectedTransaction(row)}
                            className="group cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
                          >
                            <td className="px-8 py-5 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{fmtDate(row.date)}</td>
                            <td className="px-8 py-5 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{row.merchant}</td>
                            <td className="px-8 py-5">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-tertiary)' }}>{row.cat}</span>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`${
                                 row.status === 'Reconciled' ? 'badge-reconciled' :
                                 row.status === 'Pending' ? 'badge-pending' :
                                 row.status === 'Flagged' ? 'badge-flagged' : 'badge-verified'
                               } px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest`}>
                                 {row.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-right" style={{ color: row.amt >= 0 ? 'var(--color-income)' : 'var(--color-text-primary)' }}>
                              {row.amt >= 0 ? '+' : ''}{formatCurrency(row.amt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'invoices' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Invoice Management</h2>
                   <div className="flex flex-wrap items-center gap-3">
                     <Tooltip text="Batch Client Records">
                       <button 
                         onClick={handleBatchDownload}
                         className="p-2.5 rounded-full border transition-all hover:bg-[var(--color-bg-hover)] flex items-center justify-center"
                         style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}
                       >
                         <Database className="w-3.5 h-3.5" />
                       </button>
                     </Tooltip>
                     <button 
                      onClick={handleExportInvoicesExcel}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                     >
                       <Download className="w-3.5 h-3.5" />
                       Export Excel
                     </button>
                     <button 
                      onClick={handleExportInvoicesPDF}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-2"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                     >
                       <FileText className="w-3.5 h-3.5" />
                       Export PDF
                     </button>
                     <button 
                      onClick={() => setShowCreateInvoice(true)}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                      style={{ background: 'var(--color-brand)', color: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand)'}
                     >Create Invoice</button>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: 'Outstanding', val: formatCurrency(outstandingInvoiceTotal), icon: Clock, className: 'badge-pending' },
                     { label: 'Paid (Mtd)', val: formatCurrency(invoicesPaidMtd), icon: CheckCircle2, className: 'badge-reconciled' },
                     { label: 'Avg Payment Time', val: avgPaymentDays, icon: Activity, className: 'badge-verified' }
                   ].map((s, i) => (
                     <div 
                       key={i} 
                       className="p-6 rounded-3xl border shadow-sm"
                       style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                     >
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 rounded-lg" style={{ background: 'var(--color-bg-primary)' }}>
                              <s.icon className={`w-4 h-4 ${s.className.replace('badge-', 'text-')}`} />
                           </div>
                           <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</span>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{s.val}</p>
                     </div>
                   ))}
                </div>
                <div 
                  className="rounded-3xl border overflow-hidden shadow-sm"
                  style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                >
                  <table className="w-full text-left">
                    <thead className="border-b" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                      <tr>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Client</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Due Date</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Status</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-right" style={{ color: 'var(--color-text-tertiary)' }}>Amount</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-center" style={{ color: 'var(--color-text-tertiary)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                      {invoices.map((inv) => (
                        <tr 
                          key={inv.id} 
                          className="group hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
                        >
                          <td onClick={() => setSelectedInvoice(inv)} className="px-8 py-4 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{inv.client}</td>
                          <td onClick={() => setSelectedInvoice(inv)} className="px-8 py-4 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>{fmtDate(inv.dueDate)}</td>
                          <td onClick={() => setSelectedInvoice(inv)} className="px-8 py-4">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                               inv.status === 'Paid' ? 'badge-reconciled' : 
                               inv.status === 'Overdue' ? 'badge-flagged' : 
                               'badge-pending'
                             }`}>
                               {inv.status}
                             </span>
                          </td>
                          <td onClick={() => setSelectedInvoice(inv)} className="px-8 py-4 text-sm font-bold text-right" style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(inv.amt)}</td>
                          <td className="px-8 py-4 text-center">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDownloadInvoicePDF(inv);
                               }}
                               className="p-2 rounded-xl border border-transparent hover:border-[#C28E4A]/30 hover:bg-[#C28E4A]/5 transition-all group/btn"
                               title="Download PDF"
                             >
                                <Download className="w-4 h-4 text-[#C28E4A]" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {view === 'cashflow' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                      { label: 'This Week Net', val: formatCurrency(getCashFlowData().weeklyNetFlow), sub: 'Flow Velocity', color: getCashFlowData().weeklyNetFlow >= 0 ? 'text-emerald-500' : 'text-rose-500' },
                      { label: 'Next Week Projection', val: formatCurrency(getCashFlowData().projectedNextWeek), sub: 'Model Accuracy 92%', color: getCashFlowData().projectedNextWeek >= 0 ? 'text-[#C28E4A]' : 'text-rose-500' },
                      { label: 'Operating Runway', val: runway.toFixed(1) + 'm', sub: 'Burn Adjusted', color: 'text-[#C28E4A]' },
                      { label: 'Available Liquidity', val: formatCurrency(availableCapital), sub: 'Post-Tax Capital', color: 'text-emerald-500' }
                   ].map((stat, i) => (
                      <div key={i} className={`p-6 rounded-3xl border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200'}`}>
                         <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">{stat.label}</p>
                         <h3 className={`text-xl font-bold ${stat.color}`}>{stat.val}</h3>
                         <p className="text-[9px] text-gray-400 mt-1">{stat.sub}</p>
                      </div>
                   ))}
                </div>

                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Cash Flow Management</h2>
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold border badge-reconciled" style={{ background: 'var(--color-bg-secondary)' }}>
                      <Activity className="w-3 h-3 animate-pulse" />
                      HEALTHY FLOW
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div 
                     className="lg:col-span-2 p-8 rounded-3xl border shadow-sm"
                     style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                   >
                      <div className="flex justify-between items-center mb-8">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Seven Day Inflow Density</h4>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-income)' }}></div>
                              <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Inflow</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-expense)' }}></div>
                              <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Outflow</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getCashFlowData().chartData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                               <XAxis 
                                  dataKey="name" 
                                  axisLine={false} 
                                  tickLine={false}
                                  tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontWeight: 500 }}
                                />
                               <Bar 
                                  dataKey="in" 
                                  fill="var(--chart-bar-income)" 
                                  radius={[4, 4, 0, 0]} 
                                  barSize={24} 
                                  className="transition-all duration-300 cursor-pointer"
                                  style={{ filter: 'drop-shadow(0 0 2px var(--color-income))' }}
                               />
                               <Bar 
                                  dataKey="out" 
                                  fill="var(--chart-bar-expense)" 
                                  radius={[4, 4, 0, 0]} 
                                  barSize={24} 
                                  className="transition-all duration-300 cursor-pointer"
                                  style={{ filter: 'drop-shadow(0 0 2px var(--color-expense))' }}
                               />
                               <RechartsTooltip 
                                  cursor={{ fill: 'var(--color-bg-hover)' }} 
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div 
                                          className="p-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
                                          style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                                        >
                                          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-tertiary)' }}>{label} Volume</p>
                                          <div className="space-y-2">
                                             <div className="flex items-center justify-between gap-8">
                                                <div className="flex items-center gap-2">
                                                   <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-income)' }}></div>
                                                   <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-tertiary)' }}>Inflow</span>
                                                </div>
                                                <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>${(payload[0].value as number).toLocaleString()}</span>
                                             </div>
                                             <div className="flex items-center justify-between gap-8">
                                                <div className="flex items-center gap-2">
                                                   <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-expense)' }}></div>
                                                   <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-tertiary)' }}>Outflow</span>
                                                </div>
                                                <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>${(payload[1].value as number).toLocaleString()}</span>
                                             </div>
                                             <div className="pt-2 mt-2 border-t flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                                                <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-tertiary)' }}>Net</span>
                                                <span className="text-xs font-bold" style={{ color: ((payload[0].value as number) - (payload[1].value as number)) >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                                                   ${((payload[0].value as number) - (payload[1].value as number)).toLocaleString()}
                                                </span>
                                             </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div 
                     className="p-8 rounded-3xl border shadow-sm flex flex-col justify-between"
                     style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                   >
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-brand)' }}>
                              <Target className="w-4 h-4 text-white" />
                           </div>
                           <h4 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Scenario Simulator</h4>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>Model growth variables to predict liquidity constraints.</p>
                        
                        <div className="space-y-4">
                           <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-widest font-bold flex justify-between" style={{ color: 'var(--color-text-tertiary)' }}>
                                 Hire New Engineers
                                 <span style={{ color: 'var(--color-text-primary)' }}>+{scenarioInput.hired}</span>
                              </p>
                              <input 
                                 type="range" 
                                 min="0" max="10" 
                                 value={scenarioInput.hired}
                                 onChange={(e) => setScenarioInput(prev => ({ ...prev, hired: parseInt(e.target.value) }))}
                                 className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                                 style={{ background: 'var(--color-border)' }}
                              />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-widest font-bold flex justify-between" style={{ color: 'var(--color-text-tertiary)' }}>
                                 Add Monthly Revenue
                                 <span style={{ color: 'var(--color-income)' }}>+${scenarioInput.newRevenue.toLocaleString()}</span>
                              </p>
                              <input 
                                 type="range" 
                                 min="0" max="50000" step="1000"
                                 value={scenarioInput.newRevenue}
                                 onChange={(e) => setScenarioInput(prev => ({ ...prev, newRevenue: parseInt(e.target.value) }))}
                                 className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                                 style={{ background: 'var(--color-border)' }}
                              />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[10px] uppercase tracking-widest font-bold flex justify-between" style={{ color: 'var(--color-text-tertiary)' }}>
                                 Avg monthly salary per hire ($)
                                 <span style={{ color: 'var(--color-text-primary)' }}>${scenarioInput.salaryPerHead.toLocaleString()}</span>
                              </p>
                              <input 
                                 type="range" 
                                 min="5000" max="30000" step="1000"
                                 value={scenarioInput.salaryPerHead}
                                 onChange={(e) => setScenarioInput(prev => ({ ...prev, salaryPerHead: parseInt(e.target.value) }))}
                                 className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                                 style={{ background: 'var(--color-border)' }}
                              />
                           </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                         <p className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Projected Offset</p>
                         <div className="flex items-end justify-between mb-6">
                            <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                               {((scenarioInput.newRevenue - (scenarioInput.hired * scenarioInput.salaryPerHead)) >= 0 ? '+' : '')}${(scenarioInput.newRevenue - (scenarioInput.hired * scenarioInput.salaryPerHead)).toLocaleString()}
                            </span>
                            <span className="text-xs font-bold" style={{ color: (scenarioInput.newRevenue - (scenarioInput.hired * scenarioInput.salaryPerHead)) >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}>
                               /mo
                            </span>
                         </div>
                         <button 
                           onClick={() => {
                              setToast('Macro calibration complete: Dashboard updated');
                              setView('dashboard');
                           }}
                           className="w-full py-4 rounded-full bg-[#C28E4A] hover:bg-[#855F2E] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#C28E4A]/20"
                         >
                            Apply Scenario to Dashboard
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div 
                     className="p-8 rounded-3xl border shadow-sm"
                     style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                   >
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6" style={{ color: 'var(--color-text-tertiary)' }}>Predictive Intelligence</h4>
                      <div className="space-y-4">
                        {[
                          { 
                            title: 'Upcoming Invoice Payout', 
                            desc: (() => {
                              const sentInvoices = [...invoices].filter(inv => inv.status === 'Sent');
                              const nearestInvoice = sentInvoices.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
                              return nearestInvoice 
                                ? `${nearestInvoice.client} (${formatCurrency(nearestInvoice.amt)}) due ${fmtDate(nearestInvoice.dueDate)}.`
                                : 'No upcoming invoice payouts detected.';
                            })(),
                            icon: ArrowUpRight, 
                            className: 'badge-reconciled' 
                          },
                          { 
                            title: 'Overdue Receivables Risk', 
                            desc: overdueInvoices.length > 0 
                              ? `${formatCurrency(outstandingInvoiceTotal)} is currently overdue across ${overdueInvoices.length} invoices.`
                              : 'No overdue receivables detected at this time.', 
                            icon: Zap, 
                            className: 'badge-pending' 
                          },
                          { 
                            title: 'Cash Distribution Variance', 
                            desc: `Operating expenses are ${((totalExpenses / totalRevenue || 0) * 100).toFixed(1)}% of gross revenue.`, 
                            icon: ShieldAlert, 
                            className: 'badge-flagged' 
                          }
                        ].map((item, i) => (
                          <div 
                            key={i} 
                            className="p-6 rounded-2xl border group cursor-pointer transition-all hover:bg-[var(--color-bg-hover)]"
                            style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${item.className.replace('badge-', 'bg-').replace('-reconciled', '-income').replace('-pending', '-amber').replace('-flagged', '-expense')}/10`}>
                                   <item.icon className={`w-4 h-4 ${item.className.replace('badge-', 'text-').replace('-reconciled', '-income').replace('-pending', '-amber').replace('-flagged', '-expense')}`} />
                                </div>
                                <div>
                                   <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{item.title}</p>
                                   <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</p>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div 
                     className="p-8 rounded-3xl border shadow-sm flex flex-col justify-center items-center text-center"
                     style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                   >
                      <div className="w-40 h-40 relative flex items-center justify-center">
                         <svg className="w-full h-full -rotate-90">
                           <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--color-border)" strokeWidth="12" />
                            <circle 
                              cx="80" cy="80" r="70" 
                              fill="transparent" 
                              stroke="var(--color-brand)" 
                              strokeWidth="12" 
                              strokeDasharray="439.8" 
                              strokeDashoffset={439.8 * (1 - Math.min(runway/24, 1))} 
                              strokeLinecap="round" 
                              className="transition-all duration-1000"
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>{runway.toFixed(1)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>Months</span>
                         </div>
                      </div>
                      <h4 className="text-lg font-bold mt-8" style={{ color: 'var(--color-text-primary)' }}>Runway Viability</h4>
                      <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>Your current capital vs burn rate suggests a comfortable liquidity window until H2 2025.</p>
                      
                      <div className="mt-8 w-full space-y-4">
                         <div className="p-4 rounded-2xl border badge-reconciled" style={{ background: 'var(--color-bg-primary)' }}>
                            <div className="flex items-center gap-3 mb-2">
                               <TrendingUp className="w-4 h-4 text-[var(--color-income)]" />
                               <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-income)' }}>Forecast Alpha</span>
                            </div>
                            <p className="text-xs leading-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                               AI detects a 12% seasonality uptick in sales for Nov. Net margin projected to expand by 412bps.
                            </p>
                         </div>
                         <div className="p-4 rounded-2xl border badge-pending" style={{ background: 'var(--color-bg-primary)' }}>
                            <div className="flex items-center gap-3 mb-2">
                               <Zap className="w-4 h-4 text-amber-500" />
                               <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Risk Variance</span>
                            </div>
                            <p className="text-xs leading-normal" style={{ color: 'var(--color-text-tertiary)' }}>
                               Infrastructure cost drift (+4.2%) identified in AWS billing patterns. Recommendation: Reserved Instance audit.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}



            
            {view === 'settings' && (
              <div className="max-w-5xl mx-auto space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
                  <div className="flex items-center gap-8">
                     <div className="relative group">
                       <div className={`w-24 h-24 rounded-3xl ${contrastBg} overflow-hidden shadow-2xl shadow-white/10`}>
                          <img 
                             src={user.avatar} 
                             alt="Profile" 
                             className="w-full h-full object-cover"
                             referrerPolicy="no-referrer"
                          />
                       </div>
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity cursor-pointer">
                          <Plus className="w-6 h-6 text-white" />
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setUser(prev => ({ ...prev, avatar: url }));
                              }
                            }}
                          />
                       </div>
                     </div>
                     <div>
                        <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                           {profileData.firstName} {profileData.lastName}
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">{profileData.role} @ {profileData.company}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button 
                        disabled={!isDirty}
                        onClick={() => setProfileData({...savedProfileData})}
                        className={`px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border transition-all ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} ${!isDirty ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 shadow-sm'}`}
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={() => {
                          setUser(prev => ({ ...prev, name: profileData.company || `${profileData.firstName} ${profileData.lastName}` }));
                          setSavedProfileData({...profileData});
                          logAction('updated_profile', 'settings', 'user_profile', 'Saved global configuration updates');
                          setToast('Settings saved');
                          setIsDirty(false);
                        }}
                        className={`px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest ${contrastBg} ${isDark ? 'text-black' : 'text-white'} shadow-xl ${isDark ? 'shadow-white/5' : 'shadow-black/20'} hover:opacity-90 transition-all active:scale-95 relative overflow-hidden`}
                     >
                        {isDirty && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
                        Save Changes
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                   <div className="lg:col-span-1 space-y-2">
                      {['General', 'Financial', 'Security', 'Notifications', 'Audit Log'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveSettingsTab(tab)}
                          className={`w-full text-left px-6 py-4 rounded-2xl flex items-center gap-4 transition-all ${
                            activeSettingsTab === tab 
                              ? (isDark ? `${accentBgAlpha} ${contrastText} border ${accentBorderAlpha} shadow-[0_0_20px_rgba(255,255,255,0.05)]` : 'bg-white text-black border border-slate-100 shadow-xl')
                              : (isDark ? 'text-gray-500 hover:bg-white/5' : 'text-slate-500 hover:bg-white shadow-sm hover:shadow-md' )
                          }`}
                        >
                           {tab === 'General' && <User className="w-4 h-4" />}
                           {tab === 'Financial' && <DollarSign className="w-4 h-4" />}
                           {tab === 'Security' && <Lock className="w-4 h-4" />}
                           {tab === 'Notifications' && <BellRing className="w-4 h-4" />}
                           {tab === 'Audit Log' && <Activity className="w-4 h-4" />}
                           <span className="text-xs font-bold uppercase tracking-widest">{tab}</span>
                        </button>
                      ))}
                   </div>

                   <div className="lg:col-span-3">
                      <AnimatePresence mode="wait">
                        {activeSettingsTab === 'General' && (
                          <motion.div 
                            key="general"
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xl'} space-y-12`}
                          >
                             <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Professional Identity</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black leading-loose">Core account parameters and credentials</p>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Legal First Name</label>
                                   <input 
                                      type="text" 
                                      value={profileData.firstName}
                                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                      className={`w-full px-6 py-5 rounded-[2rem] text-sm font-bold border outline-none transition-all ${isDark ? 'bg-black/50 border-white/5 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-[#C28E4A]'}`}
                                   />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Legal Last Name</label>
                                   <input 
                                      type="text" 
                                      value={profileData.lastName}
                                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                      className={`w-full px-6 py-5 rounded-[2rem] text-sm font-bold border outline-none transition-all ${isDark ? 'bg-black/50 border-white/5 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-[#C28E4A]'}`}
                                   />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">System Identifier (Email)</label>
                                   <div className="relative">
                                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input 
                                         type="email" 
                                         value={profileData.email}
                                         readOnly
                                         className={`w-full pl-16 pr-6 py-5 rounded-[2rem] text-sm font-bold border cursor-not-allowed ${isDark ? 'bg-black/80 border-white/5 text-gray-500' : 'bg-slate-200 border-slate-300 text-slate-500'}`}
                                      />
                                      <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#C28E4A]/10 text-[#C28E4A] text-[9px] font-black uppercase border border-[#C28E4A]/20">Verified</div>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Mobile Access</label>
                                   <div className="relative">
                                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input 
                                         type="text" 
                                         value={profileData.phone}
                                         onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                         className={`w-full pl-16 pr-6 py-5 rounded-[2rem] text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                      />
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Corporate Association</label>
                                   <input 
                                      type="text" 
                                      value={profileData.company}
                                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                                      className={`w-full px-6 py-5 rounded-[2rem] text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                   />
                                </div>
                                <div className="space-y-4">
                                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Strategic Role</label>
                                   <input 
                                      type="text" 
                                      value={profileData.role}
                                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                                      className={`w-full px-6 py-5 rounded-[2rem] text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                   />
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {activeSettingsTab === 'Financial' && (
                          <motion.div 
                            key="financial"
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xl'} space-y-12`}
                          >
                             <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Financial Parameters</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black leading-loose">Default reporting currency & localization</p>
                             </div>

                             <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                   <div className="space-y-4">
                                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Presentation Currency</label>
                                      <select 
                                         value={profileData.currency}
                                         onChange={(e) => setProfileData({...profileData, currency: e.target.value})}
                                         className={`w-full px-6 py-5 rounded-[2rem] text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all appearance-none cursor-pointer ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                      >
                                         <option>USD - US Dollar</option>
                                         <option>EUR - Euro</option>
                                         <option>GBP - British Pound</option>
                                         <option>JPY - Japanese Yen</option>
                                      </select>
                                   </div>
                                   <div className="space-y-4">
                                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] block ml-1">Linguistic Region</label>
                                      <div className="relative">
                                         <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                         <select 
                                            value={profileData.language}
                                            onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                                            className={`w-full pl-16 pr-6 py-5 rounded-[2rem] text-sm font-bold border outline-none focus:${contrastBorder} transition-all appearance-none cursor-pointer ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                         >
                                            <option>English (US)</option>
                                            <option>English (UK)</option>
                                            <option>French (France)</option>
                                            <option>Spanish (Latin America)</option>
                                         </select>
                                      </div>
                                   </div>
                                </div>

                                <div className={`p-8 rounded-[2rem] border overflow-visible flex flex-col gap-6 ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50'}`}>
                                   <div className="flex flex-col gap-6 mt-2 w-full">
                                     <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Settings className="w-4 h-4"/> Budget Configuration</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {Object.entries(budgets).map(([cat, amt]) => (
                                         <div key={cat} className="flex flex-col gap-2 w-full">
                                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{cat}</label>
                                           <div className="relative">
                                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">{currencyCode}</span>
                                             <input 
                                               type="number"
                                               value={amt}
                                               onChange={(e) => setBudgets(b => ({ ...b, [cat]: parseFloat(e.target.value) || 0 }))}
                                               className={`w-full pl-10 pr-2 py-3 rounded-xl text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all appearance-none ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                             />
                                           </div>
                                         </div>
                                       ))}
                                     </div>
                                     
                                     <div className="pt-8 border-t border-white/5">
                                       <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-6"><DollarSign className="w-4 h-4"/> Tax Rates</h4>
                                       <div className="space-y-4">
                                         {taxRates.map((tx, idx) => (
                                           <div key={idx} className="flex gap-4 items-center">
                                             <input 
                                               type="text"
                                               value={tx.name}
                                               onChange={(e) => setTaxRates(taxes => taxes.map((t, i) => i === idx ? { ...t, name: e.target.value } : t))}
                                               className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                             />
                                             <input 
                                               type="number"
                                               value={tx.rate * 100}
                                               onChange={(e) => setTaxRates(taxes => taxes.map((t, i) => i === idx ? { ...t, rate: (parseFloat(e.target.value) || 0) / 100 } : t))}
                                               className={`w-24 px-4 py-3 rounded-xl text-sm font-bold border outline-none focus:border-[#C28E4A] transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                             />
                                             <span className="text-gray-500 font-bold">%</span>
                                             <button onClick={() => setTaxRates(taxes => taxes.filter((_, i) => i !== idx))} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                               <X className="w-5 h-5" />
                                             </button>
                                           </div>
                                         ))}
                                         <button onClick={() => setTaxRates([...taxRates, { name: 'New Tax', rate: 0.1 }])} className="text-xs font-bold text-[#C28E4A] uppercase tracking-widest hover:underline mt-4 block">+ Add Tax Rate</button>
                                       </div>
                                     </div>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {activeSettingsTab === 'Security' && (
                          <motion.div 
                            key="security"
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xl'} space-y-12`}
                          >
                             <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Security Integrity</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black leading-loose">Protocols for digital asset protection</p>
                             </div>

                             <div className="space-y-6">
                                <div className={`p-8 rounded-[2rem] border ${isDark ? 'border-white/5 bg-white/2' : 'border-slate-100 bg-slate-50'} flex items-center justify-between`}>
                                   <div className="flex items-center gap-6">
                                      <div className="w-14 h-14 rounded-2xl bg-[#C28E4A]/10 flex items-center justify-center shadow-inner">
                                         <ShieldCheck className="w-6 h-6 text-[#C28E4A]" />
                                      </div>
                                      <div>
                                         <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>2FA Verification</p>
                                         <p className="text-[11px] text-gray-500 mt-1">Multi-factor push authentication for login</p>
                                      </div>
                                   </div>
                                   <button 
                                      onClick={() => setProfileData({...profileData, twoFactor: !profileData.twoFactor})}
                                      className={`w-16 h-8 rounded-full relative transition-all duration-500 ${profileData.twoFactor ? 'bg-[#C28E4A] shadow-[0_0_15px_rgba(194,142,74,0.4)]' : 'bg-gray-700'}`}
                                   >
                                      <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-spring ${profileData.twoFactor ? 'left-9' : 'left-1.5'}`}></div>
                                   </button>
                                </div>

                                <div className={`p-8 rounded-[2rem] border ${isDark ? 'border-white/5' : 'border-slate-100'} flex flex-col md:flex-row items-center justify-between gap-6`}>
                                   <div className="flex items-center gap-6">
                                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                         <Lock className="w-6 h-6 text-amber-500" />
                                      </div>
                                      <div>
                                         <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Primary Keyphrase</p>
                                         <p className="text-[11px] text-gray-500 mt-1 italic">Entropy: 85 bits • Rotated 92 days ago</p>
                                      </div>
                                   </div>
                                   <button className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>Update Vault</button>
                                </div>
                             </div>
                          </motion.div>
                        )}

                        {activeSettingsTab === 'Notifications' && (
                          <motion.div 
                            key="notifications"
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xl'} space-y-12`}
                          >
                             <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Insight Routing</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black leading-loose">Communication map for AI synthesis</p>
                             </div>

                             <div className="grid grid-cols-1 gap-4">
                                {[
                                  { id: 'email', label: 'Email Synthesis Digest', sub: 'Weekly predictive financial highlights' },
                                  { id: 'push', label: 'Real-time Signal Alerts', sub: 'Instant mobile push for anomalies' },
                                  { id: 'sms', label: 'Critical Burn Warnings', sub: 'Priority SMS for high-risk variances' },
                                  { id: 'reports', label: 'Institutional Audits', sub: 'Full compliance ledger reports monthly' },
                                ].map((item) => (
                                  <div key={item.id} className={`p-8 rounded-[2rem] flex items-center justify-between transition-all group ${isDark ? 'bg-white/[0.02] hover:bg-white/5' : 'bg-slate-50 hover:bg-white hover:shadow-lg hover:z-10'}`}>
                                     <div className="flex flex-col gap-1">
                                        <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                                        <p className="text-[11px] text-gray-500 font-medium">{item.sub}</p>
                                     </div>
                                      <button 
                                         onClick={() => setProfileData({
                                            ...profileData, 
                                            notifications: {
                                               ...profileData.notifications, 
                                               [item.id as keyof typeof profileData.notifications]: !profileData.notifications[item.id as keyof typeof profileData.notifications]
                                            }
                                         })}
                                         className={`w-14 h-7 rounded-full relative transition-all duration-300 ${profileData.notifications[item.id as keyof typeof profileData.notifications] ? (isDark ? 'bg-[#faf9f5]' : 'bg-black') : (isDark ? 'bg-white/10' : 'bg-slate-200')}`}
                                      >
                                         <div className={`absolute top-1.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${profileData.notifications[item.id as keyof typeof profileData.notifications] ? 'left-8.5' : 'left-1.5'}`}></div>
                                      </button>
                                  </div>
                                ))}
                             </div>
                          </motion.div>
                        )}

                        {activeSettingsTab === 'Audit Log' && (
                          <motion.div 
                            key="audit"
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xl'} space-y-10`}
                          >
                             <div>
                                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Institutional Activity</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">History of account access & modifications</p>
                             </div>

                             <div className="space-y-6">
                                {auditLog.length === 0 ? (
                                   <div className="text-center py-20 text-gray-500">
                                      <p className="text-xs uppercase tracking-widest font-black">Memory Buffer Empty</p>
                                      <p className="text-[10px] mt-2">Activity will appear here as you interact with the system.</p>
                                   </div>
                                ) : (
                                   auditLog.map((log) => (
                                      <div key={log.id} className="flex items-center justify-between pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                         <div className="flex items-center gap-5">
                                            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} text-gray-500`}>
                                               {log.action.includes('delete') ? <Trash2 className="w-4 h-4" /> : 
                                                log.action.includes('edit') || log.action.includes('update') ? <Settings className="w-4 h-4" /> : 
                                                log.action.includes('create') || log.action.includes('add') ? <Plus className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            </div>
                                            <div>
                                               <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                  <span className="uppercase">{log.entityType}</span> {log.action}: {log.entityLabel}
                                               </p>
                                               <p className="text-[10px] text-gray-500 mt-1">{log.detail || 'System verified integrity check'}</p>
                                            </div>
                                         </div>
                                         <span className="text-[10px] text-gray-400 font-bold uppercase">{log.timestamp}</span>
                                      </div>
                                   ))
                                )}
                             </div>
                             
                             <button className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-gray-500 hover:bg-white/5 transition-all">Download Full Integrity Log</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>

        {/* AI Chatbot Floating Button & Panel */}
        <div className="fixed bottom-8 right-8 z-[200]">
           <button 
             onClick={() => setChatOpen(!chatOpen)}
             className={`w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500 ${
               chatOpen ? 'bg-red-500 rotate-90' : `${contrastBg} hover:opacity-90 -rotate-0 ${isDark ? 'shadow-white/10' : 'shadow-black/20'}`
             }`}
           >
             {chatOpen ? <X className="w-6 h-6 text-white" /> : <Sparkles className={`w-8 h-8 ${isDark ? 'text-black' : 'text-white'} group-hover:scale-110 transition-transform`} />}
             {!chatOpen && (
               <motion.span 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-black rounded-full"
               ></motion.span>
             )}
           </button>

           <AnimatePresence>
             {chatOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 20, scale: 0.95 }}
                 className={`absolute bottom-20 right-0 w-[400px] h-[600px] ${isDark ? 'bg-[#0A0A0A] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-200 shadow-2xl'} border rounded-[32px] flex flex-col overflow-hidden backdrop-blur-xl`}
               >
                 {/* Chat Header */}
                 <div className={`p-6 border-b border-white/5 ${contrastBg}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Bot className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
                       </div>
                       <div>
                          <h4 className={`${isDark ? 'text-black' : 'text-white'} font-bold text-sm`}>Finance Intelligence</h4>
                          <p className={`${isDark ? 'text-black/60' : 'text-white/60'} text-[10px] uppercase font-bold tracking-widest`}>Active • GPT-Elite-Node</p>
                          <button 
                            onClick={() => {
                               setToast('Configuration persistent: Dashboard recalibrated');
                               setView('dashboard');
                            }}
                            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20"
                          >
                             Apply to Dashboard
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Chat Messages */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                           msg.role === 'user' 
                             ? `${contrastBg} ${isDark ? 'text-black' : 'text-white'} rounded-tr-none` 
                             : (isDark ? 'bg-white/5 text-gray-300' : 'bg-slate-100 text-slate-800') + ' rounded-tl-none shadow-sm'
                         }`}>
                           <Markdown>{msg.content}</Markdown>
                         </div>
                         {msg.role === 'model' && (
                            <div className="flex flex-wrap gap-2 mt-3">
                               {msg.content.toLowerCase().includes('invoice') && (
                                  <button onClick={() => { setView('invoices'); setChatOpen(false); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-[#C28E4A] hover:bg-[#C28E4A]/10 transition-colors">Go to Invoices</button>
                               )}
                               {msg.content.toLowerCase().includes('cash') && (
                                  <button onClick={() => { setView('cashflow'); setChatOpen(false); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 transition-colors">Go to Cash Flow</button>
                               )}
                               {msg.content.toLowerCase().includes('report') && (
                                  <button onClick={() => { setView('reports'); setChatOpen(false); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors">Go to Reports</button>
                               )}
                               {msg.content.toLowerCase().includes('transaction') && (
                                  <button onClick={() => { setView('transactions'); setChatOpen(false); }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 transition-colors">Go to Transactions</button>
                               )}
                            </div>
                         )}
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                         <div className={`p-4 rounded-2xl rounded-tl-none ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex gap-1`}>
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className={`w-1.5 h-1.5 rounded-full ${contrastBg}`}></motion.div>
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className={`w-1.5 h-1.5 rounded-full ${contrastBg}`}></motion.div>
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className={`w-1.5 h-1.5 rounded-full ${contrastBg}`}></motion.div>
                         </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>

                 {/* Chat Input */}
                 <div className="p-6 border-t border-white/5">
                    <div className="relative">
                       <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                         placeholder="Ask CFO Intelligence..."
                         className={`w-full px-5 py-4 rounded-2xl text-xs font-medium border transition-all outline-none ${
                            isDark ? 'bg-white/5 border-white/5 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#C28E4A]'
                         }`}
                       />
                       <button 
                         onClick={handleSendMessage}
                         disabled={isChatLoading || !chatInput.trim()}
                         className="absolute right-3 top-3 p-2 bg-[#C28E4A] text-white rounded-lg hover:bg-[#855F2E] transition-colors disabled:opacity-50"
                       >
                         <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAddTransaction(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`relative w-full max-w-lg ${isDark ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200'} border rounded-[40px] p-10 shadow-2xl overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C28E4A]/20">
                <div className="h-full bg-[#C28E4A] w-1/3 shadow-[0_0_15px_rgba(194,142,74,0.5)]"></div>
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className={`text-2xl font-serif italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Log New Entry</h3>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">Manual Transaction Entry</p>
                </div>
                <button 
                  onClick={() => {
                    setShowAddTransaction(false);
                    setFormError('');
                  }}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-slate-100 text-slate-400'} transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {formError}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Entry Type</label>
                  <div className="flex gap-2">
                    {['income', 'expense'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setNewTransaction(prev => ({ ...prev, type: t }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          newTransaction.type === t 
                            ? (t === 'income' ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 border-red-500 text-white shadow-red-500/20') + ' shadow-lg'
                            : isDark ? 'bg-white/[0.03] border-white/10 text-gray-500 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Merchant / Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Amazon Web Services"
                      value={newTransaction.merchant}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, merchant: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none ${
                          isDark ? 'bg-white/[0.03] border-white/10 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900'
                      }`}
                    />
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Currency</label>
                    <select 
                      value={newTransaction.originalCurrency || currencyCode}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, originalCurrency: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none ${
                          isDark ? 'bg-white/[0.03] border-white/10 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900'
                      }`}
                    >
                      {Object.keys(staticFxRates).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Amount</label>
                    <input 
                      type="number" 
                      placeholder="-450.00"
                      value={newTransaction.originalCurrency !== currencyCode ? newTransaction.originalAmount : newTransaction.amt}
                      onChange={(e) => {
                        if (newTransaction.originalCurrency !== currencyCode) {
                          setNewTransaction(prev => ({ ...prev, originalAmount: e.target.value, amt: '' }));
                        } else {
                          setNewTransaction(prev => ({ ...prev, amt: e.target.value, originalAmount: '' }));
                        }
                      }}
                      className={`w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none ${
                          isDark ? 'bg-white/[0.03] border-white/10 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Category</label>
                    <select 
                      value={newTransaction.cat}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, cat: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none ${
                          isDark ? 'bg-white/[0.03] border-white/10 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900'
                      }`}
                    >
                      <option>Software</option>
                      <option>Infrastructure</option>
                      <option>Hardware</option>
                      <option>Sales</option>
                      <option>Operations</option>
                      <option>Marketing</option>
                      <option>Payroll</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Recurring</label>
                    <select 
                      value={newTransaction.recurringInterval || 'none'}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, recurringInterval: e.target.value as any }))}
                      className={`w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none ${
                          isDark ? 'bg-white/[0.03] border-white/10 text-white focus:border-[#C28E4A]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900'
                      }`}
                    >
                      <option value="none">None</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</label>
                  <div className="flex gap-2">
                    {['Pending', 'Verified', 'Reconciled'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setNewTransaction(prev => ({ ...prev, status: s }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          newTransaction.status === s 
                            ? 'bg-[#C28E4A] border-[#C28E4A] text-white shadow-lg shadow-[#C28E4A]/20' 
                            : isDark ? 'bg-white/[0.03] border-white/10 text-gray-500 hover:bg-white/5' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSaveTransaction}
                    className={`w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                      isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                    }`}
                  >
                    Confirm Ledger Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Transaction Modal */}
        {showEditTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowEditTransaction(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg border rounded-[40px] p-10 shadow-2xl overflow-hidden"
              style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--color-status-pending-bg)' }}>
                <div className="h-full w-1/3" style={{ background: 'var(--color-status-pending)', boxShadow: '0 0 15px var(--color-status-pending)' }}></div>
              </div>

              <div className="flex justify-between items-start mb-8 text-left">
                <div>
                  <h3 className="text-2xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Edit Record</h3>
                  <p className="text-[10px] mt-1 uppercase tracking-widest font-bold font-sans" style={{ color: 'var(--color-text-tertiary)' }}>Modify Historical Entry</p>
                </div>
                <button 
                  onClick={() => {
                    setShowEditTransaction(false);
                    setFormError('');
                  }}
                  className="p-2 rounded-full transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {formError}
                  </motion.div>
                )}

                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Entry Type</label>
                  <div className="flex gap-2">
                    {['income', 'expense'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setEditingTransaction(prev => ({ ...prev, type: t }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          editingTransaction.type === t 
                            ? (t === 'income' ? 'bg-[var(--color-income)] border-[var(--color-income)] text-white shadow-lg' : 'bg-[var(--color-expense)] border-[var(--color-expense)] text-white shadow-lg')
                            : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]'
                        }`}
                        style={{
                          background: editingTransaction.type === t ? (t === 'income' ? 'var(--color-income)' : 'var(--color-expense)') : 'var(--color-bg-secondary)',
                          borderColor: editingTransaction.type === t ? (t === 'income' ? 'var(--color-income)' : 'var(--color-expense)') : 'var(--color-border)'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Merchant / Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Amazon Web Services"
                      value={editingTransaction.merchant}
                      onChange={(e) => setEditingTransaction(prev => ({ ...prev, merchant: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Currency</label>
                    <select 
                      value={editingTransaction.originalCurrency || currencyCode}
                      onChange={(e) => setEditingTransaction(prev => ({ ...prev, originalCurrency: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      {Object.keys(staticFxRates).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Amount</label>
                    <input 
                      type="number" 
                      placeholder="450.00"
                      value={editingTransaction.originalCurrency !== currencyCode ? editingTransaction.originalAmount : editingTransaction.amt}
                      onChange={(e) => {
                        if (editingTransaction.originalCurrency !== currencyCode) {
                          setEditingTransaction(prev => ({ ...prev, originalAmount: e.target.value, amt: '' }));
                        } else {
                          setEditingTransaction(prev => ({ ...prev, amt: e.target.value, originalAmount: '' }));
                        }
                      }}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Category</label>
                    <select 
                      value={editingTransaction.cat}
                      onChange={(e) => setEditingTransaction(prev => ({ ...prev, cat: e.target.value }))}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      <option>Software</option>
                      <option>Infrastructure</option>
                      <option>Hardware</option>
                      <option>Sales</option>
                      <option>Operations</option>
                      <option>Marketing</option>
                      <option>Payroll</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Recurring</label>
                    <select 
                      value={editingTransaction.recurringInterval || 'none'}
                      onChange={(e) => setEditingTransaction(prev => ({ ...prev, recurringInterval: e.target.value as any }))}
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium border transition-all outline-none appearance-none"
                      style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    >
                      <option value="none">None</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Status</label>
                  <div className="flex gap-2">
                    {['Pending', 'Verified', 'Reconciled', 'Flagged'].map(s => (
                      <button 
                        key={s}
                        onClick={() => setEditingTransaction(prev => ({ ...prev, status: s }))}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          editingTransaction.status === s 
                            ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white shadow-lg' 
                            : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]'
                        }`}
                        style={{
                          background: editingTransaction.status === s ? 'var(--color-brand)' : 'var(--color-bg-secondary)',
                          borderColor: editingTransaction.status === s ? 'var(--color-brand)' : 'var(--color-border)'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSaveEditTransaction}
                    className="w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl"
                    style={{ background: 'var(--color-brand)', color: '#fff' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Invoice Modal */}
        {showCreateInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="absolute inset-0" onClick={() => setShowCreateInvoice(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-3xl border rounded-[40px] shadow-2xl overflow-hidden my-auto"
              style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
            >
              {/* Header Accent */}
              <div className="h-2 w-full" style={{ background: 'var(--color-brand)' }}></div>

              <div className="p-8 lg:p-12">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-3xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Professional Invoice</h3>
                    <p className="text-[10px] mt-1 uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Billing ID: {newInvoice.invoiceNumber}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCreateInvoice(false);
                      setFormError('');
                    }}
                    className="p-3 rounded-full transition-all hover:bg-[var(--color-bg-hover)]"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest"
                  >
                    {formError}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Bill To Client</label>
                      <input 
                        type="text" 
                        placeholder="Company Name"
                        value={newInvoice.client}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, client: e.target.value }))}
                        className="w-full px-5 py-4 rounded-2xl text-sm font-bold border transition-all outline-none"
                        style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="billing@client.com"
                        value={newInvoice.clientEmail}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="w-full px-5 py-4 rounded-2xl text-sm border transition-all outline-none"
                        style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Due Date</label>
                      <input 
                        type="date" 
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-5 py-4 rounded-2xl text-sm border transition-all outline-none"
                        style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Initial Status</label>
                      <div className="flex gap-2">
                        {['Draft', 'Sent', 'Partial'].map(s => (
                          <button 
                            key={s}
                            onClick={() => setNewInvoice(prev => ({ ...prev, status: s }))}
                            className={`flex-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                              newInvoice.status === s 
                                ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white shadow-lg' 
                                : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]'
                            }`}
                            style={{ background: newInvoice.status === s ? 'var(--color-brand)' : 'var(--color-bg-secondary)', borderColor: newInvoice.status === s ? 'var(--color-brand)' : 'var(--color-border)' }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Items Section */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Line Items</h4>
                    <button 
                      onClick={addInvoiceItem}
                      className="text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                      style={{ color: 'var(--color-brand)' }}
                    >
                      <Plus className="w-3 h-3" />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newInvoice.items.map((item, idx) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex-1 w-full">
                          <input 
                            type="text" 
                            placeholder="Description of service/product"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm border transition-all outline-none"
                            style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div className="w-24">
                          <input 
                            type="number" 
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl text-sm border text-center outline-none"
                            style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div className="w-32">
                          <input 
                            type="number" 
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => updateInvoiceItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl text-sm border text-right outline-none"
                            style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div className="w-32">
                          <select 
                            value={item.taxRate || 0}
                            onChange={(e) => updateInvoiceItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl text-sm border outline-none appearance-none cursor-pointer"
                            style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                          >
                            <option value={0}>No Tax</option>
                            {taxRates.map(tx => (
                              <option key={tx.name} value={tx.rate}>{tx.name} ({tx.rate * 100}%)</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={() => removeInvoiceItem(item.id)}
                          className="p-3 rounded-xl transition-all hover:bg-[var(--color-expense)]/10"
                          style={{ color: 'var(--color-expense)' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-12 text-left">
                   <div className="flex-1 space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Notes / Payment Terms</label>
                      <textarea 
                        placeholder="e.g. Please remit payment via ACH within 30 days..."
                        rows={4}
                        value={newInvoice.notes}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-5 py-4 rounded-2xl text-xs border transition-all outline-none resize-none"
                        style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      />
                   </div>
                   <div className="w-full md:w-64 space-y-6">
                      <div className="space-y-3 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                         <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                            <span>Subtotal</span>
                            <span>{formatCurrency(newInvoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0))}</span>
                         </div>
                         <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                            <span>Taxes</span>
                            <span>{formatCurrency(newInvoice.items.reduce((sum, i) => sum + (i.quantity * i.price * (i.taxRate || 0)), 0))}</span>
                         </div>
                         <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--color-income)' }}>
                            <span>Credits</span>
                            <span>$0.00</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Total Due</span>
                         <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                           {formatCurrency(newInvoice.items.reduce((sum, i) => sum + (i.quantity * i.price * (1 + (i.taxRate || 0))), 0))}
                         </span>
                      </div>
                      <button 
                        onClick={handleCreateInvoice}
                        className="w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl"
                        style={{ background: 'var(--color-brand)', color: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand)'}
                      >
                        Confirm & Process
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl border rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
              style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: selectedInvoice.status === 'Paid' ? 'var(--color-income)' : (selectedInvoice.status === 'Overdue' ? 'var(--color-expense)' : 'var(--color-brand)') }}></div>

              <div className="flex justify-between items-start mb-8 text-left">
                <div>
                  <h3 className="text-2xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-[10px] mt-1 uppercase tracking-widest font-bold font-display" style={{ color: 'var(--color-text-tertiary)' }}>{selectedInvoice.client}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-full transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-3xl border" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Recipient</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{selectedInvoice.clientEmail}</p>
                   </div>
                   <div className="text-right md:text-left">
                      <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Due Date</p>
                      <p className={`text-sm font-bold ${selectedInvoice.status === 'Overdue' ? 'text-[var(--color-expense)]' : ''}`} style={{ color: selectedInvoice.status === 'Overdue' ? 'var(--color-expense)' : 'var(--color-text-primary)' }}>{fmtDate(selectedInvoice.dueDate)}</p>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Line Items</p>
                   <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                      <table className="w-full text-left">
                        <thead>
                           <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                              <th className="px-6 py-3 text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Description</th>
                              <th className="px-6 py-3 text-[10px] uppercase font-bold text-center" style={{ color: 'var(--color-text-tertiary)' }}>Qty</th>
                              <th className="px-6 py-3 text-[10px] uppercase font-bold text-right" style={{ color: 'var(--color-text-tertiary)' }}>Price</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                           {(selectedInvoice.items || []).map((item: any) => (
                             <tr key={item.id} style={{ borderColor: 'var(--color-border)' }}>
                                <td className="px-6 py-4 text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{item.description}</td>
                                <td className="px-6 py-4 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>{item.quantity}</td>
                                <td className="px-6 py-4 text-xs font-bold text-right" style={{ color: 'var(--color-text-primary)' }}>${item.price.toLocaleString()}</td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>

                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        selectedInvoice.status === 'Paid' ? 'badge-reconciled' : 
                        selectedInvoice.status === 'Overdue' ? 'badge-flagged' : 
                        'badge-pending'
                      }`}>{selectedInvoice.status}</span>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Invoice Total</p>
                      <p className="text-4xl font-bold tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>
                        ${selectedInvoice.amt.toLocaleString()}
                      </p>
                   </div>
                </div>

                <div className="mb-6 bg-[var(--color-bg-secondary)]/50 p-5 rounded-3xl border border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                   <p className="text-[10px] uppercase tracking-widest font-black mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Select PDF Template Style</p>
                   <div className="grid grid-cols-3 gap-3">
                     {(['classic', 'corporate', 'minimal'] as const).map(t => (
                       <button
                         key={t}
                         onClick={() => setInvoiceTemplate(t)}
                         className={`py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest border transition-all ${
                           invoiceTemplate === t 
                             ? 'border-[#C28E4A] bg-[#C28E4A]/10 text-[#C28E4A]' 
                             : 'border-transparent bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-hover)]'
                         }`}
                         style={{ color: invoiceTemplate === t ? '#C28E4A' : 'var(--color-text-tertiary)' }}
                       >
                         {t}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                  <button 
                    onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all text-red-500 border-red-500/20 hover:bg-red-500/10"
                  >
                    Delete Archive
                  </button>
                  <button 
                    onClick={() => {
                        setEditingInvoice({ ...selectedInvoice });
                        setShowEditInvoice(true);
                        setFormError('');
                    }}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
                  >
                    Edit Record
                  </button>
                  <button 
                    onClick={() => {
                      console.log("Reminder sent to " + selectedInvoice.clientEmail);
                      setToast("Reminder sent to " + selectedInvoice.clientEmail);
                    }}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
                  >
                    Send Reminder
                  </button>
                  <button 
                    onClick={() => handleDownloadInvoiceExcel(selectedInvoice)}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all hover:bg-[var(--color-bg-hover)]"
                    style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
                  >
                    Export Data
                  </button>
                  <button 
                    onClick={() => handleDownloadInvoicePDF(selectedInvoice)}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all bg-[#C28E4A] text-white hover:bg-[#A67B3D] shadow-lg shadow-[#C28E4A]/20 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  {selectedInvoice.status !== 'Paid' && (
                    <button 
                      onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'Paid')}
                      className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
                      style={{ background: 'var(--color-brand)', color: '#fff' }}
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

      {/* Edit Invoice Modal */}
      <AnimatePresence>
        {showEditInvoice && editingInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowEditInvoice(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-xl rounded-[2.5rem] border overflow-hidden p-8 ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
              <h2 className="text-xl font-bold font-serif mb-6 italic" style={{ color: 'var(--color-text-primary)' }}>Edit Institutional Invoice</h2>
              {formError && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-xs font-bold text-red-500 text-center">{formError}</p>
                </div>
              )}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Recipient Entity</label>
                    <input 
                      type="text" 
                      value={editingInvoice.client}
                      onChange={(e) => setEditingInvoice({...editingInvoice, client: e.target.value})}
                      placeholder="Organization Name"
                      className="w-full px-6 py-4 rounded-2xl border text-xs font-bold"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Fiscal Contact</label>
                    <input 
                      type="email" 
                      value={editingInvoice.clientEmail}
                      onChange={(e) => setEditingInvoice({...editingInvoice, clientEmail: e.target.value})}
                      placeholder="finance@entity.ai"
                      className="w-full px-6 py-4 rounded-2xl border text-xs font-bold"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Invoice Value (USD)</label>
                    <input 
                      type="number" 
                      value={editingInvoice.amt}
                      onChange={(e) => setEditingInvoice({...editingInvoice, amt: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      className="w-full px-6 py-4 rounded-2xl border text-xs font-bold"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Due Date</label>
                    <input 
                      type="date" 
                      value={editingInvoice.dueDate}
                      onChange={(e) => setEditingInvoice({...editingInvoice, dueDate: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border text-xs font-bold"
                      style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowEditInvoice(false)}
                    className="flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                  >Cancel</button>
                  <button 
                    onClick={handleSaveEditInvoice}
                    className="flex-2 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
                    style={{ background: 'var(--color-brand)', color: '#fff' }}
                  >Update Archive</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedTransaction(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg border rounded-[40px] p-10 shadow-2xl overflow-hidden"
              style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: selectedTransaction.amt >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}></div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>{selectedTransaction.merchant}</h3>
                  <p className="text-[10px] mt-1 uppercase tracking-widest font-bold" style={{ color: 'var(--color-text-tertiary)' }}>{fmtDate(selectedTransaction.date)}</p>
                </div>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 rounded-full transition-colors hover:bg-[var(--color-bg-hover)]"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-6 rounded-3xl border text-center" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Total Amount</p>
                  <p className="text-4xl font-bold tracking-tighter" style={{ color: selectedTransaction.amt >= 0 ? 'var(--color-income)' : 'var(--color-text-primary)' }}>
                    {selectedTransaction.amt.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Category</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{selectedTransaction.cat}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedTransaction.status === 'Flagged' ? 'bg-[var(--color-expense)]' : 'bg-[var(--color-income)]'}`}></div>
                      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{selectedTransaction.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => handleDeleteTransaction(selectedTransaction.id)}
                    className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border"
                    style={{ background: 'var(--color-expense-bg)', color: 'var(--color-expense)', borderColor: 'var(--color-expense-border)' }}
                  >
                    Delete Entry
                  </button>
                  <button 
                    onClick={() => {
                        setEditingTransaction({
                          id: selectedTransaction.id,
                          merchant: selectedTransaction.merchant,
                          cat: selectedTransaction.cat,
                          amt: Math.abs(selectedTransaction.amt).toString(),
                          status: selectedTransaction.status,
                          type: selectedTransaction.type,
                          date: selectedTransaction.date
                        });
                        setShowEditTransaction(true);
                        setSelectedTransaction(null);
                    }}
                    className="flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
                    style={{ background: 'var(--color-brand)', color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-brand-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand)'}
                  >
                    Edit Record
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-[var(--color-brand)] selection:text-white overflow-x-hidden transition-colors duration-500" style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      {!isLogged && <ThreeBackground isDark={isDark} />}
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b backdrop-blur-md" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-primary-transparent)' }}>
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12" style={{ background: 'var(--color-brand)' }}>
              <div className="w-5 h-5 rounded-sm rotate-45 shadow-inner" style={{ background: 'var(--color-bg-primary)' }}></div>
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Finance AI</span>
          </div>
          
          <div className="hidden md:flex gap-10 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            <a href="#services" className="hover:text-[var(--color-text-primary)] transition-colors">Services</a>
            <a href="#workflow" className="hover:text-[var(--color-text-primary)] transition-colors">Workflow</a>
            <a href="#about" className="hover:text-[var(--color-text-primary)] transition-colors">About</a>
            <button onClick={() => setView('pricing')} className="hover:text-[var(--color-text-primary)] transition-colors">Pricing</button>
            <a href="#faq" className="hover:text-[var(--color-text-primary)] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full border transition-all"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              aria-label="Toggle Mobile Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <BarChart3 className="w-5 h-5 rotate-90" />}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-full border transition-all hover:bg-[var(--color-bg-hover)]"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={handleLogin}
              className="px-6 py-2.5 text-sm font-bold rounded-full transition-all active:scale-95 shadow-md"
              style={{ background: 'var(--color-brand)', color: '#fff' }}
            >
              Start for Free
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 border-r z-[70] md:hidden p-8 flex flex-col"
              style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-brand)' }}>
                  <div className="w-4 h-4 rounded-sm rotate-45" style={{ background: 'var(--color-bg-primary)' }}></div>
                </div>
                <span className="text-xl font-bold tracking-tight font-serif italic" style={{ color: 'var(--color-text-primary)' }}>Finance AI</span>
              </div>
              
              <nav className="flex flex-col gap-6 text-left">
                {[
                  { label: 'Services', id: 'services' },
                  { label: 'Workflow', id: 'workflow' },
                  { label: 'About', id: 'about' },
                  { label: 'Pricing', onClick: () => setView('pricing') },
                  { label: 'FAQ', id: 'faq' }
                ].map((link) => (
                  <button 
                    key={link.label}
                    onClick={() => {
                      setMenuOpen(false);
                      if (link.onClick) link.onClick();
                      else if (link.id) document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-2xl font-serif italic transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto">
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogin();
                  }}
                  className="w-full py-4 font-bold rounded-2xl shadow-xl"
                  style={{ background: 'var(--color-brand)', color: '#fff' }}
                >
                  Start Now
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="pt-32">
        {view === 'pricing' ? (
          <section id="pricing" className="py-20 px-6 lg:px-12 min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-[1400px] mx-auto w-full">
              <div className="flex justify-center mb-12">
                <button 
                  onClick={() => setView('landing')}
                  className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Landing
                </button>
              </div>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-serif italic mb-8" style={{ color: 'var(--color-text-primary)' }}>Scale with clarity.</h2>
                <p className="max-w-xl mx-auto text-lg font-light" style={{ color: 'var(--color-text-secondary)' }}>Pricing architecture built for sustainable institutional growth.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {PRICING_TIERS.map((tier, i) => (
                  <PricingTier key={i} tier={tier} isDark={isDark} handleLogin={handleLogin} />
                ))}
              </div>
            </div>
          </section>
        ) : view === 'privacy' || view === 'terms' ? (
          <section className="py-20 px-6 lg:px-12 min-h-[70vh]">
            <div className="max-w-3xl mx-auto">
              <button 
                onClick={() => setView('landing')}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all mb-12"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Landing
              </button>
              <div className="markdown-body text-left prose prose-invert max-w-none">
                <Markdown>{view === 'privacy' ? PRIVACY_POLICY : TERMS_OF_SERVICE}</Markdown>
              </div>
            </div>
          </section>
        ) : view === 'blog' ? (
          <section className="py-20 px-6 lg:px-12 min-h-[70vh]">
            <div className="max-w-5xl mx-auto">
              <button 
                onClick={() => setView('landing')}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all mb-12"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Landing
              </button>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-serif italic mb-8" style={{ color: 'var(--color-text-primary)' }}>The Intel Feed.</h2>
                <p className="max-w-xl mx-auto text-lg font-light" style={{ color: 'var(--color-text-secondary)' }}>Deep dives into the intersection of capital and intelligence.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {BLOG_POSTS.map(post => (
                  <motion.div 
                    key={post.id}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-[40px] border flex flex-col items-start text-left group cursor-pointer"
                    style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
                    onClick={() => {
                      setSelectedBlogId(post.id);
                      setView('blog-post');
                    }}
                  >
                    <div className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A] mb-4">{post.date} • {post.author}</div>
                    <h3 className="text-3xl font-serif italic mb-4 group-hover:text-[#C28E4A] transition-colors">{post.title}</h3>
                    <p className="text-sm font-light leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>{post.excerpt}</p>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-primary)' }}>
                      Read Analysis <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : view === 'blog-post' ? (
          <section className="py-20 px-6 lg:px-12 min-h-[70vh]">
            <div className="max-w-3xl mx-auto">
              <button 
                onClick={() => setView('blog')}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all mb-12"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </button>
              {BLOG_POSTS.find(p => p.id === selectedBlogId) && (
                <div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-[#C28E4A] mb-4">
                      {BLOG_POSTS.find(p => p.id === selectedBlogId)?.date} • By {BLOG_POSTS.find(p => p.id === selectedBlogId)?.author}
                   </div>
                   <div className="markdown-body text-left prose prose-invert max-w-none">
                      <Markdown>{BLOG_POSTS.find(p => p.id === selectedBlogId)?.content}</Markdown>
                   </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Hero Section */}
        <section className="relative px-6 lg:px-12 text-center flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] blur-[120px] rounded-full pointer-events-none -z-10" style={{ background: 'var(--color-brand-transparent)' }}></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] uppercase tracking-[0.2em] mb-10 mx-auto shadow-inner" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-brand)' }}></span>
              The Future of Institutional Accounting
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic leading-[1.05] mb-8 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Intelligent Finance for <br/> 
              <span className="not-italic font-sans font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>Modern Enterprises.</span>
            </h1>
            
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-light text-balance px-4" style={{ color: 'var(--color-text-secondary)' }}>
              Finance AI automates complex bookkeeping and provides real-time audit trails 
              using proprietary models built for fiscal precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 px-6">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                className="w-full sm:w-auto px-12 py-6 font-bold rounded-full transition-all flex items-center justify-center gap-2 group"
                style={{ background: 'var(--color-brand)', color: '#fff', boxShadow: '0 0 50px var(--color-brand-transparent)' }}
              >
                Access Dashboard Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('dashboard-preview')?.scrollIntoView({behavior:'smooth'})}
                className="w-full sm:w-auto px-12 py-6 bg-transparent border font-bold rounded-full transition-all text-sm uppercase tracking-widest"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                View Product Tour
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Brand Banner */}
        <section className="py-24 border-b" style={{ borderColor: 'var(--color-border)' }}>
           <div className="max-w-7xl mx-auto px-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] mb-12 block font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Trusted by institutional funds & global enterprises</span>
              <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                 {['QUANTUM', 'VERTEX', 'CORE', 'ALTITUDE', 'NOVA'].map((brand) => (
                    <span key={brand} className="text-xl md:text-2xl font-sans font-black tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>{brand}</span>
                 ))}
              </div>
           </div>
        </section>

        {/* Platform Experience / Dashboard Preview */}
        <section id="dashboard-preview" className="py-40 px-6 lg:px-12 overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                style={{ background: 'var(--color-brand)', color: '#fff' }}
              >
                The Interface
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-serif italic mb-6" style={{ color: 'var(--color-text-primary)' }}>Clarity in <br/> every keystroke.</h2>
              <p className="max-w-xl mx-auto font-light" style={{ color: 'var(--color-text-tertiary)' }}>Minimalist design meets complex financial intelligence. Every insight is one click away.</p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="p-1 lg:p-4 rounded-[48px] border backdrop-blur-3xl relative"
              style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
            >
              <div className="absolute -top-20 -left-20 w-96 h-96 blur-[120px] pointer-events-none" style={{ background: 'var(--color-brand-transparent)' }}></div>
              <div className="absolute -bottom-20 -right-20 w-96 h-96 blur-[120px] pointer-events-none" style={{ background: 'var(--color-brand-transparent)' }}></div>

              {/* Bento Grid Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-4 h-full">
                {/* Main Graph Card */}
                <div className="lg:col-span-8 p-8 rounded-[40px] border flex flex-col justify-between min-h-[500px]" style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
                   <div className="flex justify-between items-start mb-8 text-left">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Portfolio Performance</p>
                        <h3 className="text-4xl font-serif italic" style={{ color: 'var(--color-text-primary)' }}>$1,420,840.12</h3>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-bg-hover)' }}><LucideLineChart className="w-4 h-4" style={{ color: 'var(--color-brand)' }} /></div>
                      </div>
                   </div>
                   <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={[
                            { x: 'Jan', y: 400 }, { x: 'Feb', y: 300 }, { x: 'Mar', y: 600 }, { x: 'Apr', y: 450 }, { x: 'May', y: 550 }, { x: 'Jun', y: 800 }, { x: 'Jul', y: 750 }
                         ]}>
                            <RechartsTooltip 
                              cursor={{ stroke: 'var(--color-brand)', strokeWidth: 1, strokeDasharray: '4 4' }}
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="p-4 rounded-2xl border shadow-2xl backdrop-blur-xl" style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
                                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{label} Efficiency</p>
                                      <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{payload[0].value}%</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area 
                               type="monotone" 
                               dataKey="y" 
                               stroke="var(--color-brand)" 
                               strokeWidth={4} 
                               fill="url(#heroGradient)" 
                               activeDot={{ r: 6, stroke: '#faf9f5', strokeWidth: 2, fill: 'var(--color-brand)' }}
                               animationDuration={2500}
                            />
                            <defs>
                              <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-3 gap-8 pt-8 mt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      {[
                        { l: 'Yield', v: '12.4%', c: 'var(--color-income)' },
                        { l: 'Alpha', v: '+4.2', vcolor: 'var(--color-brand)' },
                        { l: 'Risk', v: 'Low', c: 'var(--color-status-pending)' }
                      ].map((s, i) => (
                        <div key={i}>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{s.l}</p>
                          <p className="text-xl font-bold" style={{ color: s.c || s.vcolor || 'var(--color-text-primary)' }}>{s.v}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Side Intelligence Column */}
                <div className="lg:col-span-4 space-y-1 lg:space-y-4">
                   <div className="p-8 rounded-[40px] border" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                      <h4 className="text-sm font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>AI Intelligence Feed</h4>
                      <div className="space-y-4">
                        {[
                          { t: 'Tax Credit Found', v: '+$4.2k', i: <Zap className="w-3 h-3 text-amber-500" /> },
                          { t: 'Anomalous Bill', v: '-$1.2k', i: <Target className="w-3 h-3 text-[#C28E4A]" /> }
                        ].map((n, i) => (
                          <div key={i} className="p-4 rounded-2xl border border-transparent hover:border-[var(--color-border)] transition-all flex items-center justify-between" style={{ background: 'var(--color-bg-primary)' }}>
                             <div className="flex items-center gap-3">
                                {n.i}
                                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{n.t}</span>
                             </div>
                             <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>{n.v}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="p-8 rounded-[40px] border border-transparent overflow-hidden relative group" style={{ background: 'var(--color-brand)', color: '#fff' }}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:scale-150 transition-transform"></div>
                      <h4 className="font-serif italic text-xl mb-4">Audit Readiness</h4>
                      <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-bold tracking-tighter">98%</span>
                        <span className="text-white/60 text-xs font-medium mb-2">Confidence Level</span>
                      </div>
                      <button onClick={handleLogin} className="w-full py-3 bg-white text-black rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">Generate Report</button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 px-6 lg:px-12 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {STATS.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center lg:text-left group"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 transition-colors" style={{ color: 'var(--color-text-tertiary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}>{stat.label}</p>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter" style={{ color: 'var(--color-text-primary)' }}>
                    <AnimatedCounter value={stat.value} />
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Services Section */}
        <section id="services" className="py-40 px-6 lg:px-12" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center text-left">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl md:text-7xl font-serif italic mb-8 leading-tight" style={{ color: 'var(--color-text-primary)' }}>Master your financial ecosystem.</h2>
                  <p className="text-xl font-light mb-12 leading-relaxed max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
                    Beyond simple bookkeeping—we provide institutional-grade intelligence that acts as your permanent, AI-powered accounting department.
                  </p>
                  <div className="space-y-6">
                    {[
                      'Proactive Tax Optimization strategies generated daily',
                      'Proprietary reconciliation LLMs with 99.99% accuracy',
                      'Direct banking API integrations for real-time ledger updates'
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-default">
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center transition-all group-hover:bg-[var(--color-text-primary)] group-hover:border-[var(--color-text-primary)]" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                          <Zap className="w-3 h-3 group-hover:text-[var(--color-bg-primary)]" style={{ color: 'var(--color-text-tertiary)' }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                 {SERVICES.map((s, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: i * 0.1 }}
                     className="p-8 rounded-3xl border transition-all group"
                     style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
                     onMouseEnter={e => {
                       e.currentTarget.style.borderColor = 'var(--color-brand)';
                       e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--color-brand-transparent)';
                     }}
                     onMouseLeave={e => {
                       e.currentTarget.style.borderColor = 'var(--color-border)';
                       e.currentTarget.style.boxShadow = 'none';
                     }}
                   >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
                        {s.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>{s.title}</h3>
                      <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--color-text-tertiary)' }}>{s.description}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-brand)' }}>
                        Learn More <ChevronRight className="w-3 h-3" />
                      </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-40 px-6 lg:px-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-24">
                <h2 className="text-6xl font-serif italic mb-6" style={{ color: 'var(--color-text-primary)' }}>Zero-Effort Integration.</h2>
                <p className="max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>We connect directly to your sources, removing human error from the data ingestion process entirely.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { title: 'Secure Link', icon: <Lock className="w-8 h-8" />, desc: 'Connect bank feeds with enterprise-grade MFA and AES-256 encryption.' },
                  { title: 'AI Mapping', icon: <Zap className="w-8 h-8 text-amber-400" />, desc: 'Our models automatically map your historical transactions to a standard chart of accounts.' },
                  { title: 'Live Dashboard', icon: <BarChart3 className="w-8 h-8 text-emerald-400" />, desc: 'Access real-time reports and predictive forecasts within seconds of data sync.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-center group"
                  >
                     <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border group-hover:scale-110 transition-transform relative" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                        <div className="absolute inset-0 blur-xl group-hover:blur-2xl transition-all" style={{ background: 'var(--color-brand-transparent)' }}></div>
                        <div style={{ color: 'var(--color-text-primary)' }}>{item.icon}</div>
                     </div>
                     <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
                     <p className="text-sm leading-relaxed max-w-[280px] mx-auto" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="about" className="py-40 px-6 lg:px-12 border-t" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                <h2 className="text-5xl md:text-7xl font-serif italic mb-12" style={{ color: 'var(--color-text-primary)' }}>Our Legacy, <br/> Your Future.</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-[0.2em] text-[10px]" style={{ color: 'var(--color-brand)' }}>The Mission</h3>
                    <p className="text-xl font-light leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      To bridge the gap between complex institutional accounting and real-time business intelligence through secure, adaptive AI. We transform raw fiscal data into strategic clarity.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-[0.2em] text-[10px]" style={{ color: 'var(--color-brand)' }}>Commitment to Innovation</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                      We don't just automate bookkeeping; we build the foundational layer of institutional trust. Our models are trained on centuries of financial principles, updated for the speed of modern commerce.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="p-12 rounded-[40px] border relative overflow-hidden text-left shadow-2xl"
                style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none" style={{ background: 'var(--color-brand-transparent)' }}></div>
                <h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>The Expertise</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Quantitative Analytics', desc: 'Masters of traditional finance with deep risk assessment backgrounds.' },
                    { title: 'Neural Engineering', desc: 'World-class AI researchers specializing in transformer models for tabular data.' },
                    { title: 'Regulatory Compliance', desc: 'Former institutional auditors ensuring every bit matches the ledger.' }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl border group transition-colors" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
                      <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-40 px-6 lg:px-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-serif italic mb-8" style={{ color: 'var(--color-text-primary)' }}>Scale with clarity.</h2>
              <p className="max-w-xl mx-auto text-lg font-light" style={{ color: 'var(--color-text-secondary)' }}>Pricing architecture built for sustainable institutional growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {PRICING_TIERS.map((tier, i) => (
                <PricingTier key={i} tier={tier} isDark={isDark} handleLogin={handleLogin} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-40 px-6 lg:px-12" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-serif italic mb-6" style={{ color: 'var(--color-text-primary)' }}>Common Queries.</h2>
              <p className="max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>Everything you need to know about integrating Intelligence into your finance stack.</p>
            </div>
            <div className="p-8 md:p-12 rounded-[40px] border shadow-2xl" style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} isDark={isDark} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-40 px-6 lg:px-12 relative overflow-hidden text-center">
           <div className="absolute inset-0 blur-[150px] -z-10" style={{ background: 'var(--color-brand-transparent)' }}></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] border rounded-full pointer-events-none" style={{ borderColor: 'var(--color-border)' }}></div>
           
           <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-6xl md:text-8xl font-serif italic leading-tight mb-12" style={{ color: 'var(--color-text-primary)' }}>
                Scale without <br/> the overhead.
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleLogin}
                   className="px-12 py-6 font-bold rounded-full text-xl transition-all shadow-xl"
                   style={{ background: 'var(--color-brand)', color: '#fff' }}
                 >
                   Start Your Free Trial
                 </motion.button>
                 <button className="px-12 py-6 bg-transparent border font-bold rounded-full transition-all text-sm uppercase tracking-widest" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>
                   Schedule Demo
                 </button>
              </div>
              <p className="mt-12 text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>No credit card required. 14-day full access trial.</p>
           </div>
        </section>
      </>
    )}
  </main>

      <footer className="border-t py-12 px-6 lg:px-12" style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-tertiary)' }}>
          <div>&copy; 2024 Finance AI Technologies Inc.</div>
          <div className="flex flex-wrap justify-center gap-10">
            <button onClick={() => setView('privacy')} className="transition-all hover:underline underline-offset-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Privacy Policy</button>
            <button onClick={() => setView('terms')} className="transition-all hover:underline underline-offset-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Terms of Service</button>
            <button onClick={() => setView('blog')} className="transition-all hover:underline underline-offset-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Blog</button>
            <a href="#" className="transition-all hover:underline underline-offset-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Security Audit</a>
          </div>
          <div className="flex gap-4">
             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> All Systems Operational</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            className="fixed bottom-8 left-8 z-[300] px-6 py-4 rounded-2xl shadow-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 border"
            style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
