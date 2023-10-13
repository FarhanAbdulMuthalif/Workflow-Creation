import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import "./FlowCongigDialog.css";
import { FlowContext } from "../App";
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
  const [value, setvalue] = useState("levelConfig");
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setvalue(newValue);
  };
  const contextData = useContext(FlowContext);
  const { outgoing, incoming } = contextData;
  const menuItemStyle = {
    fontSize: "12px",
    color: "#5E5873",
  };

  const SelectStyle = {
    fontSize: "12px",
    color: "brown",

    height: "2.4rem",
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        id="alert-dialog-title"
        sx={{ borderBottom: "1px solid rgba(0, 0, 255, 0.1) " }}
      >
        {content} Configration
      </DialogTitle>
      <DialogContent
        sx={{
          width: "36rem",
          height: "25rem",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            marginBottom: "5px",
            borderBottom: ".5px solid #888E94",
          }}
        >
          <Tab
            sx={{ backgroundColor: "transparent" }}
            label="Form setup"
            value="levelConfig"
          />
          <Tab label="Email Config" value="emailConfig" />
        </Tabs>
        {value === "levelConfig" ? (
          <>
            <div className="input-wrapper-div">
              <label
                htmlFor="SelectRoleOnConfig"
                className="input-wrapper-label"
              >
                Select Role :
              </label>
              <Select
                id="SelectRoleOnConfig"
                sx={SelectStyle}
                fullWidth
                displayEmpty
              >
                <MenuItem sx={menuItemStyle} value="" disabled>
                  Select Field
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"requester"}>
                  Requester
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"approver"}>
                  Approver
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"cataloguer"}>
                  Cataloguer
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"reviewer"}>
                  Reviewer
                </MenuItem>
              </Select>
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SelectFormOnConfig"
                className="input-wrapper-label"
              >
                Select Form :
              </label>
              <Select
                id="SelectFormOnConfig"
                sx={SelectStyle}
                fullWidth
                displayEmpty
              >
                <MenuItem sx={menuItemStyle} value="" disabled>
                  Select Field
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"requester Form"}>
                  Requester Form
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"approver Form"}>
                  Approver Form
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"cataloguer Form"}>
                  Cataloguer Form
                </MenuItem>
                <MenuItem sx={menuItemStyle} value={"reviewer Form"}>
                  Reviewer Form
                </MenuItem>
              </Select>
            </div>
            <div className="input-wrapper-div">
              <label htmlFor="SetRoleOnConfig" className="input-wrapper-label">
                Set Rule :
              </label>
              <TextField
                id="SetRoleOnConfig"
                placeholder="Enter Rule"
                className="input-wrapper-input"
                size="small"
                fullWidth
              />
            </div>
            <div className="input-wrapper-div">
              <label htmlFor="SetLevelOnConfig" className="input-wrapper-label">
                Select Next Level :
              </label>
              <FormGroup aria-label="position" row>
                {outgoing.map((data: string) => {
                  return (
                    <FormControlLabel
                      value={data}
                      control={<Checkbox size="small" />}
                      key={data}
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.875rem",
                            margin: "0 ",
                          }}
                        >
                          {data}
                        </Typography>
                      }
                    />
                  );
                })}
              </FormGroup>
            </div>
          </>
        ) : (
          <>
            <section
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                gap: "5px",
                margin: "10px 0",
              }}
            >
              <label
                htmlFor="SelectEmailTemplateTo"
                style={{ fontSize: "14px" }}
              >
                Select email to :
                <Select
                  id="SelectEmailTemplateTo"
                  name="toText"
                  // sx={{ width: "8rem" }}
                  fullWidth
                  size="small"
                >
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value=""
                  >
                    Select Field
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="approver"
                  >
                    Approver
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="cataloger"
                  >
                    Cataloger
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="requester"
                  >
                    Requester
                  </MenuItem>
                </Select>
              </label>
              <label
                htmlFor="SelectEmailTemplateCC"
                style={{ fontSize: "14px" }}
              >
                Select email cc :
                <Select
                  id="SelectEmailTemplateCC"
                  name="ccText"
                  fullWidth
                  size="small"
                  // sx={{ width: "8rem" }}
                >
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value=""
                  >
                    Select Field
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="approver"
                  >
                    Approver
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="cataloger"
                  >
                    Cataloger
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="requester"
                  >
                    Requester
                  </MenuItem>
                </Select>
              </label>
              <label
                htmlFor="SelectEmailTemplateBCC"
                style={{ fontSize: "14px" }}
              >
                Select email bcc :
                <Select
                  id="SelectEmailTemplateBCC"
                  name="bccText"
                  size="small"
                  // sx={{ width: "8rem" }}
                  fullWidth
                >
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value=""
                  >
                    Select Field
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="approver"
                  >
                    Approver
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="cataloger"
                  >
                    Cataloger
                  </MenuItem>
                  <MenuItem
                    sx={{ fontSize: "12px", color: "#5E5873" }}
                    value="requester"
                  >
                    Requester
                  </MenuItem>
                </Select>
              </label>
            </section>

            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailSubjectOnConfig"
                className="input-wrapper-label"
              >
                Enter Subject :
              </label>
              <TextField
                id="SetEmailSubjectOnConfig"
                placeholder="Enter Email Subject"
                className="input-wrapper-input"
                size="small"
                fullWidth
              />
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailBodyOnConfig"
                className="input-wrapper-label"
              >
                Enter Body Content :
              </label>
              <TextField
                id="SetEmailBodyOnConfig"
                placeholder="Enter Email Body Content"
                className="input-wrapper-input"
                size="small"
                fullWidth
                multiline
                rows={3}
              />
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailTableBoolOnConfig"
                className="input-wrapper-label"
              >
                Add Table :
              </label>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                id="SetEmailTableBoolOnConfig"
                sx={{ width: "100%" }}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        margin: "0 ",
                      }}
                    >
                      Yes
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        margin: "0 ",
                      }}
                    >
                      No
                    </Typography>
                  }
                />
              </RadioGroup>
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailTableRowsOnConfig"
                className="input-wrapper-label"
              >
                Enter Rows :
              </label>
              <TextField
                id="SetEmailTableRowsOnConfig"
                placeholder="Enter Rows"
                className="input-wrapper-input"
                size="small"
                fullWidth
              />
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailTableColumnsOnConfig"
                className="input-wrapper-label"
              >
                Enter Columns :
              </label>
              <TextField
                id="SetEmailTableColumnsOnConfig"
                placeholder="Enter Columns"
                className="input-wrapper-input"
                size="small"
                fullWidth
              />
            </div>
            <div className="input-wrapper-div">
              <label
                htmlFor="SetEmailSignatureOnConfig"
                className="input-wrapper-label"
              >
                Enter Signature :
              </label>
              <TextField
                id="SetEmailSignatureOnConfig"
                placeholder="Enter Email Signature"
                className="input-wrapper-input"
                size="small"
                fullWidth
                multiline
                rows={3}
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: "1px solid rgba(0, 0, 255, 0.1) " }}>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button onClick={handleOk} variant="contained" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
