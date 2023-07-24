import { BlockEntity, PaletteInfo } from ".";

export type List<T extends TagType> = {
  type: TagType.List;
  value: { type: Tags[T]["type"]; value: Tags[T]["value"][] };
};

export enum TagType {
  Byte = "byte",
  Short = "short",
  Int = "int",
  Long = "long",
  Float = "float",
  Double = "double",
  ByteArray = "byteArray",
  String = "string",
  List = "list",
  Compound = "compound",
  IntArray = "intArray",
  LongArray = "longArray",
}

export type Tags = {
  [TagType.Byte]: { type: TagType.Byte; value: number };
  [TagType.Short]: { type: TagType.Short; value: number };
  [TagType.Int]: { type: TagType.Int; value: number };
  [TagType.Long]: { type: TagType.Long; value: [number, number] };
  [TagType.Float]: { type: TagType.Float; value: number };
  [TagType.Double]: { type: TagType.Double; value: number };
  [TagType.ByteArray]: { type: TagType.ByteArray; value: number[] };
  [TagType.String]: { type: TagType.String; value: string };
  [TagType.List]: List<TagType>;
  [TagType.Compound]: {
    type: TagType.Compound;
    value: Record<string, undefined | Tags[TagType]>;
  };
  [TagType.IntArray]: { type: TagType.IntArray; value: number[] };
  [TagType.LongArray]: { type: TagType.LongArray; value: [number, number][] };
};

export type NBTFormat = "big" | "little" | "littleVarint";

export type NBT = Tags["compound"] & { name: string };
export type Metadata = {
  // The decompressed buffer
  buffer: Buffer;
  // The length of bytes read from the buffer
  size: number;
};

export type simplifyNBT = {
  blocks: BlockEntity[];
  palette: PaletteInfo[];
};
