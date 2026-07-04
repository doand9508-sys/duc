//=============================================================================
// Phileas_TextWrap.js
//=============================================================================
// [Update History]
// 2023.July.02 Ver1.0.0 First Release
// 2023.July.03 Ver1.0.1 Fixed TAA bug
// 2023.July.03 Ver1.0.2 TAA_BookMenu standard padding
// 2025.February.16 Ver1.1.0 Fixed the display of messages
// 2025.February.23 Ver1.1.1 Dynamic calculation lines number
// 2025.April.14 Ver1.1.2 Fixed control characters processing
// 2025.April.19 Ver1.1.3 Fixed text wrapping
// 2025.April.23 Ver1.1.4 Fixed text wrapping
// 2025.May.12 Ver1.1.5 Fixed text size step tag
// 2025.May.13 Ver1.1.6 Fixed num lines calculation
// 2025.July.27 Ver1.1.7 Fixed choices

/*:
 * @target MZ
 * @plugindesc v1.1.7 Automatic text wrapping.
 * @author Phileas
 *
 * @command getWrappedText
 * @text Writes the wrapped text to a variable.
 * @desc Inserts line breaks into the given text so that the width of the text does not exceed the specified one.
 *
 * @arg text
 * @text Text
 * @type string
 * @desc Input non-empty text
 * @default String
 *
 * @arg fontName
 * @text Font name
 * @type combo
 * @option GameFont
 * @option Arial
 * @option Courier New
 * @option SimHei
 * @option Heiti TC
 * @option Dotum
 * @option AppleGothic
 * @desc Text font.
 * @default GameFont
 *
 * @arg fontSize
 * @text Font size
 * @type number
 * @desc Input a positive number.
 * @default 26
 *
 * @arg maxWidth
 * @text Max text width
 * @type number
 * @desc Input a positive number.
 * @default 700
 *
 * @arg variableId
 * @text A variable id
 * @type variable
 * @desc The text will be written to this variable.
 * @default 1
 *
 *
 * @help
 * The plugin adds a line break to the text in such a way that the text does not go beyond the borders of the window.
 * The plugin works automatically for message windows and the TAA_BookMenu plugin.
 *
 * Plugin Command: getWrappedText
 * This command will allow you to write the processed text to a variable.
 *
 * Feature of the plugin: the text color setting (\C[x]) is saved when the line is moved. Even if the new line is displayed in another window (which often happens when transferring text in the message window).
 * The same applies to the text size setting (\FS[x]).
 *
 * You can always write to the author if you need support for other windows. Or if you need other features or even plugins.
 * Boosty: https://boosty.to/phileas
 * RPG Maker Web: https://forums.rpgmakerweb.com/index.php?members/phileas.176075/
 * RPG Maker Union: https://rpgmakerunion.ru/id/phileas
 * Email: olek.olegovich gmail.com
 * Telegram: olekolegovich
 *
 * [License]
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

"use strict";
// If a manual newline lands on a line that is less than this fraction of the
// max width, the newline is suppressed and the next segment is joined instead.
// Exceptions: the very first line (character name) and lines whose next
// segment begins with a fullwidth space (explicit indentation).
const MERGE_THRESHOLD = -1;

const INDENT_STARTERS = new Set([
  "「",
  "『",
  "【",
  "〔",
  "（",
  "［",
  "｛",
  "〈",
  "《",
  "“",
  "‘",
  "　", // ← full-width space included as trigger
]);
//-----------------------------------------------------------------------------
// MY CODE
PluginManager.registerCommand(
  "Phileas_TextWrap",
  "getWrappedText",
  getWrappedTextByCommand,
);

// Add this line inside the (function () { ... })(); block
window.phileasGetWrappedText = getWrappedText;

function getColor(word) {
  for (let i = word.length - 3; i > -1; --i) {
    if (word[i] == "\\" && word[i + 1] == "C" && word[i + 2] == "[") {
      let tag = "\\C[";
      let j = i + 3;
      while (word[j] != "]" && j < word.length) {
        tag += word[j];
        ++j;
      }
      if (j == word.length) {
        return "";
      }

      if (i > 0 && word[i - 1] == "\\") {
        tag = "\\" + tag;
      }

      return tag + "]";
    }
  }

  return "";
}

function getTextSize(word) {
  for (let i = word.length - 4; i > -1; --i) {
    if (
      word[i] == "\\" &&
      word[i + 1] == "F" &&
      word[i + 2] == "S" &&
      word[i + 3] == "["
    ) {
      let tag = "\\FS[";
      let j = i + 4;
      while (word[j] != "]" && j < word.length) {
        tag += word[j];
        ++j;
      }
      if (j == word.length) {
        return "";
      }

      if (i > 0 && word[i - 1] == "\\") {
        tag = "\\" + tag;
      }

      return tag + "]";
    }
  }

  return "";
}

function getTextSizeStep(word) {
  let textSizeStep = 0;
  for (let i = word.length - 2; i > -1; --i) {
    if (word[i] == "\\" && word[i + 1] == "{") {
      ++textSizeStep;
      continue;
    }

    if (word[i] == "\\" && word[i + 1] == "}") {
      --textSizeStep;
    }
  }

  return textSizeStep;
}

function textSizeStepToTag(textSizeStep) {
  if (textSizeStep == 0) {
    return "";
  }

  const base = textSizeStep > 0 ? "\\{" : "\\}";
  const n = Math.abs(textSizeStep);
  let tag = "";

  for (let i = 0; i < n; ++i) {
    tag += base;
  }

  return tag;
}

function startsWithIndentStarter(line) {
  if (!line) return false;
  let i = 0;
  const len = line.length;

  // Skip control codes at the start of the line (e.g., \C[1], \FS[20])
  while (i < len && line[i] === "\\") {
    if (i + 1 >= len) break;
    const next = line[i + 1];
    if (next === "{" || next === "}" || next === "n") {
      i += 2;
    } else if (next === "C" || next === "F") {
      let j = i + 2;
      if (next === "F" && i + 2 < len && line[i + 2] === "S") {
        j = i + 3;
      }
      while (j < len && line[j] !== "]") j++;
      i = j + 1;
    } else {
      i += 2;
    }
  }

  // Now check the first real character
  if (i < len) {
    // console.log(line[i]);
    return INDENT_STARTERS.has(line[i]);
  }
  return false;
}

Window_Base.prototype.phileasGetTextSizes = function (text, x, y, width) {
  const textState = this.createTextState(text, x, y, width);
  this.processAllText(textState);
  return textState;
};

Window_Base.prototype.phileasGetTextWidth = function (text, x, y, width) {
  return this.phileasGetTextSizes(text, x, y, width).outputWidth;
};

Window_Base.prototype.phileasGetTextHeight = function (text, x, y, width) {
  return this.phileasGetTextSizes(text, x, y, width).outputHeight;
};

Window_Base.prototype.getWrappedText = function (
  text,
  maxWidth,
  windowMaxLines = 6,
) {
  return getWrappedText(text, maxWidth, this, windowMaxLines);
};

function getWrappedText(text, maxWidth, mainWindow, windowMaxLines = 6) {
  const wrapWindow = new Window_Base(
    new Rectangle(mainWindow.x, mainWindow.y, maxWidth, mainWindow.height),
  );
  wrapWindow.contents.fontFace = mainWindow.contents.fontFace;
  wrapWindow.contents.fontSize = mainWindow.contents.fontSize;
  const rect = wrapWindow.baseTextRect();

  let result = "";
  let word = "";
  let line = "";
  let lastIndex = 0;
  let currentColor = "";
  let currentTextSize = "";
  let previousTextSizeSteps = 0;
  let textSizeSteps = 0;
  let lines = 0;
  // lineNumber counts hard line-breaks from the original source text so we
  // can exempt the very first line (the character-name line) from merging.
  let lineNumber = 0;

  // Ensure we process the last word
  if (text[text.length - 1] !== " " && text[text.length - 1] !== "\n") {
    text += " ";
  }

  /// Locate this loop inside Phileas_TextWrap.js[cite: 1]
  for (let i = 0; i < text.length; ++i) {
    const char = text[i];
    const nextChar = text[i + 1];
    const charAfterNext = text[i + 2];

    // UPDATED: Check if it's \n but NOT \n[ (your variable tag)[cite: 1]
    let isControlN =
      (char === "\\" || char === "\x1b") &&
      (nextChar === "n" || nextChar === "N") &&
      charAfterNext !== "[";

    // ... rest of the loop logic

    let isNewlineChar = char === "\n";
    let isSpace = char === " ";
    // ... rest of the logic

    // If not a "break" character, keep building the word
    if (!isSpace && !isNewlineChar && !isControlN) {
      continue;
    }

    // 1. Extract the word
    // If it's \n (control), we take 2 characters. Otherwise 1.
    let wordEnd = isControlN ? i + 2 : i + 1;
    word = text.substring(lastIndex, wordEnd);

    // 2. Track Formatting Tags
    let newColor = getColor(word);
    if (newColor !== "") currentColor = newColor;

    let newTextSize = getTextSize(word);
    if (newTextSize !== "") currentTextSize = newTextSize;

    // 3. Check for Automatic Word Wrap
    // We check the width of the CURRENT line plus the NEW word
    wrapWindow.resetFontSettings();
    let testLine = line + word;
    let currentWidth = wrapWindow.phileasGetTextWidth(
      textSizeStepToTag(previousTextSizeSteps) + testLine,
      rect.x,
      rect.y,
      rect.width,
    );

    if (currentWidth > rect.width && line !== "") {
      result += "\n";
      lines++;

      // Apply Indentation if the current line segment started with a bracket
      // if (startsWithIndentStarter(line)) {
      //   result += "　";
      // }

      let textSizeStepTag = "";
      if (lines >= windowMaxLines) {
        textSizeStepTag = textSizeStepToTag(textSizeSteps);
        previousTextSizeSteps = lines = 0;
      } else {
        previousTextSizeSteps = textSizeSteps;
      }

      // Start a new line with the current word and carry over tags
      if (startsWithIndentStarter(line)) {
        line = currentTextSize + currentColor + textSizeStepTag + "　" + word;
      } else {
        line = currentTextSize + currentColor + textSizeStepTag + word;
      }

      result += line;
    } else {
      // No wrap needed, just add word to line and result
      line += word;
      result += word;
      textSizeSteps += getTextSizeStep(word);
    }

    // 4. Handle Manual Newlines (\n or literal newline)
    if (isNewlineChar || isControlN) {
      // --- Merge-threshold check ---
      // Look ahead to find what text comes next (up to the next break char).
      // Skip past this newline's own characters first (1 for \n, 2 for \n ctrl).
      let nextSegmentStart = isControlN ? i + 2 : i + 1;
      let nextSegmentEnd = nextSegmentStart;
      while (
        nextSegmentEnd < text.length &&
        text[nextSegmentEnd] !== " " &&
        text[nextSegmentEnd] !== "\n" &&
        !(text[nextSegmentEnd] === "\\" && text[nextSegmentEnd + 1] === "n")
      ) {
        nextSegmentEnd++;
      }
      const nextSegment = text.substring(nextSegmentStart, nextSegmentEnd);
      const nextStartsWithFullwidthSpace = nextSegment.startsWith("　");

      // Measure how full the current line is
      wrapWindow.resetFontSettings();
      const lineWidth = wrapWindow.phileasGetTextWidth(
        textSizeStepToTag(previousTextSizeSteps) + line,
        rect.x,
        rect.y,
        rect.width,
      );
      const isBelowThreshold = lineWidth < rect.width * MERGE_THRESHOLD;

      // Suppress this newline if:
      //   • The current line is below the fill threshold, AND
      //   • This is NOT the very first source line (name line)
      // When merging, if the next segment starts with a fullwidth space (　)
      // we skip it — it was only there as indent padding for a new line.
      if (
        isBelowThreshold &&
        (lineNumber > 0 ||
          !(nextSegment.startsWith("「") || nextSegment.startsWith("（")))
      ) {
        // The newline character is already inside `word` and was already
        // appended to `result` in step 3. Strip it back out before merging.
        if (isNewlineChar && result.endsWith("\n")) {
          result = result.slice(0, -1);
          line = line.replace(/\n$/, "");
        } else if (isControlN && result.endsWith("\\n")) {
          result = result.slice(0, -2);
          line = line.replace(/\\n$/, "");
        }

        // Replace the stripped newline with a space to join the segments.
        result += " ";
        line += " ";

        // If the very next character in the source is a fullwidth space used
        // for indentation, skip past it so it doesn't appear mid-sentence.
        if (nextStartsWithFullwidthSpace) {
          if (isControlN) i++;
          i++; // skip the fullwidth space (it's one JS char, U+3000)
          lastIndex = i + 1;
        } else {
          if (isControlN) i++;
          lastIndex = i + 1;
        }
        lineNumber++;
        continue;
      }

      // Normal newline handling
      result += isControlN ? "" : ""; // The newline char is already in 'word'
      lines++;
      lineNumber++;

      let textSizeStepTag = "";
      if (lines >= windowMaxLines) {
        textSizeStepTag = textSizeStepToTag(textSizeSteps);
        previousTextSizeSteps = lines = 0;
      } else {
        previousTextSizeSteps = textSizeSteps;
      }

      // RESET the line tracker because we hit a hard break
      line = currentTextSize + currentColor + textSizeStepTag;
    }

    // Update loop index and lastIndex
    if (isControlN) i++;
    lastIndex = i + 1;
  }

  return result;
}

function getWrappedTextByCommand(params) {
  let text = params["text"];
  let fontName = params["fontName"];
  let fontSize = Number(params["fontSize"]);
  let maxWidth = Number(params["maxWidth"]);
  let variableId = Number(params["variableId"]);
  if (
    text == undefined ||
    text == "" ||
    fontName == undefined ||
    fontName == "" ||
    fontSize < 1 ||
    maxWidth < 1 ||
    variableId < 1
  ) {
    console.log("Wrapping failed for these parameters: ", {
      text: text,
      fontName: fontName,
      fontSize: fontSize,
      maxWidth: maxWidth,
      variableId: variableId,
    });
    return;
  }

  let wrapWindow = new Window_Base(
    new Rectangle(0, 0, maxWidth, Graphics.boxHeight),
  );
  wrapWindow.contents.fontFace = fontName;
  wrapWindow.contents.fontSize = fontSize;
  let wrappedText = getWrappedText(text, maxWidth, wrapWindow);
  $gameVariables.setValue(variableId, wrappedText);
}

Window_Message.prototype.phileasGetWindowMessageMargin = function () {
  const faceExists = $gameMessage.faceName() !== "";
  // If it's a bubble, use a slightly larger padding to prevent edge touching
  const spacing = 28;
  return faceExists ? ImageManager.faceWidth + spacing : 12;
};

Window_Message.prototype.phileasNumLines = function (text) {
  const wrapWindow = new Window_Base(
    new Rectangle(this.x, this.y, this.width, this.height),
  );
  const rect = this.baseTextRect();
  const lineHeight = wrapWindow.phileasGetTextHeight(
    text,
    rect.x,
    rect.y,
    rect.width,
  );
  if ($gameMessage._background === 1 || $gameMessage._background === 0) {
    $gameMessage._numLines = 4;
  } else {
    $gameMessage._numLines = Math.floor(rect.height / lineHeight);
  }
};

//-----------------------------------------------------------------------------
// MODIFIED CODE

// In Phileas_TextWrap.js
const Origin_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
  this.resetFontSettings();

  // 1. Cat plugin calculates exact dimensions and creates the canvas[cite: 2]
  if (typeof this.newCatMessageWindow === "function") {
    this.newCatMessageWindow();
  }

  const expandedText = this.convertEscapeCharacters($gameMessage.allText());
  this.phileasNumLines(expandedText);

  // 2. Final wrap for display[cite: 1]
  const maxWidth = this.width - this.phileasGetWindowMessageMargin();
  const wrappedLines = window
    .phileasGetWrappedText(expandedText, maxWidth, this, $gameMessage._numLines)
    .split("\n");

  $gameMessage._texts = wrappedLines.slice(0, $gameMessage._numLines);
  $gameMessage._nextTexts = wrappedLines.slice($gameMessage._numLines);

  Origin_startMessage.call(this);
};

const Origin_Window_Message_startInput = Window_Message.prototype.startInput;
Window_Message.prototype.startInput = function () {
  if ($gameMessage._nextTexts.length > 0) {
    return false;
  }

  return Origin_Window_Message_startInput.call(this);
};

const Origin_Game_Message_initialize = Game_Message.prototype.initialize;
Game_Message.prototype.initialize = function () {
  this._nextTexts = [];
  Origin_Game_Message_initialize.call(this);
};

const Origin_Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
  if (this._nextTexts.length == 0) {
    Origin_Game_Message_clear.call(this);
    return;
  }

  this._texts = this._nextTexts.slice(0, $gameMessage._numLines);
  this._nextTexts = this._nextTexts.slice($gameMessage._numLines);
};
