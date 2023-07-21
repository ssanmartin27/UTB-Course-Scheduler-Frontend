import './Schedule.css'
import colors from '../colors.json'
import {useState, useEffect} from 'react'
import he from 'he'

const Schedule = ({schedules, setSchedules, n, setN}) => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    let styles = {}
    if (schedules.length > 0) {
    let schedule = schedules[n]
    schedule.forEach((section, idx) => {
        section.meetingsFaculty.forEach((meet, idx2)=>{
            for (let day of days) {
                if (meet.meetingTime[day]) {
                    let hour_count = +meet.meetingTime.beginTime + 50
                    let i = 0
                    do {
                    if (i === 0)
                        styles[day+'-'+(+meet.meetingTime.beginTime)] = {sty: {backgroundColor:colors[idx]}, text: he.decode(section.courseTitle), rowspan: 1}
                    else {
                        styles[day+'-'+(+meet.meetingTime.beginTime)]["rowspan"] = i+1
                        styles[day+'-'+(hour_count-50)] = {sty: {display:"none"}, text:"", rowspan: 1}
                    }
                    hour_count += 100
                    i += 1
                    } while(hour_count <= +meet.meetingTime.endTime)
                    break;
                }
            }
        })
    });
    }
    
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    const headersh = ["Hour", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const hourto12 = (num) => ( (num % 12 || 12) + ' ' + (num >= 12 ? 'pm' : 'am' ));
    const hours = Array.from(Array(14), (e,i)=>hourto12(i+7))
    const hours2 = range(700, 2000, 100)

    return (
        <table className='schedule ff-primary'>
            
            <caption className='scheduleTitle ff-primary'>{'Schedule ' + (n+1) + '/' + schedules.length}</caption>
            <tr>
                {headersh.map(header => <th className='headersh'>{header}</th>)}
            </tr>
        {hours.map((hr, idx) =>
            <tr>
                <th className='headersv'>{hr}</th>
                {headersh.slice(1).map((header, idx2) => (
                    <td rowspan={styles?.[days[idx2]+'-'+hours2[idx]]?.["rowspan"]} style={styles?.[days[idx2]+'-'+hours2[idx]]?.["sty"]}>{styles?.[days[idx2]+'-'+hours2[idx]]?.["text"]}</td>
                ))
                
        }
            </tr>
                
                
        )}  
        </table>
    )




}

export default Schedule