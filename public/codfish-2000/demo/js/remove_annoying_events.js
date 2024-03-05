
'use strict';

/**
 * This file removes the annoying dragstart and contextmenu events.
 */



document.querySelector('body').addEventListener(
    'dragstart',
    (event) => {
        event.preventDefault();
    }
);

let board = document.querySelector('.chessboard');

if (board != undefined) {
    board.addEventListener(
        'contextmenu',
        (event) => {
            event.preventDefault();
        }
    );
}