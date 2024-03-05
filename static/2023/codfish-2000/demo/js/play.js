
'use strict';

/**
 * This file handles the play engine game mode.
 */



/**
 * ############################# PLAY EVENTS #############################
 */

document.querySelector('.slider').addEventListener('input', sliderInputEvent);
document.querySelector('.play-button').addEventListener('click', playButtonClickEvent);

let DOM_SAVE_POSITION_BUTTON = document.querySelector('.save-position-button');
if (DOM_SAVE_POSITION_BUTTON != undefined) {
    DOM_SAVE_POSITION_BUTTON.addEventListener('click', savePositionEvent);
}

function sliderInputEvent(event) {

    let DOM_engine_level = document.querySelector('.engine-level');
    let DOM_opening_book_text = document.querySelector('.opening-book');
    let DOM_maximum_depth_text = document.querySelector('.maximum-depth');

    switch (event.target.value) {
        case '1':
            DOM_engine_level.childNodes[0].nodeValue = 'Engine level: Beginner';
            DOM_opening_book_text.childNodes[0].nodeValue = 'Opening book: Tiny (97kb)';
            DOM_maximum_depth_text.childNodes[0].nodeValue = 'Maximum depth: 2';

            OPENING_BOOK_ID = 'tiny';
            ENGINE_MAX_DEPTH = 2;
            break;
        case '2':
            DOM_engine_level.childNodes[0].nodeValue = 'Engine level: Intermediate';
            DOM_opening_book_text.childNodes[0].nodeValue = 'Opening book: Small (362kb)';
            DOM_maximum_depth_text.childNodes[0].nodeValue = 'Maximum depth: 3';

            OPENING_BOOK_ID = 'small';
            ENGINE_MAX_DEPTH = 3;
            break;
        case '3':
            DOM_engine_level.childNodes[0].nodeValue = 'Engine level: Advanced';
            DOM_opening_book_text.childNodes[0].nodeValue = 'Opening book: Default (999kb)';
            DOM_maximum_depth_text.childNodes[0].nodeValue = 'Maximum depth: 4';

            OPENING_BOOK_ID = 'default';
            ENGINE_MAX_DEPTH = 4;
            break;
        case '4':
            DOM_engine_level.childNodes[0].nodeValue = 'Engine level: Expert';
            DOM_opening_book_text.childNodes[0].nodeValue = 'Opening book: Large (2.2Mb)';
            DOM_maximum_depth_text.childNodes[0].nodeValue = 'Maximum depth: 6';
            
            OPENING_BOOK_ID = 'large';
            ENGINE_MAX_DEPTH = 6;
            break;
        case '5':
            DOM_engine_level.childNodes[0].nodeValue = 'Engine level: Master';
            DOM_opening_book_text.childNodes[0].nodeValue = 'Opening book: Largest (7.0Mb)';
            DOM_maximum_depth_text.childNodes[0].nodeValue = 'Maximum think time: ~15s';

            OPENING_BOOK_ID = 'largest';
            ENGINE_MAX_DEPTH = 99;
            break;
    }
    
}

async function playButtonClickEvent() {

    let DOM_popup_container = document.querySelector('.popup-container');
    let DOM_settings = document.querySelector('.settings');
    let DOM_download_opening_book = document.querySelector('.download-opening-book');

    DOM_settings.style.display = 'none';
    DOM_download_opening_book.style.display = 'flex';

    await fetchOpeningBook();

    DOM_download_opening_book.style.display = 'none';
    DOM_popup_container.style.display = 'none';
    DOM_ANTI_CLICK_OVERLAY.style.display = 'none';

    if (DOM_SAVE_POSITION_BUTTON != undefined) {
        DOM_SAVE_POSITION_BUTTON.disabled = false;
    }
}

function savePositionEvent() {
    fetch(
        'save_position.php',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: "fen=" + GAME
        })
    .then(response => {
        if (!response.ok) {
            if (response.status == 409) {
                throw new Error('This position already exists in the database');
            }
            else {
                throw new Error('Unable to save position: Error ' + response.status);
            }
        }
        else {
            window.alert('Position successfully saved');
        }
    })
    .catch((error) => {
        window.alert(error.message);
    });

}



/**
 * ############################# PLAY #############################
 */

function displayPopupIfGameEnded() {

    if (GAME.status == STATUS.ONGOING) {
        return;
    }

    let DOM_popup_container = document.querySelector('.popup-container');
    let DOM_game_result = document.querySelector('.game-result');
    let DOM_game_result_text = document.querySelector('.game-result-text');

    DOM_ANTI_CLICK_OVERLAY.style.display = 'block';
    DOM_popup_container.style.display = 'flex';
    DOM_game_result.style.display = 'flex';
    
    if (GAME.status == STATUS.WHITE_WINS) {
        DOM_game_result_text.childNodes[0].nodeValue = 'White wins!';
    }
    else if (GAME.status == STATUS.BLACK_WINS) {
        DOM_game_result_text.childNodes[0].nodeValue = 'Black wins!';
    }
    else {
        DOM_game_result_text.childNodes[0].nodeValue = 'Draw';
    }

}

function updateGameAndGUI(evaluation, best_move) {

    DOM_BUBBLES.style.visibility = 'hidden';

    /**
     * The best move can be undefined if for example there 
     * are no legal moves because there is a checkmate.
     */
    if (best_move != undefined) {
        GAME.playMove(best_move);
        updateGUIChessboard(best_move);
    }

    updateGUIEvaluationBar(evaluation);
    displayPopupIfGameEnded();

}

function playEngine(depth = 1) {

    if (GAME.status != STATUS.ONGOING || depth > ENGINE_MAX_DEPTH) {
        return;
    }

    if (GAME.searchOpeningBook()) {
        return;
    }

    let start = Date.now();
    let [evaluation, best_move] = miniMax(depth, -Infinity, Infinity);
    let end = Date.now();
    let seconds = (end - start) / 1000;

    
    // There is a checkmate on the board
    if (evaluation == - Infinity) {
        if (depth <= 2) {
            GAME.status = STATUS.BLACK_WINS;
        }
    }
    
    // There is a checkmate on the board
    else if (evaluation == Infinity) {
        if (depth <= 2) {
            GAME.status = STATUS.WHITE_WINS;
        }
    }
    
    // There is a forced draw on the board
    else if (evaluation == FORCED_DRAW_EVALUATION) {
        if (depth <= 2) {
            GAME.status = STATUS.DRAW;
        }
    }

    // There is still enough time to search deeper
    else if (seconds < ENGINE_MAX_TIME && depth < ENGINE_MAX_DEPTH) {
        playEngine(depth + 1);
        return;
    }

    updateGameAndGUI(evaluation, best_move);
}



/**
 * ############################# MAIN #############################
 */

initializeGUI();
GAME.game_mode = GAME_MODE.PLAY_ENGINE;
DOM_ANTI_CLICK_OVERLAY.style.display = 'block';
ENGINE_MAX_DEPTH = 4;
