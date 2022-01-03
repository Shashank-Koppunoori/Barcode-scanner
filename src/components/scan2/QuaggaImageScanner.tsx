import { useEffect } from 'react';
// @ts-ignore
import Quagga from 'quagga';
type ImageScanner = {
    imgSrc: string;
    onCodeDetection:(code: string)=> void;
    onError:(err: string)=> void;
}
const QuaggaImageScanner = ({imgSrc,onCodeDetection,onError}:ImageScanner) => {
    useEffect(() => {
        Quagga.decodeSingle({
            decoder: {
                readers: ["ean_reader"] // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            // You can set the path to the image in your server
            // or using it's base64 data URI representation data:image/jpg;base64, + data
            src: imgSrc
        }, function(result: any){
            if(result?.codeResult) {
                console.log("result", result.codeResult.code);
                onCodeDetection(result.codeResult.code);
            } else {
                onError("Unable to detect");
            }
        });
    },[])
    return (
        <></>
    )
}

export default QuaggaImageScanner;