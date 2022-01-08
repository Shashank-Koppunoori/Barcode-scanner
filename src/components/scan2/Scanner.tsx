import Image from "next/image";
import { BaseSyntheticEvent, ChangeEventHandler, EventHandler, useState } from "react";
import QuaggaScanner from "./Quagga";
import QuaggaImageScanner from "./QuaggaImageScanner";

const Scanner = () =>{
    const [showScanner, setShowScanner]=useState(false);
    const [scanning, setScanning]=useState(false);
    const [fileScan, setFileScanner]=useState(false);
    const [startFileScan, setStartFileScanner]=useState(false);
    const [error, setError]=useState("");
    const [code, setCode]=useState("");
    const [imgSrc, setImgSrc]=useState<string | ArrayBuffer | null | undefined>("");
    const toogleShowScanner = () => {
        setCode("");
        imgSrc && setImgSrc("");
        fileScan && setFileScanner(false);
        setShowScanner(!showScanner);
        error && setError("");
        startFileScan && setStartFileScanner(false);
    }
    const updateScannigStatus = (status: boolean) => {
        setScanning(status);
    }
    const handleError = (error: string) => {
        setError(error);
        code && setCode("");
        showScanner && setShowScanner(false);
        startFileScan && setStartFileScanner(false);
    }
    const codeDetected = (code: string) => {
        error && setError("");
        setCode(code);
        showScanner && setShowScanner(false);
        startFileScan && setStartFileScanner(false);
        scanning && setScanning(false);
    }
    const copyToClipBoard=()=>{
        const cb = navigator.clipboard;
        if(cb){
            cb.writeText(code).then(() => alert("Code copied"))
        }
    }
    const encodeImageFileAsURL = (e: BaseSyntheticEvent) => {
        const files=e.target.files;
        if (files.length > 0) {
            let fileToLoad = files[0];
            let fileReader = new FileReader();
      
            fileReader.onload = function(fileLoadedEvent:ProgressEvent<FileReader>) {
                setImgSrc(fileLoadedEvent?.target?.result); // <--- data: base64
                setFileScanner(true);
                setStartFileScanner(true);
            }
            fileReader.readAsDataURL(fileToLoad);
          }
    }
    const onInputClick = ( event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = event.target as HTMLInputElement
        element.value = ''
    }
    return (
        <div className="center-div" style={{width: "100%", position:"relative", overflow:"hidden"}}>
            <div style={{position:"fixed", bottom:10, display:"flex", gap:"16px", zIndex:2000}}>
                <button className="btn" onClick={toogleShowScanner}>
                    <Image src="/images/scan.svg" height="18px" width="18px" alt="upload" />
                    &nbsp;&nbsp;{showScanner ? "STOP" : "SCAN" }
                </button>
                <>
                    <label className="btn" htmlFor="inputFileToLoad">
                        <Image className="block" src="/images/gallery.svg" height="18px" width="18px" alt="upload" />
                        &nbsp;&nbsp;UPLOAD
                    </label>
                    <input id="inputFileToLoad" type="file" onClick={onInputClick} onChange={encodeImageFileAsURL} accept=".jpg, .jpeg" hidden/>
                </>
            </div>
            <div className="scanner-container" style={{width:"100%"}}>
            {showScanner && !fileScan &&
                <div className="scanner-div">
                   <QuaggaScanner 
                            onCodeDetection={codeDetected} 
                            onError={handleError}
                            scanStatus={updateScannigStatus}
                        />
                        {
                        scanning &&  
                        <>
                            <p>Scanning</p>
                            <span></span>
                        </>
                        }
                   
                  
                    <em></em>
                </div>
                }
                {
                    !showScanner && fileScan && imgSrc &&
                    <div className="img-wrapper">
                        <Image src={imgSrc as string} alt="Scanned image" height="220" width="300"/>
                    </div>
                }
            </div>
            {error && !scanning && <div className="error">{error}</div>}
            {code && <div className="barcode-container" onClick={copyToClipBoard}>
                <div className="barcode">{code}</div>
                <div style={{padding:"4px 6px", fontWeight:"bold"}}><Image src="/images/copy.svg" height="24px" width="24px" alt="copy" /></div>
            </div>}
            {startFileScan && 
            
                <QuaggaImageScanner 
                    onCodeDetection={codeDetected} 
                    onError={handleError}
                    imgSrc={imgSrc as string} 
                />   
            }
        </div>
    )
}

export default Scanner;