import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ComponentType } from "react";
import { Block, BlockTextureLoader } from "~/components";
import { NBT, TagType } from "~/types";

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
      <scene>
        <camera>
          <ambientLight intensity={0.4} />
          <Component />
        </camera>
        <CameraControls makeDefault />
      </scene>
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
    const maxHeight = Math.max(...blocks.map((b) => b.pos[1])) || 0;

    return (
      <BlockTextureLoader names={palette.map((p) => p.Name)}>
        {blocks && (
          <group
            position={[-maxWidth / 2, -maxHeight / 2, -maxWidth]}
            rotation={[0, 0, 0]}
          >
            {blocks.map((block, index) => (
              <Block
                key={index}
                name={palette[block.state].Name}
                position={block.pos}
              />
            ))}
          </group>
        )}
      </BlockTextureLoader>
    );
  });

export { NbtRenderer };
