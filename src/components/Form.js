import './Form.css'
import CourseForm from './CourseForm';
import {useState, useEffect} from 'react';
import bannerService from '../banners'
import generateSchedules from '../generateSchedules';
import generateSchedules2 from "../generateSchedules2";

const Form = ({schedules, setSchedules}) => {
    const [nforms, setNforms] = useState(localStorage.getItem('nforms') || 0)
    const [terms, setTerms] = useState([])
    const [term, setTerm] = useState("202320")
    const [courses, setCourses] = useState(JSON.parse(localStorage.getItem("courses")) || {0:''})
    const [subjects, setSubjects] = useState(JSON.parse(localStorage.getItem("subjects"))|| {0:''})
    const [campus, setCampus] = useState("CAMPUS TECNOLOGICO")
    
    
    const handleClick = () => {
        const newNforms = nforms+1
        setNforms(newNforms)
        setSubjects({...subjects, [newNforms]:''})
        setCourses({...courses, [newNforms]:''})
    }

    const handleTermChange = (event) => {
        setTerm(event.target.value)
    }

    const handleCampusChange = (event) => {
        setCampus(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let subsToSearch = Object.values(subjects).join()
        let userCourses = []
        for (let p in courses) {
            userCourses.push(subjects[p] + courses[p])
        }
        let offset = 0;
        let totalCount
        let sections = []
        do {
            let res = await bannerService.classSearch(term, subsToSearch, 500, offset)
            totalCount = res.data.totalCount
            offset += 500
            sections = sections.concat(res.data.data)
        } while (offset < totalCount)
        let userSections = sections.filter((sec) => userCourses.includes(sec.subjectCourse) && sec.campusDescription === campus)
        console.log(userSections)
        /*let graph = new generateSchedules2.Graph()
        graph.populateGraph(userSections)*/
        setSchedules(generateSchedules.generateSchedule(userSections))
        //setSchedules(generateSchedules2.generateSchedule2(graph))
        localStorage.setItem('courses', JSON.stringify(courses));
        localStorage.setItem('subjects', JSON.stringify(subjects));
        localStorage.setItem('nforms', nforms);
    }

    useEffect(() => {
        bannerService.getTerms().then(
            (term) => setTerms(term.data))
      }, [])
    
    return (
        <form className='form' onSubmit={handleSubmit}>
            <label className="ff-primary" for="term">Select period:</label>
            <select className="ff-primary" value={term} onChange={handleTermChange} name="term" id="term">
                {terms.map((term) =>
                <option value={term.code}>{term.description}</option>)}
            </select>
            <select className="ff-primary" value={campus} onChange={handleCampusChange} name="campus" id="campus">
                    <option value="CAMPUS TECNOLOGICO">CAMPUS TECNOLOGICO</option>
                    <option value="CAMPUS CASA LEMAITRE">CAMPUS CASA LEMAITRE</option>
            </select>

            <button onClick={handleClick} type='button' className='button ff-primary'>+</button>
            <div className='courseForms'>
            {Object.keys(subjects).map((key, index) => (
                <CourseForm courses={courses} 
                setCourses={setCourses} idx={key} subjects={subjects} setSubjects={setSubjects} className="course-form"/>)
            )}
            </div>
            
            <button type='submit' className='button ff-primary'>Generate Schedules</button>
        </form>
    )
}

export default Form;