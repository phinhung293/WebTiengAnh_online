document.addEventListener("DOMContentLoaded", function () {
    // Hàm tải HTML từ file và chèn vào thẻ có id tương ứng
    function loadComponent(id, file) {
        const element = document.getElementById(id);
        if (element) {
            return fetch(file)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                })
                .catch(error => console.error("Error loading component:", file, error));
        }
        return Promise.resolve();
    }

    // Kiểm tra xem trang hiện tại có nằm trong thư mục pages không
    const isPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isPagesDir ? '../' : '';

    // Tải các components
    Promise.all([
        loadComponent("header-placeholder", basePath + "components/header.html"),
        loadComponent("footer-placeholder", basePath + "components/footer.html"),
        loadComponent("modals-placeholder", basePath + "components/modals.html")
    ]).then(() => {
        // Cập nhật lại đường dẫn cho hình ảnh và link trong các components
        document.querySelectorAll('#header-placeholder img, #footer-placeholder img').forEach(img => {
            let src = img.getAttribute("src");
            if(src && !src.startsWith('http') && !src.startsWith('../')) {
                if(isPagesDir) img.setAttribute("src", "../" + src);
            }
        });

        document.querySelectorAll('#header-placeholder a, #footer-placeholder a').forEach(a => {
            let href = a.getAttribute("href");
            if(!href || href.startsWith('http') || href.startsWith('#')) return;

            if (isPagesDir) {
                if(href === "index.html" || href === "../index.html") {
                    a.setAttribute("href", "../index.html");
                } else if(!href.includes('/')) { // features.html
                    a.setAttribute("href", href);
                } else { // pages/features.html
                    a.setAttribute("href", href.replace('pages/', ''));
                }
            } else {
                if(href === "index.html" || href === "../index.html") {
                    a.setAttribute("href", "index.html");
                } else if(!href.startsWith("pages/")) {
                    a.setAttribute("href", "pages/" + href);
                }
            }
        });

        // Set active link in header
        const path = window.location.pathname.split("/").pop();
        if(path) {
            document.querySelectorAll(".nav-link").forEach(link => {
                let linkHref = link.getAttribute("href");
                if(linkHref === path || linkHref === "pages/" + path) {
                    link.classList.add("active");
                    link.style.color = "#f43f5e";
                    link.style.fontWeight = "bold";
                }
            });
        }
    });
});
