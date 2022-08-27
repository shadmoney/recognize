import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import classes from "./NftCard.module.css";
import supportedChains from "../../../utils/supportedChains";
import Copy from "../../copy/copy";
import { GenContext } from "../../../gen-state/gen.context";
import avatar from "../../../assets/avatar.png";
import { readUserProfile } from "../../../utils/firebase";

const NftCard = ({ nft, listed, chinPrice, useWidth, fromDashboard, is1of1, collectionName }) => {
  const { Id, name, price, image_url, chain, owner } = nft;
  const match = useRouteMatch();
  const history = useHistory();
  const breakAddress = (address = "", width = 6) => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };
  const { account } = useContext(GenContext);

  const [state, setState] = useState({
    totalPrice: 0,
    ownerName: "",
  });

  const { ownerName, totalPrice } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (!chinPrice) {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedChains[chain]?.id}&vs_currencies=usd`)
        .then((res) => {
          const value = Object.values(res?.data)[0]?.usd;
          handleSetState({ totalPrice: value * price });
        });
    }
    (async function getUsername() {
      const data = await readUserProfile(owner);
      handleSetState({ ownerName: data.username });
    })();
  }, []);

  return (
    <Link
      to={
        fromDashboard && !listed
          ? nft.collection_name
            ? `${match.url}/${Id}`
            : chain
            ? `/marketplace/1of1/preview/${chain}/${Id}`
            : `/marketplace/1of1/preview/${Id}`
          : nft.collection_name
          ? `${match.url}/${Id}`
          : chain
          ? `/marketplace/1of1/${chain}/${Id}`
          : `/marketplace/1of1/${Id}`
      }
    >
      <div style={useWidth ? { width: useWidth } : {}} className={classes.card}>
        <div className={classes.imageContainer}>
          <img
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = image_url;
            }}
            src={image_url}
            alt=""
          />
        </div>
        <div className={classes.cardBody}>
          <div className={classes.collectionName}>
            <div className={classes.name}>
              {is1of1 ? (
                <div className={classes.is1of1}>1 of 1</div>
              ) : (
                <div className={classes.collection}>{collectionName}</div>
              )}
            </div>
            <div>
              <img className={classes.chainIcon} src={supportedChains[chain]?.icon} alt="" />
            </div>
          </div>
          <div className={classes.nftName}>{name}</div>
          <div className={classes.creator}>
            {!fromDashboard ? (
              <div className={classes.creatorAddress}>
                <div className={classes.address}>{ownerName ? ownerName : breakAddress(owner)}</div>
              </div>
            ) : (
              <div className={classes.createdBy}>Owned by you</div>
            )}
          </div>
          <div className={classes.wrapper}>
            <div className={classes.listPrice}>
              <div className={classes.list}>PRICE</div>
              {price === 0 ? (
                <div className={classes.price}>
                  <img className={classes.chainIcon} src={supportedChains[chain]?.icon} alt="" />
                </div>
              ) : (
                <div className={classes.price}>
                  {parseInt(price).toFixed(2)} <span className={classes.chain}>{supportedChains[chain]?.sybmol}</span>
                  <span className={classes.usdPrice}>
                    ({chinPrice ? (chinPrice * price).toFixed(2) : totalPrice.toFixed(2)} USD)
                  </span>
                </div>
              )}
            </div>
            {price === 0 ? (
              fromDashboard ? (
                <button
                  type="button"
                  onClick={() => history.push(`/marketplace/1of1/preview/${chain}/${Id}`)}
                  className={`${classes.button} ${classes.buttonSold}`}
                >
                  List
                </button>
              ) : (
                <button type="button" className={`${classes.notListed} ${classes.buttonSold}`}>
                  Not Listed!
                </button>
              )
            ) : listed ? (
              <button type="button" className={`${classes.button} ${nft.sold && classes.buttonSold}`}>
                {nft.sold ? "Sold" : "Buy"}
              </button>
            ) : (
              <button type="button" className={`${classes.button} ${nft.sold && classes.buttonSold}`}>
                {nft.sold ? "List" : "Re-list"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NftCard;
