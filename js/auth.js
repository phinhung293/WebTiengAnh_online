$(document).ready(function () {

    const currentEmail = localStorage.getItem('moonsilk_email');

    if (!currentEmail) return;

    const users = JSON.parse(localStorage.getItem('moonsilk_users')) || [];

    const user = users.find(u => u.email === currentEmail);

    if (user) {

        if ($('#displayName').length) {
            $('#displayName').text(user.name);
        }

        if ($('.welcome-card__user').length) {
            $('.welcome-card__user').text(user.name + ' ✨');
        }

    }
});