import generateSchedules from "./generateSchedules";

class Graph { 
    adjacencyList; 
  
    constructor(){ 
      this.adjacencyList = new Map(); 
    }
  
    addNode(node){ 
      this.adjacencyList.set(node, new Set()); 
    }
  
    addEdge(node1, node2){ 
      this.adjacencyList.get(node1).add(node2); 
      this.adjacencyList.get(node2).add(node1); 
    }
  
    getNeighbors(node){ 
      return this.adjacencyList.get(node); 
    }
  
    hasEdge(node1, node2){ 
      return this.adjacencyList.get(node1).has(node2); 
    }

    getNodes() {
        return new Set(this.adjacencyList.keys())
    }

    populateGraph(input) {

        input.forEach(sec => {
            this.addNode(sec)
        }) 
    
        for (let i = 0; i < input.length - 1; i++) {
            for (let j = i + 1; j < input.length; j++) {
                if ((input[i].subjectCourse !== input[j].subjectCourse || 
                    input[i].scheduleTypeDescription !== input[j].scheduleTypeDescription) &&
                    !overlap(input[i], input[j])) {
                        this.addEdge(input[i], input[j])
                    }
            }
        }
    }
}

const bronKerbosch = (r, p, x, graph, solutions, credits, max_credits) => {
    if (p.size === 0 && x.size === 0) {
        solutions.push(r)
        return;
    }
    p.forEach(v => {
        credits += calcCredits(v)
        let neighbors = graph.getNeighbors(v)
        let filtered_neighbors = new Set()
        if (v.isSectionLinked && v.scheduleTypeDescription !== 'LABORATORIO')
            neighbors.forEach(sec => {
                if ((sec.subjectCourse === v.subjectCourse) && (sec.scheduleTypeDescription === 'LABORATORIO')
                && (sec.sequenceNumber.charAt(0) === v.linkIdentifier)) 
                    filtered_neighbors.add(sec)
            })
        else
            neighbors.forEach(sec => {
                if (sec.scheduleTypeDescription !== 'LABORATORIO' && (calcCredits(sec) + credits <= max_credits))
                    filtered_neighbors.add(sec)
            })
        let new_r = union(r, new Set([v]))
        let new_p = intersection(p, filtered_neighbors)
        let new_x = intersection(x, neighbors)
        bronKerbosch(new_r, new_p, new_x, graph, solutions, credits, max_credits) 
        p.delete(v)
        credits -= calcCredits(v)
        x.add(v)
    })
}
  
  function union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB) {
      _union.add(elem);
    }
    return _union;
  }
  
  function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }
  
const overlap = (sec1, sec2) => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (const meetSec1 of sec1.meetingsFaculty) {
      for (const meetSec2 of sec2.meetingsFaculty) {
        for (const day of days) {
          if (meetSec1.meetingTime[day] && meetSec2.meetingTime[day]) {
            if (meetSec1.meetingTime.beginTime <= meetSec2.meetingTime.endTime
              && meetSec1.meetingTime.endTime >= meetSec2.meetingTime.beginTime) {
                return true
              }
            break  
          }
        }
      }
    }
    return false
}

const calcCredits = (section) => (
    section.scheduleTypeDescription === 'LABORATORIO' ? 0 : (section.creditHourHigh + 
      section.creditHourLow)
  ) 

const generateSchedule2 = (graph) => {
    let p = graph.getNodes()
    let solutions = []
    let max_credits = 20
    bronKerbosch(new Set(), p, new Set(), graph, solutions, 0, max_credits)
    console.log(solutions)
    return solutions
}

export default {
    Graph: Graph,
    bronKerbosch: bronKerbosch,
    generateSchedule2: generateSchedule2
}