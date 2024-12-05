

let sortedItems = []; 


function start(){

    const input = document.getElementById("inputField").value;
    const items = input.split(" - "); 

    const lowercaseWords = [];
    const uppercaseWords = [];
    const numbers = [];

    
    items.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(Number(item));
        } else if (item[0] === item[0].toLowerCase()) {
            lowercaseWords.push(item);
        } else {
            uppercaseWords.push(item);
        }
    });
    
    lowercaseWords.sort((a, b) => a.localeCompare(b));
    uppercaseWords.sort((a, b) => a.localeCompare(b));
    numbers.sort((a, b) => a - b);


    const result = {};

    lowercaseWords.forEach((word, index) => {
        result[`a${index + 1}`] = word;
    });

    uppercaseWords.forEach((word, index) => {
        result[`b${index + 1}`] = word;
    });

    numbers.forEach((num, index) => {
        result[`n${index + 1}`] = num;
    });

    sortedItems = Object.keys(result).map(key => ({ key, value: result[key] }));
    displayItems(sortedItems);
}

function displayItems(items) {
    const left = document.getElementById("left");
    left.innerHTML = "";

    items.forEach(item => {
        const wordItem = document.createElement("div");
        wordItem.className = "word-item";
        wordItem.textContent = `${item.key}: ${item.value}`;
        wordItem.draggable = true;
        wordItem.id = item.key; 

        
        wordItem.ondragstart = drag;
        wordItem.onclick = () => displayWord(item.value);

        left.appendChild(wordItem);
    });
}


function displayWord(word) {
    document.getElementById("up").textContent += word + ' ';
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, targetBlockId) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    const draggedElement = document.getElementById(data);

    const targetBlock = document.getElementById(targetBlockId);

    if (targetBlockId === "right") {
        draggedElement.style.backgroundColor = getRandomColor();

        const rect = targetBlock.getBoundingClientRect(); 
        const offsetX = event.clientX - rect.left; 
        const offsetY = event.clientY - rect.top;  

        draggedElement.style.position = "absolute";
        // draggedElement.style.left = `${offsetX}px`;
        // draggedElement.style.top = `${offsetY}px`;

        draggedElement.style.left = `${event.clientX}px`;
        draggedElement.style.top = `${event.clientY}px`;

        draggedElement.style.width = `250px`;

        left.removeChild(draggedElement);
        right.appendChild(draggedElement);

        // draggedElement.onclick = () => displayWord(draggedElement.textContent);

    } else if (targetBlockId === "left") {

        draggedElement.style.backgroundColor = `#bbfaa8`;

        draggedElement.style.position = "";
        draggedElement.style.left = "";
        draggedElement.style.top = "";


        targetBlock.appendChild(draggedElement);
        updateLeft();
    }
    else{        
        targetBlock.appendChild(draggedElement);
    }
}

function updateLeft() {
    const left = document.getElementById("left");

    const itemsInLeft = Array.from(left.children).map(child => ({
        key: child.id,
        value: child.textContent.split(": ")[1] // Получаем текст слова
    }));

    itemsInLeft.sort((a, b) => a.key.localeCompare(b.key));

    
    left.innerHTML = ""; 
    itemsInLeft.forEach(item => {
        const wordItem = document.createElement("div");
        wordItem.className = "word-item";
        wordItem.textContent = `${item.key}: ${item.value}`;
        wordItem.draggable = true;
        wordItem.id = item.key;

        wordItem.style.backgroundColor = `#bbfaa8`;

        
        wordItem.ondragstart = drag;
        wordItem.onclick = () => displayWord(item.value);

        left.appendChild(wordItem);
    });
}



function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}