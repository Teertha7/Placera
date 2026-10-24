import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { ApiResponse, Resume } from '../../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newResume: Resume) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      error('Only PDF documents are permitted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      error('File size cannot exceed 5MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post<ApiResponse<Resume>>('/api/students/me/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.data) {
        success('Resume uploaded and set as active');
        onSuccess(res.data.data);
        onClose();
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Resume" description="Accepts PDF documents up to 5MB">
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-600 bg-blue-50/50'
              : selectedFile
              ? 'border-emerald-500 bg-emerald-50/30'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-semibold text-sm text-slate-800">
                Click to browse or drag & drop your resume PDF
              </p>
              <p className="text-xs text-slate-400 mt-1">Supported format: PDF only (Max 5MB)</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedFile}
            isLoading={isUploading}
          >
            Upload and Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
