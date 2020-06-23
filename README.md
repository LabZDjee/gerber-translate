# *gerber-translate*: simple CLI to manipulate Gerber coordinates in Node.js

This Command Line Utility targeting [Node.js](https://nodejs.org) processes one [Gerber](https://en.wikipedia.org/wiki/Gerber_format) file, manipulates its (x, y) coordinates and writes back result into another Gerber file

CLI syntax is (assumed from the source directory):

`node index.js path/to/inputGerberFile path/to/outputGerberFile transformation(x, y)`

with:

- `path/to/inputGerberFile`: the input Gerber file
- `path/to/outputGerberFile`: the output Gerber file (which can be the same than the input file)
- `transformation(x, y)`: a partial function involving `x` and `y` coordinates. Its syntax is `x: f(x), y: g(y)` where `f` and `g` are expressions compatible with [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript).  Example: `"x: 2*x, y: y+3134"`. Either `x` or `y` can be omitted in which case they are not altered in the process

## Management of Zeroes

Header of Gerber input file is parsed for a FS (Format Specification) command. If `%FSL` is found, leading zeroes are omitted. If %FST is found, which means omit trailing zeroes, process is aborted. Otherwise, leading zeroes are padded

Reason why trailing zeroes are not addressed is this case is very rare, deprecated, and too unnatural and tricky to manage for the rare cases it will be met