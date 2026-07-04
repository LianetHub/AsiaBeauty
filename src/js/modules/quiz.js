export function initQuiz() {
    const $quizzes = $('[data-quiz]');

    if (!$quizzes.length) return;

    const STEPS = ['start', '1', '2', '3', '4', 'success'];
    const QUESTION_STEPS = ['1', '2', '3', '4'];
    const FIELD_NAMES = ['quiz_goal', 'quiz_duration', 'quiz_format', 'quiz_frequency'];

    $quizzes.each(function () {
        const $quiz = $(this);
        const $steps = $quiz.find('[data-quiz-step]');
        const $progress = $quiz.find('.quiz__progress');
        const $progressWrap = $quiz.find('.quiz__progress-wrap');
        const $prevBtn = $quiz.find('[data-quiz-prev]');
        const $nextBtn = $quiz.find('[data-quiz-next]');
        const $form = $quiz.find('.quiz__form');

        let currentStep = 'start';

        function getStepIndex(step) {
            return STEPS.indexOf(step);
        }

        function isQuestionStep(step) {
            return QUESTION_STEPS.includes(step);
        }

        function getSelectedValue(step) {
            const fieldName = FIELD_NAMES[QUESTION_STEPS.indexOf(step)];
            const $checked = $quiz.find(`input[name="${fieldName}"]:checked`);
            return $checked.length ? $checked.val() : '';
        }

        function isCurrentStepAnswered() {
            if (!isQuestionStep(currentStep)) return true;
            return Boolean(getSelectedValue(currentStep));
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
            const onStart = currentStep === 'start';
            const onSuccess = currentStep === 'success';
            const onFirstQuestion = currentStep === '1';

            if (onStart || onSuccess) {
                $prevBtn.prop('disabled', true).attr('aria-disabled', 'true');
                $nextBtn.prop('disabled', true).attr('aria-disabled', 'true');
                return;
            }

            $prevBtn.prop('disabled', onFirstQuestion).attr('aria-disabled', onFirstQuestion ? 'true' : 'false');

            const canGoNext = isCurrentStepAnswered();
            $nextBtn.prop('disabled', !canGoNext).attr('aria-disabled', canGoNext ? 'false' : 'true');
        }

        function fillFormAnswers() {
            FIELD_NAMES.forEach((name) => {
                const value = $quiz.find(`input[name="${name}"]:checked`).val() || '';
                $form.find(`input[name="${name}_result"]`).val(value);
            });
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

        $quiz.on('click', '[data-quiz-start]', function () {
            goToStep('1');
        });

        $quiz.on('click', '[data-quiz-next]', function () {
            goNext();
        });

        $quiz.on('click', '[data-quiz-prev]', function () {
            goPrev();
        });

        $quiz.on('change', '.quiz__option-input', function () {
            updateNav();
        });

        $form.on('submit', function (e) {
            e.preventDefault();
            fillFormAnswers();

            const formData = new FormData(this);
            for (const [name, value] of formData) {
                console.log(`${name} = ${value}`);
            }

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'sendmail.php', true);
            xhr.send(formData);

            this.reset();
            goToStep('start');
        });

        goToStep('start');
    });
}
