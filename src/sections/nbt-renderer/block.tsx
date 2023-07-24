import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { BlockEntity, Facing, PaletteInfo } from "~/types";

export interface BlockProps {
  block: BlockEntity;
  palette: PaletteInfo;
}

export type BlockStatus = {
  textureLoaded: boolean;
};

function getTexturePath(name: string): string | null {
  if (["bed", "air"].some((t) => name.includes(t))) {
    return null;
  }

  let simplifyName = name.replace(/minecraft:|_wall|_slab/g, "");

  if (simplifyName.includes("_carpet")) {
    simplifyName = simplifyName.replace("_carpet", "_wool");
  }

  if (simplifyName.includes("_sign")) {
    simplifyName = simplifyName.replace("_sign", "_planks");
  }

  let path = `https://hatqgzzfweukesggsdck.supabase.co/storage/v1/object/public/texture/block/${simplifyName}.png`;

  return path;
}

function ajustBlockSize(palette: PaletteInfo) {
  const { Name: name } = palette;
  let args: [width: number, height: number, depth: number] = [1, 1, 1];

  if (["bed", "slab"].some((type) => palette.Name.includes(type))) {
    args[1] = 0.5;
  } else if (name.includes("_carpet")) {
    args[1] = 0.0625;
  } else if (palette.Name.includes("_sign")) {
    if (["east", "west"].some((dir) => dir === palette.Properties?.facing)) {
      args[0] = 0.0625;
    } else {
      args[2] = 0.0625;
    }
    args[1] = 0.6;
  }
  if (palette.Properties?.level) {
    args[1] = [1, 0.75, 0.65, 0.55, 0.45, 0.35, 0.35, 0.15][
      +palette.Properties.level
    ];
  }

  return args;
}

function getBlockPosition(
  block: BlockEntity,
  args: [number, number, number],
  facing?: Facing
) {
  let position = block.pos as [number, number, number];
  if (facing) {
  }
  if (args[1] < 1) {
    if (facing) {
      if (["east", "west"].some((dir) => dir === facing)) {
        position[0] += (1 - args[0]) / 2;
      } else {
        position[2] -= (1 - args[2]) / 2;
      }
    } else {
      position[1] -= (1 - args[1]) / 2;
    }
  }
  return position;
}

function getBlockOpacity(palette: PaletteInfo) {
  if (palette.Name.includes("air")) {
    return 0;
  } else if (palette.Name.includes("water")) {
    return 0.5;
  }
  return 1;
}

const Block = ({ block, palette }: BlockProps) => {
  const meshRef = useRef<Mesh<BoxGeometry, MeshStandardMaterial>>(null);

  const opacity = getBlockOpacity(palette);
  const args = ajustBlockSize(palette);
  const position = getBlockPosition(block, args, palette.Properties?.facing);
  const texturePath = getTexturePath(palette.Name);
  const textureMap = texturePath ? useLoader(TextureLoader, texturePath) : null;

  if (palette.Name === "minecraft:air") {
    return <></>;
  }

  return (
    <>
      <mesh ref={meshRef} position={position} userData={block}>
        <boxGeometry args={args} />
        <meshStandardMaterial opacity={opacity} transparent map={textureMap} />
      </mesh>
    </>
  );
};

export { Block };
