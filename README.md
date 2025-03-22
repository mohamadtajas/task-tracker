# Task Tracker CLI

> Note that you have installed node js on your machine

## Usage Instructions

1. Add a Task:

```bash
node app.js add "first task"
```

2. Update a Task:

```bash
node app.js update 1 description="first task - end of project" status=in progress
```

3. Delete a Task:

```bash
node app.js delete 1
```

4. Mark a Task's Status:

```bash
node app.js mark 1 done
```

5. List Tasks:

```bash
node app.js list all
node app.js list done
node app.js list not-done
node app.js list in-progress
node app.js list todo
```


https://roadmap.sh/projects/task-tracker
