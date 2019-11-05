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
  @Input() boardWidth = 32;
  @Input() cellWidth = 20;
  @Input() speed = 100;
  @Input() wallCount = 15;

  public squares: any[];
  public paused: boolean;
  public score: number;
  public crashed: boolean;
  private interval: any;
  private snakeDirection: string;
  private boardSize: number;

  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  public pauseGame() {
    clearInterval(this.interval);
    this.paused = true;
  }

  public gameOver() {
    clearInterval(this.interval);
  }

  public startMoving() {
    this.paused = false;
    this.interval = setInterval(() => {
      this.moveSnake(this.snakeDirection);
    }, this.speed);
  }

  public newGame() {
    if (this.interval !== null) {
      this.pauseGame();
    }

    document.documentElement.style.setProperty('--board-width', this.boardWidth.toString());
    document.documentElement.style.setProperty('--cell-width', `${this.cellWidth}px`);

    this.boardSize = this.boardWidth ** 2;
    this.squares = Array(this.boardSize).fill(this.newEmptyCell());
    this.paused = false;
    this.snakeDirection = 'KeyD';
    this.interval = null;
    this.score = 0;
    this.crashed = false;

    this.newFood();
    this.newSnake();
    this.makeWalls();
    this.startMoving();
  }

  public newEmptyCell(): any {
    return { isFill: false, isHead: false, isTail: false, isFood: false, isWall: false, color: 'aqua' };
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
    return { isFill: true, isHead: true, isTail: true, isFood: false, isWall: false, color: 'brown' };
  }

  public newWallCell() {
    return { isFill: false, isHead: false, isTail: false, isFood: false, isWall: true, color: 'black' };
  }

  public makeWalls() {
    for (let index = 0; index < this.wallCount; index++) {
      this.squares.splice(this.getNewAvailableCell(), 1, this.newWallCell());
    }
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
    return { isFill: true, isHead: false, isTail: false, isFood: true, isWall: false, color: 'darkgreen' };
  }

  public moveSnake(key: string) {
    const head = this.getSnakeHead()[0];
    const headIndex = this.getSnakeHeadIndex();
    const nextCellIndex = this.getNextCellIndex();
    const nextIsFood = this.getCellByIndex(nextCellIndex).isFood;
    const nextIsWall = this.getCellByIndex(nextCellIndex).isWall;
    this.squares.splice(headIndex, 1, this.newEmptyCell());
    this.squares.splice(nextCellIndex, 1, head);

    if (nextIsFood) {
      this.score += 10;
      this.newFood();
    } else if (nextIsWall) {
      this.crashed = true;
      this.gameOver();
      head.color = 'red';
      this.squares.splice(nextCellIndex, 1, head);
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
    } else {
      console.log('Invalid Key: ', event.code);
    }
  }
}
