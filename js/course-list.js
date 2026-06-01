$(document).ready(function() {
    // Sidebar toggle for mobile
    $('#hamburgerBtn').on('click', function() {
        $(this).toggleClass('is-active');
        $('#sidebar').toggleClass('is-open');
        $('#sidebarOverlay').toggleClass('is-active');
    });

    $('#sidebarOverlay').on('click', function() {
        $('#hamburgerBtn').removeClass('is-active');
        $('#sidebar').removeClass('is-open');
        $(this).removeClass('is-active');
    });

    // Course Filtering logic
    $('.filter-item').on('click', function() {
        // Update active class
        $('.filter-item').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).attr('data-filter');

        if (filterValue === 'all') {
            $('.course-card-wrapper').show();
        } else {
            $('.course-card-wrapper').hide();
            $('.course-card-wrapper[data-category="' + filterValue + '"]').show();
        }
    });

    // Course Search logic
    $('#courseSearchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.course-card-wrapper').each(function() {
            const title = $(this).find('.course-card__title').text().toLowerCase();
            const desc = $(this).find('.course-card__desc').text().toLowerCase();
            
            // Allow filtering across active categories, but for simplicity, show matching cards
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                // If it matches search term, check if it matches the current category filter
                const currentFilter = $('.filter-item.active').attr('data-filter');
                if (currentFilter === 'all' || $(this).attr('data-category') === currentFilter) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                $(this).hide();
            }
        });
    });
});
