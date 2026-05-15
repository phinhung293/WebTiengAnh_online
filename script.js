$(document).ready(function() {
    // 1. Kiểm tra LocalStorage khi load trang (Tiêu chí 3.c.iii)
    const rememberedEmail = localStorage.getItem('moonsilk_email');
    if (rememberedEmail) {
        $('#userEmail').val(rememberedEmail);
        console.log("Đã tự động điền email từ bộ nhớ.");
    }
// Xử lý Form Đăng ký
$('#registerForm').on('submit', function(e) {
    e.preventDefault();
    const name = $('#regName').val();
    const email = $('#regEmail').val();
    const pass = $('#regPass').val();

    if (pass.length < 6) {
        alert("Mật khẩu phải từ 6 ký tự trở lên!");
        return;
    }

    console.log("Đăng ký mới:", { name, email });
    alert("Chúc mừng " + name + "! Bạn đã đăng ký thành công.");
    $('#registerModal').modal('hide');
});
    // 2. Form Validation & Login (Tiêu chí 3.b.ii)
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#userEmail').val();
        const pass = $('#userPass').val();

        // Regex kiểm tra email cơ bản
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Vui lòng nhập đúng định dạng email!");
            return;
        }

        if (pass.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        // Lưu vào LocalStorage (Tiêu chí 3.c.iii)
        localStorage.setItem('moonsilk_email', email);
        
        alert("Đăng nhập thành công! Hệ thống đã ghi nhớ email của bạn.");
        $('#loginModal').modal('hide');
    });

    // 3. Hiệu ứng cuộn mượt (Smooth Scroll)
    $('a.nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800);
        }
    });
});