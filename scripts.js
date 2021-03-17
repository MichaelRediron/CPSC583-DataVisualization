
const title = document.querySelector(".index-title"); 

title.innerHTML = title.textContent.replace(/\S/g, '<span>$&</span>');
anime({
    targets: '.index-title span',
    opacity: [0,1],
    duration: 1500,
    delay: anime.stagger(30),
    loop: false
});
anime({
    targets: '.data-box',
    opacity: [0,1],
    duration: 1900,
    easing: 'easeInExpo',
    direction: "linear",
    loop: false
});
anime({
    targets: 'svg, #cmap',
    opacity: [0,1],
    duration: 2200,
    easing: 'easeInExpo',
    direction: "linear",
    loop: false
});
anime({
    targets: '.content-right',
    opacity: [0,1],
    duration: 2500,
    easing: 'easeInExpo',
    direction: "linear",
    loop: false
});

    function splitRegion(data,name,year) {
        var prov = data.filter(function(d){ return d.Location == name && d.Year == year});
        return prov
    }

    function splitPopulation(data,name) {
        var prov = data.filter(function(d){ return d.Population == name});
        return prov
    }

    function splitEducation(data,name) {
        var prov = data.filter(function(d){ return d.Location == name});
        return prov
    }

    function createTopBarGraph(data,name,year,pop)
    {
        var elem = document.getElementsByClassName('graph-container'),
        properties = window.getComputedStyle(elem[0], null),
        height = parseFloat(properties.height) - 80,
        width = parseFloat(properties.width) - 80,
        svg = d3.select("#top-graph");

        var xScale = d3.scaleBand().range([0, width]).padding(0.7),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g")
                .attr("transform", "translate(" + 60 + "," + 40 + ")");
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(['#9DD1F1','#9F86C0','#FFA5AB','lightgreen','#FCEC52']);
        
        xScale.domain(regionData.map(function(d) { return d.Education; }));
        yScale.domain([0, d3.max(regionData, function(d) { return d.Value; })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .attr("font-size", "12px");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 15)
         .attr("x", -120)
         .attr("dy", "-50px")
         .attr("text-anchor", "end")
         .attr("fill", "black")
         .attr("font-size", "13px")
         .text("Percent %");

         g.selectAll(".bar")
         .data(regionData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) {return xScale(d.Education);})
         .attr("y", function(d) {return yScale(0);})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) {return height - yScale(0);})
         .attr("fill", function(d,i) {return color(i);});
         

         g.selectAll("rect")
         .transition()
         .duration(2700)
         .attr("y", function(d) { return yScale(d.Value); })
         .attr("height", function(d) { return height - yScale(d.Value); })
         .delay(function(d,i){return(i*100)});
    }

    function createBottomBarGraph(data,name,year,pop)
    {
        var elem = document.getElementsByClassName('graph-container'),
        properties = window.getComputedStyle(elem[1], null),
        height = parseFloat(properties.height) - 80,
        width = parseFloat(properties.width) - 80,
        svg = d3.select("#bottom-graph");
        

        var xScale = d3.scaleBand().range([0, width]).padding(0.7),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g")
                .attr("transform", "translate(" + 60 + "," + 40 + ")");
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(['#9DD1F1','#9F86C0','#FFA5AB','lightgreen','#FCEC52']);
        
        xScale.domain(regionData.map(function(d) { return d.Education; }));
        yScale.domain([0, d3.max(regionData, function(d) { return d.Value; })]);

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .attr("font-size", "12px");

            g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d;
            }))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)
            .attr("x", -120)
            .attr("dy", "-50px")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-size", "13px")
            .text("Percent %");

         g.selectAll(".bar")
         .data(regionData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) {return xScale(d.Education);})
         .attr("y", function(d) {return yScale(0);})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) {return height - yScale(0);})
         .attr("fill", function(d,i) {return color(i);});
         

         g.selectAll("rect")
         .transition()
         .duration(2700)
         .attr("y", function(d) { return yScale(d.Value); })
         .attr("height", function(d) { return height - yScale(d.Value); })
         .delay(function(d,i){return(i*100)});
    }

    function createTopPie (data,name,year,pop)
    {
        var elem = document.getElementsByClassName('graph-container'),
        properties = window.getComputedStyle(elem[0], null),
        height = parseFloat(properties.height),
        width = parseFloat(properties.width);
        var svg = d3.select("#top-graph"),
        radius = Math.min(width,height)/2;
        
        var g = svg.append("g")
            .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(['#9DD1F1','#9F86C0','#FFA5AB','lightgreen','#FCEC52']);

        var pie = d3.pie().value(function(d) { 
            return d.Value; 
        });

        var path = d3.arc()
                     .outerRadius(radius - 20)
                     .innerRadius(0);

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 100);

        var arc = g.selectAll(".arc")
                    .data(pie(regionData))
                    .enter().append("g")
                    .attr("class", "arc");

        arc.append("path")
        .attr("d", path)
        .attr("fill", function(d,i) {return color(i);})
        .style("opacity",0)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .style("opacity",1);
        
        var legends = svg.append("g")
                        .attr("transform", "translate(600,300px)")
                        .selectAll(".legends").data(regionData);
        var legend = legends.enter()
                            .append("g").classed("legends",true)
                            .attr("transform",function(d,i){return "translate(0," + (i+1)*30 + ")";});
        legend.append('rect')
              .attr("width",20)
              .attr("height",20)
              .attr("x", 20)
              .attr("y", -10)
              .attr("fill", function(d) {return color(d.Education);});
             
        legend.append("text")
              .attr("x",48)
              .attr("y",6)
              .text(function(d){return d.Education});
    }

    function createBottomPie (data,name,year,pop)
    {
        var elem = document.getElementsByClassName('graph-container'),
        properties = window.getComputedStyle(elem[1], null),
        height = parseFloat(properties.height),
        width = parseFloat(properties.width),
        svg = d3.select("#bottom-graph"),
        radius = Math.min(width,height)/2;
        
        var g = svg.append("g")
            .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(['#9DD1F1','#9F86C0','#FFA5AB','lightgreen','#FCEC52']);

        var pie = d3.pie().value(function(d) { 
            return d.Value; 
        });

        var path = d3.arc()
                     .outerRadius(radius - 20)
                     .innerRadius(0);

        var label = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 100);

        var arc = g.selectAll(".arc")
                    .data(pie(regionData))
                    .enter().append("g")
                    .attr("class", "arc");

        arc.append("path")
        .attr("d", path)
        .attr("fill", function(d,i) {return color(i);})
        .style("opacity",0)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .style("opacity",1); 
        
        var legends = svg.append("g")
                        .attr("transform", "translate(600,300px)")
                        .selectAll(".legends").data(regionData);
        var legend = legends.enter()
                            .append("g").classed("legends",true)
                            .attr("transform",function(d,i){return "translate(0," + (i+1)*30 + ")";});
        legend.append('rect')
              .attr("width",20)
              .attr("height",20)
              .attr("x", 20)
              .attr("y", -10)
              .attr("fill", function(d) {return color(d.Education);});
             
        legend.append("text")
              .attr("x",48)
              .attr("y",6)
              .text(function(d){return d.Education});
    }

    function selectChangeTop()
    {
        d3.selectAll("#top-graph > *").remove(); 
        var name = document.getElementById('gRegion').value;
        var year = document.getElementById('gYear').value;
        var type = document.getElementById('gType').value;
        var pop = document.getElementById('gPop').value;
    
        d3.csv('ed.csv').then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });
            
            if(type=='Bar')
                createTopBarGraph(data,name,year,pop);
            else
                createTopPie(data,name,year,pop);
        });
    }

    function selectChangeBottom()
    {
        d3.selectAll("#bottom-graph > *").remove(); 
        var name = document.getElementById('bRegion').value;
        var year = document.getElementById('bYear').value;
        var type = document.getElementById('bType').value;
        var pop = document.getElementById('bPop').value;
    
        d3.csv('ed.csv').then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });
            
            if(type=='Bar')
                createBottomBarGraph(data,name,year,pop);
            else
                createBottomPie(data,name,year,pop);
        });
    }

    function setSelections(region)
    {
        document.getElementById('gType').value = 'Bar';
        document.getElementById('bType').value = 'Bar';
        document.getElementById('gRegion').value = region;
        document.getElementById('bRegion').value = region;
        document.getElementById('gYear').value = 2019;
        document.getElementById('bYear').value = 2019;
        document.getElementById('gPop').value = 'Off-reserve Aboriginal  population';
        document.getElementById('bPop').value = 'Non-aboriginal population';
    }

    function fillDataBox(region){

        d3.csv('ed.csv').then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });

            var popg = document.getElementById('gPop').value;
            var popb = document.getElementById('bPop').value;
            document.getElementById('data-region-top').innerHTML = region;
            document.getElementById('data-region-bottom').innerHTML = region;
            var region2018 = splitRegion(data,region,2018);
            var nonData2018 = splitPopulation(region2018,'Non-aboriginal population');
            var ingData2018 = splitPopulation(region2018, 'Off-reserve Aboriginal  population');
            var region2019 = splitRegion(data,region,2019);
            var nonData2019 = splitPopulation(region2019,'Non-aboriginal population');
            var ingData2019 = splitPopulation(region2019, 'Off-reserve Aboriginal  population');

            d3.selectAll("#top-graph > *").remove();
            d3.selectAll("#bottom-graph > *").remove();
            setSelections(region);
            createTopBarGraph(data,region,2019,popg);
            createBottomBarGraph(data,region,2019,popb);
        
            document.getElementById('top-ilhs').innerHTML = ingData2019[0].Value + "%";
            document.getElementById('top-ihs').innerHTML = ingData2019[1].Value + "%";
            document.getElementById('top-itr').innerHTML = ingData2019[2].Value + "%";
            document.getElementById('top-icol').innerHTML = ingData2019[3].Value + "%";
            document.getElementById('top-iuni').innerHTML = ingData2019[4].Value + "%";

            document.getElementById('top-nlhs').innerHTML = nonData2019[0].Value + "%";
            document.getElementById('top-nhs').innerHTML = nonData2019[1].Value + "%";
            document.getElementById('top-ntr').innerHTML = nonData2019[2].Value + "%";
            document.getElementById('top-ncol').innerHTML = nonData2019[3].Value + "%";
            document.getElementById('top-nuni').innerHTML = nonData2019[4].Value + "%";

            document.getElementById('bottom-ilhs').innerHTML = ingData2018[0].Value + "%";
            document.getElementById('bottom-ihs').innerHTML = ingData2018[1].Value + "%";
            document.getElementById('bottom-itr').innerHTML = ingData2018[2].Value + "%";
            document.getElementById('bottom-icol').innerHTML = ingData2018[3].Value + "%";
            document.getElementById('bottom-iuni').innerHTML = ingData2018[4].Value + "%";

            document.getElementById('bottom-nlhs').innerHTML = nonData2018[0].Value + "%";
            document.getElementById('bottom-nhs').innerHTML = nonData2018[1].Value + "%";
            document.getElementById('bottom-ntr').innerHTML = nonData2018[2].Value + "%";
            document.getElementById('bottom-ncol').innerHTML = nonData2018[3].Value + "%";
            document.getElementById('bottom-nuni').innerHTML = nonData2018[4].Value + "%";
        });
    }

    fillDataBox('Canada');
    selectChangeTop();
    selectChangeBottom();
    
    document.addEventListener('change', e => {
        if(e.target.matches(".tSelect"))
            selectChangeTop();
        else
            selectChangeBottom();
    });

    document.addEventListener('click', e => {
        if(e.target.matches(".CanadaMap"))
            fillDataBox(e.target.getAttribute('name'));
    })
