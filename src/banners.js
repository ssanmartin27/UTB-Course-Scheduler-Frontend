import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const getTerms = () => {
    return axios.get(`${baseUrl}/getTerms/`)
}

const getSubjects = (term) => {
    return axios.get(`${baseUrl}/getSubjects/${term}`)
}

const classSearch = (term, subject, pageSize=-1, offset=0) => {
    return axios.get(`${baseUrl}/classSearch/${term}/${subject}/${pageSize}/${offset}`)
}

export default {
    getTerms: getTerms,
    getSubjects: getSubjects,
    classSearch: classSearch
}
