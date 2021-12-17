import classes from './mint.module.css';
import { useRef, useState, useEffect, useContext } from 'react';
import JSZip from 'jszip';
import { getImageSize } from '../../components/utils/getImageSize';
import { createNFT, mintToAlgo } from '../../components/utils/arc_ipfs';
import { GenContext } from '../../gen-state/gen.context';
import { saveAs } from 'file-saver';
import { setLoading as setGlobalLoading } from '../../gen-state/gen.actions';
import { mintToCelo } from './mint.script';

const Mint = () => {

  const [collections, setCollections] = useState([]);
  const [zip, setZip] = useState(null);
  const [ipfsJsonData, setIpfsJsonData] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [mintFileName, setMintFileName] = useState('');
  const [nextCount, setNextCount] = useState(0);
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [algoUrl, setAlgoUrl] = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [iconClicked, setIconClicked] = useState(false);
  const { account, connector, dispatch } = useContext(GenContext);
  const [celoAccount, setCeloAccount] = useState('')
  const [selectValue, setSelectValue] = useState('Algo');

  console.log(selectValue);

  const countBy = 24;
  const fileRef = useRef(null);
  const jsonFileRef = useRef(null);
  const clipboardRef = useRef(null)

  const handleUpload = () => {
    fileRef.current.click()
  }

  const handleMintUpload = () => {
    jsonFileRef.current.click()
    setShowCopy(false)
  }

  const unzip = async zip => {
    let new_zip = new JSZip();
    const unzipped = await new_zip.loadAsync(zip)
    return unzipped
  }

  const handleMintFileChange = event => {
    if (!event.target.files[0]) return;
    let content = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function (evt) {
      setIpfsJsonData(JSON.parse(evt.target.result))
    };
    fileReader.readAsText(content);
    setMintFileName(content.name);
  }

  const handleFileChange = async event => {
    if (!event.target.files[0]) return;
    setZip(event.target.files[0]);
    setLoading(true)
    let content = event.target.files[0];
    setCollectionName(content.name);
    let col = [];
    let unzipped = await unzip(content);
    for (let file in unzipped.files) {
      let uint8array = unzipped.files[file]["_data"]["compressedContent"]
      let string = new TextDecoder().decode(uint8array);
      let blob = new Blob([new Uint8Array(uint8array).buffer], { type: 'image/png' });
      try {
        const meta = JSON.parse(string)
        setMetadata(meta)
      } catch (error) {
        let imageFile = new File([blob], file, {
          type: "image/png"
        });
        col.push(imageFile)
      }
    }
    setCollections(col)
    setLoading(false);
  }

  const handleNextClick = () => {
    setNextCount(c => c + 1);
  }

  const handlePrevClick = () => {
    setNextCount(c => c - 1);
  }

  const getCount = () => {
    let result = collections.length - ((nextCount + 1) * countBy);
    return result > 0 ? result : 0
  }

  const handleExport = async () => {
    dispatch(setGlobalLoading(true))
    const ipfs = await createNFT(zip)
    dispatch(setGlobalLoading(false))
    let fileName = `${collectionName.split('.zip').join('-ipfs')}.json`;
    let fileToSave = new Blob([JSON.stringify(ipfs, null, '\t')], {
      type: 'application/json',
      name: fileName
    });
    saveAs(fileToSave, fileName);
  }

  const handleMint = async () => {
    try {
      if(selectValue.toLowerCase() === 'algo'){
        const url = await mintToAlgo(ipfsJsonData, account, connector);
        setAlgoUrl(url)
        setShowCopy(true)
      }else if(selectValue.toLowerCase() === 'celo') {
        const url = await mintToCelo({ window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount })
        setAlgoUrl(url)
        setShowCopy(true)
      }
    } catch (error) {
      alert('Please connect your account and try again!'.toUpperCase())
    }
  }

  const handleSelectChange = event => {
    setSelectValue(event.target.value)
  }

  const handleCopy = () => {
    clipboardRef.current.select();
    clipboardRef.current.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboardRef.current.value);
  }

  useEffect(() => {
    if ((nextCount) * countBy > collections.length) return;
    setEndCount(countBy * (nextCount + 1))
    setStartCount(countBy * nextCount)
  }, [nextCount, collections])

  useEffect(() => {
    if (!collections.length) return
    const run = async () => {
      const { height, width } = await getImageSize(collections[0]);
      setSize({ height, width })
    }
    run()
  }, [collections])

  return (
    <div className={classes.container}>

      <div className={` ${classes.clipboard} ${showCopy === true ? classes.enter : classes.leave}`}>
        <div>{algoUrl}</div>
        <div
          onMouseDown={() => setIconClicked(true)}
          onMouseUp={() => setIconClicked(false)}
          onClick={handleCopy} className={`${classes.icon} ${iconClicked && classes.clicked}`}
        >
          copy to clipboard
        </div>
        <input style={{ display: 'none' }} ref={clipboardRef} type="text" defaultValue={algoUrl} />
      </div>

      <div className={`${classes.innerContainer} ${!collections.length && classes.height}`}>
        <div className={classes.wrapper}>
          <div className={classes.uploadWrapper}>
            <div className={classes.title}>Upload zip file to ipfs</div>
            <div className={classes.upload}>
              <img src="/assets/upload-icon.png" alt="" />
              <div>{collectionName}</div>
            </div>
            <div className={classes.buttonWrapper}>
              <button className={classes.uploadBtn} onClick={handleUpload}>upload</button>
              {
                collections.length
                  ? <button className={classes.exportBtn} onClick={handleExport}>export IPFS.json</button>
                  : null
              }
            </div>
            <input style={{ display: 'none' }} onChange={handleFileChange} ref={fileRef} type="file" accept=".zip,.rar,.7zip" />
          </div>

          <div className={classes.mintOption}>
            <div>Select Mint Option: </div>
            <select value={selectValue} onChange={handleSelectChange}>
              <option value="Algo">Algo</option>
              <option value="Celo">Celo</option>
            </select>
          </div>

          <div className={classes.uploadWrapper}>
            <div className={classes.title}>Mint with IPFS.json {`[${selectValue}]`}</div>
            <div className={classes.upload}>
              <img src="/assets/upload-icon.png" alt="" />
              <div>{mintFileName}</div>
            </div>
            <div className={classes.buttonWrapper}>
              <button className={classes.uploadBtn} onClick={handleMintUpload}>upload</button>
              {
                ipfsJsonData.length
                  ? <button className={classes.exportBtn} onClick={handleMint}>mint</button>
                  : null
              }
            </div>
            <input style={{ display: 'none' }} onChange={handleMintFileChange} ref={jsonFileRef} type="file" accept=".json" />
          </div>

        </div>
        {
          collections.length
            ?
            <div className={classes.previewWrapper}>
              <div className={classes.preview}>
                {
                  collections
                    .filter((_, idx) => (idx >= startCount && idx < endCount))
                    .map((image, idx) => (
                      <img key={idx} src={URL.createObjectURL(image)} alt="" />
                    ))
                }
                {
                  (getCount() || nextCount)
                    ?
                    <div className={classes.next}>
                      {
                        nextCount ? <i onClick={handlePrevClick} className="fas fa-long-arrow-alt-left"></i> : null
                      }
                      {
                        getCount() ? <div onClick={handleNextClick}>{getCount()} more...</div> : null
                      }
                    </div>
                    : null
                }
              </div>
              <div className={classes.description}>
                <h3>Description</h3>
                <div><span>Collection Name: </span> {collectionName}</div>
                <div><span>Number Of Pictures: </span> {collections.length}</div>
                <div><span>Layers: </span> {
                  metadata.length
                    ?
                    <span className={classes.layers}>
                      {
                        metadata[0].attributes.map(({ trait_type }, idx) => (
                          <span key={idx}>{trait_type},</span>
                        ))
                      }
                    </span>
                    : null
                }</div>
                <div><span>Size: </span> {size.width}{" x "}{size.height}</div>
              </div>
            </div>
            :
            <div className={classes.fallback}>
              {
                loading
                  ? <i className="fas fa-spinner"></i>
                  : "nothing to preview"
              }
            </div>
        }

      </div>

    </div>
  )
}

export default Mint