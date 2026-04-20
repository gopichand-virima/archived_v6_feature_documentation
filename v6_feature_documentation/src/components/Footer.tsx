import { Linkedin, Mail, Globe } from "lucide-react";
import footerLogo from "../assets/virima-logo-extended-tag-footer.svg";
import awsLogo from "../assets/aws-color-logo.png";
import pinkverifyLogo from "../assets/pinkverify-colored.png";
import aicpaLogo from "../assets/AICPA_Colored.png";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8 mb-8 sm:mb-12">
          {/* Company Info */}
          <div>
            <img 
              src={footerLogo} 
              alt="Virima" 
              className="mb-3"
              style={{ width: '175px', height: 'auto' }}
            />
            
            
            <div className="flex items-center gap-4 mb-6">
              {/* Twitter/X Icon */}
              <a
                href="https://twitter.com/VirimaTech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-black flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn Icon */}
              <a
                href="https://in.linkedin.com/company/virima-inc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-[#0A66C2] flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            {/* Certification Badges */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <img 
                  src={awsLogo} 
                  alt="AWS" 
                  className="h-8 object-contain"
                />
                <img 
                  src={pinkverifyLogo} 
                  alt="PinkVERIFY" 
                  className="h-8 object-contain"
                />
                <img 
                  src={aicpaLogo} 
                  alt="AICPA SOC" 
                  className="h-8 object-contain"
                />
              </div>
              
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white mb-3">
              <a href="https://virima.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 transition-colors duration-200">
                Platform
              </a>
            </h4>
            <ul className="space-y-3">
              <li className="pt-0">
                <a href="https://virima.com/use-cases" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="https://virima.com/blogs" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Blogs
                </a>
              </li>
              <li>
                <a href="https://virima.com/faqs" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white mb-3">About Us</h4>
            <ul className="space-y-3">
              <li className="pt-0">
                <a href="https://virima.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://support.virima.com/v6/Default.htm" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Support
                </a>
              </li>
              <li>
                <a href="https://virima.com/careers" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h4 className="text-white mb-3">Compare</h4>
            <ul className="space-y-3">
              <li className="pt-0">
                <a href="https://virima.com/compare/virima-vs-device42-vs-servicenow" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Virima vs Device42 vs ServiceNow
                </a>
              </li>
              <li>
                <a href="https://virima.com/compare/virima-vs-device42-vs-bmc-discovery" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Virima vs Device42 vs BMC
                </a>
              </li>
              <li>
                <a href="https://virima.com/compare/lansweeper" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">
                  Virima vs Lansweeper
                </a>
              </li>
            </ul>
          </div>
        </div>

        

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
            <p className="text-slate-500 text-sm">
              © 2026 Virima Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-end">
              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:support@virima.com" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200">
                  support@virima.com
                </a>
              </div>
              {/* Website */}
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="https://www.virima.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200">
                  www.virima.com
                </a>
              </div>
              {/* Privacy Policy */}
              <div className="flex items-center gap-2">
                <a href="https://virima.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}