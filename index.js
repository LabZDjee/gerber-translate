/* jshint esversion: 6 */

const fs = require("fs");

const _ = require("lodash");

if (process.argv.length != 5) {
  console.log(`Simple Gerber Coordinate Translate
 complulsory arguments:
  gerberInFilePath gerberOutFilePath translation_function
 example
  ./in.ger ./out.ger "x: 10-x, y"`);
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2], "utf8");

const eol = input.includes("\r\n") ? "\r\n" : "\n";

const inputLines = input.split(eol);

const zeroOmit = inputLines.some((str) => {
  if (str.startsWith("%FST")) {
    console.log("Abort: this utility does not support Trailing Zeroes (%FST, a deprecated feature)");
    process.exit();
  }
  return str.startsWith("%FSL");
});

const processor = eval(`(x, y) => ({${process.argv[4]}})`); /* jshint ignore:line */

function isAcceptableNumber(n) {
  return typeof n === "number" && isFinite(n);
}

function processLine(str) {
  const regex = /^X([+-]?\d+)Y([+-]?\d+)(.+)\*$/;
  const r = regex.exec(str);
  if (r !== null) {
    let xHasSign = /^[+-]/.exec(r[1]);
    let yHasSign = /^[+-]/.exec(r[2]);
    const xPadLength = zeroOmit ? 1 : r[1].length - (xHasSign === null ? 0 : 1);
    const yPadLength = zeroOmit ? 1 : r[2].length - (yHasSign === null ? 0 : 1);
    const x = parseInt(r[1]);
    const y = parseInt(r[2]);
    const p = processor(x, y);
    if (p.x === undefined) {
      p.x = x;
    }
    if (p.y === undefined) {
      p.y = y;
    }
    if (!isAcceptableNumber(p.x) || !isAcceptableNumber(p.y)) {
      console.log("Abort: computed x and y are not acceptable numbers. Cannot process any further.");
      process.exit();
    }
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
    if (p.x < 0) {
      xHasSign = ["-"];
    }
    if (p.y < 0) {
      yHasSign = ["-"];
    }
    return `X${xHasSign === null ? "" : xHasSign[0]}${_.padStart(Math.abs(p.x).toString(10), xPadLength, "0")}Y${
      yHasSign === null ? "" : yHasSign[0]
    }${_.padStart(Math.abs(p.y).toString(10), yPadLength, "0")}${r[3]}*`;
  } else {
    return str;
  }
}

const processedLines = inputLines.map(processLine);

fs.writeFileSync(process.argv[3], processedLines.join(eol), "utf8");
