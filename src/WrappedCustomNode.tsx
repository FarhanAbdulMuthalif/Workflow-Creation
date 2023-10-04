import CustomNode from "./CustomNode";
import { NodeProps } from "reactflow"; // Import the NodeProps type

const WrappedCustomNode = (
  props: NodeProps & { onDelete: (nodeId: string) => void }
) => {
  return <CustomNode {...props} />;
};

export default WrappedCustomNode;
