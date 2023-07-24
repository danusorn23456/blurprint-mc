export interface BoundingBoxProps {}

const BoundingBox = ({ ...rest }: BoundingBoxProps) => {
  return <div {...rest}>BoundingBox</div>;
};

export { BoundingBox };
