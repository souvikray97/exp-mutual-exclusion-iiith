// Define the Process class with the required constructor
class Process {
  constructor(bufferSize = undefined, clock = 3, value = undefined, state = "ready") {
    this.process = new Array(bufferSize).fill(undefined);
    this.clock = clock;
    this.value = value;
    this.state = state;
  }
}

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
 

  const ol = document.getElementById("iteration");

  // Clear existing items in the list
  ol.innerHTML = "";

  // Create an instance of the Process class
  const processInstance = new Process();

  // Generate and append the div element with initial values using the Process instance
  const div = document.createElement("div");
  div.classList.add("flex", "border-b", "py-2");
  div.innerHTML = `<div class="basis-1/4 pl-3 pr-5">${processInstance.process}</div>
                   <div class="basis-1/4 px-2">${processInstance.clock}</div>
                   <div class="basis-1/4 px-2">${processInstance.value}</div>
                   <div class="basis-1/4 pr-3 pl-5 text-green-600">${processInstance.state}</div>`;
  ol.appendChild(div);
});
