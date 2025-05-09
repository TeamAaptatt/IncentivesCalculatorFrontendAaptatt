export function validateCreateUserFormData(formData) {
    let errors = {};
  
    // CID Validation
    if (!formData.cid.trim()) {
      errors.cid = 'CID is required.';
    }else if(!/^SP\d{1,4}$/.test(formData.cid.trim())){
      errors.cid = 'Invalid Format for CID'
    }
  
    // Name Validation
    if (!formData.name.trim()) {
  errors.name = 'Name is required.';
} else if (formData.name.trim().length > 100) {
  errors.name = 'Name length cannot exceed 100 characters.';
} else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
  errors.name = 'Name must contain only letters and spaces.';
}

  
    // Email Validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }
  
    // Salary Validation
    if (!formData.salary.trim()) {
      errors.salary = 'Salary is required.';
    } else if (!/^\d+$/.test(formData.salary.trim())) {
      errors.salary = 'Salary must be a number.';
    } else if (formData.salary.trim().length > 16) {
      errors.salary = 'Salary must be at most 16 digits.';
    }
    
  
    // Date of Joining Validation
    if (!formData.joiningDate.trim()) {
      errors.joiningDate = 'Date of joining is required.';
    }
    if (!formData.skip.trim()) {
      errors.skip = 'Reporting is required';
    }
  
    // Level Validation
    if (!formData.level.trim()) {
      errors.level = 'Level is required.';
    }
  
    // Assigned Role Validation
    if (!formData.assignedRole.trim()) {
      errors.assignedRole = 'Assigned role is required.';
    }
  
    // Designation Validation
    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required.';
    }
  
    // Password Validation
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    } else if (!/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\\/]+$/g.test(formData.password)) {
      errors.password = 'Password must contain only alphanumeric characters and special characters.';
    }else if(formData.password.length >20){
      errors.password = 'Password should not exceed 20 characters'
    }  
    return errors;
  }
  