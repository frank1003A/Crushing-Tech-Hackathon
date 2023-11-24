function app() {
  const stepper = document.getElementById("stepper");
  const btn_guide = document.getElementById("toggle-guide");
  const chevDownIcon = document.getElementById("chev-down");
  let trialCall = document.getElementById("trial-callout");
  let completeCount = document.getElementById("complete-count");
  let progressBar = document.getElementById("progress-line");
  let userDropDown = document.getElementById("user-dropdown");
  let notDropDown = document.getElementById("not-dropdown");
  let isActive = 0;
  let completed = [];

  //

  function rotateChevronIcon() {
    if (chevDownIcon.classList.contains("rotate_180")) {
      chevDownIcon.classList.remove("rotate_180");
      chevDownIcon.classList.add("rotate_0");
    } else {
      chevDownIcon.classList.remove("rotate_0");
      chevDownIcon.classList.add("rotate_180");
    }
  }

  btn_guide.addEventListener("click", function () {
    stepper.classList.toggle("display_none");
    rotateChevronIcon();
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
      let dottedCircle = step.children[0].children[0];
      let checkMark = step.children[0].children[1];

      dottedCircle.style.display = "none";

      for (let i = 0; i < completed.length; i++) {
        if (completed[i] === index) {
          checkMark.style.display = "none";
          dottedCircle.style.display = "block";
          completed = completed.filter((c) => c !== index);
          completeCount.innerHTML = `${completed.length}`;
          progressBar.style.width = `${20 * completed.length}%`;
          return;
        }
      }
      checkMark.style.display = "flex";
      completed.push(index);
      completeCount.innerHTML = `${completed.length}`;
      progressBar.style.width = `${20 * completed.length}%`;
    });
  }
  const focusStep = stepper.querySelectorAll('[tabindex="0"]');
  focusStep.forEach((step, index) => {
    step.addEventListener("keyup", function (event) {
      const step = stepper.children[index];
      if (event.key === "Enter" || event.key === "Space") {
        for (let i = 0; i < stepCount; i++) {
          stepper.children[i].classList.remove("step-active");
        }
        step.classList.add("step-active");
        isActive = index;
      }
    });
  });

  function closeTrialCallout() {
    trialCall.style.display = "none";
  }

  function closeMenu(menu, button) {
    if (menu.classList.contains("menu-active")) {
      menu.classList.remove("menu-active");
      button.ariaExpanded = "false";
      button.focus();
    }
  }

  function handleMenuEscapeKeyPress(event) {
    if (event.key == "Escape") {
      closeMenu(profileMenu, profileMenuTrigger);
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  }

  function handleMenuItemKeyPress(event, index) {
    const allMenuItems = getAllMenuItem(profileMenu);
    const isLastMenuItem = index === allMenuItems.length - 1;
    const isFirstMenuItem = index === 0;
    const nextMenuItem = allMenuItems.item(index + 1);
    const prevMenuItem = allMenuItems.item(index - 1);
    console.log(isLastMenuItem);

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLastMenuItem) {
        allMenuItems.item(0).focus();
        return;
      }

      nextMenuItem.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstMenuItem) {
        allMenuItems.item(allMenuItems.length - 1).focus();
        return;
      }

      prevMenuItem.focus();
    }
  }

  function getAllMenuItem(menu) {
    const allMenuItems = menu.querySelectorAll("a");
    return allMenuItems;
  }

  function toggleMenu(menu, button) {
    const isExpanded = button.attributes["aria-expanded"].value === "true";
    const allMenuItems = menu.querySelectorAll("a");
    const allButtons = menu.querySelectorAll("button");
    menu.classList.toggle("menu-active");

    if (isExpanded) {
      button.ariaExpanded = "false";
      button.focus();
    } else {
      button.ariaExpanded = "true";
      allMenuItems.item(0)
        ? allMenuItems.item(0).focus()
        : allButtons.item(0).focus();

      menu.addEventListener("keyup", handleMenuEscapeKeyPress);
      allMenuItems.forEach((item, index) => {
        item.addEventListener("keyup", (event) => {
          handleMenuItemKeyPress(event, index);
        });
      });
    }
  }

  // user dropdown
  let profileMenuTrigger = userDropDown.children[0];
  let profileMenu = userDropDown.children[1];

  // notification dropdown
  let notificationMenuTrigger = notDropDown.children[0];
  let notificationMenu = notDropDown.children[1];

  profileMenuTrigger.addEventListener("click", function () {
    toggleMenu(profileMenu, profileMenuTrigger);
  });

  notificationMenuTrigger.addEventListener("click", function () {
    toggleMenu(notificationMenu, notificationMenuTrigger);
  });

  window.addEventListener("mouseup", function (event) {
    if (
      event.target != userDropDown &&
      event.target.parentNode != userDropDown
    ) {
      closeMenu(profileMenu, profileMenuTrigger);
    }
    if (event.target != notDropDown && event.target.parentNode != notDropDown) {
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  });
}

app();
