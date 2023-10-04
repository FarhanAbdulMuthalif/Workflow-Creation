// CustomNode.tsx
import { Handle, NodeProps, Position } from "reactflow";
import "./CustomNode.css";
import { Menu, MenuItem } from "@mui/material";
import { KeyboardEvent, useState } from "react";

const CustomNode = ({ data, id }: NodeProps) => {
  const [incomingNodes, setIncomingNodes] = useState<string[]>([]); // Initialize as an empty array
  const [outgoingNodes, setOutgoingNodes] = useState<string[]>([]); // Initialize as an empty array
  const [NodeText, setNodeText] = useState("");
  const [editNodeNameDisplay, seteditNodeNameDisplay] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(id);
    if (id === "Start" || id === "End") return;
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItemStyleTwo = {
    color: "#924E4E",
    fontSize: "12px",
    display: "flex",
    gap: "5px",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const onEnterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (editNodeNameDisplay) {
        data.editNodes(NodeText, id);
        seteditNodeNameDisplay(false);
      } else {
        data.setNodes(NodeText, id);
        setNodeText(""); // Clear the input field after setting the node name
      }
    }
  };

  return (
    <div
      className={
        data?.label === "Start" || data?.label === "End"
          ? "node-radius-circle"
          : "node-radius-box"
      }
      onContextMenu={handleClick}
      onClick={() => {
        console.log(data);

        console.log(`Incoming edges:`, incomingNodes);
        console.log(`Outgoing edges:`, outgoingNodes);
      }}
    >
      {data?.label !== "Start" ? (
        <Handle
          type="target"
          position={Position.Left}
          id="recieve"
          style={{ background: "#555" }}
          onConnect={(params) => {
            console.log(params.source);
            console.log(params);
            setIncomingNodes((prev) => {
              return [...prev, params.source || "default-source"];
            });
          }}
        />
      ) : (
        ""
      )}
      {data.label === "node" || editNodeNameDisplay ? (
        <input
          type="text"
          className="node-input"
          value={NodeText}
          onChange={(e) => {
            setNodeText(e.target.value);
          }}
          onBlur={() => seteditNodeNameDisplay(false)}
          onKeyDown={onEnterHandler}
          placeholder="Enter name"
        />
      ) : (
        <p>{data.label}</p>
      )}
      {data?.label !== "End" ? (
        <Handle
          type="source"
          position={Position.Right}
          id="set"
          style={{ background: "#555" }}
          onConnect={(params) => {
            console.log(params.target);
            console.log(params);
            setOutgoingNodes((prev) => {
              return [...prev, params.target || "default-target"];
            });
          }}
        />
      ) : (
        ""
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            seteditNodeNameDisplay(true);
            setNodeText(data.label);
          }}
          sx={menuItemStyleTwo}
        >
          Edit Name
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
          Create Rules
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
          Copy Rules
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
          Paste Rules
        </MenuItem>
        <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
          Edit Rules
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log(data);
            console.log(id);
            data.onDelete(id);
          }}
          sx={menuItemStyleTwo}
        >
          Delete Rules
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CustomNode;
