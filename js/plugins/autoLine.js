/*:
 * @plugindesc 自动换行(英文)
 * @author FlyRoc
 * @target MZ
 * @help
 * 实现自动换行小功能。
 */
function validUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

// Window_Base.prototype.processCharacter = function (textState) {
//     const c = textState.text[textState.index++];
//     if (c.charCodeAt(0) < 0x20) {
//         this.flushTextState(textState);
//         this.processControlCharacter(textState, c);
//     } else {
//         textState.buffer += c;
//         if (textState.text) {
//             var jc = textState.text.match(/RE/i);
//             if (jc) {
//                 var jc = validUpperCase(jc[0]);
//             } else {
//                 var jc = false;
//             };
//         } else {
//             var jc = false;
//         }
//         // console.log('text:', c)
//         // console.log('x:', textState.x)
//         // console.log('width:', this.innerWidth)
//         // console.log('jc:', jc)
//         if (textState.x + this.textWidth(c) >= 1184 && jc == false) {
//             this.processNewLine(textState);
//         }
//     }
// };

Window_Message.prototype.convertEscapeCharacters = function (text) {
    /* eslint no-control-regex: 0 */
    const regex = /[\r\n]/g;
    let match;
    const newLineIndices = [];

    while ((match = regex.exec(text))) {
        newLineIndices.push(match.index);
    }
    var textWidth = 0;
    var newText = [];
    for (let i = 0; i < text.length; i++) {
        var value = this.textWidth(text[i]);
        newText.push(text[i]);
        if (newLineIndices.includes(i)) {
            textWidth = 0;
        }
        textWidth += value;
        if (textWidth >= (this.width - 60)) {
            newText.push('\n');
            textWidth = 0;
        };
    };
    text = newText.join('')
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");
    text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
    );
    text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
    );
    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
        this.actorName(parseInt(p1))
    );
    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
        this.partyMemberName(parseInt(p1))
    );
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    text = text.replace(/\x1bCT\[(\d+)\]/gi, function () {
        $gameMessage.setAlign(Number(arguments[1] || 0));
        return "";
    }.bind(this));
    return text;
};