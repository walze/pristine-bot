
type TaskCallback<A, B> = (value: A) => B;

class Task<CallbackReturn> {

  constructor(
    public callback: (...args: any[]) => any,
    public runner: TasksRunner,
  ) { }

  public next<NewCallbackReturn = undefined>(
    func: TaskCallback<CallbackReturn, NewCallbackReturn>,
  ): Task<NewCallbackReturn> {

    const newTask = new Task<NewCallbackReturn>(func, this.runner)

    this.runner.addTask(newTask)

    return newTask

  }

  public end() {
    this.runner.end()
  }
}

export class TasksRunner {

  private _tasks: Array<Task<unknown>> = []

  public get tasksLength() {
    return this._tasks.length
  }

  public addTask(task: Task<unknown>) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    this._tasks.push(task)
    return task
  }

  public start<B = undefined>(func: TaskCallback<undefined, B>) {
    const newTask = new Task<B>(func, this)

    this.addTask(newTask)

    return this._tasks[this._tasks.length - 1] as Task<B>;
  }

  public end() {
    let arg = this._tasks[0].callback()

    console.log('\n', this._tasks, '\n')

    return this._tasks.map(task => {
      let error: string | false = false

      try {
        arg = task.callback(arg)
      } catch (e) {
        const err = e as Error
        error = `${err.message} || ${err.name}`
      }

      return {
        task,
        arg,
        error,
      }
    })
  }
}
