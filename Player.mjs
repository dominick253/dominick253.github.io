//  ____                                                __                  __      __          __                  __
//  /\  _`\                       __          __        /\ \                /\ \  __/\ \        /\ \              __/\ \__
//  \ \ \/\ \    ___     ___ ___ /\_\    ___ /\_\    ___\ \ \/'\     ____   \ \ \/\ \ \ \     __\ \ \____    ____/\_\ \ ,_\    __
//   \ \ \ \ \  / __`\ /' __` __`\/\ \ /' _ `\/\ \  /'___\ \ , <    /',__\   \ \ \ \ \ \ \  /'__`\ \ '__`\  /',__\/\ \ \ \/  /'__`\
//    \ \ \_\ \/\ \L\ \/\ \/\ \/\ \ \ \/\ \/\ \ \ \/\ \__/\ \ \\`\ /\__, `\   \ \ \_/ \_\ \/\  __/\ \ \L\ \/\__, `\ \ \ \ \_/\  __/
//     \ \____/\ \____/\ \_\ \_\ \_\ \_\ \_\ \_\ \_\ \____\\ \_\ \_\/\____/    \ `\___x___/\ \____\\ \_,__/\/\____/\ \_\ \__\ \____\
//      \/___/  \/___/  \/_/\/_/\/_/\/_/\/_/\/_/\/_/\/____/ \/_/\/_/\/___/      '\/__//__/  \/____/ \/___/  \/___/  \/_/\/__/\/____/

class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = 0;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y -= speed;
        break;
      case "down":
        this.y += speed;
        break;
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
      default:
        break;
    }
  }

  collision(item) {
    const playerLeft = this.x;
    const playerRight = this.x + 20;
    const playerTop = this.y;
    const playerBottom = this.y + 20;

    const itemLeft = item.x;
    const itemRight = item.x + 10;
    const itemTop = item.y;
    const itemBottom = item.y + 10;

    if (
      playerLeft < itemRight &&
      playerRight > itemLeft &&
      playerTop < itemBottom &&
      playerBottom > itemTop
    ) {
      return true;
    }

    return false;
  }

  calculateRank(arr) {
    const sortedPlayers = [...arr].sort((a, b) => b.score - a.score);
    const currentPlayerIndex =
      sortedPlayers.findIndex((p) => p.id === this.id) + 1;
    return `Rank: ${currentPlayerIndex}/${sortedPlayers.length}`;
  }
}

export default Player;
