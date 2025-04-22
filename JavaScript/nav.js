// Navbar Hamburger Toggler 
/*
The following lines of code after this comment its used for when the user clicks the hambueguer button(on mobile), the folllowing happens:
 1. A dark blured overly ppears covering the entire pge behind.
 2. When the menu is closed the overlay dissapears.
 3. If the user clicks on the overlay it automatically closes
*/ 

// Get the collapsed navbar and overlay elements
const navMenu = document.getElementById('navbarMenu');
const pageOverlay = document.getElementById('overlay');

// Show overlay when the menu is opened
navMenu.addEventListener('show.bs.collapse', () => {
    pageOverlay.style.display = 'block';
});
// Hide overlay when the menu is closed 
navMenu.addEventListener('hide.bs.collapse', () => {
    pageOverlay.style.display = 'none';
});
