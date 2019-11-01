import { Component, OnInit, HostListener } from '@angular/core';

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
  public squares: any[];
  public interval: any;
  public paused: boolean;
  public snakeDirection: string; // 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD';
  private boardSize: number;

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
    }, 500);
  }

  public newGame() {
    if (this.interval !== null) {
      this.pauseGame();
    }

    this.boardSize = 1024;
    this.squares = Array(this.boardSize).fill({ isFill: false, isHead: false, isTail: false, isFood: false, color: 'aqua' });
    this.paused = false;
    this.snakeDirection = 'KeyD';
    this.interval = null;

    this.newFood();
    this.newSnake();
    this.startMoving();
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
    return Math.round(Math.random() * 1023);
  }

  public newFoodCell() {
    return { isFill: true, isHead: false, isTail: false, isFood: true, color: 'black' };
  }

  public moveSnake(key: string) {
    const head = this.getSnakeHead();
    switch (key) {
      case 'KeyW':
        console.log('moving up');
        break;

      case 'KeyA':
        console.log('moving left');
        break;

      case 'KeyS':
        console.log('moving down');
        break;

      case 'KeyD':
        console.log('moving right');
        break;

      default:
        console.log('Invalid Key');
        break;
    }
  }

  public getSnakeHead(): any {
    return this.squares.filter((item) => {
      return item.isHead === true;
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // this.moveSnake(event.code);
    this.snakeDirection = event.code;
  }
}
