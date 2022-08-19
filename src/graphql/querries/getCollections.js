import { gql } from "@apollo/client";
import { ethers } from "ethers";

export const GET_GRAPH_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          type
          price
        }
      }
    }
  }
`;

export const GET_CELO_GRAPH_COLLECITONS = gql`
  query MyQuery {
    collections {
      description
      id
      name
      creator {
        id
      }
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }
        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          from {
            id
          }
          type
          price
          to {
            id
          }
        }
      }
    }
  }
`;

export const GET_ALL_POLYGON_COLLECTIONS = gql`
  query MyQuery {
    collections {
      description
      id
      creator {
        id
      }
      name
      nfts {
        chain
        category
        createdAtTimestamp
        id
        isSold
        isListed
        price
        collection {
          name
          id
        }
        tokenID
        owner {
          id
        }

        tokenIPFSPath
        transactions {
          id
          txDate
          txId
          type
        }
      }
    }
  }
`;

export const GET_GRAPH_COLLECTION = gql`
  query ($id: ID) {
    collection(id: $id) {
      description
      id
      name
      nfts {
        chain
        id
        isSold
        price
        tokenID
        tokenIPFSPath
        owner {
          id
        }
      }
    }
  }
`;

export const GET_USER_NFT = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      nfts {
        chain
        createdAtTimestamp
        id
        isSold
        price
        tokenID
        tokenIPFSPath
        owner {
          id
          collections {
            name
          }
        }
      }
    }
  }
`;

export const GET_USER_COLLECTIONS = gql`
  query ($id: ID) {
    user(id: $id) {
      id
      collections {
        description
        id
        name
        nfts {
          chain
          category
          createdAtTimestamp
          id
          isSold
          price
          collection {
            name
            id
          }
          tokenID
          owner {
            id
          }
          tokenIPFSPath
          transactions {
            id
            txDate
            txId
            from {
              id
            }
            type
            price
            to {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_CELO_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      isListed
      tokenID
      owner {
        id
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        from {
          id
        }
        to {
          id
        }
        type
        price
      }
    }
  }
`;

export const GET_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        type
        price
      }
    }
  }
`;

export const GET_CELO_GRAPH_NFT = gql`
  query ($id: ID) {
    nft(id: $id) {
      chain
      category
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
      transactions {
        id
        txDate
        txId
        type
        price
      }
    }
  }
`;

export const GET_AURORA_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(where: { collection: "${process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS}" }) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

const polygonAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);

export const GET_POLYGON_SINGLE_NFTS = gql`
  query MyQuery {
    nfts(where: { collection: "${polygonAddress}" }) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;

const celoAddress =
  process.env.REACT_APP_ENV_STAGING === "true"
    ? ethers.utils.hexlify(process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS)
    : ethers.utils.hexlify(process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS);

export const GET_CELO_SINGLE_NFT = gql`
  query MyQuery {
    nfts(where: { collection: "${celoAddress}" }) {
      category
      chain
      createdAtTimestamp
      id
      isSold
      price
      tokenID
      owner {
        id
      }
      tokenIPFSPath
    }
  }
`;
