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

// Create an instance of the Process class
let processInstance;
const innerSimulation = document.getElementById("innerSimulation");
let bufferSize= parseInt(
  document.querySelector('input[name="radio"]:checked').value,
  10,
);
console.log("Buffer size selected:", bufferSize);; 

document.getElementById("start").addEventListener("click", async function () {
  

// Select the first radio button (buffer size 0) by default
bufferSize = parseInt(
  document.querySelector('input[name="radio"]:checked').value,
  10,
);
console.log("Buffer size selected:", bufferSize);
  if (bufferSize == 0) {
    alert("Select Buffer Size before Starting.")
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
});

const put = document.getElementById("put");

put.addEventListener("keyup", async function (event) {
  if (bufferSize == 0) {
    alert("Select Buffer Size and Click on Start before Producing.")
    // Clear input field after processing
    put.value = "";
    return;
  }
  if (event.key === "Enter") {
    const inputValue = put.value.trim(); // Trim input value
    if (inputValue !== "") {
      const ol = document.getElementById("iteration");

      // Check if empty is 0
      if (processInstance.empty === 0) {
        // Display wait(empty) state
        let newDiv = document.createElement("div");
        newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
        newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                            <div class="col-span-1 sm:px-3.5">${processInstance.clock - 1}</div>
                            <div class="col-span-1 sm:px-3.5">${inputValue}</div>
                            <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                            <div class="col-span-1 sm:px-3.5 text-red-600">wait(empty)</div>`;
        ol.appendChild(newDiv);
        // Clear input field after processing
        put.value = "";

        // Scroll to the bottom of #innerSimulation
        setTimeout(() => {
          innerSimulation.scrollTop = innerSimulation.scrollHeight;
        }, 100);
        await delay(1000); // Wait 1 second before proceeding
        alert("Buffer is full!");

        // Display initial state
        newDiv = document.createElement("div");
        newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
        newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                            <div class="col-span-1 sm:px-3.5">${processInstance.clock}</div>
                            <div class="col-span-1 sm:px-3.5">${processInstance.value}</div>
                            <div class="col-span-1 sm:px-3.5 text-green-600">${processInstance.state}</div>
                            <div class="col-span-1 sm:px-3.5 text-green-600">initial state</div>`;
        ol.appendChild(newDiv);

        // Scroll to the bottom of #innerSimulation
        setTimeout(() => {
          innerSimulation.scrollTop = innerSimulation.scrollHeight;
        }, 100);
        await delay(1000); // Wait 1 second before proceeding
        return;
      }

      // Wait(empty)
      let newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock - 1}</div>
                          <div class="col-span-1 sm:px-3.5">${inputValue}</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">wait(empty)</div>`;
      ol.appendChild(newDiv);
      // Clear input field after processing
      put.value = "";

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);

      await delay(1000); // Wait 1 second before proceeding

      await processInstance.wait("empty");

      // Wait(mutex)
      newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock - 2}</div>
                          <div class="col-span-1 sm:px-3.5">${inputValue}</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">wait(mutex)</div>`;
      ol.appendChild(newDiv);

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);

      await delay(1000); // Wait 1 second before proceeding

      await processInstance.wait("mutex");

      // Critical section
      const emptyIndex = processInstance.process.indexOf("");
      if (emptyIndex !== -1) {
        processInstance.process[emptyIndex] = inputValue;
        processInstance.value = inputValue;

        // Generate and append the div element with updated values
        const processString = processInstance.process
          .filter((val) => val !== "")
          .join(", ");
        newDiv = document.createElement("div");
        newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
        newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processString}</div>
                            <div class="col-span-1 sm:px-3.5">${processInstance.clock - 3}</div>
                            <div class="col-span-1 sm:px-3.5">${processInstance.value}</div>
                            <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                            <div class="col-span-1 sm:px-3.5 text-red-600">critical section</div>`;
        ol.appendChild(newDiv);

        // Scroll to the bottom of #innerSimulation
        setTimeout(() => {
          innerSimulation.scrollTop = innerSimulation.scrollHeight;
        }, 100);
      }

      await delay(1000); // Wait 1 second before proceeding

      // Signal(mutex)
      processInstance.signal("mutex");

      newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock - 4}</div>
                          <div class="col-span-1 sm:px-3.5">${inputValue}</div>
                          <div class="col-span-1 sm:px-3.5 text-yellow-600">ok</div>
                          <div class="col-span-1 sm:px-3.5 text-green-600">signal(mutex)</div>`;
      ol.appendChild(newDiv);

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);

      await delay(1000); // Wait 1 second before proceeding

      // Signal(full)
      processInstance.signal("full");

      newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock}</div>
                          <div class="col-span-1 sm:px-3.5">${inputValue}</div>
                          <div class="col-span-1 sm:px-3.5 text-green-600">ready</div>
                          <div class="col-span-1 sm:px-3.5 text-green-600">signal(full)</div>`;
      ol.appendChild(newDiv);

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);
    }
  }
});

const get = document.getElementById("get");

get.addEventListener("keyup", async function (event) {
  if (bufferSize == 0) {
    alert("Select Buffer Size, Click on Start and Produce before consuming.")
// Clear input field after processing
get.value = "";
    return;
  }
  if (event.key === "Enter") {
    const ol = document.getElementById("iteration");

    // Check if full is 0
    if (processInstance.full === 0) {
      // Display wait(full) state
      let newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock - 1}</div>
                          <div class="col-span-1 sm:px-3.5"></div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">wait(full)</div>`;
      ol.appendChild(newDiv);
      // Clear input field after processing
      get.value = "";
      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);
      await delay(1000); // Wait 1 second before proceeding
      alert("Buffer is empty!");

      // Display initial state
      newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.value}</div>
                          <div class="col-span-1 sm:px-3.5 text-green-600">${processInstance.state}</div>
                          <div class="col-span-1 sm:px-3.5 text-green-600">initial state</div>`;
      ol.appendChild(newDiv);

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);
      await delay(1000); // Wait 1 second before proceeding

      return;
    }

    // Wait(full)
    let newDiv = document.createElement("div");
    newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
    newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                        <div class="col-span-1 sm:px-3.5">${processInstance.clock - 1}</div>
                        <div class="col-span-1 sm:px-3.5"></div>
                        <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                        <div class="col-span-1 sm:px-3.5 text-red-600">wait(full)</div>`;
    ol.appendChild(newDiv);
    // Clear input field after processing
    get.value = "";
    // Scroll to the bottom of #innerSimulation
    setTimeout(() => {
      innerSimulation.scrollTop = innerSimulation.scrollHeight;
    }, 100);

    await delay(1000); // Wait 1 second before proceeding

    await processInstance.wait("full");

    // Wait(mutex)
    newDiv = document.createElement("div");
    newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
    newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                        <div class="col-span-1 sm:px-3.5">${processInstance.clock - 2}</div>
                        <div class="col-span-1 sm:px-3.5"></div>
                        <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                        <div class="col-span-1 sm:px-3.5 text-red-600">wait(mutex)</div>`;
    ol.appendChild(newDiv);

    // Scroll to the bottom of #innerSimulation
    setTimeout(() => {
      innerSimulation.scrollTop = innerSimulation.scrollHeight;
    }, 100);

    await delay(1000); // Wait 1 second before proceeding

    await processInstance.wait("mutex");

    // Critical section
    const filledIndex = processInstance.process.findIndex((val) => val !== "");
    let removedValue = "";
    if (filledIndex !== -1) {
      removedValue = processInstance.process[filledIndex];
      processInstance.process[filledIndex] = "";
      processInstance.value = removedValue;

      // Generate and append the div element with updated values
      const processString = processInstance.process
        .filter((val) => val !== "")
        .join(", ");
      newDiv = document.createElement("div");
      newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
      newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processString}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.clock - 3}</div>
                          <div class="col-span-1 sm:px-3.5">${processInstance.value}</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">busy</div>
                          <div class="col-span-1 sm:px-3.5 text-red-600">critical section</div>`;
      ol.appendChild(newDiv);

      // Scroll to the bottom of #innerSimulation
      setTimeout(() => {
        innerSimulation.scrollTop = innerSimulation.scrollHeight;
      }, 100);
    }

    await delay(1000); // Wait 1 second before proceeding

    // Signal(mutex)
    processInstance.signal("mutex");

    newDiv = document.createElement("div");
    newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
    newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                        <div class="col-span-1 sm:px-3.5">${processInstance.clock - 4}</div>
                        <div class="col-span-1 sm:px-3.5">${removedValue}</div>
                        <div class="col-span-1 sm:px-3.5 text-yellow-600">ok</div>
                        <div class="col-span-1 sm:px-3.5 text-green-600">signal(mutex)</div>`;
    ol.appendChild(newDiv);

    // Scroll to the bottom of #innerSimulation
    setTimeout(() => {
      innerSimulation.scrollTop = innerSimulation.scrollHeight;
    }, 100);

    await delay(1000); // Wait 1 second before proceeding

    // Signal(empty)
    processInstance.signal("empty");

    newDiv = document.createElement("div");
    newDiv.classList.add("grid", "grid-cols-5", "border-b", "text-center");
    newDiv.innerHTML = `<div class="col-span-1 sm:px-3.5">${processInstance.process}</div>
                        <div class="col-span-1 sm:px-3.5">${processInstance.clock}</div>
                        <div class="col-span-1 sm:px-3.5">${removedValue}</div>
                        <div class="col-span-1 sm:px-3.5 text-green-600">ready</div>
                        <div class="col-span-1 sm:px-3.5 text-green-600">signal(empty)</div>`;
    ol.appendChild(newDiv);

    // Scroll to the bottom of #innerSimulation
    setTimeout(() => {
      innerSimulation.scrollTop = innerSimulation.scrollHeight;
    }, 100);
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
