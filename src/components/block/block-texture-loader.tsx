import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Texture, TextureLoader } from "three";

export interface BlockTextureLoaderProps {
  names: string[];
  children: ReactNode;
}

export type TextureInfo = {
  name: string;
  texture: Texture | null;
  path: string;
};

export type TexturePathObject = Record<string, () => string>;

export type BlockTextureLoaderContext = TextureInfo[];

const BlockTextureContext = createContext<BlockTextureLoaderContext>([]);

const useBlockTexture = () => useContext(BlockTextureContext);

const BlockTextureLoader = ({ names, children }: BlockTextureLoaderProps) => {
  const [textures, setTextures] = useState<TextureInfo[]>([]);
  const loader = new TextureLoader();

  useEffect(() => {
    async function loadTextures() {
      // generate texture info
      let textures = names.reduce(
        (p, c) => [
          {
            name: c,
            texture: null,
            // relate to public folder
            path:
              "https://hatqgzzfweukesggsdck.supabase.co/storage/v1/object/public/texture/block/" +
              c.replace("minecraft:", "") +
              ".png",
          },
          ...p,
        ],
        [] as TextureInfo[]
      );

      for (let index = 0; index < textures.length; index++) {
        const currentTexture = textures[index];
        if (currentTexture.name === "minecraft:air") continue;
        const { path } = currentTexture;

        await new Promise((res) => {
          loader.load(
            path,
            (texture: Texture) => {
              textures[index].texture = texture;
              res("successfuly");
            },
            undefined,
            () => res("!path not found")
          );
        });
      }

      setTextures(textures);
    }

    if (names?.length) {
      loadTextures();
    }
  }, [names]);

  if (textures.every((texture) => !texture.texture) || !textures?.length) {
    console.log("loading texture");
    return <></>;
  } else {
    console.log("loading texture success");
  }

  return (
    <BlockTextureContext.Provider value={textures}>
      {children}
    </BlockTextureContext.Provider>
  );
};

export { BlockTextureLoader, useBlockTexture };
