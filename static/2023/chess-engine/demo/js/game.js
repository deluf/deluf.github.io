
'use strict';

/**
 * This file contains the game class, game constants and utilities.
 * Also initializes a global game object called GAME. 
 */



/**
 * ############################# GAME CONSTANTS #############################
 */

const VALIDATE_FEN = /^(([1-8PNBRQK]{1,8}\/){7}[1-8PNBRQK]{1,8})( [wb])( ([KQ]{1,4}|-))( ([a-h][1-8]|-))( ((([0-9])|([1-9][0-9]?))|(100)))( \d+)$/i;
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Pieces are engineered so that their binary code is the same for both black 
 * and white, except the fourth bit which is 1 for white and 0 for black:
 *   1:	0001
 *   2:	0010
 *   3:	0011
 *   4:	0100
 *   5:	0101
 *   6:	0110
 *   7:	0111
 *   8:	1000
 *
 *   9:	1001
 *  10:	1010
 *  11:	1011
 *  12:	1100
 *  13:	1101
 *  14:	1110
 */
const PIECES = {
    EMPTY : 0,                                                  
    'p' : 1, 'r' : 2, 'n' : 3, 'b' : 4, 'q' : 5, 'k' : 6,       
    'P' : 9, 'R' : 10, 'N' : 11, 'B' : 12, 'Q' : 13, 'K' : 14    
};

/**
 * Generic invalid square used for example to make 
 * pieces captured by en passant moves disappear 
 */
const DUMMY_SQUARE = 0;
const FIRST_GOOD_SQUARE = 21;
const LAST_GOOD_SQUARE = 98;

const PLAYERS = {
    BLACK: 0,
    WHITE: 1
};

const CASTLING_MOVES = {
    WHITE_KING_SIDE: 0x8,
    WHITE_QUEEN_SIDE: 0x4,
    BLACK_KING_SIDE: 0x2,
    BLACK_QUEEN_SIDE: 0x1,
    NONE: 0x0,
    ALL: 0xF
};

const REMOVE_CASTLING = {
    WHITE_ALL: 0x3,
    BLACK_ALL: 0xC,
    WHITE_KING_SIDE: 0x7,
    WHITE_QUEEN_SIDE: 0xB,
    BLACK_KING_SIDE: 0xD,
    BLACK_QUEEN_SIDE: 0xE
};

const DIRECTIONS = {
    UP: -10,
    DOWN: 10,
};

const STATUS = {
    ONGOING: 0,
    WHITE_WINS: 1,
    BLACK_WINS: 2,
    DRAW: 3
};

const GAME_MODE = {
    PLAY_ENGINE: 0,
    ANALYZE_POSITION: 1
};

/**
 * Half moves before the game is automatically declared a draw
 */
const HALF_MOVES_RULE = 100;



/**
 * ############################# GAME UTILITIES #############################
 */

function getOpponentPawnDirection(player) {
    if (player == PLAYERS.WHITE) {
        return DIRECTIONS.DOWN;
    }
    return DIRECTIONS.UP;
}

function isOffBoard(square) {
    return square < FIRST_GOOD_SQUARE || square > LAST_GOOD_SQUARE || square % 10 == 0 || square % 10 == 9;
}

function isWhite(piece) {
    return (piece & 0b1000) >> 3;
}

/**
 * Returns true if the piece passed as a parameter and the piece which
 * stands on square (if there is any) are of different colors.
 * Also returns false if the square is empty.
 * @param {PIECES} piece
 * @param {Number} square 
 * @returns {Boolean}
 */
function canCapture(piece, square) {
    if (GAME.chessboard[square] == PIECES.EMPTY) {
        return false;
    } 
    return isWhite(piece) != isWhite(GAME.chessboard[square]);
}

/**
 * @param {CASTLING_MOVES} castling_move 
 * @returns {Boolean} Whether the specified castling move is legal for the current game object.
 */
function canCastle(castling_move) {
    
    if (!(GAME.castling_rights & castling_move)) {
        return false;
    }

    if (castling_move == CASTLING_MOVES.WHITE_KING_SIDE) {
        return (
            GAME.chessboard[96] == PIECES.EMPTY &&
            GAME.chessboard[97] == PIECES.EMPTY &&
            !isAnyOfSquaresAttacked(PLAYERS.BLACK, [95, 96])
        );
    }
    
    if (castling_move == CASTLING_MOVES.BLACK_KING_SIDE) {
        return (
            GAME.chessboard[26] == PIECES.EMPTY &&
            GAME.chessboard[27] == PIECES.EMPTY &&
            !isAnyOfSquaresAttacked(PLAYERS.WHITE, [25, 26])
        );
    }
    
    if (castling_move == CASTLING_MOVES.WHITE_QUEEN_SIDE) {
        return (
            GAME.chessboard[92] == PIECES.EMPTY &&
            GAME.chessboard[93] == PIECES.EMPTY &&
            GAME.chessboard[94] == PIECES.EMPTY &&
            !isAnyOfSquaresAttacked(PLAYERS.BLACK, [94, 95])
        );
    }
    
    if (castling_move == CASTLING_MOVES.BLACK_QUEEN_SIDE) {
        return (
            GAME.chessboard[21] == PIECES.r &&
            GAME.chessboard[22] == PIECES.EMPTY &&
            GAME.chessboard[23] == PIECES.EMPTY &&
            GAME.chessboard[24] == PIECES.EMPTY &&
            !isAnyOfSquaresAttacked(PLAYERS.WHITE, [24, 25])
        );
    }

    return false;
}

function isNumber(char) {
    return char.match(/[0-9]/);
}

/**
 * Returns true if the square is in the specified row.
 * @param {Number} square
 * @param {Number} row 
 * @returns {Boolean}
 */
function isInRow(square, row) {
    return square >= RCto120(row, 0) && square <= RCto120(row, 7);
}

/**
 * Returns true if the specified square is a promotion square for the pawn.
 * @param {PIECES} pawn
 * @param {Number} square 
 * @returns {Boolean}
 */
function isPromotionSquare(pawn, square) {
    return isInRow(square, isWhite(pawn) ? 0 : 7);
}

/**
 * Given a row and a column (ex: 0 and 7) returns the corresponding square.
 * @param {Number} row
 * @param {Number} column
 * @returns {Number}
 */
function RCto120(row, column) {
    return FIRST_GOOD_SQUARE + row * 10 + column;
}

/**
 * Given a file and a rank (ex: 'a' and 8) returns the corresponding square.
 * @param {String} file
 * @param {Number} rank
 * @returns {Number}
 */
function FRto120(file, rank) {
    return RCto120(8 - rank, file.charCodeAt(0) - 'a'.charCodeAt(0));
}

/**
 * Given a square returns the corresponding row and column.
 * @param {Number} square
 * @returns {Number[]}
 */
function _120toRC(square) {
    return [Math.floor(square / 10) - 2, square % 10 - 1];
}

/**
 * Given a square returns the corresponding file and rank.
 * @param {Number} square
 * @returns {[Number, String]}
 */
function _120toFR(square) {
    let [row, column] = _120toRC(square);
    return [String.fromCharCode('a'.charCodeAt(0) + column), 8 - row];
}

/**
 * Given a square returns the corresponding square 
 * of the standard 64 squares chessboard.
 * @param {Number} square
 * @returns {Number}
 */
function _120to64(square) {
    return square - FIRST_GOOD_SQUARE - 2 * Math.floor((square - FIRST_GOOD_SQUARE) / 10);
}



/**
 * ############################# GAME OBJECT #############################
 */

class Game {

    constructor(FEN = STARTING_FEN) {
        this.parseFEN(FEN);
    }

};

/**
*  Initializes the GAME object with a chess position expressed in FEN notation.
* 
*  An example of a FEN string is:
*      rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
* 
*  A FEN string is always divided in 6 sections:
*      0: Position of the pieces
*      1: Which player moves
*      2: Castling rights
*      3: En passant
*      4: Half moves
*      5: Moves
* 
*/
Game.prototype.parseFEN = function(FEN) {

    if (!VALIDATE_FEN.test(FEN)) {
        window.alert('Invalid FEN: bad pattern');
        FEN = STARTING_FEN;
    }

    /**
        * Additional information used by the engine
        */
    if (FEN != STARTING_FEN) {
        this.is_in_book_theory = false;
    }
    else {
        this.is_in_book_theory = true;
    }
    this.book_move_history = [];
    this.status = STATUS.ONGOING;


    /**
        * The chessboard is internally represented using 120 squares instead of 64,
        * this makes move generation much easier: imagine a kinght on square
        * 91, it can reach squares [72, 83, 103, 112, 110, 99, 79, 70]:
        * just by looking at the numbers we already know which ones are
        * inside of the board and which are not.
        * 
        *  __ __ __ __ __ __ __ __ __ __
        * |                             | 0 .. 9
        * |   __ __ __ __ __ __ __ __   | 10 .. 19
        * |  |21 22 23 24 25 26 27 28|  |
        * |  |31 32 33 34 35 36 37 38|  |
        * |  |41 42 43 44 45 46 47 48|  |
        * |  |51 52 53 54 55 56 57 58|  |
        * |  |61 62 63 64 65 66 67 68|  |
        * |  |71 72 73 74 75 76 77 78|  |
        * |  |81 82 83 84 85 86 87 88|  |
        * |  |91 92 93 94 95 96 97 98|  |
        * |   A  B  C  D  E  F  G  H    | 100 .. 100
        * |__ __ __ __ __ __ __ __ __ __| 110 .. 119
        *  
        */
    this.chessboard = new Array(120);
    this.chessboard.fill(PIECES.EMPTY);


    /**
        * Used to keep track of the position of the kings
        * without having to loop the entire board.
        */
    this.white_king_square = DUMMY_SQUARE;
    this.black_king_square = DUMMY_SQUARE;


    FEN = FEN.split(' ');

    this.to_play = (FEN[1] == 'w') ? PLAYERS.WHITE : PLAYERS.BLACK;

    /**
        * The square behind the pawn that can be captured by an en-passant move.
        */
    this.en_passant = (FEN[3] == '-') ? DUMMY_SQUARE : FRto120(...FEN[3]);

    /**
        * Number of single moves (both white and black) since the last capture
        * or pawn push, it's used apply the 50 move rule (when this number reaches
        * 100 the game ends in a forced draw).
        */   
    this.half_moves = parseInt(FEN[4]);

    /**
        * Number of moves in a game, increments each time black moves.
        */   
    this.moves = parseInt(FEN[5]);

    // Parse of FEN[0]: Position of the pieces
    let row = 0;
    let column = 0;
    for (let char of FEN[0]) {

        if (char == '/') {
            column = 0;
            row++;
            continue;
        }

        if (column >= 8) {
            window.alert('Invalid FEN: too many spaces or pieces in a single row');
            // Basically calls the constructor again but with the default argument STARTING_FEN
            this.parseFEN(STARTING_FEN);
            return;
        }

        if (!isNumber(char)) {
            this.chessboard[RCto120(row, column)] = PIECES[char];

            if (char == 'k') {
                this.black_king_square = RCto120(row, column);
            }
            else if (char == 'K') {
                this.white_king_square = RCto120(row, column);
            }

            column++;
            continue;
        }

        for (;char > 0; char--) {
            column++;
        }
    }

    if (this.white_king_square == DUMMY_SQUARE || this.black_king_square == DUMMY_SQUARE) {
        window.alert('Invalid FEN: there are no kings');
        this.parseFEN(STARTING_FEN);
        return;
    }


    /**
        * Parse of FEN[2]: Castling rights (4 bit binary flag):
        * - 1st bit: White king's side castling right
        * - 2nd bit: White queen's side castling right
        * - 3rd bit: Black king's side castling right
        * - 4th bit: Black queen's side castling right
        */
    this.castling_rights = CASTLING_MOVES.NONE;
    let error_message = '';
    for (let char of FEN[2]) {   

        if (char == 'K') {
            if (this.chessboard[95] != PIECES.K || this.chessboard[98] != PIECES.R) {
                error_message = 'Invalid FEN: white king\'s side castling is incompatible with the position of the pieces';
            }
            this.castling_rights |= CASTLING_MOVES.WHITE_KING_SIDE;
        }

        else if (char == 'Q') {
            if (this.chessboard[95] != PIECES.K || this.chessboard[91] != PIECES.R) {
                error_message = 'Invalid FEN: white queen\'s side castling is incompatible with the position of the pieces';
            }
            this.castling_rights |= CASTLING_MOVES.WHITE_QUEEN_SIDE;
        }

        else if (char == 'k') {
            if (this.chessboard[25] != PIECES.k || this.chessboard[28] != PIECES.r) {
                error_message = 'Invalid FEN: black king\'s side castling is incompatible with the position of the pieces';
            }
            this.castling_rights |= CASTLING_MOVES.BLACK_KING_SIDE;
        }

        else if (char == 'q') {
            if (this.chessboard[25] != PIECES.k || this.chessboard[21] != PIECES.r) {
                error_message = 'Invalid FEN: black queen\'s side castling is incompatible with the position of the pieces';
            }
            this.castling_rights |= CASTLING_MOVES.BLACK_QUEEN_SIDE;
        }

    }
    if (error_message != '') {
        window.alert(error_message);
        this.parseFEN(STARTING_FEN);
    }

}

/**
 * Returns the FEN string of the current GAME object
 */
Game.prototype.toString = function() {
    let FEN = '';
    let space_counter = 0;

    for (let square = FIRST_GOOD_SQUARE; square <= LAST_GOOD_SQUARE; square++) {

        if (isOffBoard(square)) {

            if (isOffBoard(square + 1)) {
                if (space_counter != 0) {
                    FEN += space_counter;
                    space_counter = 0;
                }                
                FEN += '/';
            }

            continue;
        }

        let piece = this.chessboard[square];

        if (piece == PIECES.EMPTY) {
            space_counter++;
        }
        else {
            if (space_counter != 0) {
                FEN += space_counter;
                space_counter = 0;
            }
            FEN += getKeyByValue(PIECES, piece);
        }

        if (square == LAST_GOOD_SQUARE) {
            if (space_counter != 0) {
                FEN += space_counter;
            }
        }
    }

    FEN += (this.to_play == PLAYERS.WHITE) ? ' w' : ' b';

    if (this.castling_rights == CASTLING_MOVES.NONE) {
        FEN += ' -';
    }
    else if (this.castling_rights == CASTLING_MOVES.ALL) {
        FEN += ' KQkq';
    }
    else {
        FEN += ' ';
        if (this.castling_rights & CASTLING_MOVES.WHITE_KING_SIDE) {
            FEN += 'K';
        }
        if (this.castling_rights & CASTLING_MOVES.WHITE_QUEEN_SIDE) {
            FEN += 'Q';
        }
        if (this.castling_rights & CASTLING_MOVES.BLACK_KING_SIDE) {
            FEN += 'k';
        }
        if (this.castling_rights & CASTLING_MOVES.BLACK_QUEEN_SIDE) {
            FEN += 'q';
        }
    }
    
    if (this.en_passant != DUMMY_SQUARE) {
        let en_passant = _120toFR(this.en_passant);
        FEN += ' ' + en_passant[0] + en_passant[1];
    }
    else {
        FEN += ' -';
    }

    FEN += ' ' + this.half_moves;
    FEN += ' ' + this.moves;

    return FEN;
}



/**
 * ############################# MAIN #############################
 */

let GAME = new Game();
