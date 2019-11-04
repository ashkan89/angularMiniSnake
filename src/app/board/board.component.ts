import { Component, OnInit, HostListener, Input } from '@angular/core';

export enum KEY_CODE {
  KeyW = 'KeyW',
  KeyA = 'KeyA',
  KeyS = 'KeyS',
  KeyD = 'KeyD'
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() boardWidth: number;

  public squares: any[];
  public interval: any;
  public paused: boolean;
  public snakeDirection: string;
  private boardSize: number;
  // private boardWidth: number;

  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  public pauseGame() {
    clearInterval(this.interval);
    this.paused = true;
  }

  public startMoving() {
    this.paused = false;
    this.interval = setInterval(() => {
      this.moveSnake(this.snakeDirection);
    }, 100);
  }

  public newGame() {
    if (this.interval !== null) {
      this.pauseGame();
    }

    // this.boardWidth = 32;
    this.boardSize = this.boardWidth ** 2;
    this.squares = Array(this.boardSize).fill(this.newEmptyCell());
    this.paused = false;
    this.snakeDirection = 'KeyD';
    this.interval = null;

    this.newFood();
    this.newSnake();
    this.startMoving();
  }

  public newEmptyCell(): any {
    return { isFill: false, isHead: false, isTail: false, isFood: false, color: 'aqua' };
  }

  public newFood() {
    this.squares.splice(this.getNewAvailableCell(), 1, this.newFoodCell());
  }

  public isCellAllowed(idx: number): boolean {
    return this.squares[idx].isFill;
  }

  public newSnake() {
    this.squares.splice(this.getNewAvailableCell(), 1, this.newSnakeCell());
  }

  public newSnakeCell() {
    return { isFill: true, isHead: true, isTail: true, isFood: false, color: 'brown' };
  }

  public getNewAvailableCell(): number {
    let randCell: number;
    do {
      randCell = this.newCellNum();
    } while (this.isCellAllowed(randCell));

    return randCell;
  }

  public newCellNum(): number {
    return Math.round(Math.random() * (this.boardSize - 1));
  }

  public newFoodCell() {
    return { isFill: true, isHead: false, isTail: false, isFood: true, color: 'black' };
  }

  public moveSnake(key: string) {
    const head = this.getSnakeHead();
    const headIndex = this.getSnakeHeadIndex();
    const nextCellIndex = this.getNextCellIndex();
    const nextIsFood = this.getCellByIndex(nextCellIndex).isFood;
    this.squares.splice(headIndex, 1, this.newEmptyCell());
    this.squares.splice(nextCellIndex, 1, head[0]);

    if (nextIsFood) {
      this.newFood();
    }
  }

  public getCellByIndex(idx: number): any {
    return this.squares[idx];
  }

  public getSnakeHead(): any {
    return this.squares.filter((item: any) => {
      return item.isHead === true;
    });
  }

  public getSnakeHeadIndex(): any {
    return this.squares.findIndex((item: any): any => {
      return item.isHead === true;
    });
  }

  public getNextCellIndex(): number {
    const headIndex = this.getSnakeHeadIndex();
    switch (this.snakeDirection) {
      case KEY_CODE.KeyW:
        if (headIndex < this.boardWidth) {
          return this.boardSize - (this.boardWidth - headIndex);
        } else {
          return headIndex - this.boardWidth;
        }

      case KEY_CODE.KeyA:
        if ((headIndex % this.boardWidth) === 0) {
          return headIndex + (this.boardWidth - 1);
        } else {
          return headIndex - 1;
        }

      case KEY_CODE.KeyS:
        if (headIndex >= (this.boardWidth * (this.boardWidth - 1))) {
          return (headIndex - (this.boardSize - 1) + (this.boardWidth - 1));
        } else {
          return headIndex + this.boardWidth;
        }

      case KEY_CODE.KeyD:
        if (((headIndex + 1) % this.boardWidth) === 0) {
          return headIndex - (this.boardWidth - 1);
        } else {
          return headIndex + 1;
        }

      default:
        console.log('Invalid Key');
        break;
    }
  }

  private isKeyCodeAcceptable(key: string): boolean {
    return Object.values(KEY_CODE).includes(key as KEY_CODE);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.paused) {
      return;
    }

    if (this.isKeyCodeAcceptable(event.code)) {
      this.snakeDirection = event.code;
    }
  }
}
