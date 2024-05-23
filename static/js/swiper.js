const swiper = new Swiper('.swiper-container', {
    loop: true,
    speed: 2000,            //追加（スライドスピード）
    effect: 'fade',         //追加（フェードエフェクトを適用する）
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
})