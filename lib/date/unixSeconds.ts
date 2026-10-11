export const getUnixSeconds = (timestamp?: Date) => {
    const time = timestamp ? timestamp.getTime() : Date.now()
    return Math.floor(time / 1000)
}
