type HexChar = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ByteString = `0x${HexChar}${HexChar}`;
export type Byte = number & { __descriptor__: 'BYTE' };

export function toByte(value: number | ByteString){
  if (typeof value === 'string'){
    return +value as Byte;
  }
  if (Number.isSafeInteger(value) && value >= 0 && value < 256){
    return value as Byte;
  }
  throw new Error("Cannot parse byte");
}

