import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chess } from 'chess.js';
import { error } from 'console';

declare var Chessboard: any;

@Component({
  selector: 'app-chess-game',
  templateUrl: './chess-game.component.html',
  styleUrls: ['./chess-game.component.css']
})
export class ChessGameComponent implements AfterViewInit {
  chess: any;
  board: any;
  isBrowser: boolean;
  stockfish: Worker;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.chess = new Chess();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.loadChessboardScript().then(() => {
        this.initializeBoard();
        this.initializeStockfish();
      }).catch((error) => {
        console.error('Error loading chessboard.js script:', error);
      });
    }
  }


  loadChessboardScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/js/chessboard-1.0.0.min.js';
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

 

  initializeBoard() {
    this.board = Chessboard('board', {
      draggable: true,
      position: 'start',
      onDrop: this.handleMove.bind(this),
      onSnapEnd: this.updateBoard.bind(this)
    });
  }

  initializeStockfish() {
    this.stockfish = new Worker(new URL('../../stockfish.worker.js', import.meta.url));
    this.stockfish.onmessage = (event) => {
      const bestMove = event.data.match(/^bestmove\s([a-h][1-8][a-h][1-8][qrbn]?)$/);
      if (bestMove) {
        this.chess.move({
          from: bestMove[1].substring(0, 2),
          to: bestMove[1].substring(2, 4),
          promotion: bestMove[1].substring(4, 5)
        });
        this.updateBoard();
        this.updateStatus();
      }
    };
  }

  handleMove(source: string, target: string): any {
    const move = this.chess.move({
      from: source,
      to: target,
      promotion: 'q' // always promote to a queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    this.updateStatus();

    if (!this.chess.game_over()) {
      this.stockfish.postMessage(`position fen ${this.chess.fen()}`);
      this.stockfish.postMessage('go depth 15');
    }
  }



  updateBoard() {
    this.board.position(this.chess.fen());
  }

  updateStatus() {
    if (this.chess.in_checkmate()) {
      alert('Checkmate! Game over.');
    } else if (this.chess.in_draw()) {
      alert('Draw! Game over.');
    } else if (this.chess.in_stalemate()) {
      alert('Stalemate! Game over.');
    } else if (this.chess.in_threefold_repetition()) {
      alert('Threefold repetition! Game over.');
    } else if (this.chess.insufficient_material()) {
      alert('Insufficient material! Game over.');
    }
  }
}
