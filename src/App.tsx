import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  OnConnect,
  ReactFlowInstance,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import "./App.css";

const initialNodes = [
  {
    id: "Start",
    type: "textUpdater",
    position: { x: 20, y: 70 },
    data: { label: "Start" },
  },
  {
    id: "End",
    type: "textUpdater",
    position: { x: 720, y: 70 },
    data: { label: "End" },
  },
  {
    id: "Level 1",
    type: "textUpdater",
    position: { x: 200, y: 70 },
    data: { label: "Level 1" },
  },
];
const initialEdges = [{ id: "e1-2", source: "Start", target: "Level 1" }];

export default function App() {
  const [InputText, setInputText] = useState("");
  const [AddFlowShow, setAddFlowShow] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance?.toObject();
      console.log(flow);
      console.log(rfInstance);
      localStorage.setItem("prosol", JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem("prosol") || "");

      if (flow) {
        // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        rfInstance?.fitView();
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, rfInstance]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      console.log(
        `Connected from node ${params.source} to node ${params.target}`
      );
      console.log(params);
    },
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ textUpdater: CustomNode }), []);
  const defaultEdgeOptions = {
    style: { strokeWidth: 1.5, stroke: "black" },
    type: "floating",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  };
  const AddHandler = () => {
    if (!InputText) return;
    if (nodes.find((data) => data.data.label === InputText))
      return alert("please enter different text");
    setInputText("");
    setNodes((prev) => [
      ...prev,
      {
        id: InputText,
        type: "textUpdater",
        position: { x: 100, y: 10 },
        data: { label: InputText },
      },
    ]);
  };
  const proOptions = { hideAttribution: true };
  const handleLoad = (reactFlowInstance: ReactFlowInstance) => {
    setRfInstance(reactFlowInstance);
  };
  return (
    <ReactFlowProvider>
      <div
        className="wrapper"
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {AddFlowShow ? (
          <div className="addModuleWrapper">
            <input
              type="text"
              className="input-inside"
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={InputText}
              placeholder="Enter Name"
            />
            <button className="inside-button" onClick={AddHandler}>
              Submit
            </button>
          </div>
        ) : (
          ""
        )}
        <div
          style={{
            width: "800px",
            height: "200px",
            backgroundColor: "#E9E9F7",
            transition: "all 300s ease",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            proOptions={proOptions}
            onInit={handleLoad} //
          >
            <Panel position="top-left" style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={() => {
                  setAddFlowShow(!AddFlowShow);
                }}
              >
                Add new {AddFlowShow ? "X" : "+"}
              </button>
              <button onClick={onSave}>save</button>
              <button onClick={onRestore}>Restore</button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
