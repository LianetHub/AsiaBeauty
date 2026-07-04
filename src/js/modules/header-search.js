export function initHeaderSearch() {
	const $header = $(".header");
	const $search = $(".header-search");
	const $toggle = $(".header__action--search");
	const $overlay = $(".header-search__overlay");
	const $close = $(".header-search__close");
	const $input = $(".header-search__input");

	if (!$search.length || !$toggle.length) return;

	function openSearch() {
		$search.addClass("is-open").attr("aria-hidden", "false");
		$header.addClass("header--search-open");
		$toggle.attr("aria-expanded", "true");

		setTimeout(() => {
			$input.trigger("focus");
		}, 350);
	}

	function closeSearch() {
		$search.removeClass("is-open").attr("aria-hidden", "true");
		$header.removeClass("header--search-open");
		$toggle.attr("aria-expanded", "false");
	}

	function toggleSearch() {
		if ($search.hasClass("is-open")) {
			closeSearch();
		} else {
			openSearch();
		}
	}

	$toggle.on("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleSearch();
	});

	$close.on("click", (e) => {
		e.preventDefault();
		closeSearch();
	});

	$overlay.on("click", () => {
		closeSearch();
	});

	$search.on("click", (e) => {
		e.stopPropagation();
	});

	$(document).on("click", (e) => {
		if (!$search.hasClass("is-open")) return;

		if (!$(e.target).closest(".header-search, .header__action--search").length) {
			closeSearch();
		}
	});

	$(document).on("keydown", (e) => {
		if (e.key === "Escape" && $search.hasClass("is-open")) {
			closeSearch();
			$toggle.trigger("focus");
		}
	});
}
