//   ____                                                __                  __      __          __                  __
//  /\  _`\                       __          __        /\ \                /\ \  __/\ \        /\ \              __/\ \__
//  \ \ \/\ \    ___     ___ ___ /\_\    ___ /\_\    ___\ \ \/'\     ____   \ \ \/\ \ \ \     __\ \ \____    ____/\_\ \ ,_\    __
//   \ \ \ \ \  / __`\ /' __` __`\/\ \ /' _ `\/\ \  /'___\ \ , <    /',__\   \ \ \ \ \ \ \  /'__`\ \ '__`\  /',__\/\ \ \ \/  /'__`\
//    \ \ \_\ \/\ \L\ \/\ \/\ \/\ \ \ \/\ \/\ \ \ \/\ \__/\ \ \\`\ /\__, `\   \ \ \_/ \_\ \/\  __/\ \ \L\ \/\__, `\ \ \ \ \_/\  __/
//     \ \____/\ \____/\ \_\ \_\ \_\ \_\ \_\ \_\ \_\ \____\\ \_\ \_\/\____/    \ `\___x___/\ \____\\ \_,__/\/\____/\ \_\ \__\ \____\
//      \/___/  \/___/  \/_/\/_/\/_/\/_/\/_/\/_/\/_/\/____/ \/_/\/_/\/___/      '\/__//__/  \/____/ \/___/  \/___/  \/_/\/__/\/____/

class Collectible {
  constructor({ x, y, value, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }
}

try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
