import { useLayoutEffect, useRef } from "react";
import {
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import { useBlockTexture } from ".";

export interface BlockProps {
  name: string;
  position?: number[];
}
export type BlockStatus = {
  textureLoaded: boolean;
};
const Block = ({ name, position = [0, 0, 0] }: BlockProps) => {
  const pos = new Vector3(...position);
  const meshRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null);
  const textures = useBlockTexture();

  useLayoutEffect(() => {
    const { current: mesh } = meshRef;

    if (!mesh) return;

    const textureInfo = textures.find((t) => t.name === name);

    if (textureInfo) {
      mesh.material.map = textureInfo.texture;
    }
  });

  if (name.includes("minecraft:air")) {
    return <></>;
  }

  return (
    <mesh ref={meshRef} position={pos}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial side={DoubleSide} />
    </mesh>
  );
};

export { Block };
