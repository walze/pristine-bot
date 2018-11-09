
type TaskCallback<A, B> = (value: A) => B;

class Task<TaskType, OldTaskType> {

  constructor(
    public callback: (value: OldTaskType) => TaskType,
    public runner: TasksRunner,
  ) { }

  public next<NewTaskType = void>(
    newCallback: TaskCallback<TaskType, NewTaskType>,
  ) {

    const newTask = new Task<NewTaskType, TaskType>(
      newCallback,
      this.runner,
    )

    this.runner.addTask(newTask)

    return newTask

  }

  public end() {
    return this.runner.end()
  }
}

interface IEnd {
  task: Task<unknown, unknown>;
  return: unknown;
  error: string | boolean;
}

export class TasksRunner {

  private _tasks: Array<Task<unknown, unknown>> = []

  public addTask(task: Task<any, any>) {
    this._tasks.push(task)

    return task
  }

  public start<B = undefined>(func: TaskCallback<undefined, B>) {
    const newTask = new Task<B, any>(func, this)

    this.addTask(newTask)

    return this._tasks[this._tasks.length - 1] as Task<B, any>;
  }

  public end() {
    let arg: unknown
    const result: IEnd[] = []

    this._tasks.map(task => {
      let error: string | false = false

      try {
        arg = task.callback(arg)
      } catch (e) {
        arg = null
        const err = e as Error
        error = `${err.message} || ${err.name}`
      }

      result.push({
        task,
        return: arg,
        error,
      })
    })

    return result
  }
}
