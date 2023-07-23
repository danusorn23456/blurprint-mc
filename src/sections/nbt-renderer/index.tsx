import { Canvas } from "@react-three/fiber";
import { ComponentType } from "react";
import { Block, BlockTextureLoader } from "~/components";
import { NBT, TagType } from "~/types";
import { Cursor } from "./cursor";
import { Ground } from "./ground";
import { Control } from "./control";

export type BlockInfo = {
  pos: number[];
  state: number;
};

export type PaletteInfo = {
  Name: string;
};

export type simplifyNBT = {
  blocks: BlockInfo[];
  palette: PaletteInfo[];
};

export interface NbtRendererProps {
  nbt: NBT;
}

const NbtCanvas = (Component: ComponentType) => {
  return (
    <Canvas>
      <Component />
    </Canvas>
  );
};

function simplify(data: NBT): simplifyNBT {
  function transform(value: any, type: TagType) {
    if (type === "compound") {
      return Object.keys(value).reduce(function (
        acc: Record<string, any>,
        key
      ) {
        acc[key] = simplify(value[key]);
        return acc;
      },
      {});
    }
    if (type === "list") {
      return value.value.map(function (v: any) {
        return transform(v, value.type);
      });
    }
    return value;
  }
  return transform(data.value, data.type);
}

const NbtRenderer = ({ nbt }: NbtRendererProps) =>
  NbtCanvas(() => {
    const { blocks, palette } = simplify(nbt);

    const maxWidth = Math.max(...blocks.map((b) => b.pos[0])) || 0;
    // const maxHeight = Math.max(...blocks.map((b) => b.pos[1])) || 0;

    return (
      <>
        <Control position={[0, 0, -maxWidth]} />
        <scene>
          <ambientLight intensity={0.4} />
          <camera>
            <BlockTextureLoader names={palette.map((p) => p.Name)}>
              {blocks &&
                blocks.map((block, index) => (
                  <Block
                    key={index}
                    name={palette[block.state].Name}
                    position={block.pos}
                  />
                ))}
            </BlockTextureLoader>
            <Ground />
            <Cursor />
          </camera>
        </scene>
      </>
    );
  });

export { NbtRenderer };
