import { DoubleSide } from "three";

const Ground = () => {
  return (
    <mesh
      name="ground"
      rotation={[Math.PI / 2, 0, 0]}
      userData={{ cantouch: true }}
      position={[0, -0.5, 0]}
    >
      <planeGeometry args={[201, 201, 201, 201]} />
      <meshStandardMaterial side={DoubleSide} transparent opacity={0} />
      <gridHelper
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        args={[201, 201, "#dcdcdc", "#dcdcdc"]}
      />
    </mesh>
  );
};

export { Ground };
