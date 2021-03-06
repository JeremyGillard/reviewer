import * as d3 from 'd3';

function generate(learningLength, reviewingLength, masteredLength) {
  const data = [
    { name: 'learning', value: learningLength },
    { name: 'reviewing', value: reviewingLength },
    { name: 'mastered', value: masteredLength },
  ];

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(['#34B6FF', '#ffc634', '#4A4A4A']);

  const width = 243;
  const height = width;

  const svg = d3
    .select('#chart')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie().value((d) => d.value);

  const arc = d3
    .arc()
    .innerRadius(100)
    .outerRadius(120);

  const data_ready = pie(data);

  g.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .transition()
    .duration(400)
    .delay((d, i) => i * 400)
    .attrTween('d', function(d) {
      var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      return function(t) {
        d.endAngle = i(t);
        return arc(d);
      };
    })
    .attr('fill', (d) => color(d.data.name));

  // g.selectAll('path')
  //   .data(data_ready)
  //   .join(
  //     (enter) =>
  //       enter
  //         .append('path')
  //         .attr('fill', (d) => color(d.data.name))
  //         .transition()
  //         .duration(400)
  //         .delay((d, i) => i * 400)
  //         .attrTween('d', function(d) {
  //           var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
  //           return function(t) {
  //             d.endAngle = i(t);
  //             return arc(d);
  //           };
  //         }),
  //     (update) => update,
  //     (exit) => exit.remove(),
  //   );
  // .attr('d', (d) => arc(d))
}

export default { generate };
