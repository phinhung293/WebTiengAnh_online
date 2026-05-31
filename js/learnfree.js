$(document).ready(function() {
    
    // ===================================================
    // 1. TƯƠNG TÁC VIDEO (TRÌNH PHÁT MÔ PHỎNG CHUẨN)
    // ===================================================
    let isPlaying = false;
    let currentTime = 0; 
    let duration = 330; // Mặc định bài 1: 5 phút 30 giây (330s)
    let videoInterval;

    // Hàm format MM:SS
    function formatTime(seconds) {
        const roundedSeconds = Math.floor(seconds);
        const mins = Math.floor(roundedSeconds / 60);
        const secs = roundedSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Hàm cập nhật thanh UI của Video
    function updateVideoDisplay() {
        if (currentTime > duration) currentTime = duration;
        if (currentTime < 0) currentTime = 0;
        
        const progress = (currentTime / duration) * 100;
        $('#videoProgressFill').css('width', progress + '%');
        $('#videoTime').text(`${formatTime(currentTime)} / ${formatTime(duration)}`);
    }

    // Hàm Play / Pause
    function togglePlay() {
        if (isPlaying) {
            clearInterval(videoInterval);
            isPlaying = false;
            $('#playVideoBtnSmall').removeClass('bi-pause-circle').addClass('bi-play-circle');
            $('#playVideoBtnLarge').html('<i class="bi bi-play-fill"></i>');
        } else {
            if (currentTime >= duration) currentTime = 0; // Phát lại từ đầu nếu đã hết
            
            videoInterval = setInterval(function() {
                if (currentTime < duration) {
                    currentTime += 0.5; // Nhích 0.5s
                    updateVideoDisplay();
                } else {
                    clearInterval(videoInterval);
                    isPlaying = false;
                    $('#playVideoBtnSmall').removeClass('bi-pause-circle').addClass('bi-play-circle');
                    $('#playVideoBtnLarge').html('<i class="bi bi-play-fill"></i>');
                }
            }, 500); 
            
            isPlaying = true;
            $('#playVideoBtnSmall').removeClass('bi-play-circle').addClass('bi-pause-circle');
            $('#playVideoBtnLarge').html('<i class="bi bi-pause-fill"></i>');
        }
    }

    // Sự kiện Bấm Play
    $('#playVideoBtnLarge, #playVideoBtnSmall').on('click', togglePlay);

    // Sự kiện Tua Video bằng cách click vào thanh progress
    $('#videoTrack').on('click', function(e) {
        const trackWidth = $(this).width();
        const clickX = e.offsetX;
        let newProgress = (clickX / trackWidth) * 100;
        newProgress = Math.min(Math.max(newProgress, 0), 100);
        currentTime = (newProgress / 100) * duration;
        updateVideoDisplay();
    });

    // Sự kiện Mute Âm thanh
    let isMuted = false;
    $('#volumeBtn').on('click', function() {
        isMuted = !isMuted;
        if (isMuted) {
            $(this).removeClass('bi-volume-up').addClass('bi-volume-mute text-danger');
        } else {
            $(this).removeClass('bi-volume-mute text-danger').addClass('bi-volume-up');
        }
    });

    // Khởi tạo video ban đầu
    updateVideoDisplay();


    // ===================================================
    // 2. CHUYỂN TAB TỪ SIDEBAR MENU
    // ===================================================
    $('.lf-menu-item').on('click', function(e) {
        e.preventDefault();
        $('.lf-menu-item').removeClass('active');
        $('.lf-menu-item i').removeClass('text-pink');
        $(this).addClass('active');
        $(this).find('i').addClass('text-pink');

        const targetTab = $(this).data('target');
        $('.lf-tab-pane').removeClass('d-block').addClass('d-none');
        $(targetTab).removeClass('d-none').addClass('d-block').hide().fadeIn(300);

        if ($(window).width() < 992) {
            $('#hamburgerBtn').removeClass('is-active');
            $('#sidebar').removeClass('is-open');
            $('#sidebarOverlay').removeClass('is-active');
        }
    });

    // ===================================================
    // 3. BÀI TẬP TRẮC NGHIỆM
    // ===================================================
    $('.lf-quiz-btn').on('click', function() {
        const $questionBox = $(this).closest('.lf-card');
        $questionBox.find('.lf-quiz-btn').removeClass('correct wrong');
        const $statusIcon = $questionBox.find('.quiz-icon, #quizStatusIcon');
        
        if ($(this).data('correct') === true) {
            $(this).addClass('correct');
            $statusIcon.removeClass('d-none text-danger bi-x-circle-fill').addClass('text-success bi-check-circle-fill').hide().fadeIn(200);
        } else {
            $(this).addClass('wrong');
            $statusIcon.removeClass('d-none text-success bi-check-circle-fill').addClass('text-danger bi-x-circle-fill').hide().fadeIn(200);
        }
    });

    // ===================================================
    // 4. HAMBURGER MENU BẬT / TẮT
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

});
// ===================================================
    // 5. HIỆU ỨNG LẬT THẺ FLASHCARD TỪ VỰNG
    // ===================================================
    $('.flashcard-container').on('click', function() {
        $(this).toggleClass('flipped');
    });
// ===================================================
// HÀM CHUYỂN BÀI HỌC (Click từ danh sách phải)
// ===================================================
function changeLesson(element, timeString) {
    // 1. Đổi giao diện trạng thái Active cho danh sách
    const items = document.querySelectorAll('.lf-lesson-item');
    items.forEach(item => {
        item.classList.remove('active');
        item.querySelector('p').classList.remove('text-pink', 'fw-bold');
        item.querySelector('p').classList.add('text-dark', 'fw-medium');
        item.querySelector('i').classList.replace('text-pink', 'text-secondary'); // Chỉnh màu icon default
    });
    
    element.classList.add('active');
    element.querySelector('p').classList.remove('text-dark', 'fw-medium');
    element.querySelector('p').classList.add('text-pink', 'fw-bold');
    element.querySelector('i').classList.replace('text-secondary', 'text-pink');

    // 2. Lấy tên bài học và đẩy lên tiêu đề Video
    const lessonTitle = element.querySelector('p').innerText;
    document.getElementById('videoTitle').innerText = lessonTitle;

    // 3. Tính toán lại thời lượng Video (Parse MM:SS thành Giây)
    const timeParts = timeString.split(':');
    const newDuration = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);

    // 4. Xóa Video cũ, cài đặt lại thời gian mới
    const playBtnLarge = document.getElementById('playVideoBtnLarge');
    const playBtnSmall = document.getElementById('playVideoBtnSmall');
    
    // Ép click Pause nếu video đang chạy
    if (playBtnSmall.classList.contains('bi-pause-circle')) {
        $('#playVideoBtnSmall').trigger('click');
    }

    // Đưa thời gian hiện tại về 0, áp dụng thời lượng mới và hiển thị
    window.currentTime = 0;
    window.duration = newDuration;
    
    document.getElementById('videoProgressFill').style.width = '0%';
    document.getElementById('videoTime').innerText = `00:00 / ${timeString}`;
}