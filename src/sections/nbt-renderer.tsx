import { Canvas, useThree } from "@react-three/fiber";
import { NBT, Tags, simplify } from "prismarine-nbt";
import { ComponentType, useLayoutEffect, useMemo } from "react";
import { Block, BlockTextureLoader } from "~/components";

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
      </scene>
    </Canvas>
  );
};

export type BlockInfo = {
  pos: Tags["intArray"]["value"];
  state: Tags["short"]["value"];
};

export type PaletteInfo = {
  Name: Tags["string"]["value"];
};

export type SimplifyNbt = {
  blocks?: BlockInfo[];
  palette?: PaletteInfo[];
};

const NbtRenderer = ({ nbt }: NbtRendererProps) =>
  NbtCanvas(() => {
    const { camera } = useThree();
    const simplifyNbt = useMemo(() => {
      return simplify(nbt) as SimplifyNbt;
    }, [nbt]);

    const { blocks = [], palette = [] } = simplifyNbt;

    const maxWidth = Math.max(...blocks.map((b) => b.pos[0])) || 0;
    const maxHeight = Math.max(...blocks.map((b) => b.pos[1])) || 0;

    useLayoutEffect(() => {
      camera.position.set(maxWidth / 2, maxHeight / 2, maxWidth);
    }, []);

    return (
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
    );
  });

export { NbtRenderer };
