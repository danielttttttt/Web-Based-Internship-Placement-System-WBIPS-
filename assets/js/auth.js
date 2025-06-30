// ===== AUTHENTICATION JAVASCRIPT =====

// ===== AUTHENTICATION UTILITIES =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers
    };
}

function validatePhone(phone) {
    // Basic phone validation for Ethiopian numbers
    const phoneRegex = /^(\+251|0)?[79]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ===== FORM VALIDATION =====
function validateForm(form) {
    const formData = new FormData(form);
    const errors = [];
    
    // Email validation
    const email = formData.get('email');
    if (!email || !validateEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    const password = formData.get('password');
    if (!password) {
        errors.push('Password is required');
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            if (!passwordValidation.minLength) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!passwordValidation.hasUpperCase) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!passwordValidation.hasLowerCase) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!passwordValidation.hasNumbers) {
                errors.push('Password must contain at least one number');
            }
        }
    }
    
    // Confirm password validation (for registration)
    const confirmPassword = formData.get('confirmPassword');
    if (confirmPassword && password !== confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    // Phone validation
    const phone = formData.get('phone');
    if (phone && !validatePhone(phone)) {
        errors.push('Please enter a valid Ethiopian phone number');
    }
    
    // Required fields validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            const label = form.querySelector(`label[for="${field.id}"]`);
            const fieldName = label ? label.textContent : field.name;
            errors.push(`${fieldName} is required`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ===== AUTHENTICATION API SIMULATION =====
function simulateLogin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock authentication logic
            const mockUsers = {
                'student@example.com': {
                    password: 'student123',
                    role: 'student',
                    firstName: 'John',
                    lastName: 'Doe',
                    university: 'St. Mary University',
                    department: 'Computer Science'
                },
                'company@example.com': {
                    password: 'company123',
                    role: 'company',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    companyName: 'TechCorp Solutions',
                    industry: 'Technology'
                },
                'coordinator@example.com': {
                    password: 'coordinator123',
                    role: 'coordinator',
                    firstName: 'Dr. Ahmed',
                    lastName: 'Hassan',
                    university: 'St. Mary University',
                    faculty: 'Engineering'
                }
            };
            
            const user = mockUsers[credentials.email];
            
            if (user && user.password === credentials.password) {
                const userData = {
                    ...user,
                    email: credentials.email,
                    loginTime: new Date().toISOString(),
                    sessionId: generateSessionId()
                };
                delete userData.password; // Remove password from session data
                resolve(userData);
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1500); // Simulate network delay
    });
}

function simulateRegistration(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Mock registration logic
            const existingEmails = [
                'student@example.com',
                'company@example.com',
                'coordinator@example.com'
            ];
            
            if (existingEmails.includes(userData.email)) {
                reject(new Error('Email already exists'));
            } else {
                const newUser = {
                    ...userData,
                    registrationTime: new Date().toISOString(),
                    sessionId: generateSessionId(),
                    isVerified: false
                };
                delete newUser.password; // Remove password from session data
                resolve(newUser);
            }
        }, 2000); // Simulate network delay
    });
}

// ===== SESSION MANAGEMENT =====
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

function saveUserSession(userData) {
    try {
        localStorage.setItem('userSession', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error saving user session:', error);
        return false;
    }
}

function getUserSession() {
    try {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Error getting user session:', error);
        return null;
    }
}

function clearUserSession() {
    try {
        localStorage.removeItem('userSession');
        return true;
    } catch (error) {
        console.error('Error clearing user session:', error);
        return false;
    }
}

function isUserLoggedIn() {
    const session = getUserSession();
    return session && session.sessionId;
}

// ===== PASSWORD UTILITIES =====
function generateStrongPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special character
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function getPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Add special characters');
    
    const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
    const color = ['#ff4444', '#ff8800', '#ffaa00', '#88cc00', '#00cc44'][score];
    
    return {
        score,
        strength,
        color,
        feedback
    };
}

// ===== ROLE-BASED REDIRECTS =====
function getDefaultDashboard(role) {
    const dashboards = {
        student: 'student-dashboard.html',
        company: 'company-dashboard.html',
        coordinator: 'coordinator-dashboard.html',
        admin: 'admin-dashboard.html'
    };
    
    return dashboards[role] || 'student-dashboard.html';
}

function redirectToRoleDashboard(role) {
    const dashboard = getDefaultDashboard(role);
    window.location.href = dashboard;
}

// ===== FORM HELPERS =====
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-1)';
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(element => element.remove());
    
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// ===== EXPORT FUNCTIONS =====
if (typeof window !== 'undefined') {
    window.authUtils = {
        validateEmail,
        validatePassword,
        validatePhone,
        validateForm,
        simulateLogin,
        simulateRegistration,
        saveUserSession,
        getUserSession,
        clearUserSession,
        isUserLoggedIn,
        generateStrongPassword,
        getPasswordStrength,
        getDefaultDashboard,
        redirectToRoleDashboard,
        showFieldError,
        clearFieldError,
        clearAllErrors
    };
}
