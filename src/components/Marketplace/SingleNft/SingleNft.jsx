import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getSingleGraphNfts, getSingleNfts } from "../../../utils";
import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { createClient } from "urql";
import { GET_ALL_GRAPH_SINGLE_NFTS, GET_AURORA_SINGLE_NFTS } from "../../../graphql/querries/getCollections";

const SingleNft = () => {
  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  const [state, setState] = useState({
    allSingleNfts: [],
    allSingleGraphNfts: [],
  });
  const { allSingleNfts, allSingleGraphNfts } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { singleNfts, mainnet } = useContext(GenContext);
  const { url } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    (async function getResult() {
      if (singleNfts?.length) {
        const allSingleNFTs = await getSingleNfts(mainnet, singleNfts);
        handleSetState({ allSingleNfts: allSingleNFTs });
      } else {
        handleSetState({ allSingleNfts: null });
      }
    })();
  }, [singleNfts]);

  useEffect(() => {
    try {
      (async function getGraphResults() {
        const data = await client.query(GET_AURORA_SINGLE_NFTS).toPromise();
        const allSingleNfts = await getSingleGraphNfts(data?.data?.nfts);
        handleSetState({ allSingleGraphNfts: allSingleNfts });
      })();
    } catch (error) {
      console.log(error);
    }
  }, [singleNfts]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>1 of 1s</h3>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {allSingleNfts?.length ? (
        <div className={classes.wrapper}>
          {allSingleNfts.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {allSingleGraphNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
        </div>
      ) : !allSingleNfts ? (
        <h1 className={classes.noResult}> No Results Found</h1>
      ) : (
        <div className={classes.wrapper}>
          {[...new Array(5)]
            .map((_, idx) => idx)
            .map((id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SingleNft;
