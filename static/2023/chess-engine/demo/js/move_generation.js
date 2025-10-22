
'use strict';

/**
 * This file contains one of the most critical aspects of the game: generating legal moves.
 */



/**
 * ############################# MOVE GENERATION #############################
 */

/**
 * Retuns the directions in which the specified piece can move.
 * Pawns are the only pieces which can move forward but capture 
 * sideways, in this case the first direction returned is the 
 * moving direction while the others are capture directions.
 * 
 * @param {PIECES} piece 
 * @returns {Number[]} Moving and capturing directions
 */
function getDirections(piece) {
    switch (piece) {

        case PIECES.p:
            return [10, 9, 11];
        case PIECES.P: 
            return [-10, -9, -11];

        case PIECES.r:
        case PIECES.R: 
            return [-10, -1, 1, 10];

        case PIECES.n:
        case PIECES.N:
            return [-21, -19, -12, -8, 8, 12, 19, 21];

        case PIECES.b:
        case PIECES.B:
            return [-11, -9, 9, 11];

        case PIECES.q:
        case PIECES.Q:
        case PIECES.k:
        case PIECES.K:
            return [-11, -10, -9, -1, 1, 9, 10, 11];

        default:
            return [];
    }
}


/**
 * @param {PIECES} pawn A pawn
 * @param {Number} square The square on which the pawn stands
 * @returns {Number[][]} Pseudo legal moves of the specified pawn
 */
function findPawnMoves(pawn, square) {

    let moves = [];
    let [moving_direction, ...capture_directions] = getDirections(pawn);
    let end_square;

    // Check if the pawn can capture something
    for (let capture_direction of capture_directions) {

        end_square = square + capture_direction;

        if (isOffBoard(end_square)) {
            continue;
        }

        if (canCapture(pawn, end_square)) {

            // Capture which ends on a promotion square
            if (isPromotionSquare(pawn, end_square)) {
                moves.push(...encodeMove(square, end_square, true, true));
            }
            else {
                moves.push(encodeMove(square, end_square, true));
            }
            continue;
        }

        // En passant capture 
        if (end_square == GAME.en_passant) {
            moves.push(encodeMove(square, end_square, true, false, false, true));
        }
    }

    // Check the square in front of the pawn
    let first_move = isInRow(square, isWhite(pawn) ? 6 : 1);
    end_square = square + moving_direction;
    
    if (GAME.chessboard[end_square] == PIECES.EMPTY) {

        // Move which ends on a promotion square
        if (isPromotionSquare(pawn, end_square)) {
            moves.push(...encodeMove(square, end_square, true, true));
        }

        else {
            // Normal push
            moves.push(encodeMove(square, end_square, true));
            if (first_move && GAME.chessboard[end_square + moving_direction] == PIECES.EMPTY) {
                // Double push
                moves.push(encodeMove(square, end_square + moving_direction, true, false, true));
            }
        }

    }
    
    return moves;
}


/**
 * @param {PIECES} sliding_piece A rook, bishop or queen
 * @param {Number} square The square on which the piece stands
 * @returns {Number[][]} Pseudo legal moves of the specified piece
 */
function findSlidingPieceMoves(sliding_piece, square) {
    
    let moves = [];
    let end_square;
    let directions = getDirections(sliding_piece);
            
    for (let direction of directions) {
        for (let i = 1; i <= 7; i++) {

            end_square = square + direction * i;

            if (isOffBoard(end_square)) {
                break;
            }

            if (canCapture(sliding_piece, end_square)) {
                moves.push(encodeMove(square, end_square, true));
                break;
            }

            if (GAME.chessboard[end_square] != PIECES.EMPTY) {
                break;   
            }

            moves.push(encodeMove(square, end_square));
        }
    }

    return moves;
}


/**
 * @param {PIECES} kinght A knight
 * @param {Number} square The square on which the knight stands
 * @returns {Number[][]} Pseudo legal moves of the specified knight
 */
function findKnightMoves(knight, square) {
    
    let moves = [];
    let end_square;
    let directions = getDirections(knight);

    for (let direction of directions) {

        end_square = square + direction;

        if (isOffBoard(end_square)) {
            continue;
        }

        if (canCapture(knight, end_square)) {
            moves.push(encodeMove(square, end_square, true));
        }
        else if (GAME.chessboard[end_square] == PIECES.EMPTY) {
            moves.push(encodeMove(square, end_square));
        }
    }

    return moves;
}


/**
 * @param {PIECES} king A king
 * @param {Number} square The square on which the king stands
 * @returns {Number[][]} Pseudo legal moves of the specified king
 */
function findKingMoves(king, square) {

    let moves = [];
    let end_square;
    let directions = getDirections(king);

    for (let direction of directions) {

        end_square = square + direction;

        if (isOffBoard(end_square)) {
            continue;
        }
        
        if (canCapture(king, end_square) ) {
            moves.push(encodeMove(square, end_square, true));
        }

        if (GAME.chessboard[end_square] == PIECES.EMPTY) {
            moves.push(encodeMove(square, end_square));
        }
    }

    if (king == PIECES.K) {
        if (canCastle(CASTLING_MOVES.WHITE_KING_SIDE)) {
            moves.push(encodeMove(square, 97, false, false, false, false, CASTLING_MOVES.WHITE_KING_SIDE));
        }
        if (canCastle(CASTLING_MOVES.WHITE_QUEEN_SIDE)) {
            moves.push(encodeMove(square, 93, false, false, false, false, CASTLING_MOVES.WHITE_QUEEN_SIDE));
        }
    }
    else {
        if (canCastle(CASTLING_MOVES.BLACK_KING_SIDE)) {
            moves.push(encodeMove(square, 27, false, false, false, false, CASTLING_MOVES.BLACK_KING_SIDE));
        }
        if (canCastle(CASTLING_MOVES.BLACK_QUEEN_SIDE)) {
            moves.push(encodeMove(square, 23, false, false, false, false, CASTLING_MOVES.BLACK_QUEEN_SIDE));
        }
    }

    return moves;
}


/**
 * Returns all the pseudo legal moves of the the piece which stands on the specified
 * square (pseudo legal means wihtout considering checks on the king)
 * @param {Number} square 
 * @returns {Number[][]}
 */
function findPseudoLegalMoves(square) {
    let piece = GAME.chessboard[square];
    switch (piece) {
        case PIECES.p:
        case PIECES.P: 
            return findPawnMoves(piece, square);
        case PIECES.r:
        case PIECES.R: 
        case PIECES.b:
        case PIECES.B: 
        case PIECES.q:
        case PIECES.Q:
            return findSlidingPieceMoves(piece, square);
        case PIECES.n:
        case PIECES.N: 
            return findKnightMoves(piece, square);
        case PIECES.k:
        case PIECES.K:
            return findKingMoves(piece, square);
        default:
            return [];
    }
}


/**
 * @param {PLAYERS} attacker 
 * @param {Number[]} squares
 * @returns {Boolean}
 */
function isAnyOfSquaresAttacked(attacker, squares) {
    if (squares.some(square => isSquareAttacked(attacker, square))) {
        return true;
    }
    return false;
}


/**
 * Returns true if the square is attacked by the specified player.
 * Directions are hard-coded instead of retrieved with the getDirections
 * function because this function in particular has to be as fast as possible.
 * @param {PLAYERS} attacker 
 * @param {Number} square
 * @returns {Boolean}
 */
function isSquareAttacked(attacker, square) {

    // Pawn
    if (attacker == PLAYERS.WHITE) {
        if (GAME.chessboard[square + 11] == PIECES.P || GAME.chessboard[square + 9] == PIECES.P) {
            return true;
        }
    }
    else if (GAME.chessboard[square - 11] == PIECES.p || GAME.chessboard[square - 9] == PIECES.p) {
        return true;
    }

    // Knight
    let attacker_knight = PIECES.n + 8 * attacker;
    for (let knight_move of [-21, -19, -12, -8, 8, 12, 19, 21]) {
        if (GAME.chessboard[square + knight_move] == attacker_knight) {
            return true;
        }
    }

    // King
    let attacker_king = PIECES.k + 8 * attacker;
    for (let direction of [-11, -9, 9, 11, -1, -10, 10, 1]) {
        if (GAME.chessboard[square + direction] == attacker_king) {
            return true;
        }
    }

    // Diagonals
    let current_square, current_piece;
    let attacker_bishop = PIECES.b + 8 * attacker;
    let attacker_queen = PIECES.q + 8 * attacker;

    for (let diagonal_direction of [-11, -9, 9, 11]) {

        current_square = square + diagonal_direction;
        for (let i = 1; i <= 7; i++, current_square += diagonal_direction) {

            if (isOffBoard(current_square)) {
                break;
            }

            current_piece = GAME.chessboard[current_square];

            if (current_piece == PIECES.EMPTY) {
                continue;
            }
            
            if (current_piece == attacker_bishop || current_piece == attacker_queen) {
                return true;
            }
            else {
                break;
            }
        }
    }

    // Straights
    let attacker_rook = PIECES.r + 8 * attacker;
    for (let straight_direction of [-1, -10, 10, 1]) {
        current_square = square + straight_direction;
        for (let i = 1; i <= 7; i++, current_square += straight_direction) {

            if (isOffBoard(current_square)) {
                break;
            }

            current_piece = GAME.chessboard[current_square];

            if (current_piece == PIECES.EMPTY) {
                continue;
            }

            if (current_piece == attacker_rook || current_piece == attacker_queen) {
                return true;
            }
            else {
                break;
            }
        }
    }

    return false;
}


/**
 * Retuns all the legal moves for the piece which occupies the specified square,
 * whithout considering forced draws by material.
 * @param {Number} square
 * @returns {Number[][]}
 */
function findLegalMovesBySquare(square) {

    if (GAME.chessboard[square] == PIECES.EMPTY) {
        return [];
    }

    // Draw by half moves rule
    if (GAME.half_moves >= HALF_MOVES_RULE) {
        return [];
    }

    let legal_moves = [];
    let player = isWhite(GAME.chessboard[square]);
    let attacker = (player == PLAYERS.WHITE) ? PLAYERS.BLACK : PLAYERS.WHITE;
    let pseudo_legal_moves = findPseudoLegalMoves(square);

    for (let pseudo_legal_move of pseudo_legal_moves) {

        GAME.playMove(pseudo_legal_move);

        if (!isSquareAttacked(
            attacker,
            (player == PLAYERS.WHITE) ? GAME.white_king_square : GAME.black_king_square
        )) {
            legal_moves.push(pseudo_legal_move);
        }

        GAME.undoMove(pseudo_legal_move);

    }

    return legal_moves;
}


/**
 * Retuns all the legal moves for the specified player.
 * @param {PLAYERS} player
 * @returns {Number[][]}
 */
function findLegalMoves(player) {

    // Draw by half moves rule
    if (GAME.half_moves >= HALF_MOVES_RULE) {
        return [];
    }

    let white_material = 0;
    let black_material = 0;
    let white_pawns = 0;
    let black_pawns = 0;
    let legal_moves = [];

    for (let square = FIRST_GOOD_SQUARE; square <= LAST_GOOD_SQUARE; square++) {

        if (isOffBoard(square)) {
            continue;
        }

        let piece = GAME.chessboard[square];

        if (piece == PIECES.EMPTY) {
            continue;
        }

        if (isWhite(piece)) {
            white_material += PIECE_VALUES[piece];
            if (piece == PIECES.P) {
                white_pawns++;
            }
        }
        else {
            black_material += PIECE_VALUES[piece];
            if (piece == PIECES.p) {
                black_pawns++;
            }
        }

        if (isWhite(piece) == player) {
            legal_moves.push(...findLegalMovesBySquare(square));
        }
    }

    // Draw by insufficient material
    if (
        (white_pawns == 0 && black_pawns == 0) && 
        (
            (white_material == 4 || white_material == 7) &&
            (black_material == 4 || black_material == 7)
        )
    ) {
        return [];
    }

    return legal_moves;
}



/**
 * ############################# MOVE ENCODING #############################
 */

/**
 * Each move is an array containing two numbers, which are binary encoded in the following format:
 * (javascript's bitwise operations are limited to 32 bits and using them 
 *  was faster than using storing all the informations below in an array)
 * 
 *  First number: the actual move
 * +---------------+----+---------------------+-----+-------------+-------------+------------------+--------------------+----------------------+-----------------+
 * | 1 2 3 4 5 6 7 | 8  | 9 10 11 12 13 14 15 | 16  | 17 18 19 20 | 21 22 23 24 |        25        |         26         |          27          |   28 29 30 31   |
 * +---------------+----+---------------------+-----+-------------+-------------+------------------+--------------------+----------------------+-----------------+
 * | Start square  | *  | End square          | *   | Start piece | End piece   | Promotion Move ? | Double pawn push ? | En passant capture ? | Castling move ? |
 * +---------------+----+---------------------+-----+-------------+-------------+------------------+--------------------+----------------------+-----------------+
 * 
 *  Second number: a carry used to later undo the move and easily go back to the old state of the game
 * +-------------------+----+---------------------+----+-----------------+
 * |   1 2 3 4 5 6 7   | 8  | 9 10 11 12 13 14 15 | 16 |   17 18 19 20   |
 * +-------------------+----+---------------------+----+-----------------+
 * | En passant square | *  | Half moves          | *  | Castling rights |
 * +-------------------+----+---------------------+----+-----------------+
 *
 */

const MOVE_INDEXES = {
    MOVE: 0,
    CARRY: 1
};

/**
 * 
 * @param {Number} start_square 
 * @param {Number} end_square 
 * @param {Boolean} reset_half_moves 
 * @param {Boolean} promotion_move 
 * @param {Boolean} double_pawn_push 
 * @param {Boolean} en_passant_capture 
 * @param {CASTLING_MOVES} castling_move 
 * @returns {Number[]}
 */
function encodeMove(
    start_square,
    end_square,
    reset_half_moves = false,
    promotion_move = false,
    double_pawn_push = false,
    en_passant_capture = false,
    castling_move = CASTLING_MOVES.NONE
) {

    let encoded_move = start_square;
    encoded_move |= (end_square << 8);
    encoded_move |= (GAME.chessboard[start_square] << 16);
    encoded_move |= (GAME.chessboard[end_square] << 20);
    encoded_move |= (promotion_move << 24);
    encoded_move |= (double_pawn_push << 25);
    encoded_move |= (en_passant_capture << 26);
    encoded_move |= (castling_move << 27);

    let carry = GAME.en_passant;
    if (reset_half_moves) {
        carry |= (GAME.half_moves << 8);
    }
    carry |= (GAME.castling_rights << 16);

    if (promotion_move) {

        // Is the piece promoting white ?
        let offset = (end_square <= 28) ? 8 : 0;
        
        // Remove the start piece and replace it whith promotion pieces
        encoded_move = encoded_move & 0xFFF0FFFF;
        
        return [
            [encoded_move | ((PIECES.q + offset) << 16), carry],
            [encoded_move | ((PIECES.n + offset) << 16), carry],
            [encoded_move | ((PIECES.r + offset) << 16), carry],
            [encoded_move | ((PIECES.b + offset) << 16), carry],
        ];
    }

    return [encoded_move, carry];
}

/**
 * @param {Number[]} move 
 * @returns {Number[]}
 */
function decodeMove(move) {
    return [
         move[MOVE_INDEXES.MOVE] & 0x0000007F,         // Start square
        (move[MOVE_INDEXES.MOVE] & 0x00007F00) >> 8,   // End square
        (move[MOVE_INDEXES.MOVE] & 0x000F0000) >> 16,  // Start piece
        (move[MOVE_INDEXES.MOVE] & 0x00F00000) >> 20,  // End piece
        (move[MOVE_INDEXES.MOVE] & 0x01000000) >> 24,  // Promotion move ?
        (move[MOVE_INDEXES.MOVE] & 0x02000000) >> 25,  // Double pawn push ?
        (move[MOVE_INDEXES.MOVE] & 0x04000000) >> 26,  // En passant capture ?
        (move[MOVE_INDEXES.MOVE] & 0x7C000000) >> 27,  // Castling move ?

         move[MOVE_INDEXES.CARRY] & 0x0007F,           // Old en passant square
        (move[MOVE_INDEXES.CARRY] & 0x07F00) >> 8,     // Old half moves
        (move[MOVE_INDEXES.CARRY] & 0xF0000) >> 16,    // Old castling rights
    ];
}

/**
 * Translate a move from the internal bitwise representation
 * to a human comprensible format called algebraic notation.
 * 
 * This implementation refers to a simpler version of algebraic
 * notation which does not include the translation of checks
 * (+) and checkmates (#), and does not consider cases in which
 * more than two pieces of the same type can move to the same square.
 * @param {Number[][]} legal_moves 
 * @param {Number[]} move_to_play 
 * @returns {String}
 */
function moveToAlgebraicNotation(legal_moves, move_to_play) {

    let [
        start_square,
        end_square,
        start_piece,
        end_piece,
        promotion_move,
        ,
        ,
        castling_move
    ] = decodeMove(move_to_play);

    if (castling_move == CASTLING_MOVES.BLACK_KING_SIDE || castling_move == CASTLING_MOVES.WHITE_KING_SIDE) {
        return 'O-O';
    }

    if (castling_move == CASTLING_MOVES.BLACK_QUEEN_SIDE || castling_move == CASTLING_MOVES.WHITE_QUEEN_SIDE) {
        return 'O-O-O';
    }

    let [end_file, end_rank] = _120toFR(end_square);
    let [start_file, start_rank] = _120toFR(start_square);
    let start_piece_letter = getKeyByValue(PIECES, start_piece).toUpperCase();

    if (start_piece == PIECES.p || start_piece == PIECES.P || promotion_move) {    
        let algebraic_notation = '';

        if (end_piece != PIECES.EMPTY) {
            algebraic_notation += start_file + 'x';
        }

        algebraic_notation += end_file + end_rank;
        if (promotion_move) {
            algebraic_notation += start_piece_letter;
        }

        return algebraic_notation;
    }

    let disambiguity = '';

    for (let move of legal_moves) {
        let [
            other_start_square,
            other_end_square,
            other_start_piece
        ] = decodeMove(move);

        if (
            start_piece == other_start_piece &&
            end_square == other_end_square &&
            move_to_play[MOVE_INDEXES.MOVE] != move[MOVE_INDEXES.MOVE]
        ) {
            let [other_start_file, other_start_rank] = _120toFR(other_start_square);
            if (start_file != other_start_file) {
                disambiguity = start_file;
            }
            else if (start_rank != other_start_rank) {
                disambiguity = start_rank;
            }
            else {
                disambiguity = start_file + start_rank;
            }
        }
    }

    if (end_piece != PIECES.EMPTY) {
        return start_piece_letter + disambiguity + 'x' + end_file + end_rank;
    }
    return start_piece_letter + disambiguity + end_file + end_rank;
}



/**
 * ############################# GAME OBJECT EXTENSION #############################
 */

/**
 * Plays the move on the GAME object
 * @param {Number[]} move 
 */
Game.prototype.playMove = function(move) {

    let [
        start_square,
        end_square,
        start_piece,
        ,
        ,
        double_pawn_push,
        en_passant_capture,
        castling_move,
        ,
        old_half_moves
    ] = decodeMove(move);

    // Standard move
    this.chessboard[end_square] = start_piece;
    this.chessboard[start_square] = PIECES.EMPTY;
    
    let player = isWhite(start_piece);
    let direction = getOpponentPawnDirection(player);
    if (en_passant_capture) {
        this.chessboard[end_square + direction] = PIECES.EMPTY;
    }

    if (castling_move != CASTLING_MOVES.NONE) {
        if (castling_move == CASTLING_MOVES.WHITE_KING_SIDE) {
            this.chessboard[96] = PIECES.R;
            this.chessboard[98] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.WHITE_QUEEN_SIDE) {
            this.chessboard[94] = PIECES.R;
            this.chessboard[91] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.BLACK_KING_SIDE) {
            this.chessboard[26] = PIECES.r;
            this.chessboard[28] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.BLACK_QUEEN_SIDE) {
            this.chessboard[24] = PIECES.r;
            this.chessboard[21] = PIECES.EMPTY;
        }
    }

    if (this.to_play == PLAYERS.BLACK) {
        this.moves++;
        this.to_play = PLAYERS.WHITE;
    }
    else {
        this.to_play = PLAYERS.BLACK;
    }

    // If old half moves is != 0 then it means that the value must be resetted
    if (old_half_moves != 0) {
        this.half_moves = 0;
    }
    else {
        this.half_moves++;
    }

    if (double_pawn_push) {
        this.en_passant = end_square + direction;
    }
    else {
        this.en_passant = DUMMY_SQUARE;
    }

    if (start_piece == PIECES.K) {
        this.white_king_square = end_square;
        this.castling_rights &= REMOVE_CASTLING.WHITE_ALL;
    } 
    else if (start_piece == PIECES.k) {
        this.black_king_square = end_square;
        this.castling_rights &= REMOVE_CASTLING.BLACK_ALL;
    }   
    else if (start_square == 98 || end_square == 98) {
        this.castling_rights &= REMOVE_CASTLING.WHITE_KING_SIDE;
    }
    else if (start_square == 91 || end_square == 91) {
            this.castling_rights &= REMOVE_CASTLING.WHITE_QUEEN_SIDE;
    }
    else if (start_square == 28 || end_square == 28) {
        this.castling_rights &= REMOVE_CASTLING.BLACK_KING_SIDE;
    }
    else if (start_square == 21 || end_square == 21) {
        this.castling_rights &= REMOVE_CASTLING.BLACK_QUEEN_SIDE;
    }
}

/**
 * Undoes the move on the GAME object
 * @param {Number[]} move 
 */
Game.prototype.undoMove = function(move) {

    let [
        start_square,
        end_square,
        start_piece,
        end_piece,
        promotion_move,
        ,
        en_passant_capture,
        castling_move,
        old_en_passant_square,
        old_half_moves,
        old_castling_rights
    ] = decodeMove(move);
    
    let player = isWhite(start_piece);

    if (promotion_move) {
        start_piece = (player == PLAYERS.WHITE) ? PIECES.P : PIECES.p;
    }

    // Undo standard move
    this.chessboard[start_square] = start_piece;
    this.chessboard[end_square] = end_piece;

    if (en_passant_capture) {
        let direction = getOpponentPawnDirection(player);
        this.chessboard[end_square + direction] = (player == PLAYERS.WHITE) ? PIECES.p : PIECES.P;
    }

    if (castling_move != CASTLING_MOVES.NONE) {
        if (castling_move == CASTLING_MOVES.WHITE_KING_SIDE) {
            this.chessboard[98] = PIECES.R;
            this.chessboard[96] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.WHITE_QUEEN_SIDE) {
            this.chessboard[91] = PIECES.R;
            this.chessboard[94] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.BLACK_KING_SIDE) {
            this.chessboard[28] = PIECES.r;
            this.chessboard[26] = PIECES.EMPTY;
        }
        else if (castling_move == CASTLING_MOVES.BLACK_QUEEN_SIDE) {
            this.chessboard[21] = PIECES.r;
            this.chessboard[24] = PIECES.EMPTY;
        }
    }

    if (this.to_play == PLAYERS.WHITE) {
        this.moves--;
        this.to_play = PLAYERS.BLACK;
    }
    else {
        this.to_play = PLAYERS.WHITE;
    }

    if (old_half_moves) {
        this.half_moves = old_half_moves;
    }
    else {
        this.half_moves--;
    }

    if (start_piece == PIECES.K) {
        this.white_king_square = start_square;
    } 
    else if (start_piece == PIECES.k) {
        this.black_king_square = start_square;
    }   

    this.en_passant = old_en_passant_square;
    this.castling_rights = old_castling_rights;
}
