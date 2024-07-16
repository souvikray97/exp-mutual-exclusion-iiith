// Define the Process class with the required constructor
class Process {
  constructor(bufferSize, clock = 5, value = "", state = "ready") {
    this.process = new Array(bufferSize).fill("");
    this.clock = clock;
    this.value = value;
    this.state = state;
    this.empty = bufferSize;
    this.full = 0;
    this.mutex = 1;
  }

  wait(variable) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this[variable] > 0) {
          this[variable]--;
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  signal(variable) {
    this[variable]++;
  }
}

// Function to delay execution with a specified timeout
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const innerSimulation = document.getElementById("innerSimulation");
let bufferSize;
let processInstance;
let currentStep = 0;
const steps = []; // Array to store steps for "next" button iteration

const alertRed = document.getElementById("alert");
const alertRedText = document.getElementById("alert-text");

document.getElementById("start").addEventListener("click", async function () {
  // Select the first radio button (buffer size 0) by default
  bufferSize = parseInt(
    document.querySelector('input[name="radio"]:checked').value,
    10,
  );
  console.log("Buffer size selected:", bufferSize);
  if (bufferSize === 0) {
    alertRed.classList.remove("hidden");
    alertRedText.innerHTML = "Select Buffer Size before Starting.";
    await delay(2000);
    alertRed.classList.add("hidden");
    return;
  }
  processInstance = new Process(bufferSize);

  const ol = document.getElementById("iteration");

  // Generate and append the div element with initial values using the Process instance
  const div = document.createElement("div");
  div.classList.add("grid", "grid-cols-5", "border-b", "text-center");
  div.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                    <div class="col-span-1 sm:px-3.5">${processInstance.clock}</div>
                    <div class="col-span-1 sm:px-3.5">${processInstance.value}</div>
                    <div class="col-span-1 sm:px-3.5 text-green-600">${processInstance.state}</div>
                    <div class="col-span-1 sm:px-3.5 text-green-600">Start</div>`;
  ol.appendChild(div);

  // Scroll to the bottom of #innerSimulation
  setTimeout(() => {
    innerSimulation.scrollTop = innerSimulation.scrollHeight;
  }, 100);

  await delay(1000); // Wait 1 second before proceeding

  currentStep = 0;
  steps.length = 0;
});

// Function to get the appropriate class for a given state or operation
function getStateClass(state) {
  const greenStates = ["ready", "signal(empty)", "signal(mutex)", "initial state", "signal(full)"];
  const redStates = ["busy", "wait(empty)", "wait(mutex)", "critical section", "wait(full)"];
  const yellowStates = ["ok"];

  if (greenStates.includes(state)) {
    return "text-green-600";
  } else if (redStates.includes(state)) {
    return "text-red-600";
  } else if (yellowStates.includes(state)) {
    return "text-yellow-600";
  } else {
    return "";
  }
}

const put = document.getElementById("put");

put.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    if (bufferSize === 0) {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML =
        "Select Buffer Size and Click on Start before Producing.";
      put.value = "";
      await delay(2000);
      alertRed.classList.add("hidden");

      return;
    }
    if (processInstance.mutex === 0) {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML = "Another process is running. Please wait.";
      put.value = "";
      await delay(2000);
      alertRed.classList.add("hidden");

      return;
    }
    const inputValue = put.value.trim(); // Trim input value

    if (inputValue !== "") {
      const ol = document.getElementById("iteration");

      // Check if empty is 0
      if (processInstance.empty === 0) {
        // Display wait(empty) state
        steps.push({
          process: processInstance.process.slice(),
          clock: processInstance.clock - 1,
          value: inputValue,
          state: "busy",
          operation: "wait(empty)",
          alert: true // Add alert flag
        });
        put.value = "";
        await delay(1000); // Wait 1 second before proceeding

        // Display initial state
        steps.push({
          process: processInstance.process.slice(),
          clock: processInstance.clock,
          value: "",
          state: "ready",
          operation: "initial state",
        });

        await delay(1000); // Wait 1 second before proceeding
        return;
      }
      await processInstance.wait("mutex"); // wait mutex

      // Wait(empty)
      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 1,
        value: inputValue,
        state: "busy",
        operation: "wait(empty)",
      });
      put.value = "";
      await delay(1000); // Wait 1 second before proceeding

      await processInstance.wait("empty");

      // Wait(mutex)
      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 2,
        value: inputValue,
        state: "busy",
        operation: "wait(mutex)",
      });

      await delay(1000); // Wait 1 second before proceeding

      // Critical section
      const emptyIndex = processInstance.process.indexOf("");
      if (emptyIndex !== -1) {
        processInstance.process[emptyIndex] = inputValue;
        processInstance.value = inputValue;

        // Generate and append the div element with updated values
        const processString = processInstance.process
          .filter((val) => val !== "")
          .join(", ");
        steps.push({
          process: processString,
          clock: processInstance.clock - 3,
          value: inputValue,
          state: "busy",
          operation: "critical section",
        });
      }

      await delay(1000); // Wait 1 second before proceeding

      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 4,
        value: "",
        state: "ok",
        operation: "signal(mutex)",
      });

      await delay(1000); // Wait 1 second before proceeding

      // Signal(full)
      processInstance.signal("full");

      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock,
        value: "",
        state: "ready",
        operation: "signal(full)",
      });

      processInstance.signal("mutex");
    }
  }
});

const get = document.getElementById("get");

get.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    if (bufferSize === 0) {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML =
        "Select Buffer Size, Click on Start and Produce before consuming.";
      get.value = "";
      await delay(2000);
      alertRed.classList.add("hidden");
      return;
    }
    if (processInstance.mutex === 0) {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML = "Another process is running. Please wait.";
      get.value = "";
      await delay(2000);
      alertRed.classList.add("hidden");
      return;
    }

    const inputValue = get.value.trim(); // Trim input value
    if (inputValue !== "") {
      const ol = document.getElementById("iteration");

      await processInstance.wait("mutex"); //wait mutex

      // Check if full is 0
      if (processInstance.full === 0) {
        // Display wait(full) state
        steps.push({
          process: processInstance.process.slice(),
          clock: processInstance.clock - 1,
          value: inputValue,
          state: "busy",
          operation: "wait(full)",
          alert: true // Add alert flag
        });
        get.value = "";
        await delay(1000); // Wait 1 second before proceeding

        // Display initial state
        steps.push({
          process: processInstance.process.slice(),
          clock: processInstance.clock,
          value: "",
          state: "ready",
          operation: "initial state",
        });

        await delay(1000); // Wait 1 second before proceeding
        return;
      }
      // Wait(full)
      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 1,
        value: inputValue,
        state: "busy",
        operation: "wait(full)",
      });

      await delay(1000); // Wait 1 second before proceeding

      await processInstance.wait("full");

      // Wait(mutex)
      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 2,
        value: inputValue,
        state: "busy",
        operation: "wait(mutex)",
      });
      get.value = "";

      await delay(1000); // Wait 1 second before proceeding

      // Critical section
      const value = processInstance.process.shift();
      processInstance.process.push("");
      processInstance.value = value;

      // Generate and append the div element with updated values
      const processString = processInstance.process
        .filter((val) => val !== "")
        .join(", ");
      steps.push({
        process: processString,
        clock: processInstance.clock - 3,
        value,
        state: "busy",
        operation: "critical section",
      });

      await delay(1000); // Wait 1 second before proceeding

      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock - 4,
        value: "",
        state: "ok",
        operation: "signal(mutex)",
      });

      await delay(1000); // Wait 1 second before proceeding

      // Signal(empty)
      processInstance.signal("empty");

      steps.push({
        process: processInstance.process.slice(),
        clock: processInstance.clock,
        value: "",
        state: "ready",
        operation: "signal(empty)",
      });

      processInstance.signal("mutex");
    }
  }
});

// Event listener for the "next" button
document.getElementById("next").addEventListener("click", async function () {
  if (currentStep < steps.length) {
    const step = steps[currentStep];
    const ol = document.getElementById("iteration");
    const div = document.createElement("div");
    div.classList.add("grid", "grid-cols-5", "border-b", "text-center");

    const stateClass = getStateClass(step.state);
    const operationClass = getStateClass(step.operation);

    div.innerHTML = `<div class="col-span-1 sm:px-3.5">${step.process}</div>
                      <div class="col-span-1 sm:px-3.5">${step.clock}</div>
                      <div class="col-span-1 sm:px-3.5">${step.value}</div>
                      <div class="col-span-1 sm:px-3.5 ${stateClass}">${step.state}</div>
                      <div class="col-span-1 sm:px-3.5 ${operationClass}">${step.operation}</div>`;
    ol.appendChild(div);
    // Execute alert if flag is present and operation is "wait(empty)"
    if (step.alert && step.operation === "wait(empty)") {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML = "Buffer is full!";
      await delay(2000);
      alertRed.classList.add("hidden");
    }
    // Execute alert if flag is present and operation is "wait(empty)"
    if (step.alert && step.operation === "wait(full)") {
      alertRed.classList.remove("hidden");
      alertRedText.innerHTML = "Buffer is empty!";
      await delay(2000);
      alertRed.classList.add("hidden");
    }
    
    currentStep++;
  } else {
    console.log("No more steps to execute.");
  }
});

// Reset button event listener
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", function () {
  // Reset radio button to default (radio-1)
  const defaultRadio = document.getElementById("radio-1");
  defaultRadio.checked = true;

  // Clear the content of ol with id "iteration"
  const ol = document.getElementById("iteration");
  ol.innerHTML = "";

  // Reset processInstance to null or initial state as needed
  processInstance = null;
});
