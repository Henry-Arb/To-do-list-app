const delButton = document.querySelectorAll(".delete");
const editButton = document.querySelectorAll(".edit");
const saveButton = document.querySelectorAll(".save");

Array.from(delButton).forEach((element) => {
	element.addEventListener("click", deleteTask);
});

Array.from(saveButton).forEach((element) => {
	element.addEventListener("click", saveTask);
});

Array.from(editButton).forEach((element) => {
	element.addEventListener("click", editTask);
});

async function deleteTask() {
	console.log("Delete Works");
	const taskName = this.parentNode.parentNode.childNodes[3].innerText;
	console.log(taskName);
	try {
		const res = await fetch("deleteTask", {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				taskNamee: taskName,
			}),
		});
		const data = await res.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

function editTask() {
	console.log("Task edited");
	const taskContainer = this.parentNode.parentNode.childNodes[3];
	const editText = this.parentNode.childNodes[3];
	const saveText = this.parentNode.childNodes[1];
	const editingStuff = this.parentNode.parentNode.childNodes[1];

	//Hides edit button and shows save button.
	editText.classList.toggle("hidden");
	saveText.classList.toggle("hidden");

	//Hides the current task and shows the input where user can edit the task.
	editingStuff.classList.toggle("hidden");
	taskContainer.classList.toggle("hidden");

	//Sets the "old" name of the task as a placeholder for the edit input.
	editingStuff.placeholder = taskContainer.innerText;
}

async function saveTask() {
	const editText = this.parentNode.childNodes[3];
	const saveText = this.parentNode.childNodes[1];
	const editingStuff = this.parentNode.parentNode.childNodes[1];
	const taskContainer = this.parentNode.parentNode.childNodes[3];

	//Takes the value of the input and sets it as the new task.
	let newTask = editingStuff.value;
	//Takes the value of the old task and sets it as the old task.
	const oldTask = taskContainer.innerText;

	//If user doesn't put anything in the input. Sets new task to equal old task.
	if (newTask === "") {
		newTask = oldTask;
	}

	//Hides save button and shows edit button.
	editText.classList.toggle("hidden");
	saveText.classList.toggle("hidden");

	//Hides editing input and shows current task.
	editingStuff.classList.toggle("hidden");
	taskContainer.classList.toggle("hidden");

	//passes in the parameters of oldTask and newTask where they are then used to find and update the value of the task on the database.
	try {
		const res = await fetch("editTask", {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				oldTask: oldTask,
				newTask: newTask,
			}),
		});
		const data = await res.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}
