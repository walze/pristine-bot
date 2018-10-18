
/**
 * Action requirements
 *
 * @export
 * @class Requirements
 */
export class Requirements {
  [key: string]: any
  public prefix = true
  public text = true
  public ats = false
  public params?: { [key: string]: boolean } = {}

  /**
   * Creates an instance of Requirements.
   * @param {Requirements} [required]
   * @memberof Requirements
   */
  public constructor(required?: Requirements) {
    if (required)
      for (const prop in required)
        this[prop] = required[prop]
  }
}
