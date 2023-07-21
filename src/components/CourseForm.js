import './CourseForm.css'
import subjects_data from '../subjects.json'

const CourseForm = ({courses, setCourses, idx, subjects, setSubjects}) => {
    
    const handleSubjectChange = (event) => {
        setSubjects({...subjects, [idx]:event.target.value })
    }

    const handleCourseChange = (event) => {
        setCourses({...courses, [idx]:event.target.value })
    }

    const handleClick = () => {
        const {[idx]:courseToDelete, ...restCourses} = courses
        setCourses(restCourses)
        const {[idx]:subjectToDelete, ...restSubjects} = subjects
        setSubjects(restSubjects)
    }

    
    return(
    <div className='container'> 
        <div className='container2'>
            <label className="ff-primary" for="subject">Subject:</label>
            <input className="ff-primary" size="7" list="subjects" id="subject" 
            name = "subject" value={subjects[idx]} onChange={handleSubjectChange}/>
            <datalist className="ff-primary" id="subjects">
                {subjects_data.map((subject)=>
                <option value={subject.code}/>)}
            </datalist>
        </div>

        <div className='container2'>
            <label className="ff-primary" for="course">Course:</label>
            <input className="ff-primary" value={courses[idx]} onChange={handleCourseChange} size="4" type="text" id="course"/>
        </div>

        <button onClick={handleClick} type='button' className='button ui ff-primary'>x</button>
    </div>
    )
}

export default CourseForm