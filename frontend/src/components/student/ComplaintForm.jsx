import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  School, FlaskConical, Home as HomeIcon, Monitor, BookOpen,
  MapPin, AlertCircle, ArrowRight, ArrowLeft, Send, Loader2,
  FileText, Search,
} from 'lucide-react';
import StepIndicator from '@/components/ui/stepindicator.jsx';
import ImageUpload from '@/components/ui/imageupload.jsx';

const CATEGORIES = [
  { value: 'classroom', label: 'Classroom', icon: School },
  { value: 'lab', label: 'Laboratory', icon: FlaskConical },
  { value: 'hostel', label: 'Hostel', icon: HomeIcon },
  { value: 'it', label: 'IT Infrastructure', icon: Monitor },
  { value: 'library', label: 'Library', icon: BookOpen },
];

const ROOM_SUGGESTIONS = [
  'Room 101 - Main Building', 'Room 102 - Main Building', 'Room 201 - Science Block',
  'Lab A - Engineering Block', 'Lab B - Engineering Block', 'Computer Lab 1 - IT Wing',
  'Hostel Block A - Room 101', 'Hostel Block A - Room 102', 'Library - Ground Floor',
  'Cafeteria - Main Building', 'Sports Complex',
];

const STEPS = [
  { label: 'Details', description: 'Basic info' },
  { label: 'Review', description: 'Verify' },
  { label: 'Submit', description: 'Done' },
];

const MAX_DESC = 500;

export default function ComplaintForm({ onSubmit }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [existingComplaints, setExistingComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [showExistingComplaints, setShowExistingComplaints] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  useEffect(() => {
    const fetchExistingComplaints = async () => {
      try {
        setComplaintsLoading(true);

        const response = await makeAuthenticatedRequest(`${BACKEND_URL}/api/complaints/`);
        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to fetch complaints:', data);
          return;
        }

        setExistingComplaints(data.complaints || []);
      } catch (error) {
        if (error.message === 'No authentication token found') {
          return;
        }
        console.error('Error fetching complaints:', error);
      } finally {
        setComplaintsLoading(false);
      }
    };

    fetchExistingComplaints();
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { title: '', category: '', location: '', description: '' },
  });

  const values = watch();
  const descLen = values.description?.length || 0;
  const isStep1Valid = values.title && values.category && values.location && values.description && descLen <= MAX_DESC;

  const handleFinalSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await makeAuthenticatedRequest(`${BACKEND_URL}/api/complaints/`, {
        method: 'POST',
        body: JSON.stringify({
          category: data.category,
          title: data.title,
          description: data.description,
          priority: 'medium',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to submit complaint');
        return;
      }

      navigate('/success', {
        state: {
          complaint: result.complaint,
          message: result.message,
        },
      });
    } catch (error) {
      if (error.message === 'No authentication token found') {
        alert('Please login first');
        navigate('/login');
        return;
      }
      console.error('Error submitting complaint:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Register a Complaint</h2>
          <p className="text-slate-500 text-sm mt-1">Provide details to help us resolve your issue faster.</p>
        </div>

        <StepIndicator currentStep={step} steps={STEPS} />

        <form onSubmit={handleSubmit(handleFinalSubmit)} className="mt-6 space-y-5">
          {/* ── STEP 1 ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Complaint Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Brief summary of your complaint"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
                {errors.title && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CATEGORIES.map(({ value, label, icon: Icon }) => {
                    const active = values.category === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('category', value)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                          active
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
                {!values.category && errors.category && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> Please select a category
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location / Room *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('location', { required: 'Location is required' })}
                    placeholder="e.g., Room 101 - Main Building"
                    list="room-list"
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  />
                  <datalist id="room-list">
                    {ROOM_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
                  </datalist>
                </div>
                {errors.location && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.location.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-700">Description *</label>
                  <span className={`text-xs font-medium ${
                    descLen > MAX_DESC ? 'text-red-600' : descLen > MAX_DESC * 0.8 ? 'text-amber-600' : 'text-slate-400'
                  }`}>{descLen}/{MAX_DESC}</span>
                </div>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    maxLength: { value: MAX_DESC, message: `Max ${MAX_DESC} characters` },
                  })}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                />
                {errors.description && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.description.message}
                  </p>
                )}
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Attach Image <span className="text-slate-400 font-normal">(Optional)</span></label>
                <ImageUpload image={image} onImageChange={setImage} />
              </div>

              {/* Existing Complaints Check */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">Check Existing Complaints</label>
                  <button
                    type="button"
                    onClick={() => setShowExistingComplaints(!showExistingComplaints)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    {showExistingComplaints ? 'Hide' : 'Show'} Recent Complaints
                    <Search className="w-3 h-3" />
                  </button>
                </div>

                {showExistingComplaints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Your Recent Complaints</span>
                    </div>

                    {complaintsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span className="text-sm text-slate-500 ml-2">Loading...</span>
                      </div>
                    ) : existingComplaints.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No complaints found.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {existingComplaints.slice(0, 5).map((complaint) => (
                          <div key={complaint.complaint_id} className="bg-white border border-slate-200 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{complaint.title}</p>
                                <p className="text-xs text-slate-500">{complaint.category} • {complaint.status}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'Unknown date'}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                complaint.status === 'in-progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {existingComplaints.length > 5 && (
                          <p className="text-xs text-slate-500 text-center pt-2">
                            And {existingComplaints.length - 5} more complaints...
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 mt-3">
                      Check if your issue has already been reported before submitting a new complaint.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-blue-900 mb-4">Review Your Complaint</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Title', value: values.title },
                    { label: 'Category', value: CATEGORIES.find((c) => c.value === values.category)?.label },
                    { label: 'Location', value: values.location },
                    { label: 'Description', value: values.description },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex border-b border-blue-100 pb-3 last:border-0 last:pb-0">
                      <span className="text-xs font-semibold text-blue-700 w-28 shrink-0">{label}</span>
                      <span className="text-sm text-slate-800 flex-1 whitespace-pre-wrap">{value}</span>
                    </div>
                  ))}
                  {image && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-semibold text-blue-700 w-28 shrink-0">Attachment</span>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-blue-200">
                          <img src={URL.createObjectURL(image)} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-slate-600">{image.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Please verify all details before submitting.</p>
                  <p className="text-xs text-amber-700 mt-0.5">Once submitted, the complaint will be assigned to the appropriate team.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ACTIONS ── */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} disabled={submitting}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step === 1 && (
              <button type="button" onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Review <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button type="submit" disabled={submitting}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit Complaint</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
