const tasksDOM = document.querySelector(".tasks");

const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");


//  get data from /api/v1/tasks
const showTasks = async () => {
    try {
        const { data: tasks }  = await axios.get("/api/v1/tasks");
       
       // no tasks
        if (tasks.length  < 1) {
            tasksDOM.innerHTML = `<h5 class="emply-list">タスクが見つかりません.</h5>`;
            return;
        }
       
        // output tasks
        const allTasks = tasks.map((task)=> {
            const {completed, _id, name} = task;
            
            return ` <div class="single-task ${completed && "task-completed"}">
            <h5>
                <span><i class="fa-regular fa-circle-check"></i></span>${name}
            </h5>
            <div class="task-links">
                <a href="edit.html?id=${_id}" class="edit-link">
                  <i class="fa-regular fa-pen-to-square"></i>
                </a>
                <button type="button" class="delete-btn" data-id="${_id}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>`;
        }).join("");
        tasksDOM.innerHTML = allTasks;
    } catch(err) {
        console.log(err);
    }
}

// create a new task
formDOM.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent reload behavior
    const name = taskInputDOM.value;
    try {
        await axios.post("/api/v1/tasks", { name: name });
        showTasks();
        taskInputDOM.value = "";
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "作成しました.";
        formAlertDOM.classList.add("text-success");
    } catch (err) {
        console.log(err);
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "無効です. もう一度やり直してください.";
        formAlertDOM.classList.remove("text-success");
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
    }, 3000);
});

tasksDOM.addEventListener("click", async (event) => {
    const elm = event.target;
    if(elm.parentElement.classList.contains("delete-btn")){
        const id = elm.parentElement.dataset.id;
        try {
            await axios.delete(`/api/v1/tasks/${id}`);
            showTasks();
        } catch (err) {
            console.log(err);
        }
    }
});

showTasks();