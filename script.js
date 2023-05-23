const submitBtn = document.querySelector("#submitBtn");
const input = document.querySelector("#addToDoInput");
const toDoListItems = document.querySelector("#toBeAppendedTo");



submitBtn.addEventListener("click", function(){
    if(input.value === ""){
        alert("Input field cannot be empty");
    }else{
    const listItem = document.createElement("div");
    listItem.innerText = input.value;
    listItem.draggable = "true";
    listItem.classList.add("defaultClass");
    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.contentEditable = "false";
    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fa-solid", "fa-trash-can" , "alignToTheRight");
    deleteButton.contentEditable = "false";
//This is to add the item to local storage before resetting the input.
    const todosArray = JSON.parse(localStorage.getItem("todos")) || [];
    const newItem = {
        id: todosArray.length,
        completed: false,
        title: listItem.innerText,
    }
    todosArray.push(newItem);
    localStorage.setItem("todos", JSON.stringify(todosArray));
//
//This is to mark a selected item as complete.
    checkboxInput.addEventListener("change", function(){
        markItem(checkboxInput, listItem, newItem);
        localStorage.setItem("todos", JSON.stringify(todosArray));
    })

    // console.log(listItem);
// This is for everything concerning the deletion of an item
    deleteButton.addEventListener("mouseover", function(){
        deleteButton.classList.add("changeToRed");
    })
    deleteButton.addEventListener("mouseout", function(){
        deleteButton.classList.remove("changeToRed");
    })
    deleteButton.addEventListener("click", function(){
        removeTodo(todosArray, newItem, listItem);
        localStorage.setItem("todos", JSON.stringify(todosArray));
        // todosArray.splice(newItem.id, 1);
        // console.log(newItem.id);
        // // todosArray.indexOf(newItem.title)
        // toDoListItems.removeChild(listItem);
        // localStorage.setItem("todos", JSON.stringify(todosArray));
    })


//This is for the drag and drop feature
    listItem.addEventListener("dragstart", function(){
        listItem.classList.add("draggableColors");

    })
    listItem.addEventListener("dragend", function(){
        listItem.classList.remove("draggableColors");
    })

    toDoListItems.addEventListener("dragover", function(e){
        e.preventDefault();
        const elementBelow = getElementBelowTodo(toDoListItems, e.clientY);
        const elementBeingDragged = document.querySelector(".draggableColors");
        if(elementBelow === null){
            toDoListItems.appendChild(elementBeingDragged);
        }else{
            toDoListItems.insertBefore(elementBeingDragged, elementBelow);
        }
    }) 


//  This is to be able to edit a todo
    listItem.addEventListener("dblclick", function(){
        editTodo(listItem, checkboxInput , deleteButton, newItem, todosArray);
    })



    listItem.prepend(checkboxInput);
    listItem.append(deleteButton);
    toDoListItems.appendChild(listItem);
    input.value = "";
    }


})

function editTodo(listItem, checkboxInput , deleteButton, newItem, todosArray){
    listItem.contentEditable = "true";
        checkboxInput.contentEditable = "false";
        deleteButton.contentEditable = "false";
        listItem.addEventListener("keydown", function(e){
            if(e.key === "Enter"){
                listItem.contentEditable = "false";
                console.log(listItem.innerText);
                newItem.title = listItem.innerText;
                localStorage.setItem("todos", JSON.stringify(todosArray));
            }
        })
}

function getElementBelowTodo(container, mouseY){
    const elementsNotBeingDragged = [...container.querySelectorAll(".defaultClass:not(.draggableColors)")];
  
  return  elementsNotBeingDragged.reduce((closest, child)=>{
        const box = child.getBoundingClientRect();
        const offset = mouseY - box.top - box.height/2;
        if(offset<0 && offset > closest.offset){
            return {offset:offset, element:child}
        }else{
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

function markItem(checkboxInput, listItem, newItem){
if(checkboxInput.checked){
    listItem.classList.add("lineThrough");
    newItem.completed = true;
}
else{
    listItem.classList.remove("lineThrough");
    newItem.completed = false;
}
}

function removeTodo(todosArray, newItem, listItem){
    todosArray.splice(newItem.id, 1);
        console.log(newItem.id);
        // todosArray.indexOf(newItem.title)
        // toDoListItems.removeChild(listItem);
        // localStorage.setItem("todos", JSON.stringify(todosArray));
}


// window.addEventListener("load", function(){
//     const todos = JSON.parse(localStorage.getItem("todos"));
//     for(let eachTodo of todos){
//         const newDiv = document.createElement("div");
//         newDiv.innerText = eachTodo.title;
//         newDiv.draggable = "true";
//         newDiv.classList.add("defaultClass");
//         const newCheckboxInput = document.createElement("input");
//         newCheckboxInput.type = "checkbox";
//         const newDeleteButton = document.createElement("i");
//         newDeleteButton.classList.add("fa-solid", "fa-trash-can" , "alignToTheRight");
//         newCheckboxInput.checked = eachTodo.checked;
//         newCheckboxInput.addEventListener("change", function(){
//             if(newCheckboxInput.checked){
//                 newDiv.classList.add("lineThrough");
//             }
//             else{
//                 newDiv.classList.remove("lineThrough");
//             }
//         })
//         newDeleteButton.addEventListener("mouseover", function(){
//             newDeleteButton.classList.add("changeToRed");
//         })
//         newDeleteButton.addEventListener("mouseout", function(){
//             newDeleteButton.classList.remove("changeToRed");
//         })
//         newDeleteButton.addEventListener("click", function(){
//             // todos.splice(todos.indexOf(eachTodo.title), 1);
//             // todos.splice(eachTodo.id, 1);
//             todos.filter((eachTodo)=>{
//                 // eachTodo.title = ;
//             })
//             toDoListItems.removeChild(newDiv);
//             localStorage.setItem("todos", JSON.stringify(todos));
//         })




//     newDiv.addEventListener("dragstart", function(){
//         newDiv.classList.add("draggableColors");
//     })
//     newDiv.addEventListener("dragend", function(){
//         newDiv.classList.remove("draggableColors");
//     })

//     toDoListItems.addEventListener("dragover", function(e){
//         e.preventDefault();
//         const elementBelow = getElementBelowTodo(toDoListItems, e.clientY);
//         const elementBeingDragged = document.querySelector(".draggableColors");
//         if(elementBelow === null){
//             toDoListItems.appendChild(elementBeingDragged);
//         }else{
//             toDoListItems.insertBefore(elementBeingDragged, elementBelow);
//         }
//         // console.log(elementBelow);
//     }) 

//     function getElementBelowTodo(container, mouseY){
//         const elementsNotBeingDragged = [...container.querySelectorAll(".defaultClass:not(.draggableColors)")];
      
//       return  elementsNotBeingDragged.reduce((closest, child)=>{
//             const box = child.getBoundingClientRect();
//             const offset = mouseY - box.top - box.height/2;
//             if(offset<0 && offset > closest.offset){
//                 return {offset:offset, element:child}
//             }else{
//                 return closest;
//             }
//         }, {offset: Number.NEGATIVE_INFINITY}).element
//     }
    
//         newDiv.prepend(newCheckboxInput);
//         newDiv.appendChild(newDeleteButton);
//         toDoListItems.appendChild(newDiv);
//     }
// })

window.addEventListener("load", function(){
    const newApproach = JSON.parse(localStorage.getItem("todos"));
    // console.log(newApproach[0]);
    toDoListItems.append(newApproach[0].title);
    newApproach.splice(0,1);
})  