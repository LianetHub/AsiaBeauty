export function initCartFancybox() {
	if (typeof Fancybox === "undefined" || !document.querySelector("[data-fancybox='cart']")) return;

	Fancybox.bind("[data-fancybox='cart']", {
		dragToClose: false,
		autoFocus: false,
		zoomEffect: false,
		fadeEffect: false,
		showClass: "f-cartSlideIn",
		hideClass: "f-cartSlideOut",
		mainClass: "cart-modal",
		on: {
			reveal: () => {
				document.body.classList.add("lock-cart");
			},
			destroy: () => {
				document.body.classList.remove("lock-cart");
			},
		},
	});
}
