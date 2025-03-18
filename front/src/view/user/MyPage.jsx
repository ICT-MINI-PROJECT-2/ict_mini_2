import '../../css/user/mypage.css';
import Faded from '../../effect/Faded'
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

function MyPage(){
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

        //음식체크

        //찜목록록
      }
    return(
        <Faded>
            <div className="mypage-container">
                <div id="graph-box">
                    <div id="graph-title">와 그래프!</div>
                    <Doughnut data={data} />
                </div>

                <div id="checklist-edit-box">
                    <form id="checklist-edit-form" name='checklist-edit-form' onSubmit={{checkListEditHandler}}>
                        
                    </form>
                </div>
                
            </div>

        </Faded>
    )
}

export default MyPage;