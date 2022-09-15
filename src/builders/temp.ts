class Bit {
    private _left?: Bit;
    private _right?: Bit;
    private _value: boolean = false;

    constructor(left: Bit | undefined = undefined, right: Bit | undefined = undefined) {
      this._left = left;
      this._right = right;
    }

    get left(): Bit {
      if (this._left === undefined) this._left = new Bit(undefined, this);
      return this._left;
    }

    set left(left: Bit) {
      this._left = left;
    }

    get right(): Bit {
      if (this._right === undefined) this._right = new Bit(this, undefined);
      return this._right;
    }

    set right(right: Bit) {
      this._right = right;
    }

    get value() {
      return this._value ? 1 : 0;
    }

    set value(value: number) {
      this._value = !!value;
    }

    flip() {
      this._value = !this._value;
    }
  }

  function parseOutput(queue: number[]): string {
    let output: string = "";
    let char: number[] = [];

    while (queue.length !== 0) {
      char = queue.splice(0, 8);
      char.reverse();
      while (char.length < 8) char.unshift(0);
      output += String.fromCharCode(parseInt(char.join(''), 2));
    }

    return output;
  }



  function parseInput(input: string): number[] {
    let queue: number[] = [];

    for (let character of input) {
      let charcode = character.charCodeAt(0);
      let binary = charcode.toString(2);
      let padded = ("00000000" + binary).slice(-8);
      let litEnd = padded.split('').reverse();
      for (let bit of litEnd) {
        queue.push(parseInt(bit));
      }
    }

    return queue;
  }

  let inputQueue: number[] = parseInput(input);
  let outputQueue: number[] = [];
  let currentBit: Bit = new Bit();
  let currentCommandPointer: number = 0;
  let loopPositions: number[] = [];

  while (currentCommandPointer < code.length) {
    let operation = code[currentCommandPointer];
    switch (operation) {
      case "+": // Flips the value of the bit under the pointer
        currentBit.flip();
        break;
      case ",": // Reads a bit from the input stream, storing it under the pointer. The end-user types information using characters, though. Bytes are read in little-endian order—the first bit read from the character a, for instance, is 1, followed by 0, 0, 0, 0, 1, 1, and finally 0. If the end-of-file has been reached, outputs a zero to the bit under the pointer.
        currentBit.value = inputQueue.shift() || 0;
        break;
      case ";": // Outputs the bit under the pointer to the output stream. The bits get output in little-endian order, the same order in which they would be input. If the total number of bits output is not a multiple of eight at the end of the program, the last character of output gets padded with zeros on the more significant end.
        outputQueue.push(currentBit.value);
        break;
      case "<": // Moves the pointer left by 1 bit
        currentBit = currentBit.left;
        break;
      case ">": // Moves the pointer right by 1 bit
        currentBit = currentBit.right;
        break;
      case "[": // If the value under the pointer is 0 then skip to the corresponding ]
        if (currentBit.value === 0) {  // Skip Loop
          let scope: number = 0;

          while (true) {
            operation = code[++currentCommandPointer];
            if (operation === "[") {
              scope++;
            } else if (operation === "]") {
              if (scope !== 0) scope--;
              else break;
            }
          }
          break;
        }
        if (loopPositions[loopPositions.length - 1] !== currentCommandPointer) loopPositions.push(currentCommandPointer);
        break;
      case "]": // Jumps back to the matching [ character
        const temp = loopPositions.pop();
        if (temp === undefined) throw new Error();
        currentCommandPointer = temp - 1;
        break;
      default: // Skip non-operation characters
        break;
    }
    currentCommandPointer++;
  }
  return parseOutput(outputQueue);
}
