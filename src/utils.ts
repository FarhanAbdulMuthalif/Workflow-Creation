import { Position, MarkerType } from "reactflow";

interface Node {
  id: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
  width?: number | null | undefined;
  height?: number | null | undefined;
  positionAbsolute?: {
    x: number | null | undefined;
    y: number | null | undefined;
  };
}

// This helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: Node,
  targetNode: Node
): { x: number; y: number } {
  const intersectionNodeWidth = intersectionNode.width || 0;
  const intersectionNodeHeight = intersectionNode.height || 0;
  const intersectionNodePosition = intersectionNode.positionAbsolute || {
    x: 0,
    y: 0,
  };
  const targetPosition = targetNode.positionAbsolute || { x: 0, y: 0 };

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition?.x || 0 + w;
  const y2 = intersectionNodePosition.y || 0 + h;
  const x1 = targetPosition.x || 0 + w;
  const y1 = targetPosition.y || 0 + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// Returns the position (top, right, bottom, or left) of the passed node compared to the intersection point
function getEdgePosition(
  node: Node,
  intersectionPoint: { x: number; y: number }
): Position {
  const n = { ...node.positionAbsolute, ...node };
  const nx = Math.round(n.x || 0);
  const ny = Math.round(n.y || 0);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (node.width || 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= ny + (node.height || 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  source: Node,
  target: Node
): {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
} {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export function createNodesAndEdges() {
  const nodes: Node[] = [];
  const edges: {
    id: string;
    target: string;
    source: string;
    type: string;
    markerEnd: {
      type: MarkerType;
    };
  }[] = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const targetNode: Node = {
    id: "target",
    data: { label: "Target" },
    position: center,
    width: 100, // Provide a non-null width if available
    height: 50, // Provide a non-null height if available
    positionAbsolute: { x: center.x, y: center.y }, // Provide non-null positions if available
  };

  nodes.push(targetNode);

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = (degrees * Math.PI) / 180;
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    const sourceNode: Node = {
      id: `${i}`,
      data: { label: "Source" },
      position: { x, y },
      width: 100, // Provide a non-null width if available
      height: 50, // Provide a non-null height if available
      positionAbsolute: { x, y }, // Provide non-null positions if available
    };

    nodes.push(sourceNode);

    edges.push({
      id: `edge-${i}`,
      target: targetNode.id,
      source: sourceNode.id,
      type: "floating",
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return { nodes, edges };
}
