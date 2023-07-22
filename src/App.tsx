import { ChangeEvent, useState } from "react";

import { NbtForm, NbtRenderer } from "./sections";
import { NBT } from "./types";

function App() {
  const [nbt, setNbt] = useState<NBT | null>(null);

  function handleNbtChange(_e: ChangeEvent, nbt: NBT) {
    setNbt(nbt);
  }

  if (!nbt) {
    return <NbtForm onChange={handleNbtChange} />;
  }

  return <NbtRenderer nbt={nbt} />;
}

export default App;
