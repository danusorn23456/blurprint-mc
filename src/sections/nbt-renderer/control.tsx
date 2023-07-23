import { CameraControls, PointerLockControls } from "@react-three/drei";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";

export interface ControlProps {
  position: number[];
}

const Control = ({ position }: ControlProps) => {
  const keyPressRef = useRef<Record<string, boolean>>({});

  const pointerLockControlsRef = useRef<PointerLockControlsImpl>(null);
  const cameraControlRef = useRef<CameraControls>(null);

  const [x, y, z] = position;

  useLayoutEffect(() => {
    cameraControlRef.current?.setPosition(x, y, z);
    function toggleKeyPress(e: KeyboardEvent, status = false) {
      keyPressRef.current[e.code] = status;
    }
    window.addEventListener("keydown", (e) => toggleKeyPress(e, true));
    window.addEventListener("keyup", (e) => toggleKeyPress(e, false));

    return () => {
      window.addEventListener("keydown", (e) => toggleKeyPress(e, true));
      window.removeEventListener("keyup", (e) => toggleKeyPress(e, false));
    };
  });

  useFrame(() => {
    const { current: keyPress } = keyPressRef;
    const { current: pointerLockControls } = pointerLockControlsRef;
    const pressedSpace = keyPress?.["Space"];
    const pressedShiftLeft = keyPress?.["ShiftLeft"];
    const pressedA = keyPress?.["KeyA"];
    const pressedD = keyPress?.["KeyD"];
    const pressedW = keyPress?.["KeyW"];
    const pressedS = keyPress?.["KeyS"];

    if (!pointerLockControls) return;

    const speed = 0.2;

    const { y } = pointerLockControls.camera.position;

    if (pressedSpace || pressedShiftLeft) {
      pointerLockControls.camera.position.setY(
        y + (pressedSpace ? +speed : -speed)
      );
    }

    if (pressedA || pressedD) {
      pointerLockControls.moveRight(pressedD ? +speed : -speed);
    }

    if (pressedW || pressedS) {
      pointerLockControls.moveForward(pressedW ? +speed : -speed);
    }
  });

  return (
    <>
      <PointerLockControls ref={pointerLockControlsRef} />
    </>
  );
};

export { Control };
