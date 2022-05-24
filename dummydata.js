export const dummyData = [
    {
        year: 1,
        day: 187,
        height: 1,
        critical: false
    },
    {
        year: 0,
        day: 23,
        height: 1,
        critical: false
    },
    {
        year: 0,
        day: 24,
        height: 1,
        critical: false
    },
    {
        year: 2,
        day: 1,
        height: 1,
        critical: false
    },
    {
        year: 3,
        day: 320,
        height: 1,
        critical: false
    },
    {
        year: 5,
        day: 364,
        height: 3,
        critical: false
    },
    {
        year: 20,
        day: 180,
        height: 1,
        critical: false
    },
]
 
export const convertToString = (dateData) => {
    return `${dateData.year.toString()}.${dateData.day.toString()}`
}