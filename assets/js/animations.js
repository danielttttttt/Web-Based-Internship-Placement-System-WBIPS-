// ===== ENHANCED ANIMATIONS & INTERACTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    initEnhancedAnimations();
    initCounters();
    initProgressBars();
    initTiltEffect();
    initScrollReveal();
    initTestimonialCarousel();
    initContactForm();
    initChatWidget();
    initClock();
    initFeatureDemo();
    initParallaxEffects();
    initEnhancedHoverEffects();
});

// ===== ENHANCED ANIMATIONS =====
function initEnhancedAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Trigger counters when visible
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Trigger progress bars when visible
                if (entry.target.classList.contains('animated-progress')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.textContent = '0';
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== PROGRESS BAR ANIMATION =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill[data-width]');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateProgressBar(container) {
    const progressFill = container.querySelector('.progress-fill');
    const targetWidth = progressFill.getAttribute('data-width');
    
    setTimeout(() => {
        progressFill.style.width = targetWidth;
    }, 500);
}

// ===== TILT EFFECT =====
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', handleTilt);
        element.addEventListener('mouseleave', resetTilt);
    });
}

function handleTilt(e) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetTilt(e) {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== TESTIMONIAL CAROUSEL =====
let currentTestimonial = 1;
const totalTestimonials = 3;

function initTestimonialCarousel() {
    // Auto-rotate testimonials
    setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function changeTestimonial(direction) {
    const current = document.querySelector('.testimonial-card.active');
    const currentDot = document.querySelector('.dot.active');
    
    current.classList.remove('active');
    currentDot.classList.remove('active');
    
    currentTestimonial += direction;
    
    if (currentTestimonial > totalTestimonials) {
        currentTestimonial = 1;
    } else if (currentTestimonial < 1) {
        currentTestimonial = totalTestimonials;
    }
    
    showTestimonial(currentTestimonial);
}

function showTestimonial(n) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    testimonials[n - 1].classList.add('active');
    dots[n - 1].classList.add('active');
    
    currentTestimonial = n;
}

// ===== CONTACT FORM =====
let currentStep = 1;
const totalSteps = 3;

function initContactForm() {
    const form = document.getElementById('contactForm');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // Next step buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                nextStep();
            }
        });
    });
    
    // Previous step buttons
    prevBtns.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
    
    // Character counter
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                charCount.style.color = 'var(--error)';
            } else {
                charCount.style.color = 'var(--gray-500)';
            }
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        currentStep++;
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        updateProgressBar();
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        currentStep--;
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        updateProgressBar();
    }
}

function updateProgressBar() {
    const progressFill = document.querySelector('.form-progress .progress-fill');
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
}

function validateStep(step) {
    const currentStepElement = document.querySelector(`[data-step="${step}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset form
            document.getElementById('contactForm').reset();
            currentStep = 1;
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.querySelector('[data-step="1"]').classList.add('active');
            updateProgressBar();
            
            // Reset button
            btnText.style.display = 'inline-flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
        }, 2000);
    }
}

// ===== CHAT WIDGET =====
function initChatWidget() {
    const chatInput = document.getElementById('chatInput');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.toggle('active');
    
    // Remove notification when opened
    if (chatWidget.classList.contains('active')) {
        const notification = chatWidget.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage(message, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            addChatMessage('Thank you for your message! Our team will get back to you shortly.', 'bot');
        }, 1000);
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== CLOCK =====
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        clockElement.textContent = timeString;
    }
}

// ===== FEATURE DEMO =====
function initFeatureDemo() {
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoPanels = document.querySelectorAll('.demo-panel');
    
    demoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDemo = tab.getAttribute('data-demo');
            
            // Remove active class from all tabs and panels
            demoTabs.forEach(t => t.classList.remove('active'));
            demoPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.add('active');
            document.getElementById(`demo-${targetDemo}`).classList.add('active');
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Map functions (placeholders for actual map integration)
function openMap() {
    showNotification('Opening map...', 'info');
}

function getDirections() {
    showNotification('Getting directions...', 'info');
}

function openInMaps() {
    window.open('https://maps.google.com/?q=St.+Mary+University+Addis+Ababa', '_blank');
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax:not(.footer):not(.footer *)');

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                // Ensure we're not affecting footer elements
                if (!element.closest('.footer')) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        });
    }
}

// ===== ENHANCED HOVER EFFECTS =====
function initEnhancedHoverEffects() {
    // Add magnetic effect to buttons
    const magneticElements = document.querySelectorAll('.btn-primary, .feature-card, .dashboard-card');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });

    // Add ripple effect to buttons
    const rippleButtons = document.querySelectorAll('.btn');

    rippleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}
