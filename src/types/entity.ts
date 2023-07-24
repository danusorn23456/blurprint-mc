export type BlockEntity = {
  pos: number[];
  state: number;
};

export type Facing = "east" | "north" | "south" | "west";

export type PaletteInfo = {
  Name: string;
  Properties?: {
    level?: string;
    facing: Facing;
    waterlogged: boolean;
  };
};
