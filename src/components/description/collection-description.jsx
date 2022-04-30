import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  setCurrentDnaLayers,
  setNotification,
  setLoader,
  setLoading,
  setMintAmount,
  setNftLayers,
} from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import Button from "../button/button";
import CollectionDetails from "../details/collection-details";
import classes from "./collection-description.module.css";
import ButtonClickEffect from "../button-effect/button-effect";
import { createDna, createUniqueLayer, generateArt, parseLayers } from "./collection-description-script";
import CollectionPreview from "../preview/collection-preview";

const CollectionDescription = () => {
  const { layers, nftLayers, mintAmount, dispatch, combinations, rule, isRule, collectionName } =
    useContext(GenContext);
  const canvasRef = useRef(null);

  const handleChange = (event) => {
    const { value } = event.target;
    dispatch(setMintAmount(value ? parseInt(value) : 0));
  };

  const handleGenerate = async () => {
    if (isRule) {
      return dispatch(
        setNotification({
          message: "finish adding conflict rule and try again",
          type: "warning",
        })
      );
    }
    if (!mintAmount) {
      return dispatch(
        setNotification({
          message: "set the number to generate",
          type: "warning",
        })
      );
    }
    if (!combinations) {
      return dispatch(
        setNotification({
          message: "uplaod images and try again",
          type: "warning",
        })
      );
    }
    if (mintAmount > combinations - rule.length) {
      return dispatch(
        setNotification({
          message: "cannot generate more than the possible combinations",
          type: "warning",
        })
      );
    }
    dispatch(setNftLayers([]));
    dispatch(setLoading(true));
    const dnaLayers = createDna(layers);
    const uniqueLayers = await createUniqueLayer({
      dispatch,
      setNotification,
      setLoader,
      layers: dnaLayers,
      mintAmount,
      rule,
      collectionName,
    });

    const arts = await generateArt({
      dispatch,
      setLoader,
      layers: uniqueLayers,
      canvas: canvasRef.current,
      image: layers[0].traits[0].image,
    });
    dispatch(setCurrentDnaLayers(dnaLayers));
    dispatch(setNftLayers(parseLayers({ uniqueLayers, arts })));
    dispatch(
      setNotification({
        message: "done! click on the preview button to view assets.",
        type: "success",
      })
    );
    dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <div className={classes.preview_details}>
        <div className={classes.previewWrapper}>
          <CollectionPreview />
        </div>
        <div className={classes.detailsWrapper}>
          <CollectionDetails />
        </div>
      </div>

      <div className={classes.input}>
        <div className={classes.action}>
          <label htmlFor="generate amout"># to Generate</label>
          <input onChange={handleChange} type="number" min="0" />
        </div>
        <div className={classes.action}>
          <div htmlFor="combinations">Combinations</div>
          <div className={classes.combinations}>{combinations - rule.length}</div>
        </div>
      </div>
      {nftLayers.length ? (
        <div className={classes.btnWrapper}>
          <Link to="/preview">
            <ButtonClickEffect>
              <Button invert>preview</Button>
            </ButtonClickEffect>
          </Link>
        </div>
      ) : null}

      <div className={classes.btnWrapper}>
        <div onClick={handleGenerate}>
          <ButtonClickEffect>
            <Button>generate {mintAmount}</Button>
          </ButtonClickEffect>
        </div>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default CollectionDescription;
