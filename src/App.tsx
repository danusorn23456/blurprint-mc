import { ChangeEvent, useState } from "react";

import { NBT } from "prismarine-nbt";
import { NbtForm, NbtRenderer } from "./sections";

function App() {
  const [nbt, setNbt] = useState<NBT | null>(null);

  function handleNbtChange(e: ChangeEvent, nbt: NBT) {
    setNbt(nbt);
  }

  if (!nbt) {
    return <NbtForm onChange={handleNbtChange} />;
  }

  return <NbtRenderer nbt={nbt} />;
}

export default App;
