import '../../css/user/mypage.css';
import { useParams } from "react-router-dom";
import Faded from '../../effect/Faded'
import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

function MyPage(){
    //찜목록
    /* let {id} = useParams()

      const mounted=useRef(false);
      useEffect(()=>{
        if(!mounted.current){
          mounted.current=true;
        }else{
          getWhisList();
        }
      },[]);

      let [wishRecord,setWishRecord] = useState({});
      
      function getWhisList(){
        axios.get(`http://localhost:9977/user/wishList/${id}`)
        .then()
        .catch()
      }
 */
    //그래프
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ]
      }
      /*  //음식체크
      const [editSelectedFoods, setEditSelectedFoods] = useState([]);
      const [editAllChecked, setEditAllChecked] = useState(false);
      const editAllFoods =  ["한식","중국식","일식","양식","아시아음식","패스트푸드","주점","뷔페","패밀리레스트랑","기타"];
      
      const editCheckBoxHandler = (event) =>{
        const {value,checked} = event.target;
        if(checked){
          setEditSelectedFoods([...editSelectedFoods, value]);
        }else{
          setEditSelectedFoods(editSelectedFoods.filter((item) => item !== value));
          setEditAllChecked(false);
        }
      }
      const allEditCheckedHandler = (event) =>{
        setEditAllChecked(event.target.checked);
        if(event.target.checked){
            setEditSelectedFoods(editAllFoods);
        }else{
            setEditSelectedFoods([]);
        }
    }

       const checkListEditHandler=(event)=>{
            
        event.preventDefault();
        const editFoodsString = editSelectedFoods.length > 0 ? editSelectedFoods.join('/') : '';

        console.log("보내는거", editFoodsString);
        setParam({...param, foods:editFoodsString});
        
        axios.post('http://localhost:9977/user/checkList',{...param, foods:editFoodsString})
        .then(response =>{
            console.log('mypage보냄',response.data);
        })
        .catch(error =>{
            console.log("mypage안보내지미",error);
        })
    } */
    return(
        <Faded>
            <div className="mypage-container">
              <div id='wishlist-box'>
                <div id='wishlist-title'>찜목록</div>
                  <div className="row">
                    <div className="col-sm-3">.col-sm-3</div>
                    <div className="col-sm-3">.col-sm-3</div>
                    <div className="col-sm-3">.col-sm-3</div>
                    <div className="col-sm-3">.col-sm-3</div>
                  </div>
                </div>
                <div id="graph-box">
                    <div id="graph-title">와 그래프!</div>
                    <Doughnut data={data} />
                </div>

                {/* <div id="checklist-edit-box">
                    <form id="checklist-edit-form" name='checklist-edit-form' onSubmit={{checkListEditHandler}}>
                        <div className='edit-all-wrapper'>
                          <label className='edit-all-label'>
                            <input type='checkbox' checked={editAllChecked} onChange={allEditCheckedHandler}/>
                            <span>전체선택</span>
                          </label>
                        </div>
                        <div id='edit-box'>
                          {allEditFoods.map((food)=>(
                            <label key={editFood} className='edit-food-select'>
                              <input
                                type='checkbox'
                                checked={editAllChecked||editSelectedFoods.includes(food)}
                                value={food}
                                onChange={editCheckBoxHandler}
                              />
                              <span className='edit-food-name'>{editFood}</span>
                            </label>
                          ))}
                        </div>
                    </form>
                </div> */}
                
            </div>

        </Faded>
    )
}

export default MyPage;