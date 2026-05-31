document.addEventListener("DOMContentLoaded", () => {

const cards = document.querySelectorAll(".feature-box");

cards.forEach(card => {

card.addEventListener("mouseenter", () => {
card.style.boxShadow =
"0 15px 35px rgba(129,140,248,.25)";
});

card.addEventListener("mouseleave", () => {
card.style.boxShadow = "none";
});

});

window.addEventListener("scroll", () => {

document.querySelectorAll(".feature-box").forEach(card => {

const top = card.getBoundingClientRect().top;

if(top < window.innerHeight - 100){
card.classList.add("show");
}

});

});

});