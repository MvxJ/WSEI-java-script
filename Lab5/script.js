const numberOfFiedlds = document.getElementById("numberOfFields");
const fieldsBox = document.getElementById("inputFields");
const addButton = document.getElementById("addButton");

createNumberFields();

numberOfFiedlds.addEventListener("change", event => {
    createNumberFields();
});

addButton.addEventListener("click", event => {
    calc();
});

async function calc() {
    document.getElementById("addingResults").innerHTML = "0";

    const start = performance.now();
        await addAll();
    const end = performance.now();

    document.getElementById("addingTime").innerHTML = `Execution time: ${end - start} ms`;
}

async function addAll() {
    const fields = document.querySelectorAll('.numberFields');
    let results = 0;
    fields.forEach(field => {
        asyncAdd(parseInt(results), parseInt(field.value)).then(response => {
            if (response) {
                results += response;
                document.getElementById("addingResults").innerHTML = results;
            }
        });
    });
}

const asyncAdd = async (a,b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      return Promise.reject('Argumenty muszą mieć typ number!')
    }
    return new Promise((resolve, reject) => {
      setTimeout(() =>{
        resolve(a+b)
      }, 100)
    })
  }

function createNumberFields() {
    fieldsBox.innerHTML = "";
    const value = numberOfFiedlds.value;
    for (i = 0; i < value; i++) {
        const newElement = document.createElement("input")
        newElement.type = "text";
        newElement.classList.add("numberFields");

        fieldsBox.appendChild(newElement);
    }
}