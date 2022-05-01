import { dummyData } from "./dummydata.js"


const renderChart = (dummyData) => {

    const totalYears = 100
    const zeroYear = 5
    const daysPerYear = 365
    let defaultDomain = 10


    //variables for setting the height and width of the chart.  Maybe pull the height and width from the html.
    const height = 500
    const width = 1200

    //sets the margins around the chart group.  This allows space for the labeling on the x and y axis
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 35

    }

    //variables that calculate the height and width inside the margins
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom



    //${Math.round((n%1)*100)}


    const xValue = d => {
        const dayAsDecimal = d.year + (+(Math.round((d.day / daysPerYear) + "e+3")  + "e-3")); //adds the year and the day (as a 3 digit decimal).
        //TODO: Use d3 number formatter to get 3 digit decimal?
        return dayAsDecimal
    } //takes each x data point and converts it to a string using the custom function in dummydata.js

    const yValue = d => d.height //takes each data point height attribute and sets it to yValue

    const xScale = d3.scaleLinear() //call the scaleBand function due to using an array of strings
        .domain([0, 10]) //the domain is all entries for the x axis, in this case every year/day
        .range([0, innerWidth]) //sets the width of the scale within the canvas, in this from zero location to the total inner width


    const yScale = d3.scaleLinear()  //call the scaleLinear function due to using strictly numbers
        .domain([20, 0]) //sets the domain from zero to 20 (from bottom to top).  There is nothing significant about 20 and this range can be changed later.
        .range([0, innerHeight])  //sets the height of the scale from zero location to the total innerHeight



    const svg = d3.select('svg')  //creates a selection of the svg element and assigns it svg variable TODO: Use viewbox here?
        .attr("width", width) //sets the width to the width 
        .attr("height", height) //sets the height to the height variable

    svg.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)


    const zoom = d3.zoom()
        .scaleExtent([.01, 8])
        .translateExtent([
            [0, 0],
            [xScale(totalYears), 0]
          ])
        .on('zoom', zoomed)




    const g = svg.append('g') //creates a group with all "g" elements UNKNOWN
        .attr('transform', `translate(${margin.left}, ${margin.top})`)


    const xAxisTickFormat = d => {
        if (d === zeroYear) {
            return `0 BBY/ABY`
        } else if (d < zeroYear) {
            return `${zeroYear - d} BBY`
        } else {
            return `${d - zeroYear} ABY`
        }
    }




    //creates the x axis
    const xAxis = d3.axisBottom() //executes axisBottom function which creates an axis with the ticks on the bottom.
        .scale(xScale) //sets the scale of the axis to the previously defined xScale
        //.tickValues(xAxisTicks)
        .tickFormat(xAxisTickFormat) //sets what the ticks looks like based on the xAxisTickFormat



    const yAxis = d3.axisLeft() //creates the yaxis with the ticks to the left
        .scale(yScale) //sets the scale to the previously created y scale


    const xAxisG = g.append('g') //creates the x-axis group UNKNOWN why are we appending 'g'
        .style('clip-path', 'url(#clip)')
        .attr("class", "x-axis")
        .call(xAxis) //executes the xAxis function and adds it to the group
        .attr('transform', `translate(0, ${innerHeight})`) //moves the xaxis from the top to the bottom and puts it in the previously defined margin.


    const yAxisG = g.append('g').call(yAxis) //creates and executes the y-axis group



    g.selectAll('circle') //selects all circles within the 'g' group
        .data(dummyData) // accesses the data
        .enter()  //accesses the enter function to add new data
        .append('circle') //adds a circle for each new data point
            .style('clip-path', 'url(#clip)')
            .attr('cy', d => yScale(yValue(d))) //puts each circle on yaxis where it belongs
            .attr('cx', d => xScale(xValue(d))) //puts each circle on the xaxis where it belongs
            .attr('r', 5) //sets the radius to 5px
            .attr('class', 'event-point') //sets the class of the circle

    g.selectAll('body') //selects the body.  not sure why we have to select the body for lines
        .data(dummyData) //access the data
        .enter() //enters the new data
        .append('line') //creates a line for each data point
            .style('clip-path', 'url(#clip)')
            .style('stroke', 'black') //sets the line color
            .style('stroke-width', 1) //sets the line width
            .attr('x1', d => xScale(xValue(d))) //sets the start point of the line on the x-axis
            .attr('y1', d => yScale(yValue(d))) //sets the start point of the line on the y-axis
            .attr('x2', d => xScale(xValue(d))) //sets the end point of the line on the x-axis
            .attr('y2', innerHeight) //sets the end point of the line on the y-axis
            .attr('class', 'event-line') //sets the class of each line

        svg.call(zoom)
            .call(zoom.translateTo, xScale(zeroYear), 0)


    function zoomed(event) {
        const updateX = event.transform.rescaleX(xScale)

        const zx = xAxis.scale(updateX)
        xAxisG.call(zx)


        
        svg.selectAll('.event-point')
            .attr('cx', d => updateX(xValue(d)))

        svg.selectAll('.event-line')
            .attr('x1', d => updateX(xValue(d)))
            .attr('x2', d => updateX(xValue(d)))


        }
}


renderChart(dummyData) //renders the full chart, passes in the dummy data

//function for translating interpolated numbers to base 10 numbers
// const j = (day) => {
//     const value = day - 1 / (365 - 1)
//     return Math.round(value)
// }
//day - a / (b - a) = t

//creates the available dates as an array of objects with numbers (not strings)
// const createDateObject = () => {
//     const firstYear = 0 //sets starting year on timeline as a negative number
//     const lastYear = 1 //sets ending yearing on timeline as a positive number
//     const numberOfDays = 25

//     let dateArray = []

//     for (let year = firstYear; year <= lastYear; year++) {
//         for (let day = 1; day <=numberOfDays; day++) {
//             const fullDate = {
//                 year: year.toString(),
//                 day: day.toString()
//             }
//             dateArray.push(fullDate)
//         }
//     }
//     return dateArray
// }

//const domainRange = createDateObject()