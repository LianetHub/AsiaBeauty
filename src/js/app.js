"use strict";



$(function () {

    // init Fancybox Gallery
    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
        });
    }


    // Detect user Device
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 768) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }

    getNavigator();
    $(window).on('resize', () => {
        getNavigator();
    });


    // tabs
    function initTabs() {
        $('.tabs').each(function () {
            $(this).find('.tab-btn').each(function (index) {
                if (index == 0) $(this).addClass('active');
            });
            $(this).find(".tab-content").each(function (index) {
                if (index == 0) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });

        })
        $('.tab-btn').on('click', (e) => {
            let $target = $(e.target);

            $target.addClass("active")
                .siblings()
                .removeClass("active")
                .closest(".tabs")
                .find(".tab-content")
                .removeClass('active')
                .eq($target.index())
                .addClass('active')
        })
    }

    initTabs();


    // click handlers

    $(document).on('click', (e) => {
        let $target = $(e.target);

        // menu
        if ($target.closest('.header__menu-toggler').length) {
            toggleMenu()
        }

        // // cart open
        // if ($target.hasClass('header__cart') ||
        //     $target.hasClass('cart__close') ||
        //     $target.hasClass('cart')) {
        //     getCart()
        // }

        // play video
        // if ($target.is('.product__video-btn')) {

        //     $target.addClass('active');
        //     let video = $target.prev().addClass('active')[0];

        //     if (video.play) {
        //         let playPromise = video.play();

        //         if (playPromise !== undefined && typeof playPromise.then === 'function') {
        //             playPromise
        //                 .then(() => {
        //                     console.log('Video is playing');
        //                 })
        //                 .catch(error => {
        //                     console.log('Autoplay was prevented:', error);
        //                     video.pause();
        //                 });
        //         } else {
        //             video.play();
        //         }
        //     }
        // }

        // if ($target.is('.product__video video.active')) {
        //     let video = $target[0];

        //     if (video.pause) {
        //         video.pause();
        //     }
        //     $target.removeClass('active');
        //     $target.next().removeClass('active');
        // }


    });


    function toggleMenu() {
        $('.header__menu-toggler').toggleClass('active');
        $('.header').toggleClass('header--open-menu');
        $('.menu').toggleClass('menu--open');
        toggleLocking()
    }

    // function getFilter() {
    //     $('.catalog__sidebar').toggleClass('catalog__sidebar_open');
    //     toggleLocking("lock-filter")
    // }

    // function getCart() {
    //     $('.cart').toggleClass('cart_open');
    //     toggleLocking("lock-cart")
    // }


    function toggleLocking(lockClass) {

        const $body = $('body');
        let className = lockClass ? lockClass : "lock";

        if ($body.hasClass(className)) {
            let pagePosition = parseInt($body.data("position"), 10);
            $body.css('top', 'auto');
            window.scroll({ top: pagePosition, left: 0 });
            $body.removeAttr('data-position');
        } else {
            let pagePosition = window.scrollY;
            $body.data('position', pagePosition);
            $body.css('top', -pagePosition + 'px');
        }

        let lockPaddingValue = $body.hasClass(className)
            ? "0px"
            : window.innerWidth - $(".wrapper").width() + "px";

        $body.css('--lock-padding', lockPaddingValue)

        $body.toggleClass(className);

    }

    // header height
    function getHeaderHeight() {
        const headerHeight = Math.ceil($('.header__wrapper').outerHeight());
        $('body').css('--header-height', headerHeight + 'px');
    }

    getHeaderHeight();

    $(window).on('resize', getHeaderHeight);
    $('.header__wrapper').on('transitionend', function () {
        getHeaderHeight()
    })

    // sliders 
    if ($('.certs__slider').length > 0) {
        $('.certs__slider').each(function (index, sliderWrapper) {

            let pagination = $(sliderWrapper).find('.certs__slider-pagination')[0];
            let slider = $(sliderWrapper).find('.certs__slider-main')[0];
            let thumbsSlider = $(sliderWrapper).find('.certs__slider-thumbs')[0];

            let thumbsSwiper = new Swiper(thumbsSlider, {
                slidesPerView: 4,
                spaceBetween: 8,
                watchSlidesProgress: true,
                watchOverflow: true,
                speed: 800,
                loop: true,
                slideToClickedSlide: true,
            });

            new Swiper(slider, {
                slidesPerView: 1,
                spaceBetween: 20,
                speed: 800,
                watchOverflow: true,
                loop: true,
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false
                },
                pagination: {
                    el: pagination,
                    clickable: true
                },
                thumbs: {
                    swiper: thumbsSwiper
                }
            })
        });
    }

    if ($('.news__slider').length > 0) {
        new Swiper(".news__slider", {
            slidesPerView: "auto",
            spaceBetween: 20,
            speed: 800,
            navigation: {
                nextEl: ".news__slider-next",
                prevEl: ".news__slider-prev"
            },
            breakpoints: {
                575.98: {
                    spaceBetween: 29,
                }
            }
        })
    }

    if ($('.brands__slider').length > 0) {
        new Swiper(".brands__slider", {
            slidesPerView: "auto",
            spaceBetween: 60,
            speed: 10000,
            loop: true,
            autoplay: {
                delay: 1,
                stopOnLastSlide: false,
                disableOnInteraction: false
            },
            breakpoints: {
                767.98: {
                    spaceBetween: 120,
                }
            }
        })
    }

    if ($('.services__slider').length > 0) {
        new Swiper(".services__slider", {
            slidesPerView: "auto",
            spaceBetween: 25,
        })
    }

    if ($('.places__slider').length > 0) {
        new Swiper(".places__slider", {
            slidesPerView: "auto",
            spaceBetween: 11,
            watchOverflow: true,
            breakpoints: {
                767.98: {
                    spaceBetween: 38,
                }
            }
        })
    }

    if ($('.deposits__slider').length > 0) {
        new Swiper(".deposits__slider", {
            slidesPerView: "auto",
            spaceBetween: 39,
            watchOverflow: true,
            speed: 300,
            mousewheel: true,
            breakpoints: {
                767.98: {
                    spaceBetween: 30,
                }
            }
        })
    }
    if ($('.recommendations__slider').length > 0) {
        new Swiper(".recommendations__slider", {
            slidesPerView: "auto",
            spaceBetween: 15,
            speed: 300,
            loop: true,
            grabCursor: true,
            breakpoints: {
                767.98: {
                    spaceBetween: 30,
                }
            }
        })
    }

    if ($('.salons__item-slider').length > 0) {
        $('.salons__item-slider').each(function (index, slider) {

            let swiper = $(slider).find('.swiper')[0];
            let prev = $(slider).find('.salons__item-prev')[0];
            let next = $(slider).find('.salons__item-next')[0];
            let pagination = $(slider).find('.salons__item-slider-pagination')[0];

            new Swiper(swiper, {
                slidesPerView: 1,
                speed: 800,
                pagination: {
                    el: pagination,
                    clickable: true
                },
                navigation: {
                    nextEl: next,
                    prevEl: prev
                }
            })
        });
    }



    // animation

    // add background header on scroll
    const $header = $('.header');

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            $header.removeClass('header--has-scroll')
        } else {
            $header.addClass('header--has-scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe($header[0]);



    // init Smooth Scroll

    // SmoothScroll({
    //     animationTime: 800,
    //     stepSize: 75,
    //     accelerationDelta: 30,
    //     accelerationMax: 2,
    //     keyboardSupport: true,
    //     arrowScroll: 50,
    //     pulseAlgorithm: true,
    //     pulseScale: 4,
    //     pulseNormalize: 1,
    //     touchpadSupport: true,
    // })









});


