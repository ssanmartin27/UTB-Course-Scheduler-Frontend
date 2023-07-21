//const sectionsxd = sections.filter((sec) => sec.subjectCourse === "ISCOA01A" || sec.subjectCourse === "ISCOA05A" || sec.subjectCourse === "ISCOC08A" || sec.subjectCourse === "ISCOZ01A" || sec.subjectCourse === "ISCOP01A" || sec.subjectCourse === "ISCOC11A" || sec.subjectCourse === "ISCOA06A")

const backtrack = (a, k, input, solutions, credits, max_credits) => {
    
  if (a.length !== 0) {
    input = prune(input, a[k-1], credits, max_credits)
  }
  
  if(is_a_solution(a, k, input, credits)) {
    process_solution(a, k, input, solutions);
    /*return k;*/
  } else {
    k = k + 1;
    let candidates = construct_candidates(a, k, input, credits, max_credits)
    for (const [idx, candidate] of candidates.entries()) {
      a.push(candidate)
      let candidate_credits = calcCredits(candidate)
      credits += candidate_credits
      input = input.filter(item => item !== candidate)
      backtrack(a, k, input, solutions, credits, max_credits);
      a.pop(candidate)
      credits -= candidate_credits
      
      /*if (aaa && (input.length === (aaa - k)))
        return aaa*/
    }
  }
} 

const is_a_solution = (a, k, input, credits) => (
  (input.length === 0) && (credits >= 20)
  );

const construct_candidates = (a, k, input, credits, max_credits) => {
    if (a.length !== 0 && a[k-2].isSectionLinked && a[k-2].scheduleTypeDescription !== 'LABORATORIO') {
      return input.filter((sec) => (sec.subjectCourse === a[k-2].subjectCourse) && (sec.scheduleTypeDescription === 'LABORATORIO')
      && (sec.sequenceNumber.charAt(0) === a[k-2].linkIdentifier))
    }
    else {
    return input.filter((sec) => sec.scheduleTypeDescription !== 'LABORATORIO')
    }
}  

const process_solution = (a, k, input, solutions) => {
  solutions.push(JSON.parse(JSON.stringify(a)))
  }

const generateSchedule = (input) => {
  let a = [];
  let credits = 0
  let max_credits = 20
  let solutions = [];
  const sections2 = JSON.parse(JSON.stringify(input));
  backtrack(a, 0, sections2, solutions, credits, max_credits, [])
  return solutions;
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

const prune = (arr, section, credits, max_credits) => {  
  if (section.subject === "CHUM")
    arr = arr.filter(sec => sec.subject !== "CHUM")
  
  else if (section.subject === "AEMP")
    arr = arr.filter(sec => sec.subject !== "AEMP" && sec.subject !== "ECON")

  else if (section.subject === "ECON")
    arr = arr.filter(sec => sec.subject !== "AEMP") 

  return(
  arr.filter((sec) => 
  (sec.subjectCourse !== section.subjectCourse || 
    sec.scheduleTypeDescription !== section.scheduleTypeDescription) &&
  !overlap(sec, section) && 
  ((calcCredits(sec) + credits) <= max_credits) 
  ))

}

const calcCredits = (section) => (
    section.scheduleTypeDescription === 'LABORATORIO' ? 0 : (section.creditHourHigh + 
      section.creditHourLow)
  ) 

export default {
    backtrack: backtrack,
    is_a_solution : is_a_solution,
    construct_candidates: construct_candidates,
    process_solution: process_solution,
    generateSchedule: generateSchedule,
    overlap: overlap,
    prune: prune ,
    calcCredits: calcCredits
}