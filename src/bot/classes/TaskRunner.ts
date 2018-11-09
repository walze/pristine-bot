
type TaskCallback<A, B> = (value: A) => B;

interface IEndTask {
  task: Task<unknown, unknown>;
  return: unknown;
  error: string | boolean;
}

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

export class TasksRunner {

  private _tasks: Array<Task<unknown, unknown>> = []
  private _EndMiddleware: (
    callback: () => IEndTask[],
  ) => any
  private _StepMiddleware: (
    callback: () => any,
  ) => any

  constructor(
    _EndMiddleware?: (
      callback: () => IEndTask[],
    ) => any,
    _StepMiddleware?: (
      callback: () => any,
    ) => any,
  ) {
    this._StepMiddleware = _StepMiddleware || ((callback) => callback())
    this._EndMiddleware = _EndMiddleware || ((callback) => callback())
  }

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
    return this._EndMiddleware(() => this._end())
  }

  private _end() {
    let arg: unknown
    const result: IEndTask[] = []

    this._tasks.map(task => {
      let error: string | false = false

      try {
        const middlewareResult = this._StepMiddleware(() => task.callback(arg))
        arg = middlewareResult
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
