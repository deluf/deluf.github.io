
'use strict';

/**
 * This file handles the Graphical User Interface
 */



/**
 * ############################# GUI GLOBAL VARIABLES #############################
 */

let LAST_MOVE_SQUARES = [];
let DOM_PIECES = new Array(120);
let DOM_CHESSBOARD;
let SQUARE_SIZE = getCSSSquareSize();



/**
 * ############################# GUI CONSTANTS #############################
 */

const MOBILE_SQUARE_SIZE_THRESHOLD = 40;



/**
 * ############################# GUI DOM ELEMENTS #############################
 */

const DOM_BUBBLES = document.querySelector('.bubbles');
const DOM_ANTI_CLICK_OVERLAY = document.querySelector('.anti-click-overlay');



/**
 * ############################# GUI UTILITIES #############################
 */

/**
 * Returns the pixels of the current CSS --SQUARE-SIZE property 
 * @returns {Number}
 */
function getCSSSquareSize() {
    let DOM_root = document.querySelector(':root');
    let square_size_px = getComputedStyle(DOM_root).getPropertyValue('--SQUARE-SIZE');
    return parseInt(square_size_px);
}

/**
 * Given the raw coordinates of the mouse pointer, returns 
 * their translation to the chessboard's top left corner.
 * @param {Number} raw_mouse_x 
 * @param {Number} raw_mouse_y 
 * @returns {Number[]}
 */
function mouseToBoardCoords(raw_mouse_x, raw_mouse_y) {
    let chessboard_corners = DOM_CHESSBOARD.getBoundingClientRect();
    return [
        raw_mouse_x - chessboard_corners.left,
        raw_mouse_y - chessboard_corners.top
    ];
}

/**
 * Given the raw coordinates of the mouse pointer, returns the underlying square.
 * @param {Number} raw_mouse_x 
 * @param {Number} raw_mouse_y 
 */
function mouseToSquare(raw_mouse_x, raw_mouse_y) {
    let [board_x, board_y] = mouseToBoardCoords(raw_mouse_x, raw_mouse_y);
    let [R, C] = [Math.floor(board_y / SQUARE_SIZE), Math.floor(board_x / SQUARE_SIZE)];
    return RCto120(R, C);
}

/**
 * Returns the first key of the given object which has the specified value.
 * @param {*} object 
 * @param {*} value 
 * @returns 
 */
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] == value);
}

function toggleLastMoveHighlight() {
    for (let square of LAST_MOVE_SQUARES) {
        document.querySelector(`.index-${square}`).classList.toggle('last-move');
    }
}



/**
 * ############################# GUI #############################
 */

/**
 *  Initializes the GUI according to the GAME object
 */ 
function initializeGUI() {

    toggleLastMoveHighlight();

    // If the chessboard is already present then only delete all pieces
    if (DOM_CHESSBOARD != undefined) {
        MOVING_PIECE.reset();
        DOM_PIECES = new Array(120);
        LAST_MOVE_SQUARES = [];
        document.querySelectorAll('.piece').forEach(
            piece => piece.remove()
        );
    }
    else {
        createEmptyGUIChessboard();
    }

    let piece, DOM_element, piece_type, piece_color, square;
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
    
            square = RCto120(row, column);
            piece = GAME.chessboard[square];

            if (piece == PIECES.EMPTY) {
                continue;
            }

            piece_color = isWhite(piece) ? 'w' : 'b';
            piece_type = getKeyByValue(PIECES, piece).toUpperCase();

            DOM_element = document.createElement('div');
            DOM_element.className = `piece ${piece_color}${piece_type}`;
            DOM_element.style.top = `calc(var(--SQUARE-SIZE) * ${row})`;
            DOM_element.style.left = `calc(var(--SQUARE-SIZE) * ${column})`;

            DOM_element.addEventListener('mousedown', pieceMouseDownEvent);
            DOM_element.addEventListener('mouseup', pieceMouseUpEvent);

            DOM_PIECES[square] = DOM_element;
            DOM_CHESSBOARD.appendChild(DOM_element);
        }
    }
}

function createEmptyGUIChessboard() {
    DOM_CHESSBOARD = document.querySelector('.chessboard');
    DOM_CHESSBOARD.addEventListener('mousemove', chessboardMouseMoveEvent);
    
    let color, square;
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
    
            color = ((row + column) % 2 == 0) ? 'bright' : 'dark';
    
            square = document.createElement('div');
            square.className = `square ${color} index-${RCto120(row, column)}`;
           
            square.addEventListener('mousedown', squareMouseDownEvent);      

            DOM_CHESSBOARD.appendChild(square);
        }
    }
}

function updateGUIChessboard(move) {

    let [
        start_square,
        end_square,
        start_piece,
        end_piece,
        promotion_move,
        ,
        en_passant_capture,
        castling_move
    ] = decodeMove(move);

    // Remove the hightlight on the old last move
    toggleLastMoveHighlight();

    LAST_MOVE_SQUARES = [
        start_square,
        end_square
    ];

    // Highlight the new move
    toggleLastMoveHighlight();

    // If the move captures a piece it's sufficient to swap classes
    if (end_piece != PIECES.EMPTY) {

        let piece_color = isWhite(start_piece) ? 'w' : 'b';
        let piece_type = getKeyByValue(PIECES, start_piece).toUpperCase();

        DOM_PIECES[end_square].classList.replace(
            DOM_PIECES[end_square].classList[1],
            `${piece_color}${piece_type}`
        );

        DOM_PIECES[start_square].remove();
        DOM_PIECES[start_square] = undefined;

        return;
    }

    // Moving to an empty square
    let [row_to, column_to] = _120toRC(end_square);

    DOM_PIECES[start_square].style.top = `calc(var(--SQUARE-SIZE) * ${row_to})`;
    DOM_PIECES[start_square].style.left = `calc(var(--SQUARE-SIZE) * ${column_to})`;
    DOM_PIECES[end_square] = DOM_PIECES[start_square];
    DOM_PIECES[start_square] = undefined;

    // Promotion
    if (promotion_move) {
        let piece_color = isWhite(start_piece) ? 'w' : 'b';
        let piece_type = getKeyByValue(PIECES, start_piece).toUpperCase();

        DOM_PIECES[end_square].classList.replace(
            DOM_PIECES[end_square].classList[1],
            `${piece_color}${piece_type}`
        );
    }

    // En passant
    if (en_passant_capture) {
        let direction = getOpponentPawnDirection(isWhite(start_piece));
        DOM_PIECES[end_square + direction].remove();
        DOM_PIECES[end_square + direction] = PIECES.EMPTY;

        return;
    }

    // Castling
    if (castling_move != CASTLING_MOVES.NONE) {
        if (castling_move == CASTLING_MOVES.WHITE_KING_SIDE) {
            start_square = 98;
            end_square = 96;
        }
        else if (castling_move == CASTLING_MOVES.WHITE_QUEEN_SIDE) {
            start_square = 91;
            end_square = 94;
        }
        else if (castling_move == CASTLING_MOVES.BLACK_KING_SIDE) {
            start_square = 28;
            end_square = 26;
        }
        else {
            start_square = 21;
            end_square = 24;
        }

        [row_to, column_to] = _120toRC(end_square);

        DOM_PIECES[start_square].style.top = `calc(var(--SQUARE-SIZE) * ${row_to})`;
        DOM_PIECES[start_square].style.left = `calc(var(--SQUARE-SIZE) * ${column_to})`;
    
        DOM_PIECES[end_square] = DOM_PIECES[start_square];
        DOM_PIECES[start_square] = undefined;
    }

}

function updateGUIEvaluationBar(evaluation) {
    
    if (evaluation < -4) {
        evaluation = '0px';
    }
    else if (evaluation > 4) {
        evaluation = `calc(var(--SQUARE-SIZE) * 8)`;
    }
    else {
        evaluation = evaluation * 0.5;
        if (SQUARE_SIZE <= MOBILE_SQUARE_SIZE_THRESHOLD) {
            evaluation = evaluation * 0.5;
        }
        evaluation = `calc(var(--SQUARE-SIZE) * ${(4 + evaluation)})`;
    }
    
    document.querySelector('.evaluation-bar-white').style.height = evaluation;

}



/**
 * ############################# MOVING PIECE OBJECT #############################
 */

class MovingPiece {

    constructor() {
        this.is_mouse_down = true;
    };

    isSet() {
        return this.DOM_element != undefined;
    };

};

MovingPiece.prototype.createDotsOnLegalSquares = function() {
    if (this.legal_squares == undefined) {
        return;
    }
    
    let dot, DOM_square;
    for (let legal_square of this.legal_squares) {

        DOM_square = document.querySelector(`.index-${legal_square}`);

        if (GAME.chessboard[legal_square] != PIECES.EMPTY) {
            DOM_square.classList.add('capture');
            continue;
        }

        dot = document.createElement('div');
        dot.className = 'dot';
        DOM_square.appendChild(dot);
    }
};

MovingPiece.prototype.removeDotsOnLegalSquares = function() {
    if (this.legal_squares == undefined) {
        return;
    }

    let DOM_square;
    for (let legal_square of this.legal_squares) {

        DOM_square = document.querySelector(`.index-${legal_square}`);
        DOM_square.classList.remove('capture');
        DOM_square.replaceChildren();
    }
};

MovingPiece.prototype.removeLastMouseOverSquare = function() {
    if (this.last_mouseover_square == undefined) {
        return;
    }
    document.querySelector(`.index-${this.last_mouseover_square}`).classList.remove('piece-over');
};

MovingPiece.prototype.toggleStartSquareHighlight = function() {
    if (this.start_square == undefined) {
        return;
    }
    document.querySelector(`.index-${this.start_square}`).classList.toggle('piece-start');
};

MovingPiece.prototype.set = function(target, raw_mouse_x, raw_mouse_y) {
    this.DOM_element = target;
    this.start_square = mouseToSquare(raw_mouse_x, raw_mouse_y);

    this.DOM_element.style.zIndex = 1;
    this.is_mouse_down = true;

    this.legal_squares = [];
    this.legal_moves = findLegalMovesBySquare(this.start_square);
    this.legal_moves.forEach(
        legal_move => this.legal_squares.push(
            decodeMove(legal_move)[1]
        )
    );

    this.toggleStartSquareHighlight();
    this.createDotsOnLegalSquares();
};

MovingPiece.prototype.reset = function() {
    if (this.DOM_element == undefined) {
        return;
    }

    this.removeDotsOnLegalSquares();
    this.removeLastMouseOverSquare();
    this.toggleStartSquareHighlight();

    this.DOM_element.style.zIndex = 0;
    this.DOM_element = undefined;

    this.is_mouse_down = true;
    this.start_square = undefined;
    this.legal_moves = undefined;
    this.legal_squares = undefined;
    this.last_mouseover_square = undefined; 
};

let MOVING_PIECE = new MovingPiece;



/**
 * ############################# GUI EVENTS #############################
 */

window.addEventListener(
    'resize',
    () => {SQUARE_SIZE = getCSSSquareSize();}
);

function pieceMouseDownEvent(event) {

    // Left click only
    if (event.button != 0) {
        return;
    }

    // The first character of the class identifies the piece type (ex: 'bR')
    let to_play = GAME.to_play == PLAYERS.WHITE ? 'w' : 'b';
    if (event.target.classList[1][0] != to_play) {
        return;
    }
    
    // There are no already selected pieces
    if (!MOVING_PIECE.isSet()) {
        MOVING_PIECE.set(event.target, event.clientX, event.clientY);
        return;    
    }

    // If the selected piece gets clicked again
    if (MOVING_PIECE.DOM_element == event.target) {
        MOVING_PIECE.is_mouse_down = true;
        return;
    }

    // Otherwise it's a new piece: reset the selected one and select the new one
    MOVING_PIECE.reset();
    MOVING_PIECE.set(event.target, event.clientX, event.clientY);
}

function chessboardMouseMoveEvent(event) {

    if (!MOVING_PIECE.isSet() || !MOVING_PIECE.is_mouse_down) {
        return;
    }

    let [x, y] = mouseToBoardCoords(event.clientX, event.clientY);

    // If mouse goes off the board then stop moving the piece
    if (x >= SQUARE_SIZE * 8 || x <= 0 || y >= SQUARE_SIZE * 8 || y <= 0) {
        return;
    }

    // Constantly center the moving piece in the mouse pointer
    MOVING_PIECE.DOM_element.style.left = `${x - SQUARE_SIZE/2}px`;
    MOVING_PIECE.DOM_element.style.top = `${y - SQUARE_SIZE/2}px`;

    let underlying_square = mouseToSquare(event.clientX, event.clientY);

    if (MOVING_PIECE.last_mouseover_square == undefined) {
        MOVING_PIECE.last_mouseover_square = underlying_square;
        document.querySelector(`.index-${underlying_square}`).classList.add('piece-over');
        return;
    }
    
    if (MOVING_PIECE.last_mouseover_square == underlying_square) {
        return;
    }
    
    // If underlying square changes
    document.querySelector(`.index-${MOVING_PIECE.last_mouseover_square}`).classList.remove('piece-over');
    document.querySelector(`.index-${underlying_square}`).classList.add('piece-over');
    MOVING_PIECE.last_mouseover_square = underlying_square;
}

async function pieceMouseUpEvent(event) {

    // Left click only
    if (event.button != 0) {
        return;
    }

    if (!MOVING_PIECE.isSet()) {
        return;
    }
    
    MOVING_PIECE.is_mouse_down = false;
    let mouse_end_square = mouseToSquare(event.clientX, event.clientY);

    if (await playUserMove(mouse_end_square)) {
        return;
    }

    // User moves to an illegal square
    let [start_row, start_column] = _120toRC(MOVING_PIECE.start_square);
    MOVING_PIECE.DOM_element.style.top =  `calc(var(--SQUARE-SIZE) * ${start_row})`;
    MOVING_PIECE.DOM_element.style.left =  `calc(var(--SQUARE-SIZE) * ${start_column})`;
    
    MOVING_PIECE.removeLastMouseOverSquare();
}

async function squareMouseDownEvent(event) {

    // Left click only
    if (event.button != 0) {
        return;
    }

    if (!MOVING_PIECE.isSet()) {
        return;
    }

    let square_classlist = event.target.classList.value;
    let mouse_end_square = parseInt(square_classlist.match(/\d+/)[0]);

    if (await playUserMove(mouse_end_square)) {
        return;
    }

    // User clicks on an illegal square
    MOVING_PIECE.reset();
}

function getPromiseFromEvent(item, event) {
    return new Promise(
        (resolve) => {
            const listener = (event) => {
                
                item.removeEventListener(event, listener);
                let r = _120toRC(mouseToSquare(event.clientX, event.clientY))[0];

                // Promise is resolved when the user clicks on the promotion piece
                resolve((r < 4) ? r : Math.abs(r - 7));
            };
            item.addEventListener(event, listener);
        }
    );
}

/**
 * Returns a promise object which is going to be fulfilled with 
 * either true or false, if the user selects an illegal square.
 * @param {Number} selected_square 
 * @returns {Promise}
 */
async function playUserMove(selected_square) {

    for (let [index, legal_move] of MOVING_PIECE.legal_moves.entries()) {
        
        let [
            ,
            end_square,
            start_piece,
            ,
            promotion_move
        ] = decodeMove(legal_move);

        if (end_square != selected_square) {
            continue;
        }

        if (promotion_move) {

            let promotion_column = _120toRC(end_square)[1];
            let color = isWhite(start_piece) ? 'white' : 'black';
            let DOM_popup = document.querySelector(`.${color}-promotion-popup`);
            
            DOM_popup.style.left = `calc(var(--SQUARE-SIZE) * ${promotion_column})`;

            DOM_popup.style.display = 'block';
            DOM_ANTI_CLICK_OVERLAY.style.display = 'block';
    
            let popup_selected_piece = await getPromiseFromEvent(DOM_popup, 'click');     
            
            DOM_ANTI_CLICK_OVERLAY.style.display = 'none';
            DOM_popup.style.display = 'none';

            legal_move = MOVING_PIECE.legal_moves[index + popup_selected_piece];
        }

        if (GAME.is_in_book_theory) {
            
            let legal_move_algebraic = moveToAlgebraicNotation(MOVING_PIECE.legal_moves, legal_move);
            
            if (GAME.isMoveInOpeningBook(legal_move_algebraic)) {
                GAME.book_move_history.push(legal_move_algebraic);
            }
            else {
                GAME.revokeBookAccess();
            }
        }

        GAME.playMove(legal_move);
        updateGUIChessboard(legal_move);
        MOVING_PIECE.reset();

        if (GAME.game_mode == GAME_MODE.PLAY_ENGINE) {
            // Starts the engine
            DOM_BUBBLES.style.visibility = 'visible';
            setTimeout(playEngine, 500);
        }
        else {
            // Only updates current FEN
            DOM_FEN_TEXTAREA.value = GAME.toString();
        }

        return true;
    }

    return false;
}
