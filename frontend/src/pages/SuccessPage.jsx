import { useLocation, useNavigate } from 'react-router-dom';
import SuccessModal from '../components/student/SuccessModal.jsx';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { complaint, message } = location.state || {};
  const complaintId = complaint?.complaint_id || complaint?.id || 'Unknown';

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleViewStatus = () => {
    navigate('/status');
  };

  return (
    <SuccessModal
      isOpen={true}
      onClose={handleClose}
      complaintId={complaintId}
      onViewStatus={handleViewStatus}
    />
  );
}