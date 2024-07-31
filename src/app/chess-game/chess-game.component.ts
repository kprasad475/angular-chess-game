import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Chess } from 'chess.js';
declare var Chessboard: any;
declare var $: any; // Declare jQuery to avoid TypeScript errors


@Component({
  selector: 'app-chess-game',
  templateUrl: './chess-game.component.html',
  styleUrl: './chess-game.component.css'
})
export class ChessGameComponent implements AfterViewInit {
  chess: any;
  board: any;
  isBrowser: boolean;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.loadChessboardScript().then(() => {
        this.initializeBoard();
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
      dropOffBoard: 'trash',
      sparePieces: true
    });
  }

  handleMove(source: any, target: any): any {
    const move = this.chess.move({
      from: source,
      to: target,
      promotion: 'q' // always promote to a queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    setTimeout(this.makeRandomMove.bind(this), 250);
  }

  makeRandomMove() {
    const possibleMoves = this.chess.moves();

    // Game over
    if (possibleMoves.length === 0) return;

    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    this.chess.move(possibleMoves[randomIdx]);
    this.board.position(this.chess.fen());
  }
}
