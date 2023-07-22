import { ChangeEvent, useState } from "react";

import { NBT, NbtForm, NbtRenderer } from "./sections";

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
