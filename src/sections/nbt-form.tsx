import axios from "axios";
import { NBT } from "prismarine-nbt";
import { ChangeEvent } from "react";

export interface NbtFormProps {
  onChange: (e: ChangeEvent<HTMLInputElement>, nbt: NBT) => void;
}

const NbtForm = ({ onChange }: NbtFormProps) => {
  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];
    if (!file) return console.error("file not found");

    const formData = new FormData();
    formData.append("nbt_file", file, file.name);

    const parsedNbt = await axios
      .post("https://blueprint-mc-api.onrender.com/upload", formData)
      .then((res) => res.data);

    onChange?.(e, parsedNbt);
  }

  return (
    <form>
      <input type="file" accept="nbt" onChange={handleChange} />
    </form>
  );
};

export { NbtForm };
