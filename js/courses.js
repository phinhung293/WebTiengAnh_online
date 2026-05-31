$(document).ready(function() {
    $('.filter-btn').on('click', function() {
        // Xóa class active ở tất cả các nút
        $('.filter-btn').removeClass('active');
        
        // Thêm class active cho nút được click
        $(this).addClass('active');
        
        // Lấy giá trị data-filter
        const filter = $(this).attr('data-filter');
        
        // Lặp qua các course-item
        $('.course-item').each(function() {
            if (filter === 'all' || $(this).hasClass(filter)) {
                // Hiển thị lại với animation mượt hơn (tuỳ chọn fade)
                $(this).fadeIn(300);
            } else {
                $(this).hide();
            }
        });
    });

    // Kích hoạt bộ lọc ban đầu nếu có nút active
    if ($('.filter-btn.active').length > 0) {
        // Chỉ trigger thay đổi giao diện các khoá học dựa trên active
        const initFilter = $('.filter-btn.active').attr('data-filter');
        $('.course-item').each(function() {
            if (initFilter === 'all' || $(this).hasClass(initFilter)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
});