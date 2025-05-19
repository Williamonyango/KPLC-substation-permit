export const resetForm = (setFormData, setIsSubmitted) => {
    const now = new Date();
    setFormData({
      permit_number: '',
      issued_to: '',
      substation: '',
      work_details: ['', '', ''],
      safe_work_limits: '',
      safe_hv_work_limits: '',
      mv_lv_equipment: '',
      earth_points: ['', '', ''],
      additional_earth_connections: '',
      consent_person: '',
      issue_date: now.toISOString().split('T')[0],
      issue_time: now.toLocaleTimeString('en-GB', { hour12: false }),
      comments: null,
      approver_name: null,
      approval_date: null,
      approval_time: null,
      urgency: '',
      status: 'pending',
      clearance_date: now.toISOString().split('T')[0],
      clearance_time: now.toLocaleTimeString('en-GB', { hour12: false }),
      clearance_signature: null,
      connections: '',
      cancellation_consent_person: '',
      cancellation_signature: null,
      submitted_at: now.toLocaleTimeString('en-GB', { hour12: false }),
    });
    setIsSubmitted(false);
  };
  