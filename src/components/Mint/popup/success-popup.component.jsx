import { ReactComponent as SuccessIcon } from "../../../assets/icon-success_2.svg";
import { ReactComponent as LinkIconAccent } from "../../../assets/icon-link-accent.svg";
import { ReactComponent as LinkIconWhite } from "../../../assets/icon-link-white.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { useContext, useRef, useState } from "react";
import classes from "./popup.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { useHistory } from "react-router-dom";

const SuccessPopup = (props) => {
  const clipboardRef = useRef(null);
  const history = useHistory();
  const { account } = useContext(GenContext);
  const [clipboardState, setClipboardState] = useState("Copy");

  const {
    handleSetState,
    popupProps: { url },
  } = props;

  const handleCopy = (clipProps) => {
    const { navigator, clipboard } = clipProps;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState("Copied");
    setTimeout(() => {
      setClipboardState("Copy");
    }, 650);
  };

  const handleResetPopup = () => {
    handleSetState({
      popupProps: {
        isError: null,
        url: null,
        Popup: false,
      },
    });
  };

  return (
    <div className={classes.popupContainer}>
      <CloseIcon onClick={handleResetPopup} className={classes.closeIcon} />
      <div className={classes.imgContainer}>
        <SuccessIcon alt="" />
      </div>
      <h3 className={`${classes.heading} ${classes.success}`}>Mint Successful</h3>
      <div className={classes.actionBtnContainer}>
        <button
          onClick={() => {
            history.push(`/me/${account}`);
          }}
          className={`${classes.actionBtn} ${classes._1}`}
        >
          Go to Dashboard
        </button>
        <button className={`${classes.actionBtn} ${classes._2}`}>
          <a href={url} target="_blank" rel="noreferrer">
            Block Explorer
          </a>
          <div className={classes.iconContainer}>
            <LinkIconAccent alt="" />
            <LinkIconWhite alt="" />
          </div>
        </button>
      </div>
      <div className={classes.detailsContainer}>
        <div className={classes.tag}>Share</div>
        <div className={classes.url}>{url}</div>
        <button onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.copyBtn}>
          {clipboardState}
        </button>
        <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={url} />
      </div>
    </div>
  );
};

export default SuccessPopup;
