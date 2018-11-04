
export interface IRequiredParams { [key: string]: boolean }
export interface ITextParams { [key: string]: string }

/**
 * Action requirements
 *
 * @export
 * @class Requirements
 */
export class Requirements {
  [key: string]: any
  public prefix?: boolean = true
  public text?: boolean = true
  public ats?: boolean = false
  public params?: IRequiredParams = {}

  /**
   * Creates an instance of Requirements.
   * @param {Requirements} [required]
   * @memberof Requirements
   */
  constructor(required?: Requirements) {
    if (required)
      for (const prop in required)
        this[prop] = required[prop]
  }
}
