import './NavButtons.css'

const NavButtons = ({schedules, setSchedules, n, setN}) => {

    const handlePrev = (event) => {
        if (n > 0) 
            setN(n-1)
    }

    const handleNext = (event) => {
        if (n < (schedules.length-1))
            setN(n+1)
    }

    const handleChange = (event) => {
        if (event.target.value < 1)
            setN(0)
        else if (event.target.value > (schedules.length))
            setN(schedules.length-1)
        else
            setN(event.target.value -1)
    }

    return (
    <div className='buttons-container'>
        <button className='button ff-primary' onClick={handlePrev}>{"<<"}</button>
        <input className="ff-primary" value={n+1} onChange={handleChange} size="1" type="number" id="n"/>
        <button className='button ff-primary' onClick={handleNext}>{">>"}</button>
    </div>)
}

export default NavButtons