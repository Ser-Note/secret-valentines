// Bottom Navigation Active State Handler
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove active class from all nav items
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the current page's nav item
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Check if the current path matches the nav item's href
        if (href === '/logout') {
            // Logout doesn't have an active state since it redirects
            return;
        }
        
        if (currentPath === href || currentPath.startsWith(href)) {
            item.classList.add('active');
            return;
        }
    });
});
