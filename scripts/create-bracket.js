function createBracket (event) {
    event.preventDefault();
    console.log("Name" + event.target.querySelector("#bracket-name").value);
}

document.querySelector("#bracket-creator").addEventListener('submit', createBracket);