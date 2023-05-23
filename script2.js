const submitBtn = document.querySelector("#submitBtn");
const input = document.querySelector("#addToDoInput");
const toDoListItems = document.querySelector("#toBeAppendedTo");
const clearAllButton = document.querySelector("#clearAllButton");

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
    
    //Add Item to Local Storage
    const todosArray = JSON.parse(localStorage.getItem("todos")) || [];
    const newItem = {
        id: todosArray.length,
        completed: false,
        title: listItem.innerText,
    }
    todosArray.push(newItem);
    localStorage.setItem("todos", JSON.stringify(todosArray));

    //Delete a selected item
    deleteButton.addEventListener("mouseover", function(){
        deleteButton.classList.add("changeToRed");
    })
    deleteButton.addEventListener("mouseout", function(){
        deleteButton.classList.remove("changeToRed");
    })
    deleteButton.addEventListener("click", function(){
        removeTask(newItem.id, listItem);        
    })

    //Mark an item as complete
    checkboxInput.addEventListener("change", function(){
        markItem(newItem.id, checkboxInput, listItem);
    })

    //Delete all items selected as complete
    clearAllButton.addEventListener("click", function(){
        clearAll(newItem.id, true, listItem);
    })

    //Edit a todo
    listItem.addEventListener("dblclick", function(){
        editTodo(newItem.id, listItem);
    })

    //Reordering a todo(Drag and Drop)
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

    listItem.prepend(checkboxInput);
    listItem.append(deleteButton);
    toDoListItems.appendChild(listItem);
    input.value = "";
    }
})

    function removeTask(id, listItem){
        const todosArray = JSON.parse(localStorage.getItem("todos"));

        for(let index = 0; index< todosArray.length; index++){
            const topo = todosArray[index];
            if(topo.id === id){
                todosArray.splice(index, 1);
                toDoListItems.removeChild(listItem);
            }
        }
        localStorage.setItem("todos", JSON.stringify(todosArray));
    }

    function markItem(id, checkboxInput, listItem){
        const todosArray = JSON.parse(localStorage.getItem("todos"));

        if(checkboxInput.checked){
            listItem.classList.add("lineThrough");
            for(let index=0; index<todosArray.length; index++){
                const topo = todosArray[index];
                if(topo.id === id){
                todosArray[index].completed = true;
                }
            }
        }else{
            listItem.classList.remove("lineThrough");
            for(let index=0; index<todosArray.length; index++){
                const topo = todosArray[index];
                if(topo.id === id){
                todosArray[index].completed = false;
                }
            }
        }
        localStorage.setItem("todos", JSON.stringify(todosArray));
    }

    function clearAll(id, completed, listItem){
        const todosArray = JSON.parse(localStorage.getItem("todos"));
        for(let index = 0; index< todosArray.length; index++){
            const topo = todosArray[index];
            if(topo.id === id && topo.completed === completed){
                todosArray.splice(index, 1);
                toDoListItems.removeChild(listItem);
            }
        }
        localStorage.setItem("todos", JSON.stringify(todosArray));
    }

    function editTodo(id, listItem){
        const todosArray = JSON.parse(localStorage.getItem("todos"));

        alert("Todo now editabe: Press Enter key to save changes");
        listItem.contentEditable = "true";

        listItem.addEventListener("keydown", function(e){
            if(e.key === "Enter"){
                listItem.contentEditable = "false";
                for(let index = 0; index < todosArray.length; index++){
                    const topo = todosArray[index];
                    if(topo.id === id){
                        topo.title = listItem.innerText;
                        alert("Todo has been upadted");
                    }
                }
            }
            localStorage.setItem("todos", JSON.stringify(todosArray));        
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


window.addEventListener("load", function(){
    const todosReloadArray = JSON.parse(localStorage.getItem("todos"));
    for(let eachTodo of todosReloadArray){
        const newDiv = document.createElement("div");
        const newCheckboxInput = document.createElement("input");
        const newDeleteButton = document.createElement("icon");
        newDiv.append(eachTodo);
        newDiv.draggable = "true";
        newDiv.classList.add("defaultClass");
        newDiv.innerText = eachTodo.title;
        newCheckboxInput.type = "checkbox";
        newDeleteButton.classList.add("fa-solid", "fa-trash-can" , "alignToTheRight");

        //Delete a selected item
        newDeleteButton.addEventListener("mouseover", function(){
            newDeleteButton.classList.add("changeToRed");
        })
        newDeleteButton.addEventListener("mouseout", function(){
            newDeleteButton.classList.remove("changeToRed");
        })
        newDeleteButton.addEventListener("click", function(){
            removeTask(eachTodo.id, newDiv);
        })

        //Mark an item as complete
        newCheckboxInput.addEventListener("change", function(){
            markItem(eachTodo.id, newCheckboxInput, newDiv); 
        })
    
        //Delete all items selected as complete
        clearAllButton.addEventListener("click", function(){
            clearAll(eachTodo.id, true, newDiv);
        })

        //Edit a todo
        newDiv.addEventListener("dblclick", function(){
        editTodo(eachTodo.id, newDiv);
        })        

        //Reordering a todo(Drag and Drop)
        newDiv.addEventListener("dragstart", function(){
            newDiv.classList.add("draggableColors");
        })
        newDiv.addEventListener("dragend", function(){
            newDiv.classList.remove("draggableColors");
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


        newDiv.prepend(newCheckboxInput);
        newDiv.appendChild(newDeleteButton);
        toDoListItems.append(newDiv);
        console.log(newDiv);
    }
})