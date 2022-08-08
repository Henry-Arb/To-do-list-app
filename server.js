const { request } = require("express");
const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const PORT = 1212;
require("dotenv").config();

//Connection URI
const uri = process.env.DB_STRING;

//Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
	try {
		// Connect the client to the server (optional starting in v4.7)
		await client.connect();
		// Establish and verify connection
		await client.db("admin").command({ ping: 1 });
		console.log("Connected successfully to server");
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

let dbName = "ToDoList";
let db = client.db(dbName);

console.log(`Connected to ${dbName} Database`);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Post - Create - works!
app.post("/addTask", async (req, res) => {
	try {
		const result = await db.collection("toDoListProper").insertOne({
			//Makes Sure that there are no extra whitespaces surrounding the text
			taskName: req.body.Task.trim(),
		});
		console.log("Task Added");
		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
});

//Get - Read
app.get("/", async (req, res) => {
	try {
		const data = await db.collection("toDoListProper").find().toArray();
		res.render(`index.ejs`, { toDo: data });
	} catch (err) {
		console.log(err);
	}
});

//Put - Update - works!
app.put("/editTask", async (req, res) => {
	try {
		const result = await db.collection("toDoListProper").updateOne(
			{
				taskName: req.body.oldTask,
			},
			{
				$set: {
					taskName: req.body.newTask,
				},
			},
			{
				sort: {
					sort: { _id: -1 },
					upsert: true,
				},
			}
		);
		console.log("Task has been changed");
		res.json("Task has been changed.");
	} catch (err) {
		console.log(err);
	}
});

//Delete - Delaytay - works!
app.delete("/deleteTask", async (req, res) => {
	console.log(req.body);
	try {
		const result = await db.collection("toDoListProper").deleteOne({
			taskName: req.body.taskNamee,
		});
		console.log("Task Removed...");
		res.json("Task Removed");
	} catch (err) {
		console.log(err);
	}
});

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
