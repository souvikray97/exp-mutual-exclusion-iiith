// Define the Process class with the required constructor
class Process {
  constructor(bufferSize, clock = 3, value = "", state = "ready") {
    this.process = new Array(bufferSize).fill("");
    this.clock = clock;
    this.value = value;
    this.state = state;
  }
}

// Create an instance of the Process class
let processInstance;

document.getElementById("start").addEventListener("click", function () {
  // Select the first radio button (buffer size 0) by default
  const bufferSize = parseInt(
    document.querySelector('input[name="radio"]:checked').value,
    10,
  );
  console.log("Buffer size selected:", bufferSize);

  if (bufferSize == 0) {
    return;
  }
  processInstance = new Process(bufferSize);

  const ol = document.getElementById("iteration");

  // Clear existing items in the list
  ol.innerHTML = "";

  // Generate and append the div element with initial values using the Process instance
  const div = document.createElement("div");
  div.classList.add("flex", "border-b", "py-2", "text-center");
  div.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processInstance.process}</div>
                   <div class="basis-1/4 px-2">${processInstance.clock}</div>
                   <div class="basis-1/4 px-2">${processInstance.value}</div>
                   <div class="basis-1/4 pr-3 pl-5 text-green-600">${processInstance.state}</div>`;
  ol.appendChild(div);
  // Scroll to the bottom of #innerSimulation
  const innerSimulation = document.getElementById("innerSimulation");
  innerSimulation.scrollTop = innerSimulation.scrollHeight;
});

const put = document.getElementById("put");

put.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const inputValue = put.value.trim(); // Trim input value
    if (inputValue !== "") {
      // Update the value property of the Process instance
      processInstance.value = inputValue;

      // Find the first empty spot in the process array to add the new value
      const emptyIndex = processInstance.process.indexOf("");
      if (emptyIndex !== -1) {
        const ol = document.getElementById("iteration");

        for (let i = 1; i <= 3; i++) {
          const newDiv = document.createElement("div");
          newDiv.classList.add("flex", "border-b", "py-2", "text-center");

          newDiv.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processInstance.process}</div>
                                            <div class="basis-1/4 px-2">${processInstance.clock - i}</div>
                                            <div class="basis-1/4 px-2">${inputValue}</div>
                                            <div class="basis-1/4 pr-3 pl-5 text-red-600">busy</div>`;
          // Append each new div with a delay of 1 second
          setTimeout(() => {
            ol.appendChild(newDiv);
            // Scroll to the bottom of #innerSimulation
            const innerSimulation = document.getElementById("innerSimulation");
            innerSimulation.scrollTop = innerSimulation.scrollHeight;
          }, i * 1000);
        }

        processInstance.process[emptyIndex] = inputValue;

        // Generate and append the div element with updated values
        const div = document.createElement("div");
        div.classList.add("flex", "border-b", "py-2", "text-center");

        const processString = processInstance.process
          .filter((val) => val !== "")
          .join(", ");

        div.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processString}</div>
                       <div class="basis-1/4 px-2">${processInstance.clock}</div>
                       <div class="basis-1/4 px-2">${processInstance.value}</div>
                       <div class="basis-1/4 pr-3 pl-5 text-green-600">${processInstance.state}</div>`;

        // Append the new div to the existing list (ol)
        // Add a 1-second delay before appending the main div with updated values
        setTimeout(() => {
          ol.appendChild(div);
          // Scroll to the bottom of #innerSimulation
          const innerSimulation = document.getElementById("innerSimulation");
          innerSimulation.scrollTop = innerSimulation.scrollHeight;
        }, 4000);

        // Clear input field after processing
        put.value = "";
      } else console.log("Buffer is full. Cannot add more values.");
    }
  }
});

// Event listener for the "START" button (already defined)

const get = document.getElementById("get");

get.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const inputValue = get.value.trim(); // Trim input value
    if (inputValue !== "") {
      // Update the value property of the Process instance
      processInstance.value = inputValue;

      // Find the index of the value in the process array to remove
      const foundIndex = processInstance.process.indexOf(inputValue);
      if (foundIndex !== -1) {
        const ol = document.getElementById("iteration");

        for (let i = 1; i <= 3; i++) {
          const newDiv = document.createElement("div");
          newDiv.classList.add("flex", "border-b", "py-2", "text-center");

          newDiv.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processInstance.process}</div>
                              <div class="basis-1/4 px-2">${processInstance.clock - i}</div>
                              <div class="basis-1/4 px-2">${inputValue}</div>
                              <div class="basis-1/4 pr-3 pl-5 text-red-600">busy</div>`;

          // Append each new div with a delay of 1 second
          setTimeout(() => {
            ol.appendChild(newDiv);
            // Scroll to the bottom of #innerSimulation
            const innerSimulation = document.getElementById("innerSimulation");
            innerSimulation.scrollTop = innerSimulation.scrollHeight;
          }, i * 1000);
        }

        processInstance.process[foundIndex] = "";
        // Generate and append the div element with updated values
        const div = document.createElement("div");
        div.classList.add("flex", "border-b", "py-2", "text-center");

        const processString = processInstance.process
          .filter((val) => val !== "")
          .join(", ");

        div.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processString}</div>
                           <div class="basis-1/4 px-2">${processInstance.clock}</div>
                           <div class="basis-1/4 px-2">${processInstance.value}</div>
                           <div class="basis-1/4 pr-3 pl-5 text-green-600">${processInstance.state}</div>`;
        // Remove the value from the process array after a delay
        setTimeout(() => {
          ol.appendChild(div);
          // Scroll to the bottom of #innerSimulation
          const innerSimulation = document.getElementById("innerSimulation");
          innerSimulation.scrollTop = innerSimulation.scrollHeight;
        }, 4000);

        // Clear input field after processing
        get.value = "";
      } else {
        console.log("Value not found in process array.");
      }
    }
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
