// Show loading screen immediately when script loads
if (window.Loader) {
    Loader.show();
}

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen when page is fully loaded
    if (window.Loader) {
        setTimeout(() => {
            Loader.hide();
        }, 500); // Short delay to ensure everything is rendered
    }

    const signupForm = document.getElementById('signupForm');

    // Create message elements
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';

    signupForm.appendChild(errorMessage);
    signupForm.appendChild(successMessage);

    // Check for signup error in sessionStorage
    const signupError = sessionStorage.getItem('signupError');
    if (signupError) {
        // Display error message
        errorMessage.textContent = signupError;
        errorMessage.style.display = 'block';

        // Clear error message from sessionStorage
        sessionStorage.removeItem('signupError');
    }

    // Check for signup success in sessionStorage
    const signupSuccess = sessionStorage.getItem('signupSuccess');
    if (signupSuccess) {
        // Display success message
        successMessage.textContent = signupSuccess;
        successMessage.style.display = 'block';

        // Clear success message from sessionStorage
        sessionStorage.removeItem('signupSuccess');
    }

    // Load the loader script if not already loaded
    if (!document.getElementById('loader-script')) {
        const script = document.createElement('script');
        script.id = 'loader-script';
        script.src = 'loader.js';
        document.head.appendChild(script);
    }

    // Add loading page redirect when clicking the Login link
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Store the target page in sessionStorage
            sessionStorage.setItem('redirectTo', 'login.html');

            // Navigate to loading page
            window.location.href = 'loading.html';
        });
    }

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Get form values before redirecting
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters';
            errorMessage.style.display = 'block';
            return;
        }

        // Store signup data in sessionStorage
        sessionStorage.setItem('signupName', name);
        sessionStorage.setItem('signupUsername', username);
        sessionStorage.setItem('signupPassword', password);

        // Store the target page in sessionStorage
        sessionStorage.setItem('redirectTo', 'login.html');
        sessionStorage.setItem('isSignup', 'true');

        // Navigate to loading page
        window.location.href = 'loading.html';

        // Authentication will be handled in the loading page
    });

    // Helper function to get user-friendly error messages
    function getErrorMessage(error) {
        switch(error.code) {
            case 'auth/email-already-in-use':
                return 'This email is already in use.';
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password.';
            default:
                return error.message || 'An error occurred during signup. Please try again.';
        }
    }
});