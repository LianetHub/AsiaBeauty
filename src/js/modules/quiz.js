export function initQuiz() {
    const $quizzes = $('[data-quiz]');

    if (!$quizzes.length) return;

    const STEPS = ['1', '2', '3', '4', 'success'];
    const QUESTION_STEPS = ['1', '2', '3', '4'];
    const FIELD_NAMES_HOME = ['quiz_result', 'quiz_massage', 'quiz_duration', 'quiz_details'];
    const FIELD_NAMES_SPECIALOFFER = ['quiz_occasion', 'quiz_duration', 'quiz_format', 'quiz_frequency'];

    $quizzes.each(function () {
        const $quiz = $(this);
        const isSpecialOffer = $quiz.hasClass('quiz--specialoffer');
        const fieldNames = isSpecialOffer ? FIELD_NAMES_SPECIALOFFER : FIELD_NAMES_HOME;
        const $steps = $quiz.find('[data-quiz-step]');
        const $progress = $quiz.find('.quiz__progress');
        const $progressWrap = $quiz.find('.quiz__progress-wrap');
        const $currentCounter = $quiz.find('[data-quiz-current]');
        const $prevBtn = $quiz.find('[data-quiz-prev]');
        const $nextBtn = $quiz.find('[data-quiz-next]');
        const $form = $quiz.find('.quiz__form');

        let currentStep = '1';

        function getStepIndex(step) {
            return STEPS.indexOf(step);
        }

        function isQuestionStep(step) {
            return QUESTION_STEPS.includes(step);
        }

        function getSelectedValue(step) {
            const fieldName = fieldNames[QUESTION_STEPS.indexOf(step)];
            const $checked = $quiz.find(`input[name="${fieldName}"]:checked`);
            return $checked.length ? $checked.val() : '';
        }

        function isCurrentStepAnswered() {
            if (!isQuestionStep(currentStep)) return true;
            return Boolean(getSelectedValue(currentStep));
        }

        function updateCounter() {
            if (!isQuestionStep(currentStep)) return;
            $currentCounter.text(currentStep);
        }

        function updateProgress() {
            if (!isQuestionStep(currentStep)) {
                if (currentStep === 'success') {
                    $progress.val(4);
                    $progressWrap.css('--quiz-progress', '100%');
                }
                return;
            }

            const stepNumber = Number(currentStep);
            $progress.val(stepNumber);
            $progressWrap.css('--quiz-progress', `${(stepNumber / 4) * 100}%`);
        }

        function updateNav() {
            const onSuccess = currentStep === 'success';
            const onFirstQuestion = currentStep === '1';

            if (onSuccess) {
                $prevBtn.prop('disabled', false).attr('aria-disabled', 'false');
                $nextBtn.prop('disabled', true).attr('aria-disabled', 'true');
                return;
            }

            $prevBtn.prop('disabled', onFirstQuestion).attr('aria-disabled', onFirstQuestion ? 'true' : 'false');

            const canGoNext = isCurrentStepAnswered();
            $nextBtn.prop('disabled', !canGoNext).attr('aria-disabled', canGoNext ? 'false' : 'true');
        }

        function fillFormAnswers() {
            fieldNames.forEach((name) => {
                const value = $quiz.find(`input[name="${name}"]:checked`).val() || '';
                $form.find(`input[name="${name}_result"]`).val(value);
            });

            if (!isSpecialOffer) {
                const messenger = $quiz.find('input[name="quiz_messenger"]:checked').val() || '';
                $form.find('input[name="quiz_messenger_result"]').val(messenger);
            }
        }

        function goToStep(step) {
            if (!STEPS.includes(step)) return;

            currentStep = step;
            $quiz.attr('data-quiz-state', step);

            $steps.removeClass('quiz__step--active');
            $steps.filter(`[data-quiz-step="${step}"]`).addClass('quiz__step--active');

            if (step === 'success') {
                fillFormAnswers();
            }

            updateCounter();
            updateProgress();
            updateNav();
        }

        function goNext() {
            const index = getStepIndex(currentStep);
            if (index < 0 || index >= STEPS.length - 1) return;

            if (isQuestionStep(currentStep) && !isCurrentStepAnswered()) return;

            goToStep(STEPS[index + 1]);
        }

        function goPrev() {
            const index = getStepIndex(currentStep);
            if (index <= 0) return;

            goToStep(STEPS[index - 1]);
        }

        $quiz.on('click', '[data-quiz-next]', function () {
            goNext();
        });

        $quiz.on('click', '[data-quiz-prev]', function () {
            goPrev();
        });

        $quiz.on('change', '.quiz__option-input', function () {
            const $input = $(this);
            const name = $input.attr('name');

            if (name === 'quiz_messenger') {
                fillFormAnswers();
                return;
            }

            updateNav();

            if (!isQuestionStep(currentStep)) return;

            const stepAtSelection = currentStep;

            window.setTimeout(() => {
                if (currentStep === stepAtSelection && isCurrentStepAnswered()) {
                    goNext();
                }
            }, 200);
        });

        $form.on('submit', function (e) {
            e.preventDefault();
            fillFormAnswers();

            if (!isSpecialOffer) {
                const phone = $form.find('input[name="phone"]').val().trim();
                const messenger = $quiz.find('input[name="quiz_messenger"]:checked').val();

                if (!phone || !messenger) {
                    return;
                }
            }

            const formData = new FormData(this);
            for (const [name, value] of formData) {
                console.log(`${name} = ${value}`);
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'sendmail.php', true);
            xhr.send(formData);

            this.reset();
            goToStep('1');
        });

        goToStep('1');
    });
}
