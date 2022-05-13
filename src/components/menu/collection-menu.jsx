import React, { useRef, useContext, useEffect, useState } from "react";
import classes from "./collection-menu.module.css";
import ArtCard from "../art-card/art-card";
import { GenContext } from "../../gen-state/gen.context";
import { addImage } from "../../gen-state/gen.actions";
import ButtonClickEffect from "../button-effect/button-effect";
import { handleAddBlank, handleFileChange, handleAddAssets } from "./collection-menu-script";

const CollectionMenu = ({ layer }) => {
  const [state, setState] = useState({
    activeCard: "",
  });
  const { activeCard } = state;
  const { layerTitle, traits, id } = layer;
  const { dispatch, layers } = useContext(GenContext);
  const fileRef = useRef(null);

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleBlank = async () => {
    let canvas = document.createElement("canvas");
    const res = await handleAddBlank({
      layerId: id,
      traits,
      layerTitle,
      canvas,
      img: layers[0].traits[0].image,
    });
    dispatch(addImage(res));
  };
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  };

  const handleTemplates = () => {
    let images;
    images = importAll(require.context(`../../assets/CreateAssets/`, true, /\.(png|jpe?g|svg)$/));
    let imgList = [];
    let imgFiles = [];
    Object.keys(images).map((key, value) => {
      imgList.push(images[key].default);
      imgFiles.push(dataURLtoFile(images[key].default, key.slice(key.indexOf("/") + 1)));
    });
    dispatch(addImage(handleAddAssets({ layerId: id, files: imgFiles, traits, layerTitle })));
  };

  return (
    <div className={classes.container}>
      <section className={classes.layer}>
        <h3 className={classes.header}>{layerTitle}</h3>
        {/* list of images */}
        <div className={classes.wrapper}>
          {traits.map((trait, idx) => (
            <ArtCard
              key={idx}
              index={idx}
              layerTitle={layerTitle}
              trait={trait}
              layerId={id}
              setActiveCard={(activeArtCard) => handleSetState({ activeCard: activeArtCard })}
              activeCard={activeCard}
            />
          ))}
        </div>
        <div className={classes.uploadBtnContainer}>
          <button type="button" onClick={() => fileRef.current.click()} className={classes.uploadBtn}>
            upload
          </button>
          <ButtonClickEffect>
            <button type="button" onClick={handleTemplates} className={classes.addBlankBtn}>
              Add Template Images
            </button>
          </ButtonClickEffect>
          {traits[0] && (
            <ButtonClickEffect>
              <button type="button" onClick={handleBlank} className={classes.addBlankBtn}>
                Add blank image
              </button>
            </ButtonClickEffect>
          )}
        </div>
      </section>

      <input
        onChange={(event) => dispatch(addImage(handleFileChange({ layerId: id, event, traits, layerTitle })))}
        ref={fileRef}
        style={{ display: "none" }}
        type="file"
        name="avatar"
        id="avatar"
        accept="image/png"
        multiple
      />
    </div>
  );
};

export default CollectionMenu;
