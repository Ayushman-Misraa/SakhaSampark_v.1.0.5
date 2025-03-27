# Authentication System with Loading Animation

A beautiful authentication system with glass morphism design and crystal loading animation.

## Features

- Login and Signup pages with Firebase authentication
- Glass morphism UI design
- Crystal loading animation
- Responsive design
- Performance optimized

## Theme Colors

The website uses the following color scheme:

- **Soft Lavender (#B8A6D9)**: Background, Light Accents
- **Deep Purple (#4A2E6F)**: Header, Footers, Primary Buttons
- **Cool Gray (#C0B7C8)**: Text, Borders, Secondary Buttons
- **Dark Indigo (#2B1B3D)**: Background, Navigation Bar
- **Snow White (#F1EEF7)**: Text on Dark Backgrounds
- **Muted Blue (#6D5F99)**: Links, Hover Effects, Highlights

## Pages

1. **Loading Page**: Displays a crystal animation while content loads
2. **Login Page**: Username and password fields for authentication
3. **Signup Page**: Registration form with name, username, password fields
4. **Welcome Page**: Landing page after successful authentication

## Loading Animation

The loading animation can be used in two ways:

1. **Standalone Page**: Navigate to `loading.html` to see the full-page loading animation
2. **Overlay**: The loading animation can be triggered programmatically using:

```javascript
// Show loading overlay
Loader.show();

// Hide loading overlay
Loader.hide();

// Show loading for a specific duration
Loader.showFor(2000).then(() => {
    console.log('Loading complete!');
});
```

## Files

- **loading.html**: Standalone loading page
- **loading.css**: Styles for the loading animation
- **loader.js**: Utility script for showing/hiding the loading overlay
- **login.html/js**: Login page and functionality
- **signup.html/js**: Signup page and functionality
- **index.html**: Welcome page after authentication
- **styles.css**: Shared styles for all pages
- **firebase-config.js**: Firebase configuration

## Usage

1. Open `loading.html` to see the loading animation
2. The animation will automatically redirect to the login page after 3 seconds
3. Login or signup to access the welcome page
4. The loading animation will appear during authentication processes