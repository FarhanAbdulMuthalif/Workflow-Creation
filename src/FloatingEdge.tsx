import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

// export const getSpecialPath = (
//   { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
//   offset: number
// ) => {
//   const centerX = (sourceX + targetX) / 2;
//   const centerY = (sourceY + targetY) / 2;

//   return `M ${sourceX} ${sourceY} Q ${centerX} ${
//     centerY + offset
//   } ${targetX} ${targetY}`;
// };

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  //   const isBiDirectionEdge = useStore((s: ReactFlowState) => {
  //     const edgeExists = s.edges.some(
  //       (e) =>
  //         (e.source === target && e.target === source) ||
  //         (e.target === source && e.source === target)
  //     );

  //     return edgeExists;
  //   });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  const [path] = getBezierPath(edgePathParams);

  // if (isBiDirectionEdge) {
  //   path = getSpecialPath(edgePathParams, sourceX < targetX ? 0 : -0);
  // } else {
  //   [path] = getBezierPath(edgePathParams);
  // }

  return (
    <BaseEdge
      path={path}
      markerEnd={markerEnd}
      style={{ strokeWidth: 1.5, stroke: "black" }}
    />
  );
}
