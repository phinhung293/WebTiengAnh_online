$(document).ready(function () {

    // Sidebar toggle
    $('#hamburgerBtn').on('click', function () {
        $(this).toggleClass('is-active');
        $('#sidebar').toggleClass('is-open');
        $('#sidebarOverlay').toggleClass('is-active');
    });

    $('#sidebarOverlay').on('click', function () {
        $('#hamburgerBtn').removeClass('is-active');
        $('#sidebar').removeClass('is-open');
        $(this).removeClass('is-active');
    });

    // Flashcard Flip
    $('#btnFlip, #flashcard').on('click', function () {
        $('#flashcard').toggleClass('flipped');
    });

    // Practice Mode
    $('.practice-mode-card').on('click', function () {

        $('.practice-mode-card').removeClass('active');
        $(this).addClass('active');

        $('#content-flashcards, #content-grammar, #content-speaking, #content-listening')
            .addClass('d-none');

        const modeId = $(this).attr('id');
        const contentId = modeId.replace('mode-', 'content-');

        $('#' + contentId).removeClass('d-none');
    });

    // Grammar Quiz
    let selectedAnswer = null;
    const correctAnswer = "C";

    $('.quiz-option').on('click', function () {

        $('.quiz-option').removeClass('selected');
        $(this).addClass('selected');

        selectedAnswer = $(this).data('answer');
    });

    $('#checkGrammarAnswer').on('click', function () {

        if (!selectedAnswer) {
            $('#grammarResult')
                .text('Please select an answer first.')
                .css('color', '#dc2626');
            return;
        }

        $('.quiz-option').removeClass('correct wrong');

        $('.quiz-option').each(function () {

            const answer = $(this).data('answer');

            if (answer === correctAnswer) {
                $(this).addClass('correct');
            }

            if (
                answer === selectedAnswer &&
                answer !== correctAnswer
            ) {
                $(this).addClass('wrong');
            }
        });

        if (selectedAnswer === correctAnswer) {
            $('#grammarResult')
                .text('✅ Correct! Well done.')
                .css('color', '#16a34a');
        } else {
            $('#grammarResult')
                .text('❌ Incorrect. The correct answer is C. went')
                .css('color', '#dc2626');
        }
    });

});