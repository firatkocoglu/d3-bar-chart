const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let data;

const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  data = json.data;

  const w = 1500;
  const h = 500;
  const padding = 100;

  const tooltip = d3.select('#tooltip');

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d) => new Date(d[0])),
      d3.max(data, (d) => new Date(d[0])),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3
    .select('body')
    .style('background-color', 'gainsboro')
    .select('div')
    .append('svg')
    .style('background-color', 'white')
    .attr('width', w)
    .attr('height', h);

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => {
      return d[0];
    })
    .attr('data-gdp', (d) => {
      return d[1];
    })
    .attr('width', () => {
      return Math.floor(w / data.length);
    })
    .attr('height', (d) => {
      return h - padding - yScale(d[1]);
    })
    .attr('x', (d) => {
      return xScale(new Date(d[0]));
    })
    .attr('y', (d) => {
      return yScale(d[1]);
    })
    .on('mouseover', function (e) {
      console.log(e);
      tooltip
        .style('opacity', 0.9)
        .text(() => {
          return (
            new Date(e.target['__data__'][0]).getFullYear() +
            ',  $' +
            e.target['__data__'][1].toLocaleString('en-US') +
            ' Billion'
          );
        })
        .attr('data-date', () => {
          return e.target['__data__'][0];
        });
    })
    .on('mouseout', function (e) {
      tooltip.style('opacity', 0);
    });

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis);
};
