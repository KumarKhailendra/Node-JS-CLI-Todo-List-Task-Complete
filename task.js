#!/usr/bin/env node

// Requiring module
const fs = require("fs");

// Accessing arguments
const args = process.argv;

// The "task.js" is 7 characters long
// so -7 removes last 7 characters
const currentWorkingDirectory = args[1].slice(0, -7);

if (!fs.existsSync(currentWorkingDirectory + "task.txt")) {
  let createStream = fs.createWriteStream("task.txt");
  createStream.end();
}

if (!fs.existsSync(currentWorkingDirectory + "completed.txt")) {
  let createStream = fs.createWriteStream("completed.txt");
  createStream.end();
}

// in above code(line 14,20) , we create a task.txt and completed.txt file if they does not exist

function helpAndInfo() {
  const info = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  console.log(info);
}


switch (args[2]) {
  case "help":
    helpAndInfo();

    break;
  case "done":
    completeTheTask(args[3]);

    break;
  case "del":
    let index = args[3];
    deleteItem(index);

    break;
  case "add":
    let priority = args[3];
    let task = args[4];
    addTask(priority, task);
    break;
  case "ls":
    listAllTask();

    break;

  case "report":
    showReport();

    break;
  default:
    helpAndInfo();
    break;
}


function showReport() {
  // Read data from both the files
  const pendingTasks = fs
    .readFileSync(currentWorkingDirectory + "task.txt")
    .toString();
  const completedTasks = fs
    .readFileSync(currentWorkingDirectory + "completed.txt")
    .toString();

  // Split the data from both files
  allPendingTasks = pendingTasks.split("\n");

  allCompletedTasks = completedTasks.split("\n");
  let filterAllPendingTasks = allPendingTasks.filter(function (value) {
    return value !== "";
  });

  let filterAllCompletedTasks = allCompletedTasks.filter(function (value) {
    // Filter both the data for empty lines
    return value !== "";
  });

  filterAllPendingTasks = getPriorityTaskObj(filterAllPendingTasks);
  filterAllCompletedTasks = getPriorityTaskObj(filterAllCompletedTasks);

  console.log("Pending : " + filterAllPendingTasks.length);

  for (let i = 0; i < filterAllPendingTasks.length; i++) {
    let index = i;
    let task = filterAllPendingTasks[i].taskDescription;
    let priority = filterAllPendingTasks[i].priority;
    console.log(`${++index}. ${task} [${priority}]`);
  }

  console.log("Completed : " + filterAllCompletedTasks.length);

  for (let i = filterAllCompletedTasks.length - 1; i >= 0; i--) {
    let index = filterAllCompletedTasks.length - i;
    let task = filterAllCompletedTasks[i].taskDescription;
    console.log(`${index}. ${task}`);
  }
}

function listAllTask() {
  const fileData = fs
    .readFileSync(currentWorkingDirectory + "task.txt")
    .toString();

  // Split the string and store into array
  data = fileData.split("\n");

  // Filter the string for any empty lines in the file
  let filterData = data.filter(function (value) {
    return value !== "";
  });

  if (filterData.length === 0) {
    console.log("There are no pending tasks!");
  }

  //   [index] [task] [priority]
  let filterDataArrOfObj = getPriorityTaskObj(filterData);
  //  console.log(filterDataArrOfObj);
  for (let i = 0; i < filterDataArrOfObj.length; i++) {
    let index = i;
    let task = filterDataArrOfObj[i].taskDescription;
    let priority = filterDataArrOfObj[i].priority;
    console.log(`${++index}. ${task} [${priority}]`);
  }
}

function completeTheTask(index) {
  if (index) {
    // Read the data from todo.txt
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "task.txt")
      .toString();

    data = fileData.split("\n");

    let filterData = data.filter(function (value) {
      return value !== "";
    });

    if (index > filterData.length || index <= 0) {
      console.log(`Error: no incomplete item with index #${index} exists.`);
      return;
    }

    const deletedItem = filterData.splice(index - 1, 1);

    // Join the array to create a string
    const newData = filterData.join("\n");

    fs.writeFile(currentWorkingDirectory + "task.txt", newData, function (err) {
      if (err) throw err;
    });

    // Read the data from done.txt
    const doneData = fs
      .readFileSync(currentWorkingDirectory + "completed.txt")
      .toString();

    fs.writeFile(
      currentWorkingDirectory + "completed.txt",
      deletedItem + "\n" + doneData,
      function (err) {
        if (err) throw err;
        console.log("Marked item as done.");
      }
    );
  } else {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  }
}

function deleteItem(index) {
  if (index) {
    const fileData = fs
      .readFileSync(currentWorkingDirectory + "task.txt")
      .toString();

    data = fileData.split("\n");

    // Filter the data for any empty lines
    let filterData = data.filter(function (value) {
      return value !== "";
    });
    // console.log(filterData,84);

    if (index > filterData.length || index <= 0) {
      console.log(
        `Error: task with index #${index} does not exist. Nothing deleted.`
      );
      return;
    }

    let deleteItem = filterData.splice(index - 1, 1);
    // console.log(filterData,93);
    const newData = filterData.join("\n");
    // Write the new data back in file
    fs.writeFile(currentWorkingDirectory + "task.txt", newData, function (err) {
      if (err) throw err;

      // Logs the deleted index
      console.log("Deleted task" + " #" + index);
    });
  } else {
    console.log("Error: Missing NUMBER for deleting tasks.");
  }
}

function getPriorityTaskObj(arr) {
  let priorityTaskArrOfObj = arr.map((item) => {
    let priorityTaskArr = item.split(" ");
    let priority = Number(priorityTaskArr.shift());
    let task = priorityTaskArr.join(" ");

    // console.log("line no 72",priority);
    return {
      priority: priority,
      taskDescription: task,
    };
  });

  return priorityTaskArrOfObj;
}

function getSortedArr(arrOfStrings, priority, task) {
  let currentObj = {
    priority: priority,
    taskDescription: task,
  };
  // console.log(currentObj,"line 75");
  let arrOfObjs = arrOfStrings.map((task) => {
    let taskArr = task.split(" ");
    let priority = taskArr.shift();
    let taskDescription = taskArr.join(" ");

    return {
      priority: priority,
      taskDescription: taskDescription,
    };
  });

  // console.log(arrOfObjs,"line 89");

  //sorting
  let data = [];
  let p = currentObj;
  for (let i = 0; i < arrOfObjs.length; i++) {
    let pA = Number(arrOfObjs[i].priority);
    let pB = Number(p.priority);

    if (pA < pB) {
      // console.log(arrOfObjs[i] ,pA,pB);

      data.push(arrOfObjs[i]);
    } else if (pA > pB) {
      // console.log(arrOfObjs[i] ,pA,pB);

      data.push(p);
      p = arrOfObjs[i];
    } else {
      // console.log(arrOfObjs[i] ,pA,pB);

      data.push(arrOfObjs[i]);
    }
  }

  data.push(p);

  let sortedArrOfStrings = data.map((item) => {
    let priority = item.priority;
    let task = item.taskDescription;
    return `${priority} ${task}`;
  });
  // console.log(data,"119");
  // console.log(sortedArrOfStrings,"119");

  return sortedArrOfStrings;
}

function convertArrOfObjToArrOfStr(sortedArr) {
  let arrOfStr = sortedArr.map((item) => {
    let priority = item.priority;
    let taskDescription = item.taskDescription;

    return `${priority} ${taskDescription}`;
  });

  return arrOfStr;
}

function sortFilterArrFunction(arr) {
  let arrOfObj = arr.map((task) => {
    let taskArr = task.split(" ");
    let priority = taskArr.shift();
    let taskDescription = taskArr.join(" ");

    return {
      priority: priority,
      taskDescription: taskDescription,
    };
  });
  let arrOfObjs = [...arrOfObj];
  arrOfObjs.sort((a, b) => {
    return a.priority - b.priority;
  });
  return arrOfObjs;
}

function addTask(priority, task) {

  if (priority && task && priority >= 0) {
    // console.log("add task",priority, task,"54");

    //if i have both priority and task
    let fileData = fs
      .readFileSync(currentWorkingDirectory + "task.txt")
      .toString();

    let fileDataArr = fileData.split("\n");

    fileDataArr = fileDataArr.filter((task) => {
      return task !== "";
    });

    // console.log(fileDataArr);

    if (fileDataArr.length === 0) {

      fs.writeFile(
        currentWorkingDirectory + "task.txt",
        priority + " " + task,
        function (err) {
          // // Handle if there is any error
          if (err) throw err;

          // // Logs the new task added
          console.log(`Added task: "${task}" with priority ${priority}`);
        }
      );
    } else {
      let sortedArrOfStrings = getSortedArr(fileDataArr, priority, task);
      let fileData = sortedArrOfStrings.join("\n");
      fs.writeFile(
        currentWorkingDirectory + "task.txt",
        fileData,
        function (err) {
          // // Handle if there is any error
          if (err) throw err;

          // // Logs the new task added
          console.log(`Added task: "${task}"`);
          //   console.log(fileDataArr);
        }
      );
    }
  } else {
    console.log("Error: Missing tasks string. Nothing added!");
  }
}
