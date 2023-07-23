import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  BoxGeometry,
  Intersection,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";

function Cursor() {
  const intersectsRef = useRef<Intersection<Object3D<Event>>[]>();
  const cursorRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null);
  const timeRef = useRef(0);
  useFrame(({ raycaster, camera, mouse, scene }) => {
    const { current: intersects } = intersectsRef;
    const { current: cursor } = cursorRef;

    if (!cursor) return;

    //blink animation
    const v = Math.sin(timeRef.current);
    cursor.material.opacity = Math.abs(v) / 2;
    timeRef.current += 0.1;
    //raycast
    raycaster.setFromCamera(mouse, camera);
    intersectsRef.current = raycaster.intersectObjects(scene.children);

    const intersect = intersects?.find((i) => i.object.name !== "cursor");

    if (intersect) {
      const isGround = intersect.object.name === "ground";

      const position = new Vector3().copy(intersect.point).round();

      if (isGround) {
      } else if (intersect.face) {
        position.copy(intersect.object.position);
        position.add(intersect.face.normal);
      }

      position.y = Math.max(0, position.y);

      cursor.position.copy(position);
    }
  });

  return (
    <mesh name="cursor" ref={cursorRef}>
      <boxGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0.3} color={"black"} />
    </mesh>
  );
}

export { Cursor };
