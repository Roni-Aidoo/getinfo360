// Mobile menu toggle
function toggleMobileMenu() {
    
}

// Responsive menu handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
        document.getElementById('nav-menu').style.display = 'flex';
    } else {
        document.getElementById('nav-menu').style.display = 'flex';
        document.querySelector('.mobile-menu i').className = 'fas fa-circle-user';
    }
});


document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Full article page coming soon! This is a demo.');
    });
});

document.querySelectorAll('.category-list a, .archive-list a, .tag').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Category filter feature coming soon!');
    });
});