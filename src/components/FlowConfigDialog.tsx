import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
interface DialogProps {
  open: boolean;
  handleClose: () => void;
  handleOk: () => void;
  content: string;
}
export default function FlowConfigDialog({
  open,
  handleClose,
  content,
  handleOk,
}: DialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{content}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          this may affect your records in the database and the workflow
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button onClick={handleOk} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
