import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../lib/api';
import { StudentProfile, ApiResponse, PageResponse } from '../../types';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Filter,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  Eye,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

export const StudentsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [minCgpa, setMinCgpa] = useState<string>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const { success, error } = useToast();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query.trim());
      if (department) params.append('department', department);
      if (graduationYear) params.append('graduationYear', graduationYear);
      if (minCgpa) params.append('minCgpa', minCgpa);
      params.append('page', page.toString());
      params.append('size', '15');

      const res = await api.get<ApiResponse<PageResponse<StudentProfile>>>(`/api/admin/students?${params.toString()}`);
      if (res.data.success && res.data.data) {
        setStudents(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
        setTotalStudents(res.data.data.totalElements);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, department, graduationYear]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchStudents();
  };

  const handleToggleActive = async (studentId: number, currentlyActive: boolean) => {
    try {
      await api.patch(`/api/admin/students/${studentId}/active`, { active: !currentlyActive });
      success(`Student account ${!currentlyActive ? 'activated' : 'deactivated'}`);
      fetchStudents();
      if (selectedStudent && selectedStudent.id === studentId && selectedStudent.user) {
        setSelectedStudent({
          ...selectedStudent,
          user: { ...selectedStudent.user, active: !currentlyActive },
        });
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update student state');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Registered Student Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, verify academic standing, review resumes, and manage student placement status.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl self-start sm:self-auto">
          Total: {totalStudents} Students
        </span>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, or registration no..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={graduationYear}
              onChange={(e) => {
                setGraduationYear(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">All Batches</option>
              <option value="2025">Class of 2025</option>
              <option value="2026">Class of 2026</option>
              <option value="2027">Class of 2027</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="Min CGPA"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-1">
            <Button variant="primary" size="sm" type="submit" className="w-full h-full">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={Users}
              title="No students match the criteria"
              description="Try adjusting your department or minimum CGPA filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-bold">Student</th>
                  <th className="py-3.5 px-6 font-bold">Registration No</th>
                  <th className="py-3.5 px-6 font-bold">Department</th>
                  <th className="py-3.5 px-6 font-bold">CGPA</th>
                  <th className="py-3.5 px-6 font-bold">Backlogs</th>
                  <th className="py-3.5 px-6 font-bold">Batch</th>
                  <th className="py-3.5 px-6 font-bold">Offers</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">
                          {sp.user?.firstName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{sp.user?.fullName}</p>
                          <p className="text-[11px] text-slate-400">{sp.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-700">
                      {sp.registrationNumber}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{sp.department}</td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100">
                        {sp.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold ${
                          sp.backlogCount > 0 ? 'text-rose-600' : 'text-slate-500'
                        }`}
                      >
                        {sp.backlogCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{sp.graduationYear}</td>
                    <td className="py-4 px-6">
                      {sp.offersCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {sp.offersCount} Offered
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(sp)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={selectedStudent.user?.fullName || 'Student Details'}
          description={`Registration: ${selectedStudent.registrationNumber} • ${selectedStudent.department}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">CGPA</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {selectedStudent.cgpa.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Backlogs</span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {selectedStudent.backlogCount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Degree</span>
                <span className="text-xs font-semibold text-slate-800 mt-1 block">
                  {selectedStudent.degree}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Batch</span>
                <span className="text-xs font-semibold text-slate-800 mt-1 block">
                  Class of {selectedStudent.graduationYear}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Technical Skills
              </span>
              <p className="text-xs text-slate-700 p-3 bg-slate-100 rounded-xl">
                {selectedStudent.skills || 'No skills listed'}
              </p>
            </div>

            {/* Resume Document Link */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Resume Document
              </span>
              {selectedStudent.activeResume ? (
                <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {selectedStudent.activeResume.fileName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Uploaded {formatDate(selectedStudent.activeResume.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/resumes/${selectedStudent.activeResume.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Resume PDF
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No verified resume uploaded yet.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {selectedStudent.user && (
                <Button
                  variant={selectedStudent.user.active ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleToggleActive(selectedStudent.id, selectedStudent.user?.active ?? true)
                  }
                >
                  {selectedStudent.user.active ? 'Deactivate Student Account' : 'Activate Account'}
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
