// course-script.js - Dành riêng cho course.html
$(document).ready(function() {
    
    // ===================================================
    // KIỂM TRA ĐĂNG NHẬP & HIỂN THỊ TÊN NGƯỜI DÙNG
    // ===================================================
    const currentEmail = localStorage.getItem('moonsilk_email');
    const users = JSON.parse(localStorage.getItem('moonsilk_users')) || [];
    
    if (!currentEmail) {
        // Chưa đăng nhập, chuyển về trang chủ
        window.location.replace("../index.html");
        return;
    }
    
    const currentUser = users.find(u => u.email === currentEmail);
    if (currentUser) {
        $('#displayName').text(currentUser.name);
    }
    
    // ===================================================
    // XỬ LÝ ĐĂNG XUẤT
    // ===================================================
    $('#btnLogout').on('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('moonsilk_email');
        window.location.href = "../index.html";
    });
    
    // ===================================================
    // NÚT BACK TO DASHBOARD
    // ===================================================
    $('#backToCourseBtn').on('click', function() {
        window.location.href = "dashboard.html";
    });
    
    // ===================================================
    // SIDEBAR MOBILE TOGGLE
    // ===================================================
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
    
    // ===================================================
    // TAB SWITCHING
    // ===================================================
    $('.lesson-tabs__item').on('click', function() {
        const tabId = $(this).data('tab');
        
        // Update active tab style
        $('.lesson-tabs__item').removeClass('lesson-tabs__item--active');
        $(this).addClass('lesson-tabs__item--active');
        
        // Hide all tab contents
        $('.tab-content').hide();
        
        // Show selected tab content
        if (tabId === 'overview') $('#tabOverview').show();
        else if (tabId === 'notes') $('#tabNotes').show();
        else if (tabId === 'practice') $('#tabPractice').show();
        else if (tabId === 'quiz') $('#tabQuiz').show();
        else if (tabId === 'discussion') $('#tabDiscussion').show();
    });
    
    // ===================================================
    // NOTES SAVE (Lưu vào localStorage)
    // ===================================================
    const savedNotes = localStorage.getItem('moonsilk_lesson_notes');
    if (savedNotes) {
        $('#noteArea').val(savedNotes);
        $('#noteCounter').text(savedNotes.length + '/500');
    }
    
    const savedQuickNote = localStorage.getItem('moonsilk_quick_note');
    if (savedQuickNote) {
        $('#quickNoteArea').val(savedQuickNote);
        $('#quickNoteCounter').text(savedQuickNote.length + '/200');
    }
    
    // Note counter
    $('#noteArea').on('input', function() {
        let len = $(this).val().length;
        if (len > 500) {
            $(this).val($(this).val().substring(0, 500));
            len = 500;
        }
        $('#noteCounter').text(len + '/500');
    });
    
    $('#quickNoteArea').on('input', function() {
        let len = $(this).val().length;
        if (len > 200) {
            $(this).val($(this).val().substring(0, 200));
            len = 200;
        }
        $('#quickNoteCounter').text(len + '/200');
    });
    
    // Save notes
    $('#saveNoteBtn').on('click', function() {
        const notes = $('#noteArea').val();
        localStorage.setItem('moonsilk_lesson_notes', notes);
        alert('✅ Notes saved successfully!');
    });
    
    $('#saveQuickNoteBtn').on('click', function() {
        const quickNote = $('#quickNoteArea').val();
        localStorage.setItem('moonsilk_quick_note', quickNote);
        alert('✅ Quick note saved!');
    });
    
    // ===================================================
    // VIDEO PLAYER SIMULATION (FIXED - KHÔNG LỖI THỜI GIAN)
    // ===================================================
    let isPlaying = false;
    let currentTime = 135; // 2:15 in seconds
    let duration = 330; // 5:30 in seconds
    let videoInterval;
    
    // Hàm định dạng thời gian (luôn trả về MM:SS)
    function formatTime(seconds) {
        // Làm tròn seconds thành số nguyên
        const roundedSeconds = Math.floor(seconds);
        const mins = Math.floor(roundedSeconds / 60);
        const secs = roundedSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Cập nhật hiển thị video
    function updateVideoDisplay() {
        // Đảm bảo currentTime không vượt quá duration
        let displayTime = currentTime;
        if (displayTime > duration) displayTime = duration;
        if (displayTime < 0) displayTime = 0;
        
        const progress = (displayTime / duration) * 100;
        $('#videoProgressFill').css('width', progress + '%');
        $('#videoTime').text(`${formatTime(displayTime)} / ${formatTime(duration)}`);
    }
    
    // Làm tròn currentTime để tránh số thập phân dài
    function roundCurrentTime() {
        currentTime = Math.round(currentTime * 10) / 10;
        if (currentTime > duration) currentTime = duration;
        if (currentTime < 0) currentTime = 0;
    }
    
    // Play/Pause video
    $('#playVideoBtn').on('click', function() {
        if (isPlaying) {
            // Pause
            clearInterval(videoInterval);
            isPlaying = false;
            $(this).removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');
        } else {
            // Play
            videoInterval = setInterval(function() {
                if (currentTime < duration) {
                    // Tăng thời gian lên 0.5 giây mỗi lần
                    currentTime = currentTime + 0.5;
                    if (currentTime > duration) currentTime = duration;
                    roundCurrentTime();
                    updateVideoDisplay();
                } else {
                    // Video kết thúc
                    clearInterval(videoInterval);
                    isPlaying = false;
                    $('#playVideoBtn').removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');
                    alert('🎉 Lesson completed! Great job!');
                }
            }, 500); // Cập nhật mỗi 0.5 giây
            isPlaying = true;
            $(this).removeClass('bi-play-circle-fill').addClass('bi-pause-circle-fill');
        }
    });
    
    // Click trên thanh progress để tua video
    $('.video-bar__track').on('click', function(e) {
        const trackWidth = $(this).width();
        const clickX = e.offsetX;
        let newProgress = (clickX / trackWidth) * 100;
        // Giới hạn progress trong khoảng 0-100
        newProgress = Math.min(Math.max(newProgress, 0), 100);
        // Tính currentTime dựa trên progress
        currentTime = (newProgress / 100) * duration;
        roundCurrentTime();
        updateVideoDisplay();
    });
    
    // Nút Volume (chỉ đổi icon)
    let isMuted = false;
    $('#volumeBtn').on('click', function() {
        isMuted = !isMuted;
        if (isMuted) {
            $(this).removeClass('bi-volume-up-fill').addClass('bi-volume-mute-fill');
        } else {
            $(this).removeClass('bi-volume-mute-fill').addClass('bi-volume-up-fill');
        }
    });
    
    // ===================================================
    // LESSON CONTENT CLICK (Chọn bài học từ danh sách)
    // ===================================================
    $('.content-list__item').on('click', function() {
        const lessonName = $(this).find('.content-list__name').text();
        const durationMatch = $(this).find('.small.text-muted').text();
        
        // Cập nhật thời lượng video nếu có
        if (durationMatch && durationMatch.includes(':')) {
            const parts = durationMatch.split(':');
            if (parts.length === 2) {
                duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }
        }
        
        // Dừng video hiện tại
        if (videoInterval) {
            clearInterval(videoInterval);
            isPlaying = false;
        }
        
        // Reset thời gian về 0
        currentTime = 0;
        updateVideoDisplay();
        
        // Reset icon play/pause
        $('#playVideoBtn').removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');
        
        // Tự động phát video mới
        $('#playVideoBtn').trigger('click');
    });
    
    // ===================================================
    // CONTINUE LESSON BUTTON (Tiếp tục bài học)
    // ===================================================
    $('#continueLessonBtn').on('click', function() {
        // Nếu đã xem hết, tua lại từ đầu
        if (currentTime >= duration) {
            currentTime = 0;
            updateVideoDisplay();
        }
        // Phát video nếu đang dừng
        if (!isPlaying) {
            $('#playVideoBtn').trigger('click');
        }
    });
    
    // ===================================================
    // PROGRESS TRACKING (Theo dõi tiến độ)
    // ===================================================
    let progressPercent = 75;
    
    function updateProgressUI() {
        $('#progressPercent').text(progressPercent);
        
        // Cập nhật vòng tròn progress
        const circumference = 490; // 2 * pi * 78 ≈ 490
        const dashoffset = circumference - (progressPercent / 100) * circumference;
        $('#donutProgress').attr('stroke-dashoffset', dashoffset);
        
        // Cập nhật thanh progress ngang (hiển thị phần trăm còn lại)
        $('#progressBarFill').css('width', (100 - progressPercent) + '%');
        
        // Cập nhật thời gian hiển thị (giả sử tổng bài học 24 phút)
        const completedTime = Math.floor((progressPercent / 100) * 24);
        $('#progressTime').text(completedTime + ' / 24 min');
    }
    
    // Khôi phục progress đã lưu (nếu có)
    const savedProgress = localStorage.getItem('moonsilk_lesson_progress');
    if (savedProgress) {
        progressPercent = parseInt(savedProgress);
    }
    updateProgressUI();
    
    // Cập nhật progress khi video chạy (kiểm tra mỗi 2 giây)
    setInterval(function() {
        if (isPlaying) {
            // Tính progress dựa trên currentTime
            let newProgress = Math.floor((currentTime / duration) * 100);
            // Giới hạn trong khoảng 0-100
            newProgress = Math.min(Math.max(newProgress, 0), 100);
            
            // Chỉ cập nhật nếu progress tăng lên
            if (newProgress > progressPercent) {
                progressPercent = newProgress;
                updateProgressUI();
                localStorage.setItem('moonsilk_lesson_progress', progressPercent);
                
                // Cập nhật icon trạng thái bài học khi hoàn thành
                if (progressPercent >= 100) {
                    $('.status-icon').each(function() {
                        if ($(this).hasClass('bi-circle')) {
                            $(this).removeClass('bi-circle').addClass('bi-check-circle-fill text-success');
                        }
                    });
                }
            }
        }
    }, 2000);
    
    // ===================================================
    // DISCUSSION BUTTON
    // ===================================================
    $('#startDiscussionBtn').on('click', function() {
        alert('💬 Discussion feature coming soon! Connect with other learners in the community.');
    });
    
    // ===================================================
    // SIDEBAR LESSON CLICK (Click bài học từ sidebar phải)
    // ===================================================
    $('#sidebarLessonList li').on('click', function() {
        const lessonId = $(this).data('lesson-id');
        
        // Kiểm tra bài học bị khóa (có class opacity-50)
        if ($(this).hasClass('opacity-50')) {
            alert('🔒 This lesson is locked. Complete previous lessons first!');
            return;
        }
        
        // Cập nhật tiêu đề bài học
        const lessonTitle = $(this).find('span').first().text();
        $('.lesson-banner__heading').text('Lesson ' + lessonId + ': ' + lessonTitle);
        
        // Cập nhật thời lượng từ sidebar
        const durationMatch = $(this).find('.small.text-muted').text();
        if (durationMatch && durationMatch.includes(':')) {
            const parts = durationMatch.split(':');
            if (parts.length === 2) {
                duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }
        }
        
        // Dừng video hiện tại
        if (videoInterval) {
            clearInterval(videoInterval);
            isPlaying = false;
        }
        
        // Reset thời gian
        currentTime = 0;
        updateVideoDisplay();
        
        // Reset icon
        $('#playVideoBtn').removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');
        
        // Tự động phát
        $('#playVideoBtn').trigger('click');
    });
});