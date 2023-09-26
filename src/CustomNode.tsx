// // CustomNode.tsx
// import { Handle, NodeProps, Position } from "reactflow";
// import "./CustomNode.css";
// import { Menu, MenuItem } from "@mui/material";
// import { useState } from "react";

// // type CustomHandleProps = {
// //   id: string;
// //   type: string;
// //   position: string; // Explicitly set the position as a string
// // };

// const CustomNode = ({ data }: NodeProps) => {
//   const [incomingNodes, setIncomingNodes] = useState<string[] | null>([]);
//   const [outgoingNodes, setOutgoingNodes] = useState<string[] | null>([]);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   const menuItemStyleTwo = {
//     color: "#924E4E",
//     fontSize: "12px",
//     display: "flex",
//     gap: "5px",
//     justifyContent: "space-between",
//     alignItems: "center",
//   };
//   return (
//     <div
//       className={
//         data?.label === "Start" || data?.label === "End"
//           ? "node-radius-circle"
//           : "node-radius-box"
//       }
//       onContextMenu={handleClick}
//       onClick={() => {
//         console.log(data);

//         console.log(`Incoming edges:`, incomingNodes);
//         console.log(`Outgoing edges:`, outgoingNodes);
//       }}
//     >
//       {data?.label !== "Start" ? (
//         <Handle
//           type="target"
//           position={Position.Left}
//           id="recieve"
//           style={{ background: "#555" }}
//           onConnect={(params) =>  setIncomingNodes([...incomingNodes , params.source])}
//         />
//       ) : (
//         ""
//       )}
//       {data.label}
//       {data?.label !== "End" ? (
//         <Handle
//           type="source"
//           position={Position.Right}
//           id="set"
//           style={{ background: "#555" }}
//           onConnect={(params) =>setOutgoingNodes([...outgoingNodes, params.target])}
//         />
//       ) : (
//         ""
//       )}
//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "basic-button",
//         }}
//       >
//         <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
//           Create Rules
//         </MenuItem>
//         <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
//           Copy Rules
//         </MenuItem>
//         <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
//           Paste Rules
//         </MenuItem>
//         <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
//           Edit Rules
//         </MenuItem>
//         <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
//           Delete Rules
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// };

// export default CustomNode;
// CustomNode.tsx
import { Handle, NodeProps, Position } from "reactflow";
import "./CustomNode.css";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const CustomNode = ({ data }: NodeProps) => {
  const [incomingNodes, setIncomingNodes] = useState<string[]>([]); // Initialize as an empty array
  const [outgoingNodes, setOutgoingNodes] = useState<string[]>([]); // Initialize as an empty array
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
      {data.label}
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
        <MenuItem onClick={handleClose} sx={menuItemStyleTwo}>
          Delete Rules
        </MenuItem>
      </Menu>
    </div>
  );
};

export default CustomNode;
