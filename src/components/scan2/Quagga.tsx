import { useEffect } from 'react';
// @ts-ignore
import Quagga from 'quagga';

function getMedian(arr:[]) {
    arr.sort((a, b) => a - b);
    const half = Math.floor(arr.length / 2);
    if (arr.length % 2 === 1) {
        return arr[half];
    }
    return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes:any) {
    const errors = decodedCodes.filter((x:any) => x.error !== undefined).map((x:any) => x.error);
    const medianOfErrors = getMedian(errors);
    return medianOfErrors;
}

type QuaggaScannerTypes ={
    onCodeDetection:(code: string)=> void;
    onError:(err: string)=> void;
    scanStatus: (status: boolean)=> void;
}

const QuaggaScanner =({onCodeDetection, onError, scanStatus}:QuaggaScannerTypes)=> {
    const errorCheck = (result:any) => {
        if (!onDetected) {
            return;
        }
        const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
        // if Quagga is at least 85% certain that it read correctly, then accept the code.
        if (err < 0.1) {
            onDetected(result.codeResult.code);
        }
    };
    useEffect(() => {
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        width: window.innerWidth,
                        height: 240,
                        facingMode: 'environment', // or user
                    },
                    area: { // defines rectangle of the detection/localization area
                        top: "0%",    // top offset
                        right: "0%",  // right offset
                        left: "0%",   // left offset
                        bottom: "0%"  // bottom offset
                      },
                },
                locator: {
                    patchSize: 'medium',
                    halfSample: true,
                },
                numOfWorkers: navigator.hardwareConcurrency || 0,
                decoder: {
                    // readers: [{
                    //     format: "ean_reader",
                    //     config: {
                    //         supplements: [
                    //             'ean_5_reader', 'ean_2_reader'
                    //         ]
                    //     }
                    // }],
                    readers: [
                        "ean_reader"
                    ],
                },
                locate: false,
            },
            function(err: any) {
                if (err) {
                    scanStatus(false);
                    onError(`${err}`);
                    return console.log(err);
                }
                Quagga.start();
                scanStatus(true);
            }
        );
        Quagga.onDetected(errorCheck);

        return ()=>{
            Quagga.offDetected(errorCheck);
            Quagga.stop();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onDetected=(result: string) => {
        onCodeDetection(result);
        scanStatus(false);
    }

    return ( 
    <div id="interactive" className="viewport" />
    )
    
}
export default QuaggaScanner;