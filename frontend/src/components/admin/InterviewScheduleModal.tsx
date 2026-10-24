import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { InterviewType } from '../../types';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  onSuccess: () => void;
}

export const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
  onSuccess,
}) => {
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundName, setRoundName] = useState('Technical Round 1');
  const [interviewType, setInterviewType] = useState<InterviewType>('ONLINE');
  const [scheduledTime, setScheduledTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [locationOrUrl, setLocationOrUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledTime) {
      error('Please select an interview date and time');
      return;
    }

    const isoDate = new Date(scheduledTime).toISOString();

    setIsSubmitting(true);
    try {
      await api.post(`/api/admin/applications/${applicationId}/interviews`, {
        roundNumber,
        roundName: roundName.trim(),
        interviewType,
        scheduledTime: isoDate,
        durationMinutes,
        locationOrUrl: locationOrUrl.trim() || undefined,
        instructions: instructions.trim() || undefined,
      });

      success('Interview scheduled and student notified');
      onSuccess();
      onClose();
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Interview Round"
      description={`Candidate: ${candidateName} • Job: ${jobTitle}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Round Name *
            </label>
            <input
              type="text"
              required
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="e.g. Technical Round 1"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Round Number
            </label>
            <input
              type="number"
              min={1}
              value={roundNumber}
              onChange={(e) => setRoundNumber(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Interview Format *
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as InterviewType)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ONLINE">Online (Video Conference)</option>
              <option value="IN_PERSON">In-Person (On Campus)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Duration (Minutes) *
            </label>
            <input
              type="number"
              min={15}
              max={300}
              step={15}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 45)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            required
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {interviewType === 'ONLINE' ? 'Meeting Link (URL)' : 'Campus Location / Room'}
          </label>
          <input
            type="text"
            placeholder={
              interviewType === 'ONLINE'
                ? 'https://meet.google.com/xyz-abcd-efg'
                : 'Placement Cell Interview Room 3'
            }
            value={locationOrUrl}
            onChange={(e) => setLocationOrUrl(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Special Instructions for Student
          </label>
          <textarea
            rows={2}
            placeholder="Please have your camera active and keep your photo ID ready..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Schedule & Notify Student
          </Button>
        </div>
      </form>
    </Modal>
  );
};
