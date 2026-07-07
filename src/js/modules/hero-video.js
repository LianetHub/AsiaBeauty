const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function isDesktopViewport() {
	return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getVisibleVideo(slide) {
	if (!slide) return null;

	return slide.querySelector(
		isDesktopViewport() ? ".hero__video-bg--desktop" : ".hero__video-bg--mobile"
	);
}

function pauseVideo(video) {
	if (!video) return;

	video.pause();
	video.currentTime = 0;
}

function pauseAllVideos(container) {
	container.querySelectorAll("video").forEach(pauseVideo);
}

function playVideo(video) {
	if (!video) return Promise.resolve();

	video.currentTime = 0;

	return video.play().catch(() => {});
}

function playActiveVideo(swiper) {
	const slide = swiper.slides[swiper.activeIndex];
	const video = getVisibleVideo(slide);

	pauseAllVideos(swiper.el);
	playVideo(video);
}

function isActiveVisibleVideo(swiper, video) {
	const slide = video.closest(".swiper-slide");

	if (!slide || !slide.classList.contains("swiper-slide-active")) {
		return false;
	}

	return getVisibleVideo(slide) === video;
}

export function initHeroVideo() {
	const container = document.querySelector(".hero__video-slider");

	if (!container || typeof Swiper === "undefined") return;

	const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
	let wasDesktop = isDesktopViewport();

	const swiper = new Swiper(container, {
		loop: true,
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
		allowTouchMove: false,
		speed: 800,
		autoplay: false,
		on: {
			init(swiperInstance) {
				playActiveVideo(swiperInstance);
			},
			slideChangeTransitionEnd(swiperInstance) {
				playActiveVideo(swiperInstance);
			},
		},
	});

	container.addEventListener(
		"ended",
		(event) => {
			const video = event.target;

			if (!(video instanceof HTMLVideoElement)) return;
			if (!isActiveVisibleVideo(swiper, video)) return;

			swiper.slideNext();
		},
		true
	);

	const handleViewportChange = () => {
		const isDesktop = isDesktopViewport();

		if (isDesktop === wasDesktop) return;

		wasDesktop = isDesktop;
		playActiveVideo(swiper);
	};

	if (typeof desktopMediaQuery.addEventListener === "function") {
		desktopMediaQuery.addEventListener("change", handleViewportChange);
	} else {
		desktopMediaQuery.addListener(handleViewportChange);
	}
}
