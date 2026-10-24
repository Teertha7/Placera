import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ResumeUploadModal } from '../../components/student/ResumeUploadModal';
import api from '../../lib/api';
import { StudentProfile, Resume, ApiResponse } from '../../types';
import { formatDate, formatFileSize } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Lock,
  Linkedin,
  Github,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  // Editable safe fields
  const [skills, setSkills] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<StudentProfile>>('/api/students/me');
      if (res.data.success && res.data.data) {
        const p = res.data.data;
        setProfile(p);
        setSkills(p.skills || '');
        setPhoneNumber(p.user?.phoneNumber || '');
        setLinkedinUrl(p.linkedinUrl || '');
        setGithubUrl(p.githubUrl || '');
        setPortfolioUrl(p.portfolioUrl || '');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        skills: skills.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
      };

      const res = await api.put<ApiResponse<StudentProfile>>('/api/students/me', payload);
      if (res.data.success && res.data.data) {
        success('Profile updated successfully');
        setProfile(res.data.data);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const activeResume = profile?.activeResume;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Documents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your verified academic standing, manage your PDF resume, and update technical skills.
        </p>
      </div>

      {/* Verified Academic Credentials Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-2xl text-white">
              {profile?.user?.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{profile?.user?.fullName}</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{profile?.user?.email}</p>
              <p className="text-xs text-blue-400 font-mono mt-0.5">
                Reg: {profile?.registrationNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Verified CGPA</span>
              <span className="text-xl font-black text-emerald-400">{profile?.cgpa?.toFixed(2)}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Backlogs</span>
              <span className="text-xl font-black text-white">{profile?.backlogCount}</span>
            </div>
          </div>
        </div>

        {/* Read-only Academic Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-300">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Department
            </span>
            <span className="font-semibold text-white mt-0.5 block">{profile?.department}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Degree
            </span>
            <span className="font-semibold text-white mt-0.5 block">{profile?.degree}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Graduation Batch
            </span>
            <span className="font-semibold text-white mt-0.5 block">Class of {profile?.graduationYear}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Academic Status
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          </div>
        </div>
      </Card>

      {/* Resume Management Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Resume / CV Document</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              PDF format only (Max 5MB). Used for all submitted placement applications.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResumeModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {activeResume ? 'Replace Resume' : 'Upload Resume'}
          </Button>
        </div>

        <div className="pt-4">
          {activeResume ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{activeResume.fileName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatFileSize(activeResume.fileSizeBytes)} • Uploaded {formatDate(activeResume.uploadedAt)}
                  </p>
                </div>
              </div>

              <a
                href={`/api/resumes/${activeResume.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                Download / View PDF
              </a>
            </div>
          ) : (
            <div className="text-center py-6 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active resume on file</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You must upload a verified PDF resume before applying to corporate drives.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsResumeModalOpen(true)}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Upload Resume Now
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Editable Personal & Skill Profile */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 mb-6">
          Skills, Links & Contact Information
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Technical Skills & Proficiencies
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Java, Spring Boot, React, PostgreSQL, Docker, AWS, Python"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Comma-separated technologies. Highlighted on your application reviews.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Profile URL
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Portfolio / Personal Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Updates
            </Button>
          </div>
        </form>
      </Card>

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onSuccess={() => fetchProfile()}
      />
    </div>
  );
};
