import { useEffect, useState } from "react";

function ImageModal({imageList}) {
    
    return (
        <div>
            {
                imageList.map((item)=>{
                    return <div></div>
                })
            }
            
        </div>
    )

}

export default ImageModal;