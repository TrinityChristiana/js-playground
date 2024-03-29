import { studentData } from './data.js';

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const createTeams = (students, teamSize) => {
  const team = [[]];
  let teamIndex = 0;
  students.forEach((s) => {
    if (team[teamIndex].length < teamSize) {
      team[teamIndex].push(s);
    } else {
      team[teamIndex + 1] = [s];
      teamIndex++;
    }
  });
  return team;
};

const studentSorter = (studentData, teamSize) => {
  const days = ['Wednesday', 'Thursday'];
  let sortedStudents = {
    [days[0]]: [],
    [days[1]]: [],
  };

  let firstChoices = {
    [days[0]]: [],
    [days[1]]: [],
  };

  studentData.forEach((student) => {
    //   Get out students that only have one option
    const day1Pref = student[days[0]];
    const day2Pref = student[days[1]];

    if (day1Pref === 0 || day2Pref === 0) {
      sortedStudents[days[day1Pref === 1 ? 0 : 1]].push(`*${student.name}`);
    } else {
      // Seperate remaining stuents into their prefrences
      firstChoices[days[day1Pref === 1 ? 0 : 1]].push(student.name);
    }
  });

  //   To keep this random, randomize the order of each array
  shuffle(firstChoices[days[0]]);
  shuffle(firstChoices[days[1]]);

  //   Get the one with the least prefrence
  const wantDay1 = sortedStudents[days[0]].length + firstChoices[days[0]].length;
  const wantDay2 = sortedStudents[days[1]].length + firstChoices[days[1]].length;

  let [highest, lowest] = wantDay1 > wantDay2 ? [days[0], days[1]] : wantDay1 < wantDay2 ? [days[1], days[0]] : [null, null];

  if (highest !== null && lowest !== null) {
    sortedStudents[lowest] = sortedStudents[lowest].concat(firstChoices[lowest]);

    const leftstudents = firstChoices[highest];

    leftstudents.forEach((s) => {
      if (sortedStudents[lowest].length < studentData.length / 2) {
        sortedStudents[lowest].push(s);
      } else {
        sortedStudents[highest].push(s);
      }
    });
  } else {
    sortedStudents[days[0]] = sortedStudents[days[0]].concat(firstChoices[days[0]]);
    sortedStudents[days[1]] = sortedStudents[days[1]].concat(firstChoices[days[1]]);
  }

  shuffle(sortedStudents[days[1]]);
  shuffle(sortedStudents[days[0]]);

  return {
    [days[0]]: createTeams(sortedStudents[days[0]], teamSize),
    [days[1]]: createTeams(sortedStudents[days[1]], teamSize),
  };
};

export const runStudentSorter = () => {
  const students = studentSorter(studentData, 4);
  console.log(students);
  console.log(JSON.stringify(students));
  setUpDom();
  document.querySelector('regenerate-groups').addEventListener('click', )

};

const setUpDom = () => {
  const students = studentSorter(studentData, 4);

  document.querySelector('#app').innerHTML = `
    <div>
      <h1>Welcome to Group Generator</h1>
      <div>
        ${
            Object.entries(students).map(([day, groups]) => {
            return (`
            <div class="d-flex">
              <div style="width: 200px; font-size: 30px; display: flex; align-items: center; justify-content: center;">${day}</div>
              ${groups.map((students, i) => `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">Group ${1 + i}</h5>
                  ${students.map(student => `<div>${student}</div>`).join("")}
                </div>
              </div>`).join("")}
            </div>
            <br/>
            `)
          }).join("")
        }
      </div>
      <button id="regenerate-groups">Regenerate</button>
    </div>
  `;

  document.querySelector('#regenerate-groups').addEventListener('click', setUpDom);

};
