$(document).ready(function () {

    const currentEmail = localStorage.getItem('moonsilk_email');

    // Chưa đăng nhập -> về trang chủ
    if (!currentEmail) {
        window.location.replace('../index.html');
        return;
    }

    const users = JSON.parse(localStorage.getItem('moonsilk_users')) || [];
    const user = users.find(u => u.email === currentEmail);

    if (!user) {
        localStorage.removeItem('moonsilk_email');
        window.location.replace('../index.html');
        return;
    }

    // Header
    $('#displayName').text(user.name);

    // Dashboard
    $('.welcome-card__user').text(user.name + ' ✨');

    // Profile
    $('.profile-banner__content h2').text(user.name + ' ✨');

    // Account Settings
    $('#userNameInput').val(user.name);
    $('#userEmailInput').val(user.email);

    // Logout
    $('#btnLogout').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('moonsilk_email');
        window.location.href = '../index.html';
    });

});