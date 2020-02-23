import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import "litegraph.js/css/litegraph.css";
import { makeStyles } from "@material-ui/core/styles";
// import ThreeBoxIcon from "../assets/3box.svg";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  Icon,
  Button,
  CardActions,
  Divider,
  TextField,
  SvgIcon,
  Typography,
  Tooltip
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import ShareIcon from "@material-ui/icons/Share";
import CropFreeIcon from "@material-ui/icons/CropFree";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import Box from "3box";

var codec = require("json-url")("lzw");
var QRCode = require("qrcode.react");
const axios = require("axios");

const useStyles = makeStyles({
  button: {
    width: 200
    // height: 200
  }
});

const ThreeBoxIcon = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 290 289">
      <path
        d="M42 0H248C271.196 0 290 18.804 290 42V247C290 270.196 271.196 289 248 289H42C18.804 289 0 270.196 0 247V42C0 18.804 18.804 0 42 0ZM146.438 47.823C137.893 47.823 129.906 49.0022 122.474 51.3607C115.043 53.7193 108.457 57.2347 102.716 61.9072C96.9757 66.5798 92.192 72.4092 88.365 79.3958C84.538 86.3823 81.957 94.5035 80.622 103.759L97.977 106.83C99.579 107.097 101.092 107.23 102.516 107.23C105.542 107.23 107.989 106.496 109.858 105.028C111.728 103.559 113.196 101.134 114.264 97.752C116.311 91.255 119.915 85.9373 125.077 81.7988C130.24 77.6602 136.736 75.591 144.568 75.591C153.202 75.591 160.01 77.9272 164.994 82.5997C169.978 87.2723 172.47 94.192 172.47 103.359C172.47 107.631 171.847 111.547 170.601 115.107C169.355 118.667 167.152 121.715 163.993 124.252C160.833 126.788 156.584 128.768 151.243 130.193C145.903 131.617 139.184 132.373 131.085 132.462V155.958C140.875 155.958 148.685 156.714 154.514 158.227C160.344 159.741 164.816 161.832 167.931 164.502C171.046 167.172 173.093 170.398 174.072 174.181C175.051 177.963 175.54 182.168 175.54 186.796C175.54 190.446 174.851 194.072 173.471 197.677C172.092 201.281 170 204.552 167.197 207.489C164.393 210.426 160.9 212.807 156.717 214.631C152.534 216.456 147.639 217.368 142.032 217.368C137.048 217.368 132.754 216.634 129.149 215.165C125.545 213.697 122.408 211.783 119.738 209.425C117.067 207.066 114.776 204.374 112.862 201.348C110.949 198.322 109.191 195.252 107.589 192.137C106.61 190.267 105.208 188.844 103.384 187.865C101.559 186.885 99.49 186.396 97.176 186.396C94.595 186.396 92.0585 186.93 89.5665 187.998L75.015 194.005C77.685 202.283 80.889 209.58 84.627 215.9C88.365 222.219 92.904 227.558 98.244 231.919C103.584 236.281 109.858 239.573 117.067 241.798C124.277 244.024 132.731 245.136 142.432 245.136C151.333 245.136 159.765 243.846 167.731 241.264C175.696 238.683 182.705 234.879 188.757 229.85C194.809 224.822 199.615 218.614 203.175 211.227C206.735 203.84 208.515 195.341 208.515 185.729C208.515 174.425 205.667 165.036 199.971 157.56C194.275 150.084 185.642 144.522 174.072 140.872C178.878 139.27 183.172 137.268 186.955 134.865C190.737 132.462 193.941 129.525 196.567 126.054C199.192 122.583 201.195 118.511 202.574 113.839C203.954 109.166 204.643 103.76 204.643 97.6185C204.643 90.5875 203.286 84.046 200.572 77.994C197.857 71.942 193.964 66.6688 188.891 62.1743C183.817 57.6797 177.699 54.1643 170.534 51.6278C163.37 49.0912 155.338 47.823 146.438 47.823Z"
        fill="white"
      />
    </SvgIcon>
  );
};

function SaveDialog(props) {
  const {
    liteGraph,
    setOpenSaveDialog,
    openSaveDialog,
    dynamicWidth,
    screenshot
  } = props;

  const classes = useStyles();

  const [saveType, setSaveType] = React.useState(null);
  const [shared, setShared] = React.useState();

  const [compressed, setCompressed] = React.useState();

  const [documentTitle, setDocumentTitle] = React.useState(global.title);

  const [threeBoxStatus, setThreeBoxStatus] = React.useState(null);

  const handleClose = () => {
    setSaveType(null);
    setOpenSaveDialog(false);
  };
  const handleTitle = e => {
    setDocumentTitle(e.target.value);
  };

  React.useEffect(() => {
    if (liteGraph)
      codec.compress(liteGraph.serialize()).then(data => {
        setCompressed(data);
      });
  });

  let link =
    window.location.protocol + "//" + window.location.host + "/" + compressed;

  let qrcode = "";
  if (link && link.length < 2580) {
    qrcode = (
      <div>
        <QRCode
          size={dynamicWidth}
          value={link}
          style={{ border: "1px solid #dddddd", padding: 5, margin: 5 }}
        />
      </div>
    );
  }

  const download = async () => {
    console.log("SAVING COMPRESSED", compressed);

    let webfile =
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
<key>URL</key>
<string>https://eth.build/` +
      compressed +
      `</string>
</dict>
</plist>
`;

    var file = new Blob([webfile]);
    var url = URL.createObjectURL(file);
    var element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute(
      "download",
      (documentTitle ? documentTitle : "eth.build") + ".webloc"
    );
    element.style.display = "none";
    if (document.body) {
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 1000 * 60);
      handleClose();
    }
  };

  const share = async () => {
    console.log("share", compressed);
    setSaveType("SHARE");
    let result = await axios.post("https://network.eth.build:44386/build", {
      compressed
    });

    console.log("share result", result);

    if (result && result.data && result.data.key) {
      console.log("SET SHARED:", result.data.key);
      setShared(result.data.key);
      console.log("SHARED AS:", shared);
    }
    //setTimeout(function() {
    //  URL.revokeObjectURL(url);
    //}, 1000 * 60);
    //setOpenSaveDialog(false);
  };

  const saveTo3Box = async () => {
    if (typeof window.web3 !== "undefined") {
      let web3 = window.web3;
      setThreeBoxStatus("Please enable the access to your wallet");
      console.log("Web3 is installed", web3);

      let accounts = await window.ethereum.enable();
      console.log(accounts);
      let address = accounts[0];
      setThreeBoxStatus("Approve access to your 3Box");

      const box = await Box.openBox(address, window.ethereum);
      setThreeBoxStatus("Synchronizing with 3Box");
      await box.syncDone;
      setThreeBoxStatus("Opening eth.build space on your 3Box");
      const space = await box.openSpace("myApp");
      setThreeBoxStatus("Synchronizing with your 3Box space");
      await space.syncDone;
    } else {
      console.log("MetaMask is not installed");
    }
  };

  return (
    <Dialog
      onClose={() => {
        handleClose();
      }}
      open={openSaveDialog}
      // maxWidth={Math.round(dynamicWidth * 1.1)}
      maxWidth="md"
    >
      <DialogTitle id="save-dialog" style={{ textAlign: "center" }}>
        <Icon style={{ verticalAlign: "middle" }}>save</Icon>
        <span style={{ fontsize: 38, fontWeight: "bold" }}>Save</span>
      </DialogTitle>
      <Divider />

      {saveType === null && (
        <>
          <Grid
            container
            spacing={3}
            justify="center"
            style={{ margin: 0, width: "100%", padding: 32 }}
          >
            <Grid item style={{ width: 220 }}>
              <Tooltip title="QR code for this eth.build">
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={() => {
                    setSaveType("QR_CODE");
                  }}
                  startIcon={<CropFreeIcon />}
                >
                  QR Code
                </Button>
              </Tooltip>
            </Grid>

            <Grid item style={{ width: 220 }}>
              <Tooltip title="Copy via a unique URL">
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={() => {
                    setSaveType("COPY");
                  }}
                  startIcon={<FileCopyIcon />}
                >
                  Copy
                </Button>
              </Tooltip>
            </Grid>

            <Grid item style={{ width: 220 }}>
              <Tooltip title="Save to the network and share URL">
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={share}
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
              </Tooltip>
            </Grid>

            <Grid item style={{ width: 220 }}>
              <Tooltip title="Save to your 3Box space">
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={saveTo3Box}
                  startIcon={<ThreeBoxIcon />}
                  disabled
                >
                  Save to 3Box
                </Button>
              </Tooltip>
            </Grid>

            <Grid item style={{ width: 220 }}>
              <Tooltip title="Download a local file">
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  onClick={download}
                  startIcon={<GetAppIcon />}
                >
                  Download
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </>
      )}

      {saveType === "QR_CODE" && (
        <>
          <CardActions style={{ justifyContent: "center" }}>
            {qrcode}
          </CardActions>
        </>
      )}

      {saveType === "SHARE" && (
        <>
          <div>
            {shared ? (
              <div
                style={{
                  margin: "0 auto",
                  width: "100%",
                  textAlign: "center",
                  fontSize: 12,
                  color: "#000000"
                }}
              >
                <a href={"https://eth.build/build#" + shared}>
                  {"https://eth.build/build#" + shared}
                </a>

                <div>
                  <QRCode
                    size={dynamicWidth}
                    value={"https://eth.build/build#" + shared}
                    style={{
                      border: "1px solid #dddddd",
                      padding: 20,
                      margin: 5
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ padding: 32 }}>
                <CircularProgress
                  style={{
                    width: 40,
                    height: 40,
                    display: "block",
                    textAlign: "center",
                    margin: "auto",
                    marginBottom: 16
                  }}
                />
                <Typography variant="overline" display="block" gutterBottom>
                  saving to network
                </Typography>
              </div>
            )}
          </div>
        </>
      )}

      {/* <div style={{ margin: 16 }}>
        <TextField
          fullWidth
          name="title"
          label="Title"
          variant="outlined"
          value={documentTitle}
          onChange={handleTitle}
          required
        />

      </div> 

      <CardActions
        style={{
          justifyContent: "center",
          paddingTop: 10,
          display: "flex",
          paddingBottom: 10
        }}
      ></CardActions>
      {threeBoxStatus !== null && (
        <div style={{ display: "box" }}>
          <p>{threeBoxStatus}</p>
        </div>
      )}
      */}
      {saveType === "COPY" && (
        <>
          <CardActions style={{ justifyContent: "center", padding: 32 }}>
            <input
              id="savelink"
              style={{
                border: "1px solid #dddddd",
                padding: 5,
                margin: 5,
                width: dynamicWidth
              }}
              value={link}
            ></input>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                var copyText = document.getElementById("savelink");
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                handleClose();
              }}
            >
              Copy
            </Button>
          </CardActions>
        </>
      )}
      {/* <img src={screenshot} alt="screenshot" /> */}
    </Dialog>
  );
}

export default SaveDialog;