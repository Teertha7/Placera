import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import {
  ArrowRight,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Sparkles,
  Users,
  Building2,
  Calendar,
  ChevronDown,
  Layers,
  Award,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does Placera determine job eligibility?',
      a: 'Placera runs a real-time server-side eligibility verification engine comparing student academic metrics (CGPA, active backlogs, department, graduation batch) against job criteria. Students receive clear, transparent feedback if they are ineligible.',
    },
    {
      q: 'How is resume data stored and secured?',
      a: 'Resumes are strictly validated for genuine PDF file headers, restricted to 5MB, renamed with secure UUID storage identifiers, and stored in private cloud storage. Access is enforced via role-based access control and backend authorization.',
    },
    {
      q: 'Can placement officers track hiring pipelines and schedule interviews?',
      a: 'Yes! Placera features an end-to-end recruitment stage machine (Applied, Shortlisted, Assessment, Technical Interview, HR Interview, Offered), interview scheduling with conflict prevention, and live executive analytics.',
    },
    {
      q: 'What cloud infrastructure does Placera support for production?',
      a: 'Placera is architected for zero-cost local development using Docker Compose and production deployment on Azure using Azure Container Apps (backend), Azure Static Web Apps (frontend), PostgreSQL Flexible Server, and Azure Blob Storage, managed through Terraform.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold mb-6 tracking-wide animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS RECRUITMENT & RECRUITMENT ANALYTICS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Your Campus. Your Career.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900">
              Your Next Move.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Placera centralizes university placements for students and placement administrators. Manage
            verified eligibility, job drives, candidate shortlisting, interview calendars, and recruitment analytics in one seamless platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Started
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full" leftIcon={<Briefcase className="w-4 h-4" />}>
                Explore Opportunities
              </Button>
            </Link>
          </div>

          {/* Interactive Illustrative Product Preview */}
          <div className="relative mx-auto max-w-5xl rounded-3xl p-3 bg-slate-900/5 shadow-2xl border border-slate-200/80 backdrop-blur-xl">
            <div className="rounded-2xl bg-slate-900 text-left overflow-hidden border border-slate-800 shadow-2xl">
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">placera.edu/admin/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-400 font-medium">Recruitment Drive Live</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <p className="text-xs font-bold uppercase text-slate-400">Total Registered Students</p>
                  <p className="text-2xl font-extrabold text-white mt-1">1,248</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Verified academic profiles</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <p className="text-xs font-bold uppercase text-slate-400">Published Drives</p>
                  <p className="text-2xl font-extrabold text-white mt-1">42</p>
                  <p className="text-[11px] text-blue-400 mt-1">Tier-1 & Core recruiters</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <p className="text-xs font-bold uppercase text-slate-400">Interviews Scheduled</p>
                  <p className="text-2xl font-extrabold text-white mt-1">186</p>
                  <p className="text-[11px] text-purple-400 mt-1">Automated conflict check</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <p className="text-xs font-bold uppercase text-slate-400">Placement Rate</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">84.6%</p>
                  <p className="text-[11px] text-slate-400 mt-1">Eligible batch conversion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
            ENGINEERED FOR EXCELLENCE
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Campus Recruitment Lifecycle
          </h3>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Replace fragmented spreadsheets and manual emails with a unified platform built on robust software engineering principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Automated Eligibility Engine</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time validation against minimum CGPA, active backlogs, allowed departments, and graduation batch rules. Zero manual screening overhead.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">State Machine Workflow</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Structured candidate progression through Applied, Shortlisted, Assessments, Technical Interviews, and Offers with complete audit history.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Live Recruitment Analytics</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time conversion metrics, department offer distributions, salary trends, and instant sanitized CSV exports protected against formula injection.
            </p>
          </div>
        </div>
      </section>

      {/* Student & Administrator Dual Value Props */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Student Column */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>FOR STUDENTS</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4">
                Empowering Students to Achieve Their Career Aspirations
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Instant eligibility transparency before you apply with clear criteria breakdowns.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>One-click applications with secure private PDF resume management.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time stage timeline tracking from submission to offer letters.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Synchronized interview calendar with direct video conference links.</span>
                </li>
              </ul>
            </div>

            {/* Admin Column */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-4">
                <Building2 className="w-3.5 h-3.5" />
                <span>FOR PLACEMENT OFFICERS</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4">
                Powerful Management Tools for University Placement Cells
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Centralized corporate directory and multi-tier recruitment drive publishing wizard.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Candidate stage advancement with confidential internal evaluation notes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Automated interview conflict detection across concurrent hiring drives.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive reports and interactive analytics charts ready for accreditation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Process Workflow */}
      <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
            STEP-BY-STEP FLOW
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Placera Coordinates Campus Hiring
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Student Onboarding', desc: 'Students register with verified academic records and resumes.' },
            { step: '02', title: 'Job Publishing', desc: 'Placement officers publish company drives with eligibility rules.' },
            { step: '03', title: 'Server Verification', desc: 'Server validates criteria instantly on student application.' },
            { step: '04', title: 'Interview Rounds', desc: 'Candidates are shortlisted and scheduled for technical rounds.' },
            { step: '05', title: 'Offers & Analytics', desc: 'Final selections are recorded with automatic placement analytics.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 text-left relative">
              <span className="text-2xl font-black text-blue-600/30 block mb-2">{item.step}</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Illustrative Platform Statistics */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold">
              ILLUSTRATIVE PLATFORM METRICS
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white">100%</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Server-side Eligibility Verification</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-blue-400">Zero</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Duplicate Applications Permitted</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400">&lt; 150ms</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Average REST API Response Latency</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-purple-400">256-bit</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">HMAC-SHA256 JWT Authentication</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600 mb-2">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Know
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    openFaq === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <Logo inverted size="md" showTagline />
            <p className="text-xs text-slate-500 text-center sm:text-right">
              Placera Campus Placement Management Platform. Built with Spring Boot, React & Cloud Native DevOps.
            </p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 Placera Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register as Student</Link>
              <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                OpenAPI Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
