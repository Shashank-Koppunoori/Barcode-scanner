import { Html5QrcodeScanner } from "html5-qrcode";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode/esm/core";
import { Html5QrcodeCameraScanConfig } from "html5-qrcode/esm/html5-qrcode";
import { useEffect } from "react";
const qrcodeRegionId = "html5qr-code-full-regionw";
const QRCodePlugin = () => {
    const qrCodeSuccessCallback: QrcodeSuccessCallback=(decodedText,result) => {
        console.log(decodedText,result);
    }
    const qrCodeErrorCallback: QrcodeErrorCallback=(errorMessage, error) => {
        console.log(errorMessage);
    }
    useEffect(()=>{
        const createConfig=(props: Html5QrcodeCameraScanConfig) =>{
            let config: Html5QrcodeCameraScanConfig={fps:2}
            if (props.fps) {
            config.fps = props.fps;
            }
            if (props.qrbox) {
            config.qrbox = props.qrbox;
            }
            if (props.aspectRatio) {
            config.aspectRatio = props.aspectRatio;
            }
            if (props.disableFlip !== undefined) {
            config.disableFlip = props.disableFlip;
            }
            return config;
        }

        var config = createConfig({ fps: 10, qrbox: {width: 250, height: 250}, disableFlip:false });
        var verbose = false;

        // Suceess callback is required.
        if (!(qrCodeSuccessCallback )) {
            throw "qrCodeSuccessCallback is required callback.";
        }

        let html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(
            qrCodeSuccessCallback,
            qrCodeErrorCallback);
        const clearData = () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });    
        }  
        return ()=> clearData()
    },[])

    return(
         <div id={qrcodeRegionId} style={{display:"flex", flexDirection:"column", gap:4}}/>
    )
}

export default QRCodePlugin;