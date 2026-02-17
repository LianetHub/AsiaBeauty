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

        // catalog filters toggler
        if ($target.closest('.catalog__filter-toggler').length) {
            $('.catalog__filter-toggler').toggleClass("active");
            $('.catalog__filters').slideToggle()
        }

        // favorite btn
        if ($target.is('.favorite-btn')) {
            $target.toggleClass('active')
        }

        // socials widget
        if ($target.closest('.socials-widget__btn').length) {
            $('.socials-widget__body').toggleClass('visible');
        } else if (!$target.closest('.socials-widget').length) {
            $('.socials-widget__body').removeClass('visible');
        }


        // order steps switch
        if ($target.hasClass('order__btn')) {
            let $step = $target.closest('.order__step');
            let $nextStep = $step.next();
            if ($nextStep.length > 0) {
                $step.removeClass('order__step_active');
                $nextStep.addClass('order__step_active');
            }
        }


    });


    function toggleMenu() {
        $('.header__menu-toggler').toggleClass('active');
        $('.header').toggleClass('header--open-menu');
        $('.menu').toggleClass('menu--open');
        toggleLocking()
    }

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

    class ConditionsSwiper {
        constructor(selector, options = {}, {
            mode = 'min',
            breakpoint = 767.98
        } = {}) {
            this.selector = selector;
            this.options = options;
            this.mode = mode.toLowerCase();
            this.breakpoint = breakpoint;
            this.swiperInstance = null;
            this.isInitialized = false;

            this.handleResize = this.handleResize.bind(this);

            this.handleResize();
            window.addEventListener("resize", this.handleResize);
        }

        shouldInitialize() {
            const currentWidth = window.innerWidth;

            if (this.mode === 'min') {
                return currentWidth <= this.breakpoint;
            } else if (this.mode === 'max') {
                return currentWidth > this.breakpoint;
            }
            return false;
        }

        initializeSwiper() {
            if (!this.isInitialized) {
                this.swiperInstance = new Swiper(this.selector, this.options);
                this.isInitialized = true;
            }
        }

        destroySwiper() {
            if (this.isInitialized && this.swiperInstance) {
                this.swiperInstance.destroy(true, true);
                this.swiperInstance = null;
                this.isInitialized = false;
            }
        }

        handleResize() {
            if (this.shouldInitialize()) {
                this.initializeSwiper();
            } else {
                this.destroySwiper();
            }
        }

        destroy() {
            window.removeEventListener("resize", this.handleResize);
            this.destroySwiper();
        }
    }

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

    if ($('.services-slider').length > 0) {
        new ConditionsSwiper('.services-slider', {
            slidesPerView: "auto",
            speed: 300,
            mousewheel: true,
            spaceBetween: 9
        }, {
            mode: "max",
            breakpoint: 575.98
        })
    }

    if ($('.catalog__slider').length > 0) {
        new ConditionsSwiper('.catalog__slider', {
            slidesPerView: "auto",
            speed: 800,
            spaceBetween: 90,
            watchOverflow: true,
            navigation: {
                nextEl: ".catalog__slider-next",
                prevEl: ".catalog__slider-prev",
            }
        }, {
            mode: "max",
            breakpoint: 575.98
        })
    }

    if ($('.media__slider').length > 0) {
        new Swiper(".media__slider", {
            slidesPerView: "auto",
            spaceBetween: 18,
            watchOverflow: true,
            speed: 300,
            breakpoints: {
                991.98: {
                    slidesPerView: 4,
                    spaceBetween: 34,
                }
            }
        })
    }

    if ($('.catalog__carousel').length > 0) {
        $('.catalog__carousel').each(function (index, slider) {
            new Swiper(slider, {
                spaceBetween: 30,
                slidesPerView: "auto",
                speed: 800,
                watchOverflow: true,
                breakpoints: {
                    767.98: {
                        spaceBetween: 65,
                    }
                }
            })
        });
    }

    if ($('.about__slider').length > 0) {
        $('.about__slider').each(function (index, slider) {

            let pagination = $(slider).find('.about__slider-pagination')[0];

            new Swiper(slider, {
                slidesPerView: 1,
                watchOverflow: true,
                pagination: {
                    el: pagination,
                    clickable: true
                },
            })
        });
    }

    if ($('.heading__slider').length > 0) {
        $('.heading__slider').each(function (index, sliderWrapper) {

            let pagination = $(sliderWrapper).find('.heading__slider-pagination')[0];
            let slider = $(sliderWrapper)[0];

            console.log(slider);



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

            })
        });
    }


    class Spollers {
        constructor() {
            this.$spollersArray = $("[data-spollers]");
            if (this.$spollersArray.length > 0) {
                this.init();
            }
        }

        init() {
            const $spollersRegular = this.$spollersArray.filter((index, item) => {
                return !$(item).data("spollers").split(",")[0];
            });

            if ($spollersRegular.length > 0) {
                this.initSpollers($spollersRegular);
            }

            const $spollersMedia = this.$spollersArray.filter((index, item) => {
                return $(item).data("spollers").split(",")[0];
            });

            if ($spollersMedia.length > 0) {
                this.initMediaSpollers($spollersMedia);
            }
        }

        initMediaSpollers($spollersMedia) {
            const breakpointsArray = [];
            $spollersMedia.each(function () {
                const params = $(this).data("spollers");
                const paramsArray = params.split(",");
                breakpointsArray.push({
                    value: paramsArray[0],
                    type: paramsArray[1] ? paramsArray[1].trim() : "max",
                    item: $(this)
                });
            });

            let mediaQueries = breakpointsArray.map((item) => {
                return `(${item.type}-width: ${item.value}px),${item.value},${item.type}`;
            });
            mediaQueries = [...new Set(mediaQueries)];

            mediaQueries.forEach((breakpoint) => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                const filteredSpollers = breakpointsArray.filter((item) => {
                    return item.value === mediaBreakpoint && item.type === mediaType;
                });

                matchMedia.addEventListener("change", () => {
                    this.initSpollers(filteredSpollers, matchMedia);
                });
                this.initSpollers(filteredSpollers, matchMedia);
            });
        }

        initSpollers(spollersArray, matchMedia = false) {
            const items = Array.isArray(spollersArray) ? spollersArray : spollersArray.toArray();

            items.forEach((spollerItem) => {
                const $spollersBlock = matchMedia ? spollerItem.item : $(spollerItem);
                if (!matchMedia || matchMedia.matches) {
                    $spollersBlock.addClass("_init");
                    this.initSpollerBody($spollersBlock, true);
                    $spollersBlock.off("click", "[data-spoller]").on("click", "[data-spoller]", (e) => this.setSpollerAction(e));
                } else {
                    $spollersBlock.removeClass("_init");
                    this.initSpollerBody($spollersBlock, false);
                    $spollersBlock.off("click", "[data-spoller]");
                }
            });
        }

        initSpollerBody($spollersBlock, hideSpollerBody = true) {
            const $spollerTitles = $spollersBlock.find("[data-spoller]");
            if ($spollerTitles.length > 0) {
                $spollerTitles.each(function () {
                    const $title = $(this);
                    const $body = $title.next();
                    const $parent = $title.parent();
                    if (hideSpollerBody) {
                        $title.removeAttr("tabindex");
                        if (!$title.hasClass("_active")) {
                            $body.hide();
                            $parent.removeClass("_spoller-open");
                        } else {
                            $body.show();
                            $parent.addClass("_spoller-open");
                        }
                    } else {
                        $title.attr("tabindex", "-1");
                        $body.show();
                        $parent.removeClass("_spoller-open");
                    }
                });
            }
        }

        setSpollerAction(e) {
            const $el = $(e.target);
            const $spollerTitle = $el.closest("[data-spoller]");
            const $spollersBlock = $spollerTitle.closest("[data-spollers]");
            const isOneSpoller = $spollersBlock.is("[data-one-spoller]");
            const $body = $spollerTitle.next();
            const $parent = $spollerTitle.parent();

            if (!$spollersBlock.find(":animated").length) {
                if (isOneSpoller && !$spollerTitle.hasClass("_active")) {
                    this.hideSpollersBody($spollersBlock);
                }

                $spollerTitle.toggleClass("_active");
                $parent.toggleClass("_spoller-open");
                $body.slideToggle(300);
            }
            e.preventDefault();
        }

        hideSpollersBody($spollersBlock) {
            const $activeTitle = $spollersBlock.find("[data-spoller]._active");
            if ($activeTitle.length) {
                $activeTitle.removeClass("_active");
                $activeTitle.parent().removeClass("_spoller-open");
                $activeTitle.next().slideUp(300);
            }
        }
    }

    window.spollers = new Spollers();


    // Phone Russia Mask

    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    var getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, '');
    };
    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    };
    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";
        if (!inputNumbersValue) {
            return input.value = "";
        }
        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }
        if (inputNumbersValue.length > 11) {
            inputNumbersValue = inputNumbersValue.substring(0, 11);
        }
        formattedInputValue = "+7 (";
        if (inputNumbersValue.length >= 2) {
            formattedInputValue += inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
        input.value = formattedInputValue;
    };
    var onPhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    };
    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('focus', function () {
            if (!this.value) {
                this.value = "+7 ";
            }
        });
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }



    // custom select
    class CustomSelect {

        static openDropdown = null;

        constructor(selectElement) {
            this.$select = $(selectElement);
            this.placeholder = this.$select.data('placeholder');
            this.listCaption = this.$select.data('list-caption');
            this.theme = this.$select.data('theme');
            this.defaultText = this.getDefaultText();
            this.selectName = this.$select.attr('name');
            this.$options = this.$select.find('option');
            this.$dropdown = null;
            this.initialState = {};
            this.init();
        }

        init() {
            if (!this.$select.length) return;
            this.saveInitialState();
            this.$select.addClass('hidden');
            this.renderDropdown();
            this.setupEvents();
        }

        saveInitialState() {
            const selectedOption = this.$select.find('option:selected');
            this.initialState = {
                selectedText: selectedOption.text(),
                selectedValue: selectedOption.val(),
            };
        }

        getDefaultText() {
            const selectedOption = this.$select.find('option[selected]');
            if (selectedOption.length) {
                return selectedOption.text();
            } else {
                return this.placeholder || this.$select.find('option:selected').text();
            }
        }

        renderDropdown() {
            const isDisabled = this.$select.is(':disabled');

            const buttonTemplate = `
            <button type="button" class="dropdown__button icon-arrows" 
                    aria-expanded="false" 
                    aria-haspopup="true" 
                    ${isDisabled ? 'disabled' : ''}>
                <span class="dropdown__button-text">${this.defaultText}</span>
            </button>
        `;

            this.$dropdown = $('<div>').addClass('dropdown');

            if (this.theme === 'grey') {
                this.$dropdown.addClass('dropdown--grey');
            }

            const captionTemplate = this.listCaption ? `<div class="dropdown__caption">${this.listCaption}</div>` : '';

            this.$dropdown.html(`
            ${buttonTemplate}
            <div class="dropdown__body" aria-hidden="true">
               <div class="dropdown__content">
                    ${captionTemplate}
                    <ul class="dropdown__list" role="listbox"></ul>
                </div>
            </div>
        `);

            const list = this.$dropdown.find('.dropdown__list');
            this.$options.each((index, option) => {
                const $option = $(option);
                const value = $option.val();
                const text = $option.text();
                const isSelected = $option.is(':selected');
                const isDisabled = $option.is(':disabled');

                const listItem = $('<li>')
                    .attr('role', 'option')
                    .data('value', value)
                    .attr('aria-checked', isSelected)
                    .addClass('dropdown__list-item')
                    .text(text);

                if (isSelected) listItem.addClass('selected');
                if (isDisabled) {
                    listItem.addClass('disabled');
                    listItem.attr('aria-disabled', 'true');
                }

                list.append(listItem);
            });

            this.$select.after(this.$dropdown);
        }

        setupEvents() {
            const button = this.$dropdown.find('.dropdown__button');
            button.on('click', (event) => {
                event.stopPropagation();
                const isOpen = this.$dropdown.hasClass('visible');
                this.toggleDropdown(!isOpen);
            });

            this.$dropdown.on('click', '.dropdown__list-item', (event) => {
                event.stopPropagation();
                const item = $(event.currentTarget);
                if (!item.hasClass('disabled')) {
                    this.selectOption(item);
                }
            });

            $(document).on('click', () => this.closeDropdown());
            $(document).on('keydown', (event) => {
                if (event.key === 'Escape') this.closeDropdown();
            });

            this.$select.closest('form').on('reset', () => this.restoreInitialState());
        }

        toggleDropdown(isOpen) {
            if (isOpen && CustomSelect.openDropdown && CustomSelect.openDropdown !== this) {
                CustomSelect.openDropdown.closeDropdown();
            }

            const body = this.$dropdown.find('.dropdown__body');
            const list = this.$dropdown.find('.dropdown__list');
            const hasScroll = list[0].scrollHeight > list[0].clientHeight;

            this.$dropdown.toggleClass('visible', isOpen);
            this.$dropdown.find('.dropdown__button').attr('aria-expanded', isOpen);
            body.attr('aria-hidden', !isOpen);

            if (isOpen) {
                CustomSelect.openDropdown = this;
                this.$dropdown.removeClass('dropdown-top');
                const dropdownRect = body[0].getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                if (dropdownRect.bottom > viewportHeight) {
                    this.$dropdown.addClass('dropdown-top');
                }
                list.toggleClass('has-scroll', hasScroll);
            } else {
                if (CustomSelect.openDropdown === this) {
                    CustomSelect.openDropdown = null;
                }
            }
        }

        closeDropdown() {
            this.toggleDropdown(false);
        }

        selectOption(item) {
            const value = item.data('value');
            const text = item.text();

            this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
            item.addClass('selected').attr('aria-checked', 'true');

            this.$dropdown.find('.dropdown__button').addClass('selected');
            this.$dropdown.find('.dropdown__button-text').text(text);
            this.$select.val(value).trigger('change');
            this.closeDropdown();
        }

        restoreInitialState() {
            const hasPlaceholder = this.placeholder !== undefined;

            if (hasPlaceholder) {
                this.$select.prop('selectedIndex', -1).trigger('change');
                this.$dropdown.find('.dropdown__button-text').text(this.placeholder);
                this.$dropdown.find('.dropdown__button').removeClass('selected');
                this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');
            } else {
                const state = this.initialState;
                this.$select.val(state.selectedValue).trigger('change');

                this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');

                const selectedItem = this.$dropdown.find(`.dropdown__list-item[data-value="${state.selectedValue}"]`);
                if (selectedItem.length) {
                    selectedItem.addClass('selected').attr('aria-checked', 'true');
                }

                this.$dropdown.find('.dropdown__button-text').text(state.selectedText);
                this.$dropdown.find('.dropdown__button').addClass('selected');
            }
        }

        syncSelectedOption() {
            const selectedOption = this.$select.find('option:selected');
            const selectedValue = selectedOption.val();
            const selectedText = selectedOption.text();

            this.$dropdown.find('.dropdown__list-item').removeClass('selected').attr('aria-checked', 'false');

            const selectedItem = this.$dropdown.find(`.dropdown__list-item[data-value="${selectedValue}"]`);
            selectedItem.addClass('selected').attr('aria-checked', 'true');

            this.$dropdown.find('.dropdown__button-text').text(selectedText);
        }
    }

    $('.select').each((index, element) => {
        new CustomSelect(element);
    });


    // certs block price calc
    $('.certs__block').each(function () {
        const $block = $(this);
        const $totalValue = $block.find('.certs__total-value');
        const $inputs = $block.find('.certs__item-input');

        $inputs.on('change', function () {
            const $checkedInput = $block.find('.certs__item-input:checked');
            const newValue = $checkedInput.closest('.certs__item').find('.certs__item-btn').text();

            $totalValue.text(newValue);
        });
    });



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


    // gsap animations

    gsap.registerPlugin(ScrollTrigger);

    function initGridAnimation() {
        let mm = gsap.matchMedia();
        let productCards = gsap.utils.toArray('[data-animate="card"]');
        let cardsPerRow = 1;

        mm.add("(min-width: 1439.98px)", () => {
            cardsPerRow = 4;
        });

        mm.add("(min-width: 991.98px) and (max-width: 1439.97px)", () => {
            cardsPerRow = 3;
        });

        mm.add("(min-width: 567.98px) and (max-width: 991.97px)", () => {
            cardsPerRow = 2;
        });

        productCards.forEach((card, index) => {
            if (index % cardsPerRow === 0) {
                let rowStart = index;
                let rowEnd = index + cardsPerRow;

                let currentRow = productCards.slice(rowStart, rowEnd);

                gsap.from(currentRow, {
                    opacity: 0,
                    y: 50,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 100%",
                        toggleActions: "play none none none"
                    }
                });
            }
        });
    }

    function initSectionAnimation() {
        let sections = gsap.utils.toArray('[data-animate="section"]');

        if (sections.length === 0) {
            return;
        }

        sections.forEach(section => {

            let photos = gsap.utils.toArray(section.querySelectorAll('[data-animate="photo"]'));
            let title = section.querySelector('[data-animate="title"]');
            let textBlocks = section.querySelectorAll('[data-animate="text"]');

            let sectionTL = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            if (photos.length > 0) {
                sectionTL.from(photos, {
                    opacity: 0,
                    scale: 0.75,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            }

            if (title) {
                sectionTL.from(title, {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: "power2.out"
                }, photos.length > 0 ? "-=0.5" : 0);
            }

            if (textBlocks.length > 0) {
                sectionTL.from(textBlocks, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: "power1.out"
                }, title ? "-=0.3" : photos.length > 0 ? "-=0.3" : 0);
            }
        });
    }

    function initFooterReveal() {
        const footerRevealWrap = document.querySelector('.footer-reveal-wrap');
        const footerRevealMask = document.querySelector('.footer-reveal-mask');
        const footerTarget = document.querySelector('.footer');
        const overlayFoot = document.querySelector('.footer__overlay');

        if (!footerRevealWrap || !footerRevealMask || !footerTarget || !overlayFoot) return;

        let mm = gsap.matchMedia();

        mm.add({
            isLarge: "(min-width: 1200px) and (min-height: 1040px)",
            isMedium: "(min-width: 992px) and (min-height: 970px)"
        }, (context) => {

            let { isLarge, isMedium } = context.conditions;

            if (isLarge || isMedium) {

                gsap.set(footerRevealMask, { yPercent: 40 });
                gsap.set(footerTarget, { filter: 'blur(5px)' });
                gsap.set(overlayFoot, { opacity: 1 });

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: footerRevealWrap,
                        start: "top bottom",
                        end: "top top",
                        scrub: true
                    }
                });


                tl.to(footerRevealMask, {
                    yPercent: 0,
                    ease: "none"
                }, 0);

                tl.to(footerTarget, {
                    filter: 'blur(0px)',
                    ease: "none"
                }, 0);

                tl.to(overlayFoot, {
                    opacity: 0,
                    ease: "none"
                }, 0);
            }

            return () => {
                gsap.set(footerRevealMask, { yPercent: 0 });
                gsap.set(footerTarget, { filter: 'blur(0px)' });
                gsap.set(overlayFoot, { opacity: 0 });
            };
        });
    }

    function initQuadrantShiftAnimation() {
        const iconBlocks = gsap.utils.toArray('[data-animate="quadrant-shift"]');
        if (iconBlocks.length === 0) return;

        const positions = [
            { x: 0, y: 0 },
            { x: 19, y: 0 },
            { x: 19, y: 19 },
            { x: 0, y: 19 }
        ];

        const positionsExtra = [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
            { x: 39, y: 0 },
            { x: 20, y: 19 },
            { x: 0, y: 19 }
        ];

        iconBlocks.forEach(svgElement => {
            const squares = [
                svgElement.querySelector('.q-1'),
                svgElement.querySelector('.q-2'),
                svgElement.querySelector('.q-3'),
                svgElement.querySelector('.q-4'),
                svgElement.querySelector('.q-5')
            ].filter(Boolean);

            if (squares.length === 0) return;

            squares.forEach(sq => {
                sq.setAttribute('x', '0');
                sq.setAttribute('y', '0');
            });

            const isExtra = squares.length === 5;
            const currentPositions = isExtra ? positionsExtra : positions;
            const totalPos = currentPositions.length;

            const startIndex = squares.map((_, i) => i % totalPos);

            squares.forEach((sq, i) => {
                gsap.set(sq, {
                    x: currentPositions[startIndex[i]].x,
                    y: currentPositions[startIndex[i]].y
                });
            });

            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 0.4,
                defaults: { duration: 0.5, ease: "power2.inOut" },
                paused: true
            });

            for (let step = 1; step <= totalPos; step++) {
                tl.to(squares, {
                    x: i => currentPositions[(startIndex[i] + step) % totalPos].x,
                    y: i => currentPositions[(startIndex[i] + step) % totalPos].y
                });
            }

            ScrollTrigger.create({
                trigger: svgElement,
                start: "top 85%",
                onEnter: () => tl.play(),
                onLeaveBack: () => tl.pause(0)
            });
        });
    }

    function initHeroHomepageAnimation() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const mask = hero.querySelector('.hero__banner-mask');

        const content = hero.querySelector('.container');
        const nextSection = hero.nextElementSibling;

        let mm = gsap.matchMedia();

        mm.add("(min-width: 991.98px)", () => {
            gsap.set(mask, {
                opacity: 1,
                clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)"
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "+=150%",
                    scrub: 1.25,
                    pin: true,
                    anticipatePin: 1
                }
            });

            tl.to(content, {
                opacity: 0,
                y: -100,
                duration: 2
            }, 0);

            tl.to(mask, {
                clipPath: "polygon(0% 82%, 0% 32%, 50% 32%, 50% 0%, 100% 0%, 100% 100%, 26% 100%, 26% 82%)",
                duration: 2,
                ease: "power2.inOut"
            }, 0);

            tl.to(mask, {
                clipPath: "polygon(0% 0%, 0% 0%, 100% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 0% 100%)",
                duration: 1.5,
                ease: "expo.inOut"
            }, 2);

            if (nextSection) {
                gsap.set(nextSection, { position: "relative", zIndex: 10 });

                tl.to(nextSection, {
                    marginTop: "-100vh",
                    duration: 1.5,
                    ease: "none"
                }, 2.5);
            }

            tl.to({}, { duration: 0.5 });

            return () => {
                gsap.set([mask, content, nextSection], { clearProps: "all" });
            };
        });
    }


    function initAllAnimations() {
        initGridAnimation();
        initSectionAnimation();
        initFooterReveal();
        initQuadrantShiftAnimation();
        initHeroHomepageAnimation();
    }

    initAllAnimations()







});


