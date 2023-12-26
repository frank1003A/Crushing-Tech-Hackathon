function app() {
  const guideContainer = document.getElementById("stepper");
  const guideBtn = document.getElementById("toggle-guide");
  const chevDownIcon = document.getElementById("chev-down");
  let trialCallBtn = document.querySelector("#close-trial-button");
  let trialCall = document.querySelector("#trial-callout");
  let completeCount = document.getElementById("complete-count");
  let progressBar = document.getElementById("progress-line");
  let menus = document.querySelectorAll(".dropdown");
  const steps = document.querySelectorAll(".step");
  const checkBoxButtons = document.querySelectorAll(".indicator");
  let dottedCircles = document.querySelectorAll(".dotted_circle");
  let loaderCircles = document.querySelectorAll(".loader-circle");
  let checkMarks = document.querySelectorAll(".checkmark");
  const contents = document.querySelectorAll(".info");
  const loader = document.querySelector(".loader-container");
  //
  let isActive = 0;
  let completed = [];
  const stepMax = 5;
  //
  const profileMenuTrigger = menus[1].querySelector("button");
  const profileMenu = menus[1].querySelector(".dropdown-container");
  const notificationMenuTrigger = menus[0].querySelector("button");
  const notificationMenu = menus[0].querySelector(".dropdown-container");

  //
  const activeMenuClass = "menu-active";
  const activeWidgetFocus = "menu-focus";

  window.addEventListener("load", function () {
    setTimeout(() => {
      loader.style.display = "none";
    }, 2000);
  });

  // helper functions
  const setFocus = (element) => {
    if (!element) {
      return;
    }
    element.focus();
  };

  /**error boundary for DOM elements*/
  const validateElementPresence = (element) => {
    if (!element) {
      console.error(
        `Error: ${element ? element.className : "Element"} not found.`
      );
      return;
    }
  };

  const isAriaExpanded = (element) => {
    if (!element) {
      return;
    }
    return element.attributes["aria-expanded"].value === "true";
  };

  const setDisplayStyleProperty = (element, value) => {
    validateElementPresence(element);
    element.style.display = value;
  };

  // Add "step-active" class to the first step by default
  const firstStep = steps[isActive];
  expandStepRegion(firstStep, 0);

  /**
   *  TRIAL CARD
   */
  function closeTrialCallout() {
    trialCall.classList.add("remove");
    setFocus(guideBtn);
  }

  trialCallBtn.addEventListener("click", function () {
    closeTrialCallout();
  });

  /**
   * STEP EXPANSION AND MARKING
   */

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

  guideBtn.addEventListener("click", function () {
    validateElementPresence(guideContainer);

    // Toggle the "display_none" class on the stepper element
    guideContainer.classList.toggle("display_none");

    // Call the function to rotate the chevron icon
    rotateChevronIcon(this);

    const isExpanded = isAriaExpanded(guideContainer);

    if (isExpanded) {
      this.setAttribute("aria-label", "collapse guide");
    } else {
      this.setAttribute("aria-label", "expand guide");
    }
  });

  function expandStepRegion(step, index) {
    validateElementPresence(step);

    // Remove "step-active" class and set aria-expanded to false for all steps
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove("step-active");
      steps[i].ariaExpanded = "false";
      steps[i].style.height = "45px";
    }

    // Add "step-active" class and set aria-expanded to true for the selected step
    step.classList.add("step-active");
    step.ariaExpanded = "true";
    // Set the active step index
    isActive = index;
    step.style.height = contents[isActive].scrollHeight + 30 + "px";
  }

  function markStepAsComplete(button, index) {
    let checkMarkStatus = steps[index].children[3];

    loaderCircles[index].style.display = "flex";
    checkMarkStatus.ariaLabel = "Loading, please wait...";

    // Show the check mark
    setTimeout(() => {
      loaderCircles[index].style.display = "none";
      checkMarkStatus.ariaLabel = "successfully marked as complete";
      checkMarks[index].classList.add("animate");
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
      moveToNextIncompleteStep();
    }, 1000);
  }

  function markStepAsIncomplete(button, index) {
    let checkMarkStatus = steps[index].children[3];

    // Hide the check mark and show the dotted circle
    checkMarks[index].classList.remove("animate");
    loaderCircles[index].style.display = "flex";

    checkMarkStatus.ariaLabel = "Loading, please wait...";

    setTimeout(() => {
      loaderCircles[index].style.display = "none";
      dottedCircles[index].style.display = "block";
      checkMarkStatus.ariaLabel = "successfully marked as incomplete";

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
    }, 1000);
  }

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
    let incompleteSteps = [];
    if (completed.length === stepMax) {
      return;
    }

    Array.from(steps).filter((s, i) => {
      if (!completed.includes(i)) {
        incompleteSteps.push(i);
      }
    });

    if (incompleteSteps.length > 0) {
      let index = incompleteSteps[0];
      let nextIncompleteStep = steps[incompleteSteps[0]];
      expandStepRegion(nextIncompleteStep, index);
      setFocus(checkBoxButtons[index]);
    } else {
      return;
    }
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      expandStepRegion(step, index);
    });

    // handle keyup events.
    steps.forEach((step, index) => {
      // event listener to each step for keyboard interaction.
      step.addEventListener("keyup", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          expandStepRegion(steps[index], index);
          setFocus(checkBoxButtons[index]);
        }
      });
    });
  });

  checkBoxButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      dottedCircles[index].style.display = "none";
      handleStepCheck(btn, index);
    });
  });

  const handleItemsArrowKeyPress = (items, event, index) => {
    const isLast = index === items.length - 1;
    const isFirst = index === 0;
    const next = items[index + 1];
    const prev = items[index - 1];
    //items[0].setAttribute("aria-expanded", "true");

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLast) {
        items[0].focus();
        return;
      }
      next.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirst) {
        items[items.length - 1].focus();
        return;
      }
      prev.focus();
    }

    if (event.key === "Home") {
      items[0].focus();
    }

    if (event.key === "End") {
      items[items.length - 1].focus();
    }
  };

  function getVisibleTabbableElements(element = document) {
    return Array.from(
      element.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      const isVisible = style.visibility !== "hidden" && style.opacity !== "0";
      const hasPositiveDimensions = el.offsetWidth > 0 && el.offsetHeight > 0;
      return isVisible && hasPositiveDimensions;
    });
  }

  document.addEventListener("keyup", function (e) {
    if (
      profileMenu.classList.contains(activeMenuClass) ||
      notificationMenu.classList.contains(activeMenuClass)
    ) {
      return;
    } else {
      const allFocusableElement = getVisibleTabbableElements();

      const handleTabKey = function (event) {
        const index = allFocusableElement.indexOf(event.target);

        if (index !== -1) {
          handleItemsArrowKeyPress(allFocusableElement, event, index);
        }
      };
      allFocusableElement.forEach((el) => {
        el.addEventListener("keyup", handleTabKey);
      });
    }
  });

  /**
   * KEYBOARD INTERACTIONS
   *
   * keyboard users are not only limited to accessing the checkbox
   * but they can also expand and collapse individual steps,
   * so they can see the extra action buttons and informations
   * before marking the step as complete.
   */

  // Handling the Escape key press to close associated menus.
  function handleMenuEscapeKeyPress(event, menu, button) {
    // Checking if the pressed key is "Escape".
    if (event.key == "Escape") {
      // Closing profile and notification menus.
      closeMenu(menu, button);
    }
  }

  // Closing the menu by removing the active menu class and updating aria-expanded.
  function closeMenu(menu, button) {
    // Checking if the menu is currently active.
    const isMenuOpen = menu.classList.contains(activeMenuClass);
    if (!isMenuOpen) {
      return;
    }
    // Removing the active menu class to hide the menu.
    menu.classList.remove(activeMenuClass);
    button.classList.remove(activeWidgetFocus);

    // Updating the aria-expanded attribute to indicate the menu is closed.
    button.setAttribute("aria-expanded", "false");

    // Returning focus to the button that triggered the menu.
    button.focus();
  }

  function openMenu(menu, button) {
    // Checking if the menu is currently active.
    const isMenuOpen = menu.classList.contains(activeMenuClass);
    if (isMenuOpen) {
      return;
    }
    // Add the activeMenuClass class to show the menu.
    menu.classList.add(activeMenuClass);
    button.classList.add(activeWidgetFocus);

    // Updating the aria-expanded attribute to indicate the menu is open.
    button.setAttribute("aria-expanded", "true");
  }

  function toggleMenu(menu, button) {
    const isExpanded = button.attributes["aria-expanded"].value === "true";
    const allMenuItems = menu.querySelectorAll("a, button");

    if (menu.classList.contains(activeMenuClass)) {
      closeMenu(menu, button);
    } else {
      openMenu(menu, button);
    }

    if (isExpanded) {
      button.setAttribute("aria-expanded", "false");
      button.focus();
      return;
    }

    button.setAttribute("aria-expanded", "true");
    allMenuItems ? allMenuItems[0].focus() : null;

    menu.addEventListener("keyup", function (event) {
      handleMenuEscapeKeyPress(event, menu, button);
    });

    allMenuItems.forEach((item, index) => {
      item.addEventListener("keyup", (event) => {
        // Handling key presses for navigation within a menu.
        handleItemsArrowKeyPress(allMenuItems, event, index);
      });
    });
  }

  profileMenuTrigger.addEventListener("click", function () {
    toggleMenu(profileMenu, profileMenuTrigger);
  });

  notificationMenuTrigger.addEventListener("click", function () {
    toggleMenu(notificationMenu, notificationMenuTrigger);
  });

  window.addEventListener("mouseup", function (event) {
    if (
      event.target != profileMenu &&
      event.target.parentNode != profileMenu &&
      event.target !== profileMenuTrigger &&
      event.target.parentNode != profileMenuTrigger
    ) {
      closeMenu(profileMenu, profileMenuTrigger);
    }
    if (
      event.target != notificationMenu &&
      event.target.parentNode != notificationMenu &&
      event.target !== notificationMenuTrigger &&
      event.target.parentNode != notificationMenuTrigger
    ) {
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  });
}

app();
