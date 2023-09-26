// BasicFlow.tsx
import React, { useCallback } from "react";
import ReactFlow, { addEdge, Background } from "reactflow";
import CustomNode from "./CustomNode";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 50, y: 30 },
  },
  { id: "2", data: { label: "Node 2" }, position: { x: 250, y: 5 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 250, y: 50 } },
  {
    id: "5",
    data: {
      label: "Node 4",
      ports: {
        left: { id: "left-port", type: "left" },
        right: { id: "right-port", type: "right" },
      },
    },
    position: { x: 450, y: 50 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "2", target: "5" },
];

const nodeTypes = {
  custom: CustomNode,
};

const BasicFlow = () => {
  const [edges, setEdges] = React.useState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((prevEdges) => addEdge(params, prevEdges)),
    []
  );

  return (
    <ReactFlow
      elements={initialNodes.concat(edges)}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      style={{ width: "100%", height: "500px" }}
    >
      <Background />
    </ReactFlow>
  );
};

export default BasicFlow;
