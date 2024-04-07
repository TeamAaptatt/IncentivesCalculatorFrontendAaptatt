export function validateFormData(formData) {
  const errors = {};

  if (!formData.candidate.trim()) {
    errors.candidate = 'Please enter candidate name.';
  } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/.test(formData.candidate.trim())) {
    errors.candidate = 'Candidate name must contain only letters.';
  }
  if (!formData.client.trim()) {
    errors.client = 'Please enter client name.';
  }else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/.test(formData.client.trim())) {
    errors.client = 'Client name must contain only letters.';
  }
  if (!formData.offeredPosition.trim()) {
    errors.offeredPosition = 'Please enter offered position.';
  }
  if (!formData.dateOfJoining) {
    errors.dateOfJoining = 'Please select date of joining.';
  }
  if (!formData.cnadidateOwner) {
    errors.cnadidateOwner = 'Please select Candidate Owner.';
  } 
  if (!formData.accountManager) {
    errors.accountManager = 'Please select Account Manager.';
  } 
  if (!formData.accountHead) {
    errors.accountHead = 'Please select Account Head.';
  } 
  if (!formData.pandLhead) {
    errors.pandLhead = 'Please select P & L Head.';
  } 
  if (!formData.resumeSource) {
    errors.resumeSource = 'Please Enter Resume Source.';
  } 
  if (!formData.billableSalary) {
    errors.billableSalary = 'Please Enter Billable Source.';
  }else if (!/^\d+$/.test(formData.billableSalary)) {
    errors.billableSalary = 'Billable must contain only numbers.';
  } 
  if (!formData.commercial) {
    errors.commercial = 'Please Enter Comercial.';
  }else if (!/^\d+$/.test(formData.commercial)) {
    errors.commercial = 'Commercial must contain only numbers.';
  } 
  if (!formData.fee) {
    errors.fee = 'Please Enter Fee.';
  } else if (!/^\d+$/.test(formData.fee)) {
    errors.fee = 'Fee must contain only numbers.';
  }
   if (formData.sendOff &&  !/^\d+$/.test(formData.sendOff)) {
    errors.sendOff = 'Send Off must contain only numbers.';
  }
  if (!formData.securityPeriod) {
    errors.securityPeriod= 'Please Select Security Period .';
  } 
  if (!formData.paymentStaus) {
    errors.paymentStaus= 'Please Select Payment  Status.' ;
  }
  
        
  
  return errors;
}
