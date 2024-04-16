export default class GameObj {
  constructor() {
    this.active = false;
    this.p1AllTime = 0;
    this.cpAllTime = 0;
    this.p1Session = 0;
    this.cpSession = 0;
  }

  getActiveState() {
    return this.active;
  }

  startGame() {
    this.active = true;
  }

  endGame() {
    this.active = false;
  }

  getP1AllTime() {
    return this.p1AllTime;
  }

  setP1AllTime(num) {
    this.p1AllTime = num;
  }

  getCpAllTime() {
    return this.cpAllTime;
  }

  setCpAllTime(num) {
    this.cpAllTime = num;
  }

  getP1Session() {
    return this.p1Session;
  }

  getCpSession() {
    return this.cpSession;
  }

  p1Wins() {
    this.p1AllTime += 1;
    this.p1Session += 1;
  }

  cpWins() {
    this.cpAllTime += 1;
    this.cpSession += 1;
  }
}
