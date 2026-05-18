$(document).ready(function() {
    
    // ===================================================
    // KÝ TỰ CẤU HÌNH EMAILJS (Thay thông tin của bạn vào đây)
    // ===================================================
    const EMAILJS_PUBLIC_KEY = "3WxJUOHpbf1VNW9-c";    
    const EMAILJS_SERVICE_ID = "service_k8oks5q";    
    const EMAILJS_TEMPLATE_ID = "template_2a1jq46";  
    
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Hàm lấy/lưu dữ liệu LocalStorage
    function getUsersFromStorage() { return JSON.parse(localStorage.getItem('moonsilk_users')) || []; }
    function saveUsersToStorage(users) { localStorage.setItem('moonsilk_users', JSON.stringify(users)); }

    // HÀM BỔ TRỢ: Hiển thị lỗi trực tiếp lên giao diện UI
    function showError($input, message) {
        $input.addClass('is-invalid'); 
        $input.siblings('.invalid-feedback').text(message).show(); 
    }

    // TỰ ĐỘNG XÓA LỖI TRÊN GIAO DIỆN KHI NGƯỜI DÙNG ĐANG GÕ
    $('form input').on('input', function() {
        $(this).removeClass('is-invalid'); 
        $(this).siblings('.invalid-feedback').hide();
        $('#loginError').addClass('d-none'); 
    });

    // Tự động điền email đã lưu khi load trang lần đầu
    const rememberedEmail = localStorage.getItem('moonsilk_email');
    if (rememberedEmail) { $('#userEmail').val(rememberedEmail); }

    // TỰ ĐỘNG XÓA LỖI ĐỎ & RESET FORM KHI THOÁT/ĐÓNG MODAL
    $('.modal').on('hidden.bs.modal', function () {
        const $form = $(this).find('form');
        if ($form.length > 0) {
            $form[0].reset(); 
            $form.find('input').removeClass('is-invalid'); 
            $form.find('.invalid-feedback').hide();
        }
        $('#loginError').addClass('d-none'); 
        
        const currentRemembered = localStorage.getItem('moonsilk_email');
        if (currentRemembered) { $('#userEmail').val(currentRemembered); }
    });

    // ===================================================
    // XỬ LÝ FORM ĐĂNG KÝ (BỎ ALERT -> CHUYỂN MODAL TỰ ĐỘNG)
    // ===================================================
    $('#registerForm').on('submit', function(e) {
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
            showError($email, "Vui lòng nhập đúng định dạng email (Ví dụ: abc@gmail.com)!");
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

        // Lưu tài khoản mới
        users.push({ name: $name.val().trim(), email: $email.val().trim(), pass: $pass.val() });
        saveUsersToStorage(users);

        // Đóng modal đăng ký và tự động chuyển sang mở modal đăng nhập sau 300ms
        $('#registerModal').modal('hide');
        setTimeout(function() {
            $('#userEmail').val($email.val().trim()); // Điền sẵn email vừa đăng ký xong
            $('#loginModal').modal('show');
        }, 350);
    });

    // ===================================================
    // XỬ LÝ FORM ĐĂNG NHẬP (SỬA LỖI HIỂN THỊ DƯ THỪA -> CHUYỂN TRANG)
    // ===================================================
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        // Reset sạch sẽ trạng thái để không bị chồng chéo lỗi cũ
        $('#loginForm input').removeClass('is-invalid');
        $('#loginForm .invalid-feedback').hide();
        $('#loginError').addClass('d-none');

        const $email = $('#userEmail');
        const $pass = $('#userPass');
        let isValid = true;

        // Bước 1: Kiểm tra định dạng cơ bản trước
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($email.val().trim())) {
            showError($email, "Vui lòng nhập đúng định dạng email!");
            isValid = false;
        }
        if ($pass.val() === "") {
            showError($pass, "Mật khẩu không được để trống!");
            isValid = false;
        }

        // Nếu sai định dạng từ đầu thì dừng lại ngay để hiện lỗi định dạng, không kiểm tra tài khoản
        if (!isValid) return;

        // Bước 2: Khi định dạng đã đúng, tiến hành xác thực tài khoản
        let users = getUsersFromStorage();
        const validUser = users.find(user => user.email === $email.val().trim() && user.pass === $pass.val());

        if (!validUser) {
            // Không hiển thị lỗi "Sai định dạng email", chỉ hiển thị thông báo lỗi tài khoản chung
            $('#loginError').removeClass('d-none').text('Email hoặc mật khẩu không chính xác!');
            $email.addClass('is-invalid');
            $pass.addClass('is-invalid');
            return;
        }

        // Ghi nhớ trạng thái và điều hướng tức thì
        localStorage.setItem('moonsilk_email', $email.val().trim());
        $('#loginModal').modal('hide');
        
        // Chuyển hướng thẳng sang trang Dashboard
        window.location.href = "dashboard.html";
    });

    // ===================================================
    // XỬ LÝ FORM QUÊN MẬT KHẨU (Giữ nguyên logic của bạn)
    // ===================================================
    $('#forgotPasswordForm').on('submit', function(e) {
        e.preventDefault();
        const $email = $('#forgotEmail');
        $email.removeClass('is-invalid');
        $email.siblings('.invalid-feedback').hide();

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
                $('#forgotPasswordModal').modal('hide');

                const userOTP = prompt("Nhập mã OTP (6 số) đã được gửi tới email của bạn:");
                if (userOTP === sessionStorage.getItem('reset_otp')) {
                    const newPass = prompt("Mã xác thực chính xác! Nhập mật khẩu mới của bạn (tối thiểu 6 ký tự):");
                    if (newPass && newPass.length >= 6) {
                        users = users.map(user => {
                            if (user.email === sessionStorage.getItem('reset_email')) { user.pass = newPass; }
                            return user;
                        });
                        saveUsersToStorage(users);
                        alert("Thay đổi mật khẩu thành công! Bạn có thể dùng mật khẩu mới để đăng nhập.");
                    } else {
                        alert("Mật khẩu mới không hợp lệ hoặc bạn đã hủy thao tác.");
                    }
                } else {
                    alert("Mã OTP nhập vào không chính xác!");
                }
                sessionStorage.removeItem('reset_otp');
                sessionStorage.removeItem('reset_email');
            }, function(error) {
                alert('Lỗi gửi EmailJS: ' + JSON.stringify(error));
                $btnSubmit.prop('disabled', false).text('Gửi mã khôi phục');
            });
    });

    // Smooth Scroll
    $('a.nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({ scrollTop: $(hash).offset().top }, 800);
        }
    });
});