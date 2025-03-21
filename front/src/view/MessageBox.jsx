import { useEffect, useState } from "react";
import axios from "axios";

function MessageBox({open, msg_box,setMsg_box}){
    const [total, setTotal] = useState(0);
    useEffect(()=> {
        console.log(msg_box);
        if(open) {
            axios.post('http://localhost:9977/tech/getMessage',{
                id:sessionStorage.getItem("id")
            })
            .then(res => {
                let x = [];
                let cnt = 0;
                for(var i=0;i<res.data.length;i++) {
                    if(res.data.state != 2) {
                        if(res.data[i].state == 0) cnt++;
                        x.push(res.data[i]);
                    }
                }
                setMsg_box({...msg_box, msg_list:x});
                setTotal(cnt);
            })
            .catch(err => console.log(err))
        }
    },[open])
    return(
        <>
        <div className="message-box-container" onClick={() => setMsg_box({...msg_box, isOpen:true})}>
            ✉️
            { total != 0 && <span>{total}</span>}
        </div>
        </>
    )
}

export default MessageBox;