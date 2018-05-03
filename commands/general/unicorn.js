const { Command } = require('discord.js-commando');
const fs = require("fs");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unicorn',
            group: 'general',
            memberName: 'unicorn',
            description: 'Show a unicorn',
            examples: ['!unicorn']
        });
    }
    run(msg) {
        var text = fs.readFileSync("draw");
        return msg.say("```"+text+"```");
    }
}
//                                                    /
//                                                  .7
//                                       \       , //
//                                       |\.--._/|//
//                                      /\ ) ) ).'/
//                                     /(  \  // /
//                                    /(   J'((_/ \
//                                   / ) | _\     /
//                                  /|)  \  eJ    L
//                                 |  \ L \   L   L
//                                /  \  J  '. J   L
//                                |  )   L   \/   \
//                               /  \    J   (\   /
//             _....___         |  \      \   \'''
//      ,.._.-'        '''--...-||\     -. \   \
//    .'.=.'                    '         '.\ [ Y
//   /   /                                  \]  J
//  Y / Y                                    Y   L
//  | | |          \                         |   L
//  | | |           Y                        A  J
//  |   I           |                       /I\ /
//  |    \          I             \        ( |]/|
//  J     \         /._           /        -tI/ |
//   L     )       /   /'-------'J           ''-:.
//   J   .'      ,'  ,' ,     \   ''-.__          \
//    \ T      ,'  ,'   )\    /|        ';'---7   /
//     \|    ,'L  Y...-' / _.' /         \   /   /
//      J   Y  |  J    .'-'   /         ,--.(   /
//       L  |  J   L -'     .'         /  |    /\
//       |  J.  L  J     .-;.-/       |    \ .' /
//       J   L'-J   L____,.-''        |  _.-'   |
//        L  J   L  J                  ''  J    |
//        J   L  |   L                     J    |
//         L  J  L    \                    L    \
//         |   L  ) _.'\                    ) _.'\
//         L    \(''    \                  (''    \
//          ) _.'\'-....'                   '-....'
//         (''    \
//          '-.___/   sk