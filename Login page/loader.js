/**
 * Utility functions for showing and hiding the loading screen
 */

const Loader = {
    /**
     * Creates and shows the loading overlay
     */
    show: function() {
        // Create container if it doesn't exist
        if (!document.querySelector('.loader-overlay')) {
            // Create the overlay
            const overlay = document.createElement('div');
            overlay.className = 'loader-overlay';
            
            // Create the loader container
            const container = document.createElement('div');
            container.className = 'container';
            
            // Create the loader
            const loader = document.createElement('div');
            loader.className = 'loader';
            
            // Create crystals
            for (let i = 0; i < 6; i++) {
                const crystal = document.createElement('div');
                crystal.className = 'crystal';
                loader.appendChild(crystal);
            }
            
            // Create loading text
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.textContent = 'Loading...';
            
            // Assemble the elements
            container.appendChild(loader);
            container.appendChild(loadingText);
            overlay.appendChild(container);
            
            // Add styles if not already loaded
            if (!document.getElementById('loader-styles')) {
                const style = document.createElement('style');
                style.id = 'loader-styles';
                style.textContent = `
                    .loader-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        background: url('Assets/background-auth.jpg') no-repeat center center fixed;
                        background-size: cover;
                    }

                    /* Strong blur overlay for the background */
                    .loader-overlay::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: inherit;
                        background-attachment: fixed;
                        background-position: center;
                        background-size: cover;
                        filter: blur(20px); /* Very heavy blur effect */
                        opacity: 0.95;
                        z-index: -2;
                    }

                    /* Additional overlay for better contrast */
                    .loader-overlay::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(43, 27, 61, 0.4); /* Dark Indigo with opacity */
                        z-index: -1;
                    }
                    
                    /* Loading container */
                    .loader-overlay .container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 40px;
                        position: relative;
                        z-index: 1; /* Ensure content appears above the blurred background */
                    }
                    
                    /* Crystal loader */
                    .loader-overlay .loader {
                        position: relative;
                        width: 200px;
                        height: 200px;
                        perspective: 800px;
                        z-index: 2; /* Ensure loader appears above the blurred background */
                    }
                    
                    .loader-overlay .crystal {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 60px;
                        height: 60px;
                        opacity: 0;
                        transform-origin: bottom center;
                        transform: translate(-50%, -50%) rotateX(45deg) rotateZ(0deg);
                        animation: spin 4s linear infinite, emerge 2s ease-in-out infinite alternate,
                            fadeIn 0.3s ease-out forwards;
                        border-radius: 10px;
                        visibility: hidden;
                        box-shadow: 0 0 20px rgba(184, 166, 217, 0.7), 0 0 40px rgba(184, 166, 217, 0.3); /* Enhanced glow */
                        z-index: 2;
                    }
                    
                    @keyframes spin {
                        from {
                            transform: translate(-50%, -50%) rotateX(45deg) rotateZ(0deg);
                        }
                        to {
                            transform: translate(-50%, -50%) rotateX(45deg) rotateZ(360deg);
                        }
                    }
                    
                    @keyframes emerge {
                        0%,
                        100% {
                            transform: translate(-50%, -50%) scale(0.5);
                            opacity: 0;
                        }
                        50% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes fadeIn {
                        to {
                            visibility: visible;
                            opacity: 0.8;
                        }
                    }
                    
                    /* Crystal colors */
                    .loader-overlay .crystal:nth-child(1) {
                        background: linear-gradient(45deg, #2B1B3D, #4A2E6F);
                        animation-delay: 0s;
                    }
                    
                    .loader-overlay .crystal:nth-child(2) {
                        background: linear-gradient(45deg, #4A2E6F, #6D5F99);
                        animation-delay: 0.3s;
                    }
                    
                    .loader-overlay .crystal:nth-child(3) {
                        background: linear-gradient(45deg, #6D5F99, #B8A6D9);
                        animation-delay: 0.6s;
                    }
                    
                    .loader-overlay .crystal:nth-child(4) {
                        background: linear-gradient(45deg, #B8A6D9, #C0B7C8);
                        animation-delay: 0.9s;
                    }
                    
                    .loader-overlay .crystal:nth-child(5) {
                        background: linear-gradient(45deg, #C0B7C8, #F1EEF7);
                        animation-delay: 1.2s;
                    }
                    
                    .loader-overlay .crystal:nth-child(6) {
                        background: linear-gradient(45deg, #4A2E6F, #2B1B3D);
                        animation-delay: 1.5s;
                    }
                    
                    /* Loading text */
                    .loader-overlay .loading-text {
                        font-size: 1.5rem;
                        letter-spacing: 3px;
                        color: #F1EEF7;
                        text-shadow: 0 0 10px rgba(184, 166, 217, 0.8), 0 0 20px rgba(0, 0, 0, 0.5); /* Enhanced glow with shadow */
                        animation: pulse 1.5s ease-in-out infinite;
                        font-weight: 600;
                        position: relative;
                        z-index: 2;
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 0.5;
                        }
                        50% {
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add to document
            document.body.appendChild(overlay);
        } else {
            // Show existing overlay
            document.querySelector('.loader-overlay').style.display = 'flex';
        }
    },
    
    /**
     * Hides the loading overlay
     */
    hide: function() {
        const overlay = document.querySelector('.loader-overlay');
        if (overlay) {
            // Hide the overlay
            overlay.style.display = 'none';
        }
    },
    
    /**
     * Shows the loader for a specified duration
     * @param {number} duration - Duration in milliseconds
     * @returns {Promise} - Resolves when the loader is hidden
     */
    showFor: function(duration) {
        return new Promise((resolve) => {
            this.show();
            setTimeout(() => {
                this.hide();
                resolve();
            }, duration);
        });
    }
};

// Export the Loader object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Loader;
}