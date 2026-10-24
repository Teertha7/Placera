import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Company, JobType, ApiResponse, Job } from '../../types';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Check, ArrowRight, ArrowLeft, Briefcase, Eye } from 'lucide-react';

interface JobWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobWizardModal: React.FC<JobWizardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  // Form State
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<JobType>('FULL_TIME');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState<number | ''>('');
  const [salaryMax, setSalaryMax] = useState<number | ''>('');
  const [deadline, setDeadline] = useState('');

  // Eligibility Criteria
  const [minCgpa, setMinCgpa] = useState<number>(7.0);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    'Computer Science',
    'Information Technology',
  ]);
  const [selectedYears, setSelectedYears] = useState<number[]>([2026]);
  const [skillsInput, setSkillsInput] = useState('Java, Spring Boot, React, SQL');

  const availableDepts = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const availableYears = [2025, 2026, 2027];

  useEffect(() => {
    if (isOpen) {
      api.get<ApiResponse<Company[]>>('/api/companies')
        .then((res) => {
          if (res.data.success && res.data.data) {
            setCompanies(res.data.data);
            if (res.data.data.length > 0 && !companyId) {
              setCompanyId(res.data.data[0].id);
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleSubmit = async (publishImmediately: boolean) => {
    if (!companyId || !title || !description || !location || !deadline) {
      error('Please complete all required fields');
      return;
    }
    if (selectedDepartments.length === 0) {
      error('Please select at least one eligible department');
      return;
    }
    if (selectedYears.length === 0) {
      error('Please select at least one eligible graduation year');
      return;
    }

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      companyId: Number(companyId),
      title: title.trim(),
      description: description.trim(),
      jobType,
      location: location.trim(),
      salaryMin: salaryMin !== '' ? Number(salaryMin) : undefined,
      salaryMax: salaryMax !== '' ? Number(salaryMax) : undefined,
      salaryCurrency: 'INR',
      deadline: new Date(deadline).toISOString(),
      minCgpa,
      maxBacklogs,
      allowedDepartments: selectedDepartments,
      allowedGraduationYears: selectedYears,
      requiredSkills: skillsArray,
      publishImmediately,
    };

    setIsSubmitting(true);
    try {
      await api.post<ApiResponse<Job>>('/api/admin/jobs', payload);
      success(publishImmediately ? 'Job published successfully!' : 'Job saved as draft');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Campus Recruitment Drive"
      description={`Step ${step} of 3: ${
        step === 1 ? 'Job Details' : step === 2 ? 'Eligibility & Skills' : 'Review & Publish'
      }`}
      maxWidth="2xl"
    >
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            1
          </span>
          <span className="text-xs font-semibold text-slate-800">Details</span>
        </div>
        <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            2
          </span>
          <span className="text-xs font-semibold text-slate-800">Eligibility</span>
        </div>
        <div className="h-0.5 flex-1 mx-3 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            3
          </span>
          <span className="text-xs font-semibold text-slate-800">Preview</span>
        </div>
      </div>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recruiting Company *
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              >
                <option value="">Select Company...</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Associate Software Engineer"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role Type *
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="INTERN_TO_FULL_TIME">Intern to Full Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Hybrid"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Min Salary (INR / Annum)
              </label>
              <input
                type="number"
                placeholder="800000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Salary (INR / Annum)
              </label>
              <input
                type="number"
                placeholder="1200000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Application Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description & Responsibilities *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline role responsibilities, growth trajectory, team culture, and recruitment process..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (!companyId || !title || !description || !location || !deadline) {
                  error('Please complete all required fields before continuing');
                  return;
                }
                setStep(2);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Eligibility Rules
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Eligibility & Skills */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum CGPA (0.00 - 10.00)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Active Backlogs Allowed
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Eligible Departments *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableDepts.map((dept) => (
                <label
                  key={dept}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    selectedDepartments.includes(dept)
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept)}
                    onChange={() => toggleDepartment(dept)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Eligible Graduation Batches *
            </label>
            <div className="flex gap-3">
              {availableYears.map((year) => (
                <button
                  type="button"
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    selectedYears.includes(year)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Class of {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Java, Python, React, AWS, Docker"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (selectedDepartments.length === 0 || selectedYears.length === 0) {
                  error('Please specify eligible departments and graduation batches');
                  return;
                }
                setStep(3);
              }}
              rightIcon={<Eye className="w-4 h-4" />}
            >
              Next: Preview Job
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Preview */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedCompany?.name || 'Recruiting Partner'}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-0.5">{title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {location} • {jobType.replace('_', ' ')} • Deadline: {formatDate(deadline)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-slate-900">
                  {formatCurrency(Number(salaryMin))} - {formatCurrency(Number(salaryMax))}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                About the Role
              </p>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
              <div>
                <span className="font-bold text-slate-700">Minimum CGPA:</span>{' '}
                <span className="text-slate-900">{minCgpa.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Max Backlogs:</span>{' '}
                <span className="text-slate-900">{maxBacklogs}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Eligible Batches:</span>{' '}
                <span className="text-slate-900">{selectedYears.join(', ')}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Eligible Branches:</span>{' '}
                <span className="text-slate-900">{selectedDepartments.join(', ')}</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Required Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsInput.split(',').map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(2)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmit(true)}
                isLoading={isSubmitting}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Publish Drive Immediately
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
