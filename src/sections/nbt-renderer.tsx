import { Canvas, useThree } from "@react-three/fiber";

import { ComponentType, useLayoutEffect } from "react";
import { Block, BlockTextureLoader } from "~/components";

export type BlockInfo = {
  value: {
    pos: number[];
    state: number;
  };
};

export type PaletteInfo = {
  value: {
    Name: string;
  };
};

export type NBT = {
  value: {
    blocks: {
      value: BlockInfo[];
    };
    palette: {
      value: PaletteInfo[];
    };
  };
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
      </scene>
    </Canvas>
  );
};

const NbtRenderer = ({ nbt }: NbtRendererProps) =>
  NbtCanvas(() => {
    const { camera } = useThree();

    const { blocks, palette } = nbt.value;

    const maxWidth = Math.max(...blocks.value.map((b) => b.value.pos[0])) || 0;
    const maxHeight = Math.max(...blocks.value.map((b) => b.value.pos[1])) || 0;

    useLayoutEffect(() => {
      camera.position.set(maxWidth / 2, maxHeight / 2, maxWidth);
    }, []);

    return (
      <BlockTextureLoader names={palette.value.map((p) => p.value.Name)}>
        {blocks &&
          blocks.value.map((block, index) => (
            <Block
              key={index}
              name={palette.value[block.value.state].value.Name}
              position={block.value.pos}
            />
          ))}
      </BlockTextureLoader>
    );
  });

export { NbtRenderer };
