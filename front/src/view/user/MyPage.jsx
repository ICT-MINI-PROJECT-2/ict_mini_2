import '../../css/user/mypage.css';
import { useParams } from "react-router-dom";
import Faded from '../../effect/Faded'
import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

function MyPage(){
  let [wishRecord,setWishRecord] = useState([]);
  let [pageNumber, setPageNumber] = useState([]);
  let [nowPage,setNowPage] = useState(1);
  let [totalPage,setTotalPage] = useState(1);
  let [graphRecord, setGraphRecord] = useState([]);
  let [chartData, setChartDate] = useState([0,0,0,0,0,0,0,0,0,0])
  const mounted=useRef(false);
  useEffect(()=>{
    if(mounted.current){
    }else{
      mounted.current=true;
      getWishList(1);
      graphData();
      console.log("!  ")
    }
  },[]);

  useEffect(() => {
    console.log(graphRecord, "graphRecord");
    const categories = graphRecord.map(item => item.categoryOne);
    console.log(categories, "categories");

    const categoryLabels = ["한식","중국식","일식","양식","아시아음식","패스트푸드","주점","뷔페","패밀리레스트랑","기타"];
    const categoryData = [0,0,0,0,0,0,0,0,0,0];
    setChartDate(categoryData);
    categories.forEach(category => {
      if (category === "한식") categoryData[0] += 1;
      if (category === "중국식") categoryData[1] += 1;
      if (category === "일식") categoryData[2] += 1;
      if (category === "양식") categoryData[3] += 1;
      if (category === "아시아음식") categoryData[4] += 1;
      if (category === "패스트푸드") categoryData[5] += 1;
      if (category === "주점") categoryData[6] += 1;
      if (category === "뷔페") categoryData[7] += 1;
      if (category === "패밀리레스트랑") categoryData[8] += 1;
      if (category === "기타") categoryData[9] += 1;
    });

}, [graphRecord]);

  const [wishvo, setWishvo] = useState([]);

  function getWishList(page){
    const id= sessionStorage.getItem("id");
    let url =`http://localhost:9977/user/getWishList?id=${id}&nowPage=${page}`;

    axios.get(url)
    .then(function(res){
      console.log(res.data)
      //기존 데이터 초기화
      setWishRecord([]);
      setWishRecord(res.data.re);
      setWishvo([]);
      setWishvo(res.data.we);
      

      setPageNumber([]);
      let pwVO = res.data.pwVO;
    
      for(let pw=pwVO.startPageNum; pw<pwVO.startPageNum+pwVO.onePageCount; pw++){
        if(pw<=pwVO.totalPage){
          setPageNumber((prev)=>{
            return [...prev,pw]
          });
        }
      }
      setNowPage(pwVO.nowPage);
      setTotalPage(pwVO.totalPage);
    })
    .catch(function(error){
      console.log(error);
    });
  }
  function wishDel(id){
    console.log(id,"삭제버튼클릭");

  }
   
  //그래프
  //불러오기
  function graphData(){
    const id= sessionStorage.getItem("id");
    let url =`http://localhost:9977/user/graphData?id=${id}`;

    axios.get(url)
    .then(function(response){
      setGraphRecord([]);
      setGraphRecord(response.data); 

    })
    .catch(function(error){
      console.log(error);
    });
    
  }


    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: ["한식","중국식","일식","양식","아시아음식","패스트푸드","주점","뷔페","패밀리레스트랑","기타"],
        datasets: [
          {
            label: '# of Votes',
            data : chartData,
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
      };
      const options = {
        plugins: {
          datalabels: {
            anchor: 'end', // 레이블 위치 설정
            align: 'start', // 레이블 정렬 설정
            formatter: (value, context) => { // 레이블 내용 설정
              return value; // 데이터 값 표시
            },
          },
        },
      };
     
    return(
        <Faded>
            <div className="mypage-container">
              <div id='wishlist-box'>
                <h2 id='wishlist-title'>찜목록</h2>
                  <div id='wishlist-wrapper'>
                    <table className='wishlist-table'>
                      <thead>
                        <tr>
                          <th>찜한식당</th>
                          <th>카테고리</th>
                          <th>주소</th>
                          <th>삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          wishRecord.map(function(wishlistup){
                            return(
                              <tr key={wishlistup.id}>
                                <td>{wishlistup.name}</td>
                                <td>{wishlistup.categoryOne}</td>
                                <td>{wishlistup.location}</td>
                                <td><a onClick={() =>wishDel(wishlistup.id)}>삭제</a></td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                    <div>
                        <ul className='pagination'>
                          {
                            (function(){
                              if(nowPage>1){
                                return <li className='page-item'><a className='page-link' onClick={()=>getWishList(nowPage-1)}>prev</a></li>
                              }
                            })
                          }
                          {   
                            pageNumber.map(function(pg){
                                var activeStyle = 'page-item';
                                if(nowPage==pg) activeStyle ='page-item active';
                                return <li className={activeStyle}><a className="page-link" onClick={()=>getWishList(pg)}>{pg}</a></li>
                            })
                          }
                          {
                          (function(){
                              //현재페이지가 전체페이지보다 작을때만 다음페이지가 나타남
                              if(nowPage<totalPage){
                                  return <li className="page-item"><a className="page-link" onClick={()=>getWishList(nowPage+1)}>Next</a></li>
                                  }
                              })
                          }
                        </ul>
                    </div>
                  </div>
                </div>
                <div id="graph-box">
                    <h2 id="graph-title">선호음식</h2>
                    <Doughnut data={data} options={options} />
                </div>
     
            </div>

        </Faded>
    )
}

export default MyPage;