const MIN_PRICE = 1500;
const MAX_PRICE = 150000;

function parsePrice(value) {
	return parseInt(String(value).replace(/\s/g, "").replace(/[^\d]/g, ""), 10);
}

function formatPrice(value) {
	return Math.round(value).toLocaleString("ru-RU");
}

function getTextWidth(text, input) {
	const span = document.createElement("span");
	const cs = window.getComputedStyle(input);

	span.style.position = "absolute";
	span.style.visibility = "hidden";
	span.style.whiteSpace = "nowrap";
	span.style.font = cs.font;
	span.style.letterSpacing = cs.letterSpacing;
	span.textContent = String(text || "");
	document.body.appendChild(span);

	const width = span.offsetWidth;
	document.body.removeChild(span);

	return width;
}

function updateUnitPosition(input) {
	const $input = $(input);
	const $unit = $input.siblings(".range__unit");

	if (!$unit.length) return;

	const cs = window.getComputedStyle(input);
	const value = $input.val();
	const textWidth = getTextWidth(value, input);
	const paddingLeft = parseFloat(cs.paddingLeft) || 0;
	const paddingRight = parseFloat(cs.paddingRight) || 0;
	const clientWidth = input.clientWidth;
	const contentWidth = Math.max(0, clientWidth - paddingLeft - paddingRight);
	let textStartX;
	const textAlign = cs.textAlign;

	if (textAlign === "center") {
		textStartX = paddingLeft + Math.max(0, (contentWidth - textWidth) / 2);
	} else if (textAlign === "right" || textAlign === "end") {
		textStartX = clientWidth - paddingRight - textWidth;
	} else {
		textStartX = paddingLeft;
	}

	const gap = 4;
	const currencyWidth = $unit.outerWidth();
	const desiredLeft = textStartX + textWidth + gap;
	const maxLeft = clientWidth - paddingRight - currencyWidth;

	$unit.css("left", Math.min(desiredLeft, maxLeft) + "px");
	$unit.addClass("ready");
}

function initRangeFilter(rangeEl) {
	const $range = $(rangeEl);
	const sliderEl = $range.find(".range__slider")[0];
	const startInput = $range.find(".range__control--start")[0];
	const endInput = $range.find(".range__control--end")[0];
	const inputs = [startInput, endInput];

	if (!sliderEl || !startInput || !endInput || typeof noUiSlider === "undefined") return;

	const min = parseInt(startInput.getAttribute("min"), 10) || MIN_PRICE;
	const max = parseInt(endInput.getAttribute("max"), 10) || MAX_PRICE;
	const margin = Math.round((max - min) * 0.05);

	startInput.value = formatPrice(parsePrice(startInput.value) || min);
	endInput.value = formatPrice(parsePrice(endInput.value) || max);
	inputs.forEach((input) => input.classList.add("is-filled"));

	noUiSlider.create(sliderEl, {
		start: [parsePrice(startInput.value), parsePrice(endInput.value)],
		connect: true,
		margin,
		range: {
			min,
			max,
		},
	});

	sliderEl.noUiSlider.on("update", (values, handle) => {
		inputs[handle].value = formatPrice(Math.round(values[handle]));
		inputs[handle].classList.add("is-filled");
		updateUnitPosition(inputs[handle]);
	});

	const setRangeSlider = (index, value) => {
		const arr = [null, null];
		arr[index] = parsePrice(value);
		sliderEl.noUiSlider.set(arr);
	};

	inputs.forEach((input, index) => {
		const $input = $(input);

		$input.on("change", function () {
			setRangeSlider(index, $(this).val());
		});

		$input.on("input", function () {
			let value = $(this).val().replace(/[^\d]/g, "");
			$(this).val(value);
			$(this).addClass("active");
			updateUnitPosition(this);
		});

		updateUnitPosition(input);
	});

	if (typeof ResizeObserver !== "undefined") {
		const observer = new ResizeObserver(() => {
			updateUnitPosition(startInput);
			updateUnitPosition(endInput);
		});

		observer.observe(startInput);
		observer.observe(endInput);
	}

	return sliderEl;
}

export function initCatalogFilter() {
	const sidebar = document.querySelector(".catalog__sidebar");
	if (!sidebar) return;

	const resetBtn = sidebar.querySelector("[data-catalog-reset]");
	const form = sidebar.querySelector(".catalog__sidebar-form");
	const rangeEl = sidebar.querySelector(".catalog__range-filter");
	const sliderEl = rangeEl ? initRangeFilter(rangeEl) : null;

	sidebar.querySelectorAll("[data-sidebar-more]").forEach((button) => {
		const list = button.previousElementSibling;

		if (!list || !list.classList.contains("catalog__sidebar-list")) return;

		button.addEventListener("click", () => {
			const isExpanded = list.classList.toggle("is-expanded");
			button.textContent = isExpanded ? "Скрыть" : "Показать все";
		});
	});

	if (resetBtn && form) {
		resetBtn.addEventListener("click", () => {
			form.reset();

			if (sliderEl?.noUiSlider) {
				const startInput = rangeEl.querySelector(".range__control--start");
				const endInput = rangeEl.querySelector(".range__control--end");
				const min = parseInt(startInput.getAttribute("min"), 10) || MIN_PRICE;
				const max = parseInt(endInput.getAttribute("max"), 10) || MAX_PRICE;

				startInput.value = formatPrice(min);
				endInput.value = formatPrice(max);
				sliderEl.noUiSlider.set([min, max]);
				updateUnitPosition(startInput);
				updateUnitPosition(endInput);
			}

			document.querySelectorAll(".catalog-toolbar__chip input").forEach((input) => {
				input.checked = false;
			});

			sidebar.querySelectorAll(".catalog__sidebar-list.is-expanded").forEach((list) => {
				list.classList.remove("is-expanded");
			});

			sidebar.querySelectorAll("[data-sidebar-more]").forEach((button) => {
				button.textContent = "Показать все";
			});

			rangeEl?.querySelectorAll(".range__control").forEach((input) => {
				input.classList.add("is-filled");
			});
		});
	}
}

export function initCatalogToolbar() {
	const toggler = document.querySelector(".catalog-toolbar__chips-toggler");
	const filters = document.querySelector(".catalog-toolbar__filters");

	if (!toggler || !filters) return;

	toggler.addEventListener("click", () => {
		const isHidden = filters.classList.toggle("catalog-toolbar__filters--chips-hidden");

		toggler.classList.toggle("active", !isHidden);
		toggler.setAttribute("aria-expanded", String(!isHidden));
	});
}
