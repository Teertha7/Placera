import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ApplicationStatus } from '../../types';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

interface StatusTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  currentStatus: ApplicationStatus;
  candidateName: string;
  jobTitle: string;
  onSuccess: () => void;
}

export const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  currentStatus,
  candidateName,
  jobTitle,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [reasonOrNote, setReasonOrNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const allowedTransitions = (current: ApplicationStatus): ApplicationStatus[] => {
    switch (current) {
      case 'APPLIED':
        return ['SHORTLISTED', 'REJECTED'];
      case 'SHORTLISTED':
        return ['ASSESSMENT', 'TECHNICAL_INTERVIEW', 'REJECTED'];
      case 'ASSESSMENT':
        return ['TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'REJECTED'];
      case 'TECHNICAL_INTERVIEW':
        return ['HR_INTERVIEW', 'SELECTED', 'REJECTED'];
      case 'HR_INTERVIEW':
        return ['SELECTED', 'REJECTED'];
      default:
        return [];
    }
  };

  const options = allowedTransitions(currentStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/api/admin/applications/${applicationId}/status`, {
        status: selectedStatus,
        reasonOrNote: reasonOrNote.trim() || undefined,
        internalNotes: internalNotes.trim() || undefined,
      });

      success(`Application stage transitioned to ${selectedStatus}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Candidate Stage"
      description={`Candidate: ${candidateName} • Job: ${jobTitle}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Current Stage
          </label>
          <div className="p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">
            {currentStatus.replace('_', ' ')}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Advance To Stage *
          </label>
          {options.length === 0 ? (
            <p className="text-xs text-rose-600 font-medium">
              No further transitions are allowed from this terminal status.
            </p>
          ) : (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            >
              <option value="">Select target stage...</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace('_', ' ')}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Status Note (Visible to Student)
          </label>
          <input
            type="text"
            placeholder="e.g., Cleared initial technical screening"
            value={reasonOrNote}
            onChange={(e) => setReasonOrNote(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Internal Placement Notes (Admin Only)
          </label>
          <textarea
            rows={3}
            placeholder="Confidential interviewer feedback or evaluation remarks..."
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!selectedStatus || options.length === 0}
            isLoading={isSubmitting}
          >
            Confirm Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
