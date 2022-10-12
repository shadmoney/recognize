import React, { useContext, useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./singleNftCollection.module.css";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import NotFound from "../../components/not-found/notFound";
import { GenContext } from "../../gen-state/gen.context";
import SingleNftCard from "../../components/Marketplace/SingleNftCard/SingleNftCard";
import PageControl from "../../components/Marketplace/Page-Control/PageControl";
import ChainDropdown from "../../components/Marketplace/Chain-dropdown/chainDropdown";
import {
  filterBy,
  getCollectionsByChain,
  getCollectionsBySearch,
  rangeBy,
  shuffle,
  sortBy,
} from "../Marketplace/Marketplace-script";

import FilterDropdown from "../../components/Marketplace/Filter-dropdown/FilterDropdown";
import Search from "../../components/Search/Search";

const SingleNftCollection = () => {
  const {
    singleAlgoNfts,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    singleNearNfts,
    mainnet,
    singleAvaxNfts,
    account,
    searchContainer,
  } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

  const mountRef = useRef(null);
  const [state, setState] = useState({
    collections: [],
    filteredCollection: [],
    currentPage: 1,
    paginate: {},
    currentPageValue: 1,
    searchValue: "",
    notFound: false,
    searchContext: {
      "Algorand 1of1": searchContainer["Algorand 1of1"],
      "Aurora 1of1": searchContainer["Aurora 1of1"],
      "Celo 1of1": searchContainer["Celo 1of1"],
      "Polygon 1of1": searchContainer["Polygon 1of1"],
      "Near 1of1": searchContainer["Near 1of1"],
      "Avax 1of1": searchContainer["Avax 1of1"],
    },
  });

  const {
    collections,
    paginate,
    currentPage,
    currentPageValue,
    searchValue,
    filteredCollection,
    notFound,
    searchContext,
  } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    handleSetState({ currentPage: currentPage - 1 });
  };

  const handleNext = () => {
    if (currentPage >= Object.keys(paginate).length) return;
    handleSetState({ currentPage: currentPage + 1 });
  };

  const handleGoto = () => {
    if (currentPageValue < 1 || currentPageValue > Object.keys(paginate).length) return;
    handleSetState({ currentPage: Number(currentPageValue) });
    document.documentElement.scrollTop = 0;
  };

  const handleSearchChange = (e) => {
    const result = getCollectionsBySearch({ collections, search: e.target.value });
    handleSetState({ filteredCollection: result, searchValue: e.target.value });
  };

  const handleChainChange = (chain) => {
    const result = getCollectionsByChain({ collections, chain, mainnet });
    handleSetState({ filteredCollection: result });
  };

  const handleFilter = ({ type, value }) => {
    if (type === "status") {
      const result = filterBy({ collections, value, account });
      handleSetState({ filteredCollection: result });
    } else if (type === "sort") {
      const result = sortBy({ collections, value });
      handleSetState({ filteredCollection: result });
    } else if (type === "range") {
      const result = rangeBy({ collections, value });
      handleSetState({ filteredCollection: result });
    }
  };

  useEffect(() => {
    console.log(singleNearNfts);
  }, [singleNearNfts]);

  useEffect(() => {
    let collections = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
      ...(singleNearNfts || []),
      ...(singleAvaxNfts || []),
    ];
    collections = shuffle(collections);
    handleSetState({ collections, filteredCollection: [...collections] });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts, singleNearNfts, singleAvaxNfts]);

  useEffect(() => {
    const countPerPage = 20;
    const numberOfPages = Math.ceil(filteredCollection.length / countPerPage);
    let startIndex = 0;
    let endIndex = startIndex + countPerPage;
    const paginate = {};
    for (let i = 1; i <= numberOfPages; i += 1) {
      paginate[i] = filteredCollection.slice(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = startIndex + countPerPage;
    }
    handleSetState({ paginate });
  }, [filteredCollection]);

  useEffect(() => {
    if (mountRef.current > 2) {
      handleSetState({ notFound: !Object.keys(paginate).length });
    }
    mountRef.current += 1;
  }, [paginate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.title}>
          <h1>1 of 1s</h1>
          <p>View all listed 1 of 1s {`(${collections.length} Listed)`}</p>
        </div>
        <div className={classes.searchAndFilter}>
          <Search searchContext={searchContext} searchPlaceholder="Search By 1 of 1s and Users" />

          {/* <div className={classes.search}>

            <SearchIcon />
            <input
              type="text"
              onChange={handleSearchChange}
              value={searchValue}
              placeholder="Search By collections ,1 of 1s or Users"
            />
          </div> */}
          <div className={classes.filter}>
            <div className={classes.chainDesktop}>
              <ChainDropdown onChainFilter={handleChainChange} />
            </div>
            <FilterDropdown handleFilter={handleFilter} />
          </div>
        </div>
        <div className={classes.chainMobile}>
          <ChainDropdown onChainFilter={handleChainChange} />
        </div>
      </div>
      <div className={classes.wrapper}>
        {Object.keys(paginate).length ? (
          <div className={classes.nfts}>
            {paginate[currentPage].map((nft, idx) => (
              <SingleNftCard key={idx} nft={nft} />
            ))}
          </div>
        ) : !notFound ? (
          <div className={classes.nfts}>
            {[...new Array(8)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.loader} key={id}>
                  <Skeleton count={1} height={200} />
                  <br />
                  <Skeleton count={1} height={40} />
                </div>
              ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
      {Object.keys(paginate).length ? (
        <PageControl controProps={{ handleNext, handlePrev, handleGoto, ...state, handleSetState }} />
      ) : null}
    </div>
  );
};

export default SingleNftCollection;
