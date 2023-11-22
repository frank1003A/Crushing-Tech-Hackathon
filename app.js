"use strict";
const stepper = document.getElementById("stepper");
const btn_guide = document.getElementById("toggle-guide");
const chevDownIcon = document.getElementById("chev-down");
const chevUpIcon = document.getElementById("chev-up");
let trialCall = document.getElementById("trial-callout");
let completeCount = document.getElementById("complete-count");
let progressBar = document.getElementById("progress-line");
let userDropDown = document.getElementById("user-dropdown");
let notDropDown = document.getElementById("not-dropdown");
let isCollapsed = false;
let isActive = 0;
let completed = [];
let isUserOpen = false;
let isNotOpen = false;

//
chevDownIcon.style.display = "none";
chevUpIcon.style.display = "block";

btn_guide.addEventListener("click", function () {
  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    stepper.classList.add("display_none");
    chevDownIcon.style.display = "block";
    chevUpIcon.style.display = "none";
  } else {
    stepper.classList.remove("display_none");
    chevDownIcon.style.display = "none";
    chevUpIcon.style.display = "block";
  }
});

let stepCount = stepper.children.length;

// Add "step-active" class to the first step by default
const firstStep = stepper.children[isActive];
firstStep.classList.add("step-active");

for (let index = 0; index < stepCount; index++) {
  const step = stepper.children[index];
  const checkStepBtn = stepper.children[index].children[0];

  step.addEventListener("click", function () {
    // Remove "step-active" class from all steps
    for (let i = 0; i < stepCount; i++) {
      stepper.children[i].classList.remove("step-active");
    }

    // Add "step-active" class to the clicked step
    this.classList.add("step-active");
    isActive = index;
  });

  checkStepBtn.addEventListener("click", function () {
    let dottedIcon = this.children[0];
    let loaderIcon = this.children[1];
    let checkMark = this.children[2];

    dottedIcon.style.display = "none";
    loaderIcon.style.display = "block";

    for (let i = 0; i < completed.length; i++) {
      if (completed[i] === index) {
        loaderIcon.style.display = "none";
        checkMark.style.display = "none";
        dottedIcon.style.display = "block";
        completed = completed.filter((c) => c !== index);
        completeCount.innerHTML = `${completed.length}`;
        progressBar.style.width = `${20 * completed.length}%`;
        return;
      }
    }

    setTimeout(() => {
      loaderIcon.style.display = "none";
      checkMark.style.display = "block";
      completed.push(index);
      completeCount.innerHTML = `${completed.length}`;
      progressBar.style.width = `${20 * completed.length}%`;
    }, 1000);
  });
}

function closeTrialCallout() {
  trialCall.style.display = "none";
}

// user dropdown
let _userBtn = userDropDown.children[0];
let _userDropDown = userDropDown.children[1];

// notification dropdown
let _notBtn = notDropDown.children[0];
let _notDropdown = notDropDown.children[1];

_userBtn.addEventListener("click", function () {
  isUserOpen = !isUserOpen;
  if (isUserOpen === true) {
    _userDropDown.style.display = "block";
  } else {
    _userDropDown.style.display = "none";
  }
});

_notBtn.addEventListener("click", function () {
  isNotOpen = !isNotOpen;
  if (isNotOpen === true) {
    _notDropdown.style.display = "block";
  } else {
    _notDropdown.style.display = "none";
  }
});

window.addEventListener("mouseup", function (event) {
  if (event.target != userDropDown && event.target.parentNode != userDropDown) {
    isUserOpen = false;
    _userDropDown.style.display = "none";
  }
  if (event.target != notDropDown && event.target.parentNode != notDropDown) {
    isNotOpen = false;
    _notDropdown.style.display = "none";
  }
});
