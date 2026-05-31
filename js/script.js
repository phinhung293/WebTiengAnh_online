$(document).ready(function() {
    
    // ===================================================
    // KÝ TỰ CẤU HÌNH EMAILJS (Thay thông tin của bạn vào đây)
    // ===================================================
    const EMAILJS_PUBLIC_KEY = "3WxJUOHpbf1VNW9-c";    
    const EMAILJS_SERVICE_ID = "service_k8oks5q";    
    const EMAILJS_TEMPLATE_ID = "template_2a1jq46";  
    
   emailjs.init(EMAILJS_PUBLIC_KEY);

    // Hàm phụ trợ quản lý LocalStorage
    function getUsersFromStorage() { return JSON.parse(localStorage.getItem('moonsilk_users')) || []; }
    function saveUsersToStorage(users) { localStorage.setItem('moonsilk_users', JSON.stringify(users)); }

    // Hàm phụ trợ kích hoạt thông báo lỗi đỏ trực quan
    function showError($input, message) {
        $input.addClass('is-invalid');
        $input.siblings('.invalid-feedback').text(message).show();
    }

    // Làm sạch lỗi real-time khi người dùng bắt đầu gõ lại dữ liệu
    $(document).on('input', 'form input', function() {
        $(this).removeClass('is-invalid');
        $(this).siblings('.invalid-feedback').hide();
        $('#loginError').addClass('d-none');
        $('#loginSuccess').addClass('d-none'); // Ẩn thông báo thành công cũ khi có tương tác mới
    });

    // Tự động kiểm tra và điền Email cũ từ bộ nhớ khi tải trang
    const rememberedEmail = localStorage.getItem('moonsilk_email');
    if (rememberedEmail) { $('#userEmail').val(rememberedEmail); }

    // Xóa sạch trạng thái lỗi và dữ liệu thừa khi đóng Modal bất kỳ
    $(document).on('hidden.bs.modal', '.modal', function () {
        const $form = $(this).find('form');
        if ($form.length > 0) {
            $form[0].reset();
            $form.find('input').removeClass('is-invalid');
            $form.find('.invalid-feedback').hide();
        }
        $('#loginError').addClass('d-none');
        
        // Reset trạng thái form quên mật khẩu về Bước 1 ban đầu
        $('#forgotStep1').removeClass('d-none');
        $('#forgotStep2').addClass('d-none');
        $('#forgotModalTitle').text('Quên mật khẩu');
        $('#forgotModalDesc').text('Nhập email của bạn để nhận mã OTP khôi phục qua Email.');

        const currentRemembered = localStorage.getItem('moonsilk_email');
        if (currentRemembered) { $('#userEmail').val(currentRemembered); }
    });

    // ===================================================
    // XỬ LÝ FORM ĐĂNG KÝ (VALIDATION GIAO DIỆN)
    // ===================================================
    $(document).on('submit', '#registerForm', function(e) {
        e.preventDefault();
        $('#registerForm input').removeClass('is-invalid');
        $('#registerForm .invalid-feedback').hide();

        const $name = $('#regName');
        const $email = $('#regEmail');
        const $pass = $('#regPass');
        const $confirmPass = $('#regConfirmPass');
        let isValid = true;

        if ($name.val().trim() === "") {
            showError($name, "Vui lòng nhập họ và tên!");
            isValid = false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($email.val().trim())) {
            showError($email, "Vui lòng nhập đúng định dạng email!");
            isValid = false;
        }
        if ($pass.val().length < 6) {
            showError($pass, "Mật khẩu phải từ 6 ký tự trở lên!");
            isValid = false;
        }
        if ($pass.val() !== $confirmPass.val()) {
            showError($confirmPass, "Mật khẩu xác nhận lại không trùng khớp!");
            isValid = false;
        }

        if (!isValid) return;

        let users = getUsersFromStorage();
        const isExist = users.some(user => user.email === $email.val().trim());
        if (isExist) {
            showError($email, "Email này đã được đăng ký tài khoản khác!");
            return;
        }

        // Lưu tài khoản mới thành công
        users.push({ name: $name.val().trim(), email: $email.val().trim(), pass: $pass.val() });
        saveUsersToStorage(users);

        // Đóng modal đăng ký và tự bật mở modal đăng nhập
        $('#registerModal').modal('hide');
        setTimeout(function() {
            $('#userEmail').val($email.val().trim());
            $('#loginSuccess').removeClass('d-none').text('Đăng ký thành công! Hãy đăng nhập ngay.');
            $('#loginModal').modal('show');
        }, 350);
    });

    // ===================================================
    // XỬ LÝ FORM ĐĂNG NHẬP (VALIDATION GIAO DIỆN)
    // ===================================================
    $(document).on('submit', '#loginForm', function(e) {
        e.preventDefault();
        $('#loginForm input').removeClass('is-invalid');
        $('#loginForm .invalid-feedback').hide();
        $('#loginError').addClass('d-none');

        const $email = $('#userEmail');
        const $pass = $('#userPass');
        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($email.val().trim())) {
            showError($email, "Vui lòng nhập đúng định dạng email!");
            isValid = false;
        }
        if ($pass.val() === "") {
            showError($pass, "Mật khẩu không được để trống!");
            isValid = false;
        }

        if (!isValid) return;

        let users = getUsersFromStorage();
        const validUser = users.find(user => user.email === $email.val().trim() && user.pass === $pass.val());

        if (!validUser) {
            $('#loginError').removeClass('d-none').text('Email hoặc mật khẩu không chính xác!');
            $email.addClass('is-invalid');
            $pass.addClass('is-invalid');
            return;
        }

        localStorage.setItem('moonsilk_email', $email.val().trim());
        $('#loginModal').modal('hide');
        
        // Chuyển hướng trực tiếp đến trang Dashboard học tập (tùy thuộc vào vị trí file html gọi script)
        const isPagesDir = window.location.pathname.includes('/pages/');
        window.location.href = isPagesDir ? "dashboard.html" : "pages/dashboard.html";
    });

    // ===================================================
    // XỬ LÝ FORM QUÊN MẬT KHẨU (GIAO DIỆN 2 BƯỚC KHÔNG ALERT)
    // ===================================================
    
    // Bước 1: Gửi mã OTP xác nhận về Email qua hòm thư EmailJS
    $(document).on('submit', '#forgotPasswordForm', function(e) {
        e.preventDefault();
        if ($('#forgotStep1').hasClass('d-none')) return; // Ngăn chặn sự kiện submit nhầm khi đang ở bước 2

        const $email = $('#forgotEmail');
        $email.removeClass('is-invalid');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($email.val().trim())) {
            showError($email, "Vui lòng nhập đúng định dạng email!");
            return;
        }

        let users = getUsersFromStorage();
        const validUser = users.find(user => user.email === $email.val().trim());

        if (!validUser) {
            showError($email, "Email này chưa từng đăng ký tài khoản trong hệ thống!");
            return;
        }

        // Tạo 6 số ngẫu nhiên
        const randomOTP = Math.floor(100000 + Math.random() * 900000);
        sessionStorage.setItem('reset_otp', randomOTP);
        sessionStorage.setItem('reset_email', $email.val().trim());

        const templateParams = {
            to_email: $email.val().trim(),
            to_name: validUser.name,
            message: "Mã OTP khôi phục mật khẩu Moonsilk của bạn là: " + randomOTP + ". Vui lòng không chia sẻ mã này!"
        };

        const $btnSubmit = $('#btnForgotSubmit');
        $btnSubmit.prop('disabled', true).text('Đang gửi mã...');

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function() {
                $btnSubmit.prop('disabled', false).text('Gửi mã khôi phục');
                
                // Ẩn bước 1 và trượt hiển thị bước 2 nhập liệu ngay tại chỗ
                $('#forgotStep1').addClass('d-none');
                $('#forgotStep2').removeClass('d-none');
                
                $('#forgotModalTitle').text('Xác thực OTP');
                $('#forgotModalDesc').html('Mã khôi phục đã gửi đến <b class="text-dark">' + $email.val().trim() + '</b>.<br>Vui lòng kiểm tra hộp thư.');

            }, function(error) {
                alert('Lỗi kết nối EmailJS: ' + JSON.stringify(error));
                $btnSubmit.prop('disabled', false).text('Gửi mã khôi phục');
            });
    });

    // Bước 2: Nhấp xác nhận đổi mật khẩu mới trực tiếp trên Modal UI
    $(document).on('click', '#btnConfirmReset', function() {
        const $otpInput = $('#forgotOTP');
        const $newPass = $('#forgotNewPass');
        const $confirmNewPass = $('#forgotConfirmNewPass');

        $('#forgotStep2 input').removeClass('is-invalid');
        let isValid = true;

        if ($otpInput.val().trim() !== sessionStorage.getItem('reset_otp')) {
            showError($otpInput, "Mã OTP nhập vào không chính xác!");
            isValid = false;
        }
        if ($newPass.val().length < 6) {
            showError($newPass, "Mật khẩu mới phải từ 6 ký tự trở lên!");
            isValid = false;
        }
        if ($newPass.val() !== $confirmNewPass.val()) {
            showError($confirmNewPass, "Mật khẩu xác nhận lại không trùng khớp!");
            isValid = false;
        }

        if (!isValid) return;

        // Cập nhật cơ sở dữ liệu LocalStorage
        let users = getUsersFromStorage();
        users = users.map(user => {
            if (user.email === sessionStorage.getItem('reset_email')) { user.pass = $newPass.val(); }
            return user;
        });
        saveUsersToStorage(users);

        // ĐÓNG MODAL QUÊN MẬT KHẨU -> MỞ LẠI MODAL ĐĂNG NHẬP KÈM BANNER XANH THÀNH CÔNG
        $('#forgotPasswordModal').modal('hide');
        setTimeout(function() {
            $('#userEmail').val(sessionStorage.getItem('reset_email'));
            $('#loginSuccess').removeClass('d-none').text('Đổi mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.');
            $('#loginModal').modal('show');
            
            // Dọn dẹp bộ nhớ đệm
            sessionStorage.removeItem('reset_otp');
            sessionStorage.removeItem('reset_email');
        }, 350);
    });

    // Hiệu ứng cuộn trang mượt mà Smooth Scroll giữ nguyên
    $(document).on('click', 'a.nav-link', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({ scrollTop: $(hash).offset().top }, 800);
        }
    });
});


