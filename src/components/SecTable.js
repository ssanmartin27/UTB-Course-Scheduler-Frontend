import './SecTable.css'
import he from 'he'
import generateSchedules from '../generateSchedules'

const SecTable = ({schedules, setSchedules, n, setN}) => {
    
    let schedule = schedules.length > 0 ? schedules[n] : []
    const headers = ["Title", "Type", "NRC", "Teacher"] 
    
    return(
    <div className='info'>
    <table className="sec-table ff-primary"> 
        <tr className="sec-row">
            {headers.map(header => ( 
            <th className='sec-header'>{header}</th>))
            }
        </tr>
        {
            schedule.map(section => (
                <tr className="sec-row">
                    <td className='sec-cell'>{he.decode(section.courseTitle)}</td>
                    <td className='sec-cell'>{section.scheduleTypeDescription}</td>
                    <td className='sec-cell'>{section.courseReferenceNumber}</td>
                    <td className='sec-cell'>{section.faculty?.[0]?.["displayName"]}</td>
                </tr>
            ))
        }

    </table>
    <p className='ff-primary'>Credits = {schedule.map(sec => generateSchedules.calcCredits(sec)).reduce((sum, num) => sum + num, 0)}</p>
    </div>)
}

export default SecTable
