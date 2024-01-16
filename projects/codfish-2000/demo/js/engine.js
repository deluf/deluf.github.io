
'use strict';

/**
 * This file contains the implementation of the game engine.
 */



/**
 * ############################# ENGINE GLOBAL VARIABLES #############################
 */

let OPENING_BOOK_ID = 'default';
let OPENING_BOOK;
let ENGINE_MAX_TIME = 1.5;
let ENGINE_MAX_DEPTH = 99;



/**
 * ############################# ENGINE CONSTANTS #############################
 */

const PIECE_VALUES = {
    1 : 1, 2 : 5,  3 : 3,  4 : 3.2,  5 : 9,  6: 4,
    9 : 1, 10 : 5, 11 : 3, 12 : 3.2, 13 : 9, 14: 4
};

/**
 * Used in end games to force the enemy king in tight spaces.
 */
const CORNER_MALUS = [
    2.5, 2.0, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5,
    2.0, 1.5, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0,
    1.5, 1.0, 0.5, 0.5, 0.5, 0.5, 1.0, 1.5,
    1.5, 1.0, 0.5, 0.0, 0.0, 0.5, 1.0, 1.5,
    1.5, 1.0, 0.5, 0.0, 0.0, 0.5, 1.0, 1.5,
    1.5, 1.0, 0.5, 0.5, 0.5, 0.5, 1.0, 1.5,
    2.0, 1.5, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0,
    2.5, 2.0, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5
];

const EARLY_GAME_SCORES = {
    // White pawn
    9: [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0,
        1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.2, 1.2,
        0.8, 0.8, 1.0, 1.3, 1.3, 1.0, 0.8, 0.8,
        0.8, 0.8, 1.0, 1.2, 1.2, 1.0, 0.8, 0.8,
        1.0, 0.9, 0.9, 1.0, 1.0, 0.9, 0.9, 1.0,
        0.9, 1.0, 1.0, 0.7, 0.7, 1.0, 1.0, 0.9,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ],
    // Black pawn
    1: [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.9, 1.0, 1.0, 0.7, 0.7, 1.0, 1.0, 0.9,
        1.0, 0.9, 0.9, 1.0, 1.0, 0.9, 0.9, 1.0,
        0.8, 0.8, 1.0, 1.2, 1.2, 1.0, 0.8, 0.8,
        0.8, 0.8, 1.0, 1.3, 1.3, 1.0, 0.8, 0.8,
        1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.2, 1.2,
        2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ],

    // White rook
    10: [
        5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3,
        5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.9, 4.7, 5.0, 5.1, 5.1, 5.0, 4.7, 4.9
    ],
    // Black rook
    2: [
        4.9, 4.7, 5.0, 5.1, 5.1, 5.0, 4.7, 4.9,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        4.7, 4.8, 4.8, 4.9, 4.9, 4.8, 4.8, 4.7,
        5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3,
        5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3, 5.3
    ],

    // White knight
    11: [ 
        2.5, 2.7, 2.8, 2.8, 2.8, 2.8, 2.7, 2.5,
        2.7, 2.9, 2.9, 2.9, 2.9, 2.9, 2.9, 2.7,
        2.8, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.8,
        2.8, 3.0, 3.0, 3.1, 3.1, 3.0, 3.0, 2.8,
        2.8, 3.0, 3.0, 3.1, 3.1, 3.0, 3.0, 2.8,
        2.8, 3.0, 3.1, 3.0, 3.0, 3.1, 3.0, 2.8,
        2.8, 2.9, 2.9, 3.0, 3.0, 2.9, 2.9, 2.8,
        2.5, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.5
    ],
    // Black knight
    3: [ 
        2.5, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.5,
        2.8, 2.9, 2.9, 3.0, 3.0, 2.9, 2.9, 2.8,
        2.8, 3.0, 3.1, 3.0, 3.0, 3.1, 3.0, 2.8,
        2.8, 3.0, 3.0, 3.1, 3.1, 3.0, 3.0, 2.8,
        2.8, 3.0, 3.0, 3.1, 3.1, 3.0, 3.0, 2.8,
        2.8, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.8,
        2.7, 2.9, 2.9, 2.9, 2.9, 2.9, 2.9, 2.7,
        2.5, 2.7, 2.8, 2.8, 2.8, 2.8, 2.7, 2.5
    ],

    // White bishop
    12: [
        2.5, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.5,
        2.7, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.7,
        2.7, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.7,
        2.7, 3.0, 2.9, 2.9, 2.9, 2.9, 3.0, 2.7,
        2.9, 3.0, 3.1, 3.0, 3.0, 3.1, 3.0, 2.9,
        2.8, 2.9, 3.0, 2.9, 2.9, 3.0, 2.9, 2.8,
        2.8, 3.1, 2.9, 2.9, 2.9, 2.9, 3.1, 2.8,
        2.6, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.6
    ],
    // Black bishop
    4: [
        2.6, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.6,
        2.8, 3.1, 2.9, 2.9, 2.9, 2.9, 3.1, 2.8,
        2.8, 2.9, 3.0, 2.9, 2.9, 3.0, 2.9, 2.8,
        2.9, 3.0, 3.1, 3.0, 3.0, 3.1, 3.0, 2.9,
        2.7, 3.0, 2.9, 2.9, 2.9, 2.9, 3.0, 2.7,
        2.7, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.7,
        2.7, 2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 2.7,
        2.5, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.5
    ],

    // White queen
    13: [
        8.5, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.5,
        8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8,
        8.8, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9, 8.8,
        8.8, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9, 8.8,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.5, 8.8, 8.8, 9.0, 8.8, 8.8, 8.8, 8.5
    ],
    // Black queen
    5:[
        8.5, 8.8, 8.8, 9.0, 8.8, 8.8, 8.8, 8.5,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.8, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.8,
        8.8, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9, 8.8,
        8.8, 8.9, 8.9, 8.9, 8.9, 8.9, 8.9, 8.8,
        8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8,
        8.5, 8.8, 8.8, 8.8, 8.8, 8.8, 8.8, 8.5
    ],

    // White king
    14: [
        3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4,
        3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
        3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6,
        3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7,
        3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8,
        3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9,
        4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0,
        4.1, 4.2, 4.1, 4.0, 4.0, 4.1, 4.3, 4.1
    ],
    // Black king
    6: [
        4.1, 4.2, 4.1, 4.0, 4.0, 4.1, 4.3, 4.1,
        4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0,
        3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9, 3.9,
        3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8, 3.8,
        3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7, 3.7,
        3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6,
        3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
        3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.4, 3.8
    ]
};

const FORCED_DRAW_EVALUATION = 1e-10;
const OPENING_MATERIAL_THRESHOLD = 70;
const ENDGAME_MATERIAL_THRESHOLD = 45;
const KING_STEP_WEIGHT = 0.1;



/**
 * ############################# ENGINE UTILITIES #############################
 */

/**
 * Returns the get request promise of the opening book.
 * @returns {Promise}
 */
async function fetchOpeningBook() {
    return fetch('opening_books/' + OPENING_BOOK_ID + '.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Unable to fetch opening book: Error ' + response.status);
        }
        else {
            return response.json();
        }
    })
    .then(json => {
        OPENING_BOOK = json;
    })
    .catch((error) => {
        GAME.revokeBookAccess();
        window.alert(error.message);
    });
}


/**
 * Min and max are included.
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * Returns the minimum number of steps a king 
 * must do to move from square a to square b.
 * @param {Number} square_a 
 * @param {Number} square_b 
 * @returns {Number}
 */
function stepsBetweenSquares(square_a, square_b) {
    let [square_a_row, square_a_column] = _120toRC(square_a);
    let [square_b_row, square_b_column] = _120toRC(square_b);

    return  Math.max(
        Math.abs(square_a_row - square_b_row),
        Math.abs(square_a_column - square_b_column)
    );
}


/**
 * If the result is negative, move a is likely to be a
 * better move than b and so is sorted before it.
 * @param {Number[]} move_a 
 * @param {Number[]} move_b 
 * @returns {Number}
 */
function shallowMoveOrdering(move_a, move_b) {
    GAME.playMove(move_a);
    let evaluation_a = staticEvaluation();
    GAME.undoMove(move_a);
    GAME.playMove(move_b);
    let evaluation_b = staticEvaluation();
    GAME.undoMove(move_b);
    if (GAME.to_play == PLAYERS.WHITE) {
        return evaluation_b - evaluation_a;
    }
    return evaluation_a - evaluation_b;
}



/**
 * ############################# ENGINE #############################
 */

/**
 * This function estimates which player is winning and 
 * by how much just by looking at the current board, if 
 * the returned value is positive then white player 
 * has the advantage.
 * @returns {Number}
 */
function staticEvaluation() {

    let white_material = 0;
    let white_pieces_positioning = 0;
    let black_material = 0;
    let black_pieces_positioning = 0;
    let black_pawn_pressure = 0;
    let number_of_black_pawns = 0;
    let white_pawn_pressure = 0;
    let number_of_white_pawns = 0;
    let piece;

    for (let square = FIRST_GOOD_SQUARE; square <= LAST_GOOD_SQUARE; square++) {

        piece = GAME.chessboard[square];

        if (piece== PIECES.EMPTY) {
            continue;
        }

        if (isWhite(piece)) {
            white_material += PIECE_VALUES[piece];
            white_pieces_positioning += EARLY_GAME_SCORES[piece][_120to64(square)];
            if (piece == PIECES.P) {
                number_of_white_pawns++;
                white_pawn_pressure += (7 - _120toRC(square)[0]);
            }
        }
        else {
            black_material += PIECE_VALUES[piece];
            black_pieces_positioning += EARLY_GAME_SCORES[piece][_120to64(square)];
            if (piece == PIECES.p) {
                number_of_black_pawns++;
                black_pawn_pressure += _120toRC(square)[0];
            }
        }
    }

    if (number_of_white_pawns != 0) {
        white_pawn_pressure = white_pawn_pressure * 0.2 / number_of_white_pawns;
    }
    if (black_pawn_pressure != 0) {
        black_pawn_pressure = black_pawn_pressure * 0.2 / number_of_black_pawns;
    }

    /**
     * Opening and early middle game evaluation:
     * encourages players to develop pieces and to castle kings to safety
     */
    if (black_material + white_material >= OPENING_MATERIAL_THRESHOLD) {
        let opening_malus_white = 0;
        let opening_malus_black = 0;

        opening_malus_white -= (GAME.chessboard[92] == PIECES.N) * 0.25;
        opening_malus_white -= (GAME.chessboard[97] == PIECES.N) * 0.25;
        opening_malus_white -= (GAME.chessboard[96] == PIECES.B) * 0.25;
        opening_malus_white -= (GAME.chessboard[93] == PIECES.B) * 0.25;
        opening_malus_white -= (GAME.chessboard[94] != PIECES.Q) * 0.5;
        opening_malus_white -= (
            GAME.chessboard[93] != PIECES.K &&
            GAME.chessboard[97] != PIECES.K
        ) * 0.5;

        opening_malus_black += (GAME.chessboard[22] == PIECES.n) * 0.25;
        opening_malus_black += (GAME.chessboard[27] == PIECES.n) * 0.25;
        opening_malus_black += (GAME.chessboard[26] == PIECES.b) * 0.25;
        opening_malus_black += (GAME.chessboard[23] == PIECES.b) * 0.25;
        opening_malus_black += (GAME.chessboard[24] != PIECES.q) * 0.25;
        opening_malus_black += (
            GAME.chessboard[23] != PIECES.k &&
            GAME.chessboard[27] != PIECES.k
        ) * 0.5;

        return white_pieces_positioning - black_pieces_positioning + opening_malus_white + opening_malus_black;
    }
    
    /**
     * Endgame evaluation:
     * encourages players to isolate the enemy king and to push pawns
     */
    if (black_material + white_material <= ENDGAME_MATERIAL_THRESHOLD) {

        let enemy_king_near_corners = 0;
        let distance_between_kings = 0;

        if (GAME.to_play) {
            enemy_king_near_corners = CORNER_MALUS[_120to64(GAME.black_king_square)];
            distance_between_kings = - stepsBetweenSquares(
                GAME.white_king_square,
                GAME.black_king_square
            ) * KING_STEP_WEIGHT;
        }
        else {
            enemy_king_near_corners = - CORNER_MALUS[_120to64(GAME.white_king_square)];
            distance_between_kings = stepsBetweenSquares(
                GAME.white_king_square,
                GAME.black_king_square
            ) * KING_STEP_WEIGHT;
        }

        return enemy_king_near_corners + distance_between_kings + white_material - black_material + white_pawn_pressure - black_pawn_pressure;
    }

    /**
     * Middle game evaluation:
     * encourages players to keep the material advantage
     * and to push pawns
     */
    return white_material - black_material + white_pawn_pressure - black_pawn_pressure;
}


/**
 * Minimax algorithm whith alpha beta pruning optimization.
 */
function miniMax(depth, alpha, beta) {

    if (depth == 0) {
        return [staticEvaluation()];
    }

    let legal_moves = findLegalMoves(GAME.to_play);
    
    if (legal_moves.length == 0) {

        if (GAME.half_moves >= HALF_MOVES_RULE) {
            return [FORCED_DRAW_EVALUATION];
        }

        if (GAME.to_play == PLAYERS.WHITE) {
            if (isSquareAttacked(PLAYERS.BLACK, GAME.white_king_square)) {
                return [-Infinity];
            }
        } 

        else if (isSquareAttacked(PLAYERS.WHITE, GAME.black_king_square)) {
            return [Infinity];
        }

        return [FORCED_DRAW_EVALUATION];
    }

    //legal_moves.sort(shallowMoveOrdering);

    // Max player
    if (GAME.to_play) {
        let best_evaluation = - Infinity;
        let best_move = legal_moves[0];
       
        for (let move of legal_moves) {
            GAME.playMove(move);
            let evaluation = miniMax(depth - 1, alpha, beta)[0];
            GAME.undoMove(move);

            if (evaluation > best_evaluation) {
                best_evaluation = evaluation;
                best_move = move;
            }

            if (evaluation > alpha) {
                alpha = evaluation;
            } 

            if (beta <= alpha) {
                break;
            }
        }

        return [
            best_evaluation,
            best_move,
            moveToAlgebraicNotation(legal_moves, best_move)
        ];
    }

    // Min player
    else {
        let best_evaluation = Infinity;
        let best_move = legal_moves[0];
       
        for (let move of legal_moves) {
            GAME.playMove(move);
            let evaluation = miniMax(depth - 1, alpha, beta)[0];
            GAME.undoMove(move);
            
            if (evaluation < best_evaluation) {
                best_evaluation = evaluation;
                best_move = move;
            }

            if (evaluation < beta) {
                beta = evaluation;
            } 

            if (beta <= alpha) {
                break;
            }
        }
        
        return [
            best_evaluation,
            best_move,
            moveToAlgebraicNotation(legal_moves, best_move)
        ];
    }
}



/**
 * ############################# GAME OBJECT EXTENSION #############################
 */

/**
 * Revokes the access to the opening book and updates
 * the GUI according to the current game mdoe.
 */
Game.prototype.revokeBookAccess = function() {
    this.is_in_book_theory = false;
    
    if (this.game_mode == GAME_MODE.ANALYZE_POSITION) {
        DOM_OPENING_BOOK_CHECKBOX.checked = false;
        DOM_OPENING_BOOK_CHECKBOX.disabled = true;
    }
}

/**
 * Assuming that the specified move is a valid book move for the current GAME object,
 * this function plays it on the board and/or updates the GUI according to the current game mode.
 * @param {String} move_algebraic 
 * @param {Number[]} move 
 * @returns {Boolean}
 */
Game.prototype.playBookMove = function(move_algebraic, move) {

    if (this.game_mode == GAME_MODE.PLAY_ENGINE) {
        updateGameAndGUI(0, move);
        this.book_move_history.push(move_algebraic);
    }
    else {
        ENGINE_BEST_MOVE = move;
        ENGINE_BEST_MOVE_ALGEBRAIC = move_algebraic;
        updateGUI('Book', '0');
    }
}

/**
 * @param {Number[]} move 
 * @returns {Boolean} 
 */
Game.prototype.isMoveInOpeningBook = function(move) {

    if (OPENING_BOOK == undefined) {
        return false;
    }

    let json_pointer = OPENING_BOOK;
    GAME.book_move_history.forEach(
        move => json_pointer = json_pointer[move]
    );

    return move in json_pointer;
}

/**
 * Returns true if the engine has selected a move from the opening book, false otherwise.
 * @returns {Boolean}
 */
Game.prototype.searchOpeningBook = function() {

    if (this.is_in_book_theory == false || OPENING_BOOK == undefined) {
        return false;
    }

    let legal_moves = findLegalMoves(this.to_play);
    let json_pointer = OPENING_BOOK;

    for (let book_move of this.book_move_history ) {
        json_pointer = json_pointer[book_move];
    }

    let found_moves = Object.keys(json_pointer);
    let number_of_found_moves = found_moves.length - 1; // Excludes #

    if (number_of_found_moves > 0) {
        let popularity = [];

        for (let i = 1; i <= number_of_found_moves; i++) {
            popularity.push([found_moves[i], json_pointer[found_moves[i]]['#']]);
        }
        popularity.sort((a, b) => b[1] - a[1]);

        let random_index = randomIntFromInterval(0, Math.min(number_of_found_moves - 1, 2));
        let selected_book_move = popularity[random_index][0];

        for (let move of legal_moves) {

            if (selected_book_move == moveToAlgebraicNotation(legal_moves, move)){
                
                this.playBookMove(selected_book_move, move);
                return true;
            }
        }
    }

    this.revokeBookAccess();
    return false;
}
