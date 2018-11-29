export const globalMatch = (regex: RegExp, string: string) => {

    const matches = []

    let value
    // tslint:disable-next-line:no-conditional-assignment
    while (value = regex.exec(string) as RegExpExecArray)
        matches.push(value)

    return !matches.length
        ? undefined
        : matches
}
