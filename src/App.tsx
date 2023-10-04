import { useCallback, useMemo, useState, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  OnConnect,
  ReactFlowInstance,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";

import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import "./App.css";

const initialEdges = [{ id: "e1-2", source: "Start", target: "Level 1" }];

export default function App() {
  // const [InputText, setInputText] = useState("");
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowContainerRef = useRef<HTMLDivElement | null>(null);

  const initialNodes = [
    {
      id: "Start",
      type: "textUpdater",
      position: { x: 50, y: 200 },
      data: {
        label: "Start",
        onDelete: onDeleteNode,
        setNodes: nodeNameCreateHandler,
        editNodes: editNodeNameHandler,
      },
    },
    {
      id: "End",
      type: "textUpdater",
      position: { x: 720, y: 200 },
      data: {
        label: "End",
        onDelete: onDeleteNode,
        setNodes: nodeNameCreateHandler,
        editNodes: editNodeNameHandler,
      },
    },
    {
      id: "Level 1",
      type: "textUpdater",
      position: { x: 200, y: 200 },
      data: {
        label: "Level 1",
        onDelete: onDeleteNode,
        setNodes: nodeNameCreateHandler,
        editNodes: editNodeNameHandler,
      },
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  function onDeleteNode(nodeId: string) {
    console.log(nodes);
    console.log(nodes.filter((node) => node.id !== nodeId));
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }
  function nodeNameCreateHandler(data: string, id: string) {
    const nodeIndexToUpdate = nodes.findIndex(
      (node: { id: string }) => node.id === id
    );
    console.log("printing...");
    console.log(nodeIndexToUpdate);
    console.log(nodes);
    console.log(id);
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === id) {
          // If the node ID matches the target ID, update its data
          return {
            ...node,
            data: {
              ...node.data,
              label: data,
            },
          };
        }
        return node;
      });
    });
  }
  function editNodeNameHandler(name: string, id: string) {
    console.log("id=" + id);
    console.log("name=" + name);
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === id) {
          // If the node ID matches the target ID, update its data
          return {
            ...node,
            data: {
              ...node.data,
              label: name,
            },
          };
        }
        return node;
      });
    });
  }

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

  // const AddHandler = () => {
  //   if (!InputText) return;
  //   if (nodes.find((data) => data.data.label === InputText))
  //     return alert("please enter different text");
  //   setInputText("");
  //   setNodes((prev) => [
  //     ...prev,
  //     {
  //       id: InputText,
  //       type: "textUpdater",
  //       position: { x: 300, y: 10 },
  //       data: { label: InputText, onDelete: onDeleteNode },
  //     },
  //   ]);
  // };
  const proOptions = { hideAttribution: true };
  const handleLoad = (reactFlowInstance: ReactFlowInstance) => {
    setRfInstance(reactFlowInstance);
  };
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;

    if (reactFlowContainerRef.current) {
      const reactFlowBounds =
        reactFlowContainerRef.current.getBoundingClientRect();
      const positionX = x - reactFlowBounds.left;
      const positionY = y - reactFlowBounds.top;

      const newNode = {
        id: Math.random().toString(),
        type: "textUpdater",
        position: { x: positionX, y: positionY },
        data: {
          label: "node",
          onDelete: onDeleteNode,
          setNodes: nodeNameCreateHandler,
          nodes: nodes,
          editNodes: editNodeNameHandler,
        },
      };
      setNodes((prev) => [...prev, newNode]);
    }
  };

  // const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();

  //   const newNode = {
  //     id: Math.random().toString(),
  //     type: "textUpdater",
  //     position: { x: 330, y: 40 },
  //     data: {
  //       label: "node",
  //       onDelete: onDeleteNode,
  //       setNodes: nodeNameCreateHandler,
  //       nodes: nodes,
  //       editNodes: editNodeNameHandler,
  //     },
  //   };
  //   setNodes((prev) => [...prev, newNode]);
  // };
  const onDragStart = (event: React.DragEvent<HTMLParagraphElement>) => {
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <ReactFlowProvider>
      <div
        className="wrapper"
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="addModuleWrapper">
          {/* <input
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
          </button> */}
          <p
            className="draggbleNode"
            onDragStart={(event) => onDragStart(event)}
            draggable
          >
            ADD NODE +
          </p>
        </div>

        <div
          style={{
            width: "80vw",
            height: "90vh",
            backgroundColor: "#E9E9F7",
            transition: "all 300s ease",
          }}
          id="reactflow-container" // Give it a unique ID
          ref={reactFlowContainerRef}
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
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onInit={handleLoad} //
          >
            <Background color="#ccc" variant={BackgroundVariant.Dots} />
            <Controls
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            />
            <Panel position="top-right" style={{ display: "flex", gap: "8px" }}>
              <button onClick={onSave}>Save</button>
              <button onClick={onRestore}>Restore</button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
