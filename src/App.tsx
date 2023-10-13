import {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  createContext,
} from "react";
import ReactFlow, {
  useNodesState,
  MarkerType,
  Panel,
  OnConnect,
  ReactFlowInstance,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Node,
  Edge,
} from "reactflow";

import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import "./App.css";
import CustomEdge from "./FloatingEdge";
type ComplexObject = {
  incoming: string[];
  outgoing: string[];
};

export const FlowContext = createContext<ComplexObject>({
  incoming: [],
  outgoing: [],
});
export default function App() {
  // The context is created with `| null` in the type, to accurately reflect the default value.
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowContainerRef = useRef<HTMLDivElement | null>(null);
  const [SelectedId, setSelectedId] = useState({ id: "", name: "" });
  const [SelectedData, setSelectedData] = useState<{
    incoming: string[];
    outgoing: string[];
  }>({ incoming: [], outgoing: [] });

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
        getData: getDataHandler,
        edges: edges,
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
        getData: getDataHandler,
        edges: edges,
      },
    },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  function getDataHandler(nodeId: string, nodeName: string) {
    setSelectedId({ id: nodeId, name: nodeName });
  }
  useEffect(() => {
    function getSelectHandler() {
      const incomingNodesMap = new Map<string, string[]>();
      const outgoingNodesMap = new Map<string, string[]>();

      edges.forEach((edge) => {
        const { source, target } = edge;
        if (!incomingNodesMap.has(target)) {
          incomingNodesMap.set(target, [source]);
        } else {
          incomingNodesMap.get(target)!.push(source);
        }

        if (!outgoingNodesMap.has(source)) {
          outgoingNodesMap.set(source, [target]);
        } else {
          outgoingNodesMap.get(source)!.push(target);
        }
      });
      const incomingEdge = incomingNodesMap.get(SelectedId.id);
      const outgoingEdge = outgoingNodesMap.get(SelectedId.id);
      console.log("+++++++incoming+++++++");
      console.log(incomingEdge);
      console.log("+++++++outgoing+++++++");
      console.log(outgoingEdge);
      // Create a new array with labels based on the matching id
      const labelsOutgoingArray = outgoingEdge?.map((id) => {
        const node = nodes.find((node) => node.id === id);
        return node ? node.data.label : ""; // Use null if no matching id is found
      });
      const labelsIncoingArray = incomingEdge?.map((id) => {
        const node = nodes.find((node) => node.id === id);
        return node ? node.data.label : ""; // Use null if no matching id is found
      });

      console.log(labelsOutgoingArray);
      console.log(labelsIncoingArray);
      setSelectedData({
        incoming: labelsIncoingArray ?? [],
        outgoing: labelsOutgoingArray ?? [],
      });
    }
    getSelectHandler();
  }, [SelectedId, edges, nodes]);

  // const buildConnectedNodes = () => {
  //   const incomingNodesMap = new Map<string, string[]>();
  //   const outgoingNodesMap = new Map<string, string[]>();

  //   edges.forEach((edge) => {
  //     const { source, target } = edge;
  //     if (!incomingNodesMap.has(target)) {
  //       incomingNodesMap.set(target, [source]);
  //     } else {
  //       incomingNodesMap.get(target)!.push(source);
  //     }

  //     if (!outgoingNodesMap.has(source)) {
  //       outgoingNodesMap.set(source, [target]);
  //     } else {
  //       outgoingNodesMap.get(source)!.push(target);
  //     }
  //   });

  //   return { incomingNodes: incomingNodesMap, outgoingNodes: outgoingNodesMap };
  // };

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

  const onRestore = () => {
    const flow = JSON.parse(localStorage.getItem("prosol") ?? "");

    if (flow) {
      if (flow.nodes && flow.edges) {
        // Provide default or placeholder functions for onDelete, setNodes, and editNodes
        const restoredNodes = flow.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: onDeleteNode, // Placeholder function
            setNodes: nodeNameCreateHandler, // Placeholder function
            editNodes: editNodeNameHandler, // Placeholder function
            getData: getDataHandler, // Placeholder function

            edges: edges,
            nodes: nodes,
          },
        }));

        setNodes(restoredNodes);
        setEdges(flow.edges);
        rfInstance?.fitView();
      }
    }
  };

  const onConnect: OnConnect = (params) => {
    setEdges((prevEdges) => [
      ...prevEdges,
      {
        id: Math.random().toString() || "",
        source: params.source ?? "",
        target: params.target ?? "",
        sourceHandle: params.sourceHandle ?? "default", // provide a default handle
        targetHandle: params.targetHandle ?? "default", // provide a default handle
        type: "textUpdater",
        markerEnd: { type: MarkerType.ArrowClosed, color: "black" },
      },
    ]);

    console.log(
      `Connected from node ${params.source} to node ${params.target}`
    );
  };
  const nodeTypes = useMemo(() => ({ textUpdater: CustomNode }), []);
  const defaultEdgeOptions = {
    style: { strokeWidth: 1.5, stroke: "black" },
    type: "textUpdater",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  };
  const edgeTypes = {
    textUpdater: CustomEdge,
  };

  const proOptions = { hideAttribution: true };
  const handleLoad = (reactFlowInstance: ReactFlowInstance) => {
    console.log(edges);
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
          edges: edges,
          nodes: nodes,
          editNodes: editNodeNameHandler,
          getData: getDataHandler,
        },
      };
      setNodes((prev) => [...prev, newNode]);
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLParagraphElement>) => {
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <FlowContext.Provider value={SelectedData}>
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
            <>
              {SelectedId.id.length > 0 ? (
                <div>
                  <div className="SelectedNode">
                    <p className="labelSel">Selected Node:</p>
                    <p>{SelectedId.name.toUpperCase()} NODE</p>
                  </div>
                  <div className="SelectedNode">
                    <p className="labelSel">Incoming Node:</p>
                    <p>
                      {SelectedData.incoming.length < 1
                        ? "No Nodes"
                        : SelectedData?.incoming.join(" Node, ")}{" "}
                      {SelectedData?.incoming.length < 1 ? "" : "Node"}
                    </p>
                  </div>
                  <div className="SelectedNode">
                    <p className="labelSel">Outgoing Node:</p>
                    <p>
                      {SelectedData?.outgoing.length < 1
                        ? "No Nodes"
                        : SelectedData?.outgoing.join(" Node, ")}
                      {SelectedData?.outgoing.length < 1 ? "" : " Node"}
                    </p>
                  </div>
                </div>
              ) : (
                <p>no nodes selected</p>
              )}
            </>
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
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              proOptions={proOptions}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onInit={handleLoad} //
              fitView
              attributionPosition="top-right"
              connectionMode={ConnectionMode.Loose}
            >
              <Background color="#ccc" variant={BackgroundVariant.Dots} />
              <Controls
                style={{ display: "flex", flexDirection: "column", gap: "1px" }}
              />
              <Panel
                position="top-right"
                style={{ display: "flex", gap: "8px" }}
              >
                <button onClick={onSave}>Save</button>
                <button onClick={onRestore}>Restore</button>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </ReactFlowProvider>
    </FlowContext.Provider>
  );
}
