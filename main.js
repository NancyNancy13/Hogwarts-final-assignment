"use strict";
window.addEventListener("DOMContentLoaded", start);

// global variables
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";
const settings = {
  filterBy: "all",
  sortBy: "all",
  sortDir: "asc",
};
let filterBy = "all";
let studentList;
let singleStudent;
// array for expelled students
const expelledStudent = [];
// array for all students
const allStudents = [];
// array for blood status
let pureBlood = [];
let halfBlood = [];
let muggle = [];

// prototype for student object
const Student = {
  fullname: "",
  firstname: "",
  middlename: "unknown",
  lastname: "",
  nickname: "unknown",
  gender: "",
  house: "",
  expelled: false,
  prefect: false,
  squadMember: "",
  bloodStatus: "",
};

let numberOfStudent = document.querySelector(".numberOfStudent");

// hacking
let hacked = false;
function hackTheSystem() {
  document.querySelector("#warninghack").classList.remove("hide");
  document.querySelector(".close_button").addEventListener("click", closeHackDialog);

  // if ignore do nothing

  function closeHackDialog() {
    // console.log("click");
    document.querySelector("#warninghack").classList.add("hide");
    document.querySelector(".close_button").removeEventListener("click", closeHackDialog);
  }
  if (!hacked) {
    hacked = true;
    // console.log(hacked);
    hackBloodStatus();
    pushMyInfo();
  }
}
function pushMyInfo() {
  allStudents.unshift({
    firstName: "Nancy",
    middleName: "-",
    lastName: "Unknown",
    house: "Gryffindor",
    gender: "Girl",
    bloodStatus: "Pureblood",
    prefect: "false",
  });
  // console.log(allStudents);
  buildList();
}
/////////////////////////////search list/////////////////////////
const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", searchBar);
function searchBar(event) {
  let searchStudentList = allStudents.filter((student) => {
    let name = "";
    if (student.lastName === null) {
      name = student.firstName;
    } else {
      name = student.firstName + " " + student.lastName;
    }
    return name.toLowerCase().includes(event.target.value);
  });
  displayList(searchStudentList);
}
// /////// Controller///////////////////////////
function start() {
  registerButtons();
  loadJSON();
  // click on the hack button
  document.querySelector("#hack").addEventListener("click", hackTheSystem);
}
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", chooseFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", chooseSort));
}

// fetch the data
async function loadJSON() {
  const response = await fetch(url);
  studentList = await response.json();
  // console.log(studentList);
  cleanStudentData();
}
// load blood json
loadFamilyJSON();
async function loadFamilyJSON() {
  const response = await fetch(bloodURL);
  const bloodData = await response.json();
  // console.log(bloodData);
  // return bloodData;
  checkBloodType(bloodData);
}
// //////////////// Model//////////////////////////////

function cleanStudentData() {
  studentList.forEach((studentInfo) => {
    // create new array for all strings
    let getFullNameArray = studentInfo.fullname.split(" ");
    singleStudent = Object.create(Student);
    // create variables for each property in the old array(fullname, gender, house)
    let fullName;
    let gender;
    let house;
    // now removing the white space & make it to lowercase
    (fullName = studentInfo.fullname.trim()), studentInfo.fullname.toLowerCase();
    (gender = studentInfo.gender.trim()), studentInfo.gender.toLowerCase();
    (house = studentInfo.house.trim()), studentInfo.house.toLowerCase();
    // console.log("fullname: ", fullName);
    // return fullName;
    // console.log("gender: ", gender);
    // console.log("house: ", house);
    haveFirstName();
    // having first name
    function haveFirstName() {
      let firstName = fullName.substring(0, fullName.indexOf(" "));
      firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase();
      // console.log("first name: ", firstName);
      singleStudent.firstName = firstName;
      if (firstName === "") {
        singleStudent.firstName = fullName.substring(fullName.lastIndexOf(" ") + 1);
        // console.log(firstName);
      }
      return firstName;
    }
    haveMiddleName();
    // middle Name
    function haveMiddleName() {
      let middleName = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
      middleName = middleName.substring(0, 1).toUpperCase() + middleName.substring(1);
      // console.log("middle name: ", middleName);

      if (middleName === " ") {
        return (singleStudent.middleName = "-");
      } else if (middleName.includes("Ernie")) {
        // console.log(middleName);
        return (singleStudent.middleName = "-");
      } else {
        return (singleStudent.middleName = middleName);
      }
    }
    // last name
    haveLastName();
    function haveLastName() {
      let lastName = fullName.substring(fullName.lastIndexOf(" ") + 1);
      lastName = lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase();
      if (lastName.includes("-")) {
        // console.log(lastName);
        return (singleStudent.lastName = lastName.replace(/-/g, " "));
      } else if (lastName === "Leanne") {
        return (singleStudent.lastName = `No last name`);
      } else {
        // console.log("last name: ", lastName);
        return (singleStudent.lastName = lastName);
      }
    }
    // nick name
    haveNickName();
    function haveNickName() {
      let nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
      // console.log("nickName: ", nickName);
      if (nickName == "") {
        return (singleStudent.nickName = "-");
      } else {
        nickName = nickName.charAt(0).toUpperCase() + nickName.substring(1);
        return (singleStudent.nickName = nickName);
      }
    }
    // gender
    haveGender();
    function haveGender() {
      gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();
      // console.log(gender);
      return (singleStudent.gender = gender);
    }

    // house
    haveHouse();
    function haveHouse() {
      house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
      // console.log(house);
      return (singleStudent.house = house);
    }
    // image
    haveImg();
    function haveImg() {
      //   // images are displayed with the last nameand first letter of the first name
      let imgSrc = `images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${fullName.substring(0, 1).toLowerCase()}.png`;
      // if img have no lastname hard coded for it
      if (fullName === "Leanne") {
        // console.log((imgSrc = `No_Image`));
        return (singleStudent.imgSrc = `No_Image`);
      }
      // if it include "-" name
      else if (fullName.includes("-")) {
        // console.log((imgSrc = `../images/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${fullName.substring(0, 1).toLowerCase()}.png`));
        return (singleStudent.imgSrc = `images/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${fullName.substring(0, 1).toLowerCase()}.png`);
      }
      // include two surname patil
      else if (fullName.toLowerCase().includes("patil")) {
        // console.log((imgSrc = `../images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${fullName.substring(0, fullName.indexOf(" ")).toLowerCase()}.png`));
        return (singleStudent.imgSrc = imgSrc = `images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${fullName.substring(0, fullName.indexOf(" ")).toLowerCase()}.png`);
      }
      //   console.log("image: ", imgSrc);
      return (singleStudent.imgSrc = imgSrc);
    }

    allStudents.push(singleStudent);
    // console.log(singleStudent);
    // change it to the buildList so that we filter and sort on the first load
    // displayList(allStudents);
    buildList();
    return singleStudent;
  });
}

//////////////////filtering//////////////////////////////////////////////////////////

function chooseFilter(event) {
  const filter = event.target.dataset.filter;
  console.log("user select: ", filter);
  // filterList(filter);
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  // create a filter list for all house type
  // let filteredList = allStudents;
  if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(onlySlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(onlyHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(onlyRavenclaw);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(onlyGryffindor);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudent;

    // filteredList = allStudents.filter(onlyExpelled);
  }

  // console.log(filteredList);
  numberOfStudent.textContent = `Number of Students: ${filteredList.length}`;
  // console.log(numberOfStudent);
  // displayList(filteredList);
  return filteredList;
}

function onlySlytherin(stud) {
  return stud.house === "Slytherin";
}
function onlyHufflepuff(stud) {
  return stud.house === "Hufflepuff";
}
function onlyRavenclaw(stud) {
  return stud.house === "Ravenclaw";
}
function onlyGryffindor(stud) {
  return stud.house === "Gryffindor";
}
// function onlyExpelled(stud) {
//   return stud.expelledStudent === true;
// }
// /////sorting/////////////////////////////
function chooseSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  console.log(`user select ${sortBy} ${sortDir}`);
  // sortList(sortBy, sortDir);
  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user select ${sortBy}, ${sortDir}`);
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  // sortList();
  buildList();
}
function sortList(sortedList) {
  // let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

// /////////////////////////View///////////////////////////////////
function displayList(newStudentList, pureBlood, halfBlood) {
  // clear the list
  document.querySelector("#showStudentList").innerHTML = "";
  // build a new list
  newStudentList.forEach(displayStudent);
  newStudentList.forEach(defineBloodStatus);

  // console.log(newStudentList);
}

function displayStudent(student) {
  // console.log(student);
  const clone = document.querySelector("template#studentTemplate").content.cloneNode(true);

  // set clone data
  // clone.querySelector("[data-field=fullname]").textContent = `${student.firstName} ${student.lastName}`;
  // clone.querySelector("[data-field=imgSrc]").src = student.imgSrc;
  // clone.querySelector("[data-field=imgSrc]").alt = `picture of ${student.lastName}, ${student.firstName}`;
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector(".details").addEventListener("click", () => showDetails(student));

  /////////////////adding expell students//////////

  if (student.expelled === true) {
    clone.querySelector("[data-field=expelled]").textContent = "YES🏴";
  } else {
    clone.querySelector("[data-field=expelled]").textContent = "NO🏳️";
  }
  clone.querySelector("[data-field=expelled]").addEventListener("click", expellStudent);
  function expellStudent() {
    if (hacked === true && student.lastName === "Unknown") {
      document.querySelector("#noexpell").classList.remove("hide");
      document.querySelector(".okk").addEventListener("click", closeDialog);

      function closeDialog() {
        document.querySelector("#noexpell").classList.add("hide");
        document.querySelector(".okk").removeEventListener("click", closeDialog);
      }
    } else {
      toggleExpell(student);
    }
  }

  /////////////////////////////prefects//////////////////////////////////

  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = "👑";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "♛";
  }
  clone.querySelector("[data-field=prefect]").addEventListener("click", setPrefect);
  function setPrefect() {
    if (student.expelled === true) {
      student.prefect = false;
    } else if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
      // student.prefect = true;
    }
    buildList();
  }
  // /////////////////////////////////////squad member//////////////////////////////////////////////////////////
  if (student.squadMember === true) {
    clone.querySelector("[data-field=squadMember]").textContent = "✔️";
  } else {
    clone.querySelector("[data-field=squadMember]").textContent = "❌";
  }
  clone.querySelector("[data-field=squadMember]").addEventListener("click", clickSquadMember);
  function clickSquadMember() {
    if (student.expelled === true) {
      student.squadMember = false;
    } else if (student.squadMember === true) {
      student.squadMember = false;
    } else {
      student.squadMember = true;
    }
    buildList();
  }
  function toggleExpell(student) {
    if (student.expelled === false) {
      student.expelled = true;
      student.squadMember = false;
    }
    expelledStudent.push(allStudents.splice(allStudents.indexOf(student), 1)[0]);

    buildList();
  }

  // append clone to list
  document.querySelector("#showStudentList").appendChild(clone);
}

////////////////////////////////////prefect//////////////////////////////////////////////////
function tryToMakePrefect(selectedStudent) {
  // have the list of all students and filter them where all the students are prefects
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;
  const other = prefects.filter((student) => student.house === selectedStudent.house);

  // if there is another student of the same house

  if (other.length >= 2) {
    // console.log("There can be only two prefects!!");
    removeAorB(other[0], other[1]);
  }
  //  else if (prefects.length >= 2) {
  //   // console.log("There can be only one prefect in each type");
  //   removeOther(other);
  // }
  else {
    makePrefect(selectedStudent);
  }
  // console.log("prefects: ", prefects);
  console.log(`there are ${numberOfPrefects} prefects`);
  // console.log(`the other student of this gender is ${other.house}`);

  // function removeOther(other) {
  //   // ask the user to remove or ignore other
  //   document.querySelector("#remove_other").classList.remove("hide");
  //   document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
  //   document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

  //   // show the name of the student instead other
  //   document.querySelector("[data-field=other]").textContent = other.firstName;
  //   // if ignore do nothing
  //   function closeDialog() {
  //     document.querySelector("#remove_other").classList.add("hide");
  //     document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
  //     document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
  //   }
  //   // if remove other
  //   function clickRemoveOther() {
  //     removePrefect(other);
  //     makePrefect(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }
  // }
  function removeAorB(prefectA, prefectB) {
    // ask the user to ignore or remove A or B
    // remove_aorb;
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    // if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    // show name on remove a or b button
    document.querySelector("[data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("[data-field=prefectB]").textContent = prefectB.firstName;

    function clickRemoveA() {
      // if removeA
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    function clickRemoveB() {
      // else if remove B
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}

// //////////////////////////pop up/////////////////////////
function showDetails(student) {
  // console.log("click: ", student);
  const popup = document.querySelector("#popup");
  popup.style.display = "block";
  popup.querySelector("[data-field='full']").textContent = `${student.firstName} ${student.lastName}`;
  popup.querySelector("[data-field='first']").textContent = student.firstName;
  popup.querySelector("[data-field='middle']").textContent = student.middleName;
  popup.querySelector("[data-field='last']").textContent = student.lastName;
  popup.querySelector("[data-field='nick']").textContent = student.nickName;
  popup.querySelector("[data-field='gender']").textContent = student.gender;
  popup.querySelector("[data-field='house']").textContent = student.house;
  popup.querySelector("[data-field='expell']").textContent = student.expelled;
  popup.querySelector("[data-field='bloodstatus']").textContent = student.bloodStatus;
  popup.querySelector("[data-field='imgSrc']").src = student.imgSrc;

  // ///////////////////crest////////////////////

  if (student.house === "Slytherin") {
    popup.querySelector(".crest").src = "crest/slytherin_crest.png";
  } else if (student.house === "Gryffindor") {
    popup.querySelector(".crest").src = "crest/gryffindor_crest.png";
  } else if (student.house === "Hufflepuff") {
    popup.querySelector(".crest").src = "crest/hufflepuff_crest.png";
  } else if (student.house === "Ravenclaw") {
    popup.querySelector(".crest").src = "crest/ravenclaw_crest.png";
  }

  // //////////////////////expell popup///////////////////////////////////
  if (student.expelled === true) {
    popup.querySelector("[data-field=expell]").textContent = "YES🏴";
  } else {
    popup.querySelector("[data-field=expell]").textContent = "NO🏳️";
  }
  popup.querySelector("[data-field=expell]").addEventListener("click", expellStudent);
  function expellStudent() {
    if (student.expelled === true) {
      student.expelled = false;
    } else {
      student.expelled = true;
    }
    // expelledStudent.push(allStudents.splice(allStudents.indexOf(student), 1)[0]);
    buildList();
  }
  ///////////////////////////////prefect popup////////////////////////////////////
  if (student.prefect === true) {
    popup.querySelector("[data-field=prefect]").textContent = "👑";
  } else {
    popup.querySelector("[data-field=prefect]").textContent = "♛";
  }
  popup.querySelector("[data-field=prefect]").addEventListener("click", setPrefect);
  function setPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
      // student.prefect = true;
    }
    buildList();
  }
  ///////////////////////////// squad member pop up///////////
  if (student.squadMember === true) {
    popup.querySelector("[data-field=squadMember]").textContent = "✔️";
  } else {
    popup.querySelector("[data-field=squadMember]").textContent = "❌";
  }
  popup.querySelector("[data-field=squadMember]").addEventListener("click", clickSquadMember);
  function clickSquadMember() {
    if (student.squadMember === true) {
      student.squadMember = false;
    } else {
      student.squadMember = true;
    }
    buildList();
  }
  document.querySelector("#close").addEventListener("click", () => (popup.style.display = "none"));
}
function checkBloodType(bloodData) {
  // let newlastName = haveLastName();
  pureBlood = bloodData.pure;
  // console.log(pureBlood);
  halfBlood = bloodData.half;
  // console.log(halfBlood);
}

function defineBloodStatus(student) {
  // console.log(student);
  if (pureBlood.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  } else if (pureBlood.includes(student.lastName) && halfBlood.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  } else if (!pureBlood.includes(student.lastName) && !halfBlood.includes(student.lastName)) {
    student.bloodStatus = "Muggleborn";
  }
}
// ///////////////////////////hacked blood status//////////////////////////
function hackBloodStatus() {
  allStudents.forEach((student) => {
    if (student.bloodStatus === "Muggleborn") {
      student.bloodStatus = "Pureblood";
    } else if (student.bloodStatus === "Halfblood") {
      student.bloodStatus = "Pureblood";
    } else {
      let bloodRandom = Math.floor(Math.random() * 3);
      if (bloodRandom === 0) {
        student.bloodStatus = "Muggleborn";
      } else if (bloodRandom === 1) {
        student.bloodStatus = "Halfblood";
      } else {
        student.bloodStatus = "Pureblood";
      }
    }
  });
}
