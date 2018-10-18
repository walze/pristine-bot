
/**
 * Action requirements
 *
 */
export class Requirements {
  [key: string]: boolean | { [key: string]: boolean }
  public prefix = true
  public text = true
  public ats = false
  public params: { [key: string]: boolean } = {}

  /**
   * Creates an instance of Requirements.
   */
  public constructor(required?: Requirements) {
    if (required)
      for (const prop in required)
        this[prop] = required[prop]
  }
}
