import {
  ArrowRight,
  PieChart,
  Database,
  FileText,
  AlertTriangle,
  Monitor,
  User,
  Network,
  ClipboardList,
  TrendingUp,
  Settings,
  Headphones,
  BookOpen,
} from "lucide-react";
import { Binoculars } from "./icons/Binoculars";
import { ApiIntegration } from "./icons/ApiIntegration";
import { ProductSupportPolicies } from "./icons/ProductSupportPolicies";
import { CoverPage } from "./CoverPage";
import { homePageText } from "./homePageConfig";
import { useTheme } from "../lib/theme/theme-provider";

interface HomePageProps {
  onModuleSelect: (module: string) => void;
  onSearchDialogOpen: () => void;
}

const modules = [
  {
    id: "my-dashboard",
    name: "My Dashboard",
    icon: PieChart,
    description:
      "Centralized view of your IT environment with customizable widgets and real-time monitoring.",
    iconBg: "bg-orange-500",
    iconColor: "text-white",
  },
  {
    id: "admin",
    name: "Admin",
    icon: Settings,
    description:
      "Administrative functions for organizational setup, user management, discovery configuration, and system integrations.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
  },
  {
    id: "cmdb",
    name: "CMDB",
    icon: Database,
    description:
      "Configuration Management Database for tracking and managing all IT assets and their relationships.",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  {
    id: "discovery-scan",
    name: "Discovery Scan",
    icon: Binoculars,
    description:
      "Automated discovery and scanning of IT infrastructure, applications, and cloud resources.",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  {
    id: "itsm",
    name: "ITSM",
    icon: FileText,
    description:
      "IT Service Management for incident, problem, change, and service request management.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "vulnerability-management",
    name: "Vulnerability Management",
    icon: AlertTriangle,
    description:
      "Identify, assess, and remediate security vulnerabilities across your IT infrastructure.",
    iconBg: "bg-indigo-600",
    iconColor: "text-white",
  },
  {
    id: "itam",
    name: "ITAM",
    icon: Monitor,
    description:
      "IT Asset Management for complete lifecycle management of hardware and software assets.",
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
  },
  {
    id: "self-service",
    name: "Self Service",
    icon: User,
    description:
      "Empower users with self-service portal for requests, catalog items, and knowledge base.",
    iconBg: "bg-pink-500",
    iconColor: "text-white",
  },
  {
    id: "program-project-management",
    name: "Program and Project Management",
    icon: Network,
    description:
      "Manage IT programs and projects with planning, tracking, and resource allocation.",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  {
    id: "risk-register",
    name: "Risk Register",
    icon: ClipboardList,
    description:
      "Track and manage IT risks with assessment, mitigation planning, and compliance monitoring.",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    id: "reports",
    name: "Reports",
    icon: TrendingUp,
    description:
      "Comprehensive reporting and analytics with customizable dashboards and scheduled reports.",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
  },
  {
    id: "support",
    name: "Support",
    icon: Headphones,
    description:
      "Access Virima support resources, raise tickets, track issues, and connect with the support team.",
    iconBg: "",
    iconBgStyle: { backgroundColor: "#14b8a6" },
    iconColor: "text-white",
  },
  {
    id: "glossary",
    name: "Glossary",
    icon: BookOpen,
    description:
      "Centralized reference of terminology, acronyms, and abbreviations organized by module across Virima V6.1.",
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
  },
];

export function HomePage({ onModuleSelect, onSearchDialogOpen }: HomePageProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const cardStyle = isDark
    ? { background: '#0a0a0a', borderColor: '#1a1a1a' }
    : { background: '#ffffff', borderColor: '#f1f5f9' };

  return (
    <div className="bg-background pb-24">
      {/* 3D Animated Cover Page */}
      <CoverPage onModuleSelect={onModuleSelect} onSearchDialogOpen={onSearchDialogOpen} />

      {/* Value Proposition Section */}
      <div className="pt-4 pb-0 lg:pt-8 lg:pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl text-black-premium dark:text-white mb-4 tracking-tight">
              {homePageText.valueProposition.title}
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {homePageText.valueProposition.description}
            </p>
            <div className="pt-8 pb-4 lg:pt-10 lg:pb-6">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.id}
                        className="group relative rounded-2xl p-6 border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer flex flex-col"
                        style={cardStyle}
                        onClick={() => onModuleSelect(module.id)}
                      >

                        <div className="relative flex flex-col flex-grow">
                          <div className="mb-4">
                            <div
                              className={`inline-flex p-3 rounded-xl ${module.iconBg} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                              style={module.iconBgStyle}
                            >
                              <Icon
                                className={`h-5 w-5 ${module.iconColor} ${
                                  module.id === "my-dashboard"
                                    ? "bounce-in-top-on-hover"
                                    : module.id === "admin"
                                    ? "rotate-2-circles-on-hover"
                                    : module.id === "cmdb"
                                    ? "scale-in-ver-bottom-on-hover"
                                    : module.id === "itam"
                                    ? "scale-in-hor-center-on-hover"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>

                          <h3 className="text-lg text-black-premium dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            {module.name}
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-grow">
                            {module.description}
                          </p>

                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 group-hover:gap-4 transition-all duration-300">
                            <span>Explore</span>
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Modules */}

      {/* Documentation Resources */}
      <div className="py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-4xl lg:text-5xl text-black-premium dark:text-white mb-4 tracking-tight">
              {homePageText.quickLinks.title}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => onModuleSelect('product-support-policies')}
              className="group rounded-2xl p-6 border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.1)] transition-all duration-500 cursor-pointer"
              style={cardStyle}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <ProductSupportPolicies className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg text-black-premium dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Product Support Policies
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Comprehensive support policies, maintenance schedules,
                and lifecycle information for all Virima products.
              </p>
            </div>

            <div
              onClick={() => onModuleSelect('release-notes')}
              className="group rounded-2xl p-6 border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(34,197,94,0.1)] transition-all duration-500 cursor-pointer"
              style={cardStyle}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-shadow duration-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg text-black-premium dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Release Notes
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Latest updates, new features, improvements, and
                bug fixes for each version release.
              </p>
            </div>

            <a
              href="https://login.virima.com/www_em/api-docs.html#/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group rounded-2xl p-6 border shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.1)] transition-all duration-500"
              style={cardStyle}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-shadow duration-500">
                <ApiIntegration className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg text-black-premium dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                API Integration
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Developer guides, API references, and code
                examples for seamless integrations.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}