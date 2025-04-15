export function validateFormData(formData) {
  const errors = {};

  if (!formData.candidate?.trim()) {
    errors.candidate = 'Please enter candidate name.';
  } else if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)?$/.test(formData.candidate?.trim())) {
    errors.candidate = 'Candidate name must contain only letters.';
  }else if(formData.candidate.length > 100){
    errors.candidate = "Name should be less than or equal to 100 characters.";
  }
  if (!formData.client?.trim()) {
    errors.client = 'Please enter client name.';
  } else if (!/^[\w\s.-]+$/.test(formData.client.trim())) {
    errors.client = 'Client name must contain only letters, numbers, spaces, dots, and hyphens.';
  }else if(formData.client.length > 100){
    errors.client = "Name should be less than or equal to 100 characters.";
  }
  
  if (!formData.offeredPosition?.trim()) {
    errors.offeredPosition = 'Please enter offered position.';
  }else if(formData.offeredPosition.length > 80){
    errors.offeredPosition = "Name should be less than or equal to 80 characters.";
  }
  if (!formData.offeredDate) {
    errors.offeredDate = 'Please select offered date.';
  }

  if (!formData.dateOfJoining) {
    errors.dateOfJoining = 'Please select date of joining.';
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
  } else if(formData.resumeSource.length>100){
    errors.resumeSource = "Resume Source Should not be greater than  100 Characters";
  }
  if (!formData.billableSalary) {
    errors.billableSalary = 'Please Enter Billable Source.';
  }else if (!/^\d+$/.test(formData.billableSalary)) {
    errors.billableSalary = 'Billable must contain only numbers.';
  }else if(formData.billableSalary.length>16){
    errors.billableSalary="Billable Salary Must Be Less Than Or Equal To 16 Digits"
  }
  if (!formData.commercial) {
    errors.commercial = 'Please Enter Commercial.';
} else if (!/^\d+(\.\d+)?$/.test(formData.commercial)) {
    errors.commercial = 'Commercial must contain only numbers.';
}else if(formData.commercial.length>5){
  errors.commercial='Commercial Field Can Contain Only Five Digits.'  
}
 
  if (!formData.fee) {
    errors.fee = 'Please Enter Fee.';
  } else if (!/^\d+$/.test(formData.fee)) {
    errors.fee = 'Fee must contain only numbers.';
  }else if(formData.fee.length>16){
    errors.fee="Fee Must Be Less Than Or Equal To 16 Digits"
  }
   if (formData.sendOff &&  !/^\d+$/.test(formData.sendOff)) {
    errors.sendOff = 'Send Off must contain only numbers.';
  }
  // if (!formData.securityPeriod) {
  //   errors.securityPeriod= 'Please Select Security Period .';
  // } 
  // if (!formData.paymentStaus) {
  //   errors.paymentStaus= 'Please Select Payment  Status.' ;
  // }
  
        
  
  return errors;
}
