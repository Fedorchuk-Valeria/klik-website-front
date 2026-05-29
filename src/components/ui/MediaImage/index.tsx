import Image, { type ImageProps } from "next/image";
import { FC } from "react";

import { normalizeMediaUrl } from "@/src/utils/normalizeMediaUrl";

type MediaImageProps = Omit<ImageProps, "src" | "unoptimized"> & {
  src: string;
};

const MediaImage: FC<MediaImageProps> = ({ src, ...props }) => {
  return <Image {...props} src={normalizeMediaUrl(src)} unoptimized />;
};

export default MediaImage;
