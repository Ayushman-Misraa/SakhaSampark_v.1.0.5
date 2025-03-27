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

    const loginForm = document.getElementById('loginForm');

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    loginForm.appendChild(errorMessage);

    // Check for login error in sessionStorage
    const loginError = sessionStorage.getItem('loginError');
    if (loginError) {
        // Display error message
        errorMessage.textContent = loginError;
        errorMessage.style.display = 'block';

        // Clear error message from sessionStorage
        sessionStorage.removeItem('loginError');
    }

    // Load the loader script if not already loaded
    if (!document.getElementById('loader-script')) {
        const script = document.createElement('script');
        script.id = 'loader-script';
        script.src = 'loader.js';
        document.head.appendChild(script);
    }

    // Add loading page redirect when clicking the Sign Up link
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Store the target page in sessionStorage
            sessionStorage.setItem('redirectTo', 'signup.html');

            // Navigate to loading page
            window.location.href = 'loading.html';
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values before redirecting
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Store login credentials in sessionStorage
        sessionStorage.setItem('loginUsername', username);
        sessionStorage.setItem('loginPassword', password);

        // Store the target page in sessionStorage
        sessionStorage.setItem('redirectTo', 'index.html');
        sessionStorage.setItem('isLogin', 'true');

        // Navigate to loading page
        window.location.href = 'loading.html';

        // Authentication will be handled in the loading page
    });

    // Helper function to get user-friendly error messages
    function getErrorMessage(error) {
        switch(error.code) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid username or password.';
            default:
                return error.message || 'An error occurred during login. Please try again.';
        }
    }
});