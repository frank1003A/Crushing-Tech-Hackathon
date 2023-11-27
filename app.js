function app() {
  const guideContainer = document.getElementById("stepper");
  const btn_guide = document.getElementById("toggle-guide");
  const chevDownIcon = document.getElementById("chev-down");
  let trialCall = document.getElementById("trial-callout");
  let completeCount = document.getElementById("complete-count");
  let progressBar = document.getElementById("progress-line");
  let userDropDown = document.getElementById("user-dropdown");
  let notDropDown = document.getElementById("not-dropdown");
  const steps = document.querySelectorAll(".step");
  const checkBoxButtons = document.querySelectorAll(".indicator");
  let dottedCircles = document.querySelectorAll(".dotted_circle");
  let checkMarks = document.querySelectorAll(".checkmark");

  //
  let isActive = 0;
  let completed = [];
  const stepMax = 5;

  // Add "step-active" class to the first step by default
  const firstStep = steps[isActive];
  firstStep.classList.add("step-active");
  firstStep.ariaExpanded = "true";

  function rotateChevronIcon() {
    if (chevDownIcon.classList.contains("rotate_180")) {
      chevDownIcon.classList.remove("rotate_180");
      chevDownIcon.classList.add("rotate_0");
      guideContainer.ariaExpanded = "false";
    } else {
      chevDownIcon.classList.remove("rotate_0");
      chevDownIcon.classList.add("rotate_180");
      guideContainer.ariaExpanded = "true";
    }
  }

  btn_guide.addEventListener("click", function () {
    // Toggle the "display_none" class on the stepper element
    guideContainer.classList.toggle("display_none");

    // Call the function to rotate the chevron icon
    rotateChevronIcon();
  });

  function expandStepRegion(step, index) {
    // Remove "step-active" class and set aria-expanded to false for all steps
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove("step-active");
      steps[i].ariaExpanded = "false";
    }

    // Add "step-active" class and set aria-expanded to true for the selected step
    step.classList.add("step-active");
    step.ariaExpanded = "true";

    // Set the active step index
    isActive = index;
  }

  function markStepAsComplete(button, index) {
    //let checkMarkStatus = step.children[3];

    // Show the check mark
    checkMarks[index].style.display = "flex";

    // Add the index to the completed array
    completed.push(index);

    // Update the completed count and progress bar
    completeCount.innerHTML = `${completed.length}`;
    progressBar.style.width = `${20 * completed.length}%`;

    // Set aria-pressed attribute to true
    button.ariaPressed = "true";
    button.ariaLabel = button.ariaLabel.replace(
      "as complete",
      "as not complete"
    );
  }

  function markStepAsIncomplete(button, index) {
    // Hide the check mark and show the dotted circle
    checkMarks[index].style.display = "none";
    dottedCircles[index].style.display = "block";

    // Remove the index from the completed array
    completed = completed.filter((c) => c !== index);

    // Update the completed count and progress bar
    completeCount.innerHTML = `${completed.length}`;
    progressBar.style.width = `${20 * completed.length}%`;

    // Set aria-pressed attribute to false
    button.ariaPressed = "false";
    button.ariaLabel = button.ariaLabel.replace(
      "as not complete",
      "as complete"
    );
  }

  // Function to handle step check
  function handleStepCheck(button, index) {
    for (let i = 0; i < completed.length; i++) {
      if (completed[i] === index) {
        markStepAsIncomplete(button, index);
        return;
      }
    }
    markStepAsComplete(button, index);
  }

  function moveToNextIncompleteStep() {
    if (completed.length === stepMax) {
      return;
    }

    let incompleteSteps = Array.from(steps).filter(
      (s, i) => !completed.includes(i)
    );

    console.log(incompleteSteps[0]);

    /** if (incompleteSteps.length > 0) {
      expandStepRegion(incompleteSteps[0], 0);
    } else {
      return;
    } */
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      expandStepRegion(step, index);
    });
  });

  checkBoxButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      dottedCircles[index].style.display = "none";
      handleStepCheck(btn, index);
      moveToNextIncompleteStep();
    });
  });

  function handleStepKeyPress(event, index) {
    // Determining if the current step is the last or first in the region.
    const isLastStep = index === steps.length - 1;
    const isFirstStep = index === 0;

    // Retrieving the next and previous steps.
    const nextStep = steps.item(index + 1);
    const prevStep = steps.item(index - 1);

    // Setting the aria-expanded attribute of the first step.
    steps[0].ariaExpanded = "true";

    // Checking for "Enter" or "Space" key press to trigger expansion.
    if (event.key === "Enter" || event.key === " ") {
      // Calling the function to expand the step region.
      expandStepRegion(steps[index], index);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLastStep) {
        // If last, focus on the first step in the region.
        steps.item(0).focus();
        return;
      }

      // Focusing on the next step.
      nextStep.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstStep) {
        // If first, focus on the last step.
        steps.item(steps.length - 1).focus();
        return;
      }

      // Focusing on the next step.
      prevStep.focus();
    }
  }

  // Iterating over focusable steps to handle keyup events for accessibility.
  steps.forEach((step, index) => {
    // Adding event listener to each step for keyboard interaction.
    step.addEventListener("keyup", function (event) {
      handleStepKeyPress(event, index);
    });
  });

  // Hiding the trial callout by setting
  // its display property to "none".
  function closeTrialCallout() {
    trialCall.style.display = "none";
  }

  // Closing the menu by removing the "menu-active" class and updating aria-expanded.
  function closeMenu(menu, button) {
    // Checking if the menu is currently active.
    if (menu.classList.contains("menu-active")) {
      // Removing the "menu-active" class to hide the menu.
      menu.classList.remove("menu-active");

      // Updating the aria-expanded attribute to indicate the menu is closed.
      button.ariaExpanded = "false";

      // Returning focus to the button that triggered the menu.
      button.focus();
    }
  }

  // Handling the Escape key press to close associated menus.
  function handleMenuEscapeKeyPress(event) {
    // Checking if the pressed key is "Escape".
    if (event.key == "Escape") {
      // Closing profile and notification menus.
      closeMenu(profileMenu, profileMenuTrigger);
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  }

  // Handling key presses for navigation within a menu.
  function handleMenuItemKeyPress(event, index) {
    // Retrieving all menu items for navigation.
    const allMenuItems = getAllMenuItem(profileMenu);

    // Determining if the current item is the last or first in the list.
    const isLastMenuItem = index === allMenuItems.length - 1;
    const isFirstMenuItem = index === 0;

    // Retrieving the next and previous menu items.
    const nextMenuItem = allMenuItems.item(index + 1);
    const prevMenuItem = allMenuItems.item(index - 1);

    // Navigating based on ArrowRight, ArrowDown, ArrowUp, and ArrowLeft keys.
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLastMenuItem) {
        // If last, focus on the first menu item.
        allMenuItems.item(0).focus();
        return;
      }

      // Focusing on the next menu item.
      nextMenuItem.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstMenuItem) {
        // If first, focus on the last menu item.
        allMenuItems.item(allMenuItems.length - 1).focus();
        return;
      }

      // Focusing on the previous menu item.
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
