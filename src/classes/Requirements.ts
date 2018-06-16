
export class Requirements {
  [key: string]: any
  public prefix?: boolean = true
  public text?: boolean = true
  public ats?: boolean = false
  public params?: { [key: string]: boolean } = {}

  constructor(required?: Requirements) {
    if (required)
      for (let prop in required)
        this[prop] = required[prop]
  }
}