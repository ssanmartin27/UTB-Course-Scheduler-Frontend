import {useState, useEffect} from 'react'
import './App.css'
import Nav from './components/Nav'
import Form from './components/Form'
import Schedule from './components/Schedule'
import NavButtons from './components/NavButtons'
import SecTable from './components/SecTable'
import bannerService from './banners'

const App = () => {

    
    const [schedules, setSchedules] = useState([])
    const [n, setN] = useState(0)


    return(
        <div className='par'>
            <Nav/>
            <div className='main'>
                <Form schedules={schedules} setSchedules={setSchedules}/>
                <div className='schedule-main'>
                    <NavButtons schedules={schedules} setSchedules={setSchedules} n={n} setN={setN}/>
                    <Schedule schedules={schedules} setSchedules={setSchedules} n={n} setN={setN}/>
                    <SecTable schedules={schedules} setSchedules={setSchedules} n={n} setN={setN}/>
                </div>
            </div>

        </div>

    )
}

export default App;