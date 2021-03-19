
    //get title for animation
    const title = document.querySelector(".index-title"); 
    title.innerHTML = title.textContent.replace(/\S/g, "<span>$&</span>");

    //title animation
    anime({
        targets: ".index-title span",
        opacity: [0,1],
        duration: 1500,
        delay: anime.stagger(30),
        loop: false
    });
    //information box fade in animation
    anime({
        targets: ".data-box",
        opacity: [0,1],
        duration: 1900,
        easing: "easeInExpo",
        direction: "linear",
        loop: false
    });
    //map fade in animation
    anime({
        targets: "svg, #cmap",
        opacity: [0,1],
        duration: 2200,
        easing: "easeInExpo",
        direction: "linear",
        loop: false
    });
    //graph box fade in animation
    anime({
        targets: ".content-right",
        opacity: [0,1],
        duration: 2500,
        easing: "easeInExpo",
        direction: "linear",
        loop: false
    });

    //functions to split data into desired topics
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

    // Followed this tutorial for bar graphs: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
    //creates bar graph for top graph section 
    function createTopBarGraph(data,name,year,pop)
    {
        //get width/height of graph container and add some room for margin
        var elem = document.getElementsByClassName("graph-container"),
        properties = window.getComputedStyle(elem[0], null),
        height = parseFloat(properties.height) - 80,
        width = parseFloat(properties.width) - 120,
        //select top graph container to put graph
        svg = d3.select("#top-graph");

        // add scales to graph and reduce bar width
        var xScale = d3.scaleBand().range([0, width]).padding(0.7),
            yScale = d3.scaleLinear().range([height, 0]);

        //position graph with some margin to make center, 0.5 of the substracted amount from height/width
        var g = svg.append("g").attr("transform", "translate(" + 60 + "," + 40 + ")");

        //split the graph into indigenous/non-indigenous for desired region
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        //assign colors for bar graph bars
        var color = d3.scaleOrdinal(["#9DD1F1","#9F86C0","#FFA5AB","lightgreen","#FCEC52"]);
        
        //assign x and y scales
        xScale.domain(regionData.map(function(d) { return d.Education; }));
        yScale.domain([0, d3.max(data, function(d) { return d.Value; })]);

        //create and position bottom axis
        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .attr("font-size", "12px");

        //create and position y axis
        g.append("g")
         .call(d3.axisLeft(yScale)
         .tickFormat(function(d){
             return d;
         }))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 15)
         .attr("x", -120)
         .attr("dy", "-50px")
         .attr("fill", "black")
         .attr("font-size", "14px")
         .text("Percent %");

         //create graph
         g.selectAll(".bar")
         .data(regionData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) {return xScale(d.Education);})
         .attr("y", function(d) {return yScale(0);})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) {return height - yScale(0);})
         .attr("fill", function(d,i) {return color(i);});
         
         //growing animation
         g.selectAll("rect")
         .transition()
         .duration(2700)
         .attr("y", function(d) { return yScale(d.Value); })
         .attr("height", function(d) { return height - yScale(d.Value); })
         .delay(function(d,i){return(i*100)});
    }

    //create bar graph for bottom graph section
    // identical function as above but targets bottom graph section
    // comments identical
    function createBottomBarGraph(data,name,year,pop)
    {
        var elem = document.getElementsByClassName("graph-container"),
        properties = window.getComputedStyle(elem[1], null),
        height = parseFloat(properties.height) - 80,
        width = parseFloat(properties.width) - 120,
        svg = d3.select("#bottom-graph");
        

        var xScale = d3.scaleBand().range([0, width]).padding(0.7),
            yScale = d3.scaleLinear().range([height, 0]);

        var g = svg.append("g").attr("transform", "translate(" + 60 + "," + 40 + ")");
        
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(["#9DD1F1","#9F86C0","#FFA5AB","lightgreen","#FCEC52"]);
        
        xScale.domain(regionData.map(function(d) { return d.Education; }));
        yScale.domain([0, d3.max(data, function(d) { return d.Value; })]);

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
        .attr("fill", "black")
        .attr("font-size", "14px")
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

    //followed this tutorial for pie charts: https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js
    //create top pie chart
    function createTopPie (data,name,year,pop)
    {
        //get width/height and determine radius
        var elem = document.getElementsByClassName("graph-container"),
        properties = window.getComputedStyle(elem[0], null),
        height = parseFloat(properties.height),
        width = parseFloat(properties.width);
        var svg = d3.select("#top-graph"),
        radius = Math.min(width,height)/2;
        
        //position graph
        var g = svg.append("g").attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

        //split the graph into indigenous/non-indigenous for desired region
        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        //assign colors for pie sections
        var color = d3.scaleOrdinal(["#9DD1F1","#9F86C0","#FFA5AB","lightgreen","#FCEC52"]);

        // create chart
        var pie = d3.pie().value(function(d) { 
            return d.Value; 
        });

        //create slices
        var path = d3.arc()
                     .outerRadius(radius - 20)
                     .innerRadius(0);
        var arc = g.selectAll(".arc")
                    .data(pie(regionData))
                    .enter()
                    .append("g")
                    .attr("class", "arc");

        //create graph
        arc.append("path")
        .attr("d", path)
        .attr("fill", function(d,i) {return color(i);})
        .style("opacity",0)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .style("opacity",1);
        
        //create legend for graph
        var legends = svg.append("g")
                         .selectAll(".legends").data(regionData);
        var legend = legends.enter()
                            .append("g").classed("legends",true)
                            .attr("transform",function(d,i){return "translate(0," + (i+1)*30 + ")";});
        legend.append("rect")
              .attr("width",20)
              .attr("height",20)
              .attr("x", 20)
              .attr("y", -10)
              .attr("fill", function(d) {return color(d.Education);});
             
        legend.append("text")
              .attr("x",48)
              .attr("y",6)
              .text(function(d){return d.Education +  ": " + d.Value + "%"});
    }

    //create bottom pie chart for bottom graph section
    // identical function as above but targets bottom graph section
    // comments identical
    function createBottomPie (data,name,year,pop)
    {
        var elem = document.getElementsByClassName("graph-container"),
        properties = window.getComputedStyle(elem[1], null),
        height = parseFloat(properties.height),
        width = parseFloat(properties.width),
        svg = d3.select("#bottom-graph"),
        radius = Math.min(width,height)/2;
        
        var g = svg.append("g").attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

        var region = splitRegion(data,name,year);
        var regionData = splitPopulation(region,pop);
        var color = d3.scaleOrdinal(["#9DD1F1","#9F86C0","#FFA5AB","lightgreen","#FCEC52"]);

        var pie = d3.pie().value(function(d) { 
            return d.Value; 
        });

        var path = d3.arc()
                     .outerRadius(radius - 20)
                     .innerRadius(0);
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
                         .selectAll(".legends").data(regionData);
        var legend = legends.enter()
                            .append("g").classed("legends",true)
                            .attr("transform",function(d,i){return "translate(0," + (i+1)*30 + ")";});
        legend.append("rect")
              .attr("width",20)
              .attr("height",20)
              .attr("x", 20)
              .attr("y", -10)
              .attr("fill", function(d) {return color(d.Education);});
             
        legend.append("text")
              .attr("x",48)
              .attr("y",6)
              .text(function(d){return d.Education +  ": " + d.Value + "%"});
    }

    //controller for top graphs activated on select change
    function selectChangeTop()
    {
        //clear graph and get selections data
        d3.selectAll("#top-graph > *").remove(); 
        var name = document.getElementById("gRegion").value;
        var year = document.getElementById("gYear").value;
        var type = document.getElementById("gType").value;
        var pop = document.getElementById("gPop").value;
    
        //load data
        d3.csv("ed.csv").then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });
            //determines which graph to create based on selection
            if(type=="Bar")
                createTopBarGraph(data,name,year,pop);
            else
                createTopPie(data,name,year,pop);
        });
    }

    //controller for bottom graph
    function selectChangeBottom()
    {
        d3.selectAll("#bottom-graph > *").remove(); 
        var name = document.getElementById("bRegion").value;
        var year = document.getElementById("bYear").value;
        var type = document.getElementById("bType").value;
        var pop = document.getElementById("bPop").value;
    
        d3.csv("ed.csv").then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });
            
            if(type=="Bar")
                createBottomBarGraph(data,name,year,pop);
            else
                createBottomPie(data,name,year,pop);
        });
    }

    //sets selection options for graph on click event
    function setSelections(region)
    {
        document.getElementById("gType").value = "Bar";
        document.getElementById("bType").value = "Bar";
        document.getElementById("gRegion").value = region;
        document.getElementById("bRegion").value = region;
        document.getElementById("gYear").value = 2019;
        document.getElementById("bYear").value = 2019;
        document.getElementById("gPop").value = "Off-reserve Aboriginal  population";
        document.getElementById("bPop").value = "Non-aboriginal population";
    }

    //fills in info for data box on left side on click event
    function fillDataBox(region){
        //load data
        d3.csv("ed.csv").then(data => {
            data.forEach(d => {
                d.Value = +d.Value;
                d.Year = +d.Year;
            });

            //get data and split into regions/population characteristic
            var popg = document.getElementById("gPop").value;
            var popb = document.getElementById("bPop").value;
            document.getElementById("data-region-top").innerHTML = region;
            document.getElementById("data-region-bottom").innerHTML = region;
            var region2018 = splitRegion(data,region,2018);
            var nonData2018 = splitPopulation(region2018,"Non-aboriginal population");
            var ingData2018 = splitPopulation(region2018, "Off-reserve Aboriginal  population");
            var region2019 = splitRegion(data,region,2019);
            var nonData2019 = splitPopulation(region2019,"Non-aboriginal population");
            var ingData2019 = splitPopulation(region2019, "Off-reserve Aboriginal  population");

            //set selections and clear grpahs
            setSelections(region);
            d3.selectAll("#top-graph > *").remove();
            d3.selectAll("#bottom-graph > *").remove();
            
            //create graph on click event
            createTopBarGraph(data,region,2019,popg);
            createBottomBarGraph(data,region,2019,popb);
        
            //set data fields for top 2019 box
            document.getElementById("top-ilhs").innerHTML = ingData2019[0].Value + "%";
            document.getElementById("top-ihs").innerHTML = ingData2019[1].Value + "%";
            document.getElementById("top-itr").innerHTML = ingData2019[2].Value + "%";
            document.getElementById("top-icol").innerHTML = ingData2019[3].Value + "%";
            document.getElementById("top-iuni").innerHTML = ingData2019[4].Value + "%";

            document.getElementById("top-nlhs").innerHTML = nonData2019[0].Value + "%";
            document.getElementById("top-nhs").innerHTML = nonData2019[1].Value + "%";
            document.getElementById("top-ntr").innerHTML = nonData2019[2].Value + "%";
            document.getElementById("top-ncol").innerHTML = nonData2019[3].Value + "%";
            document.getElementById("top-nuni").innerHTML = nonData2019[4].Value + "%";

            //set data fields for bottom 2018 box
            document.getElementById("bottom-ilhs").innerHTML = ingData2018[0].Value + "%";
            document.getElementById("bottom-ihs").innerHTML = ingData2018[1].Value + "%";
            document.getElementById("bottom-itr").innerHTML = ingData2018[2].Value + "%";
            document.getElementById("bottom-icol").innerHTML = ingData2018[3].Value + "%";
            document.getElementById("bottom-iuni").innerHTML = ingData2018[4].Value + "%";

            document.getElementById("bottom-nlhs").innerHTML = nonData2018[0].Value + "%";
            document.getElementById("bottom-nhs").innerHTML = nonData2018[1].Value + "%";
            document.getElementById("bottom-ntr").innerHTML = nonData2018[2].Value + "%";
            document.getElementById("bottom-ncol").innerHTML = nonData2018[3].Value + "%";
            document.getElementById("bottom-nuni").innerHTML = nonData2018[4].Value + "%";
        });
    }

    //fill data box for canada stats on first load
    fillDataBox("Canada"); 
    //create bar graphs for Canada on first load
    selectChangeTop();
    selectChangeBottom();
    
    //event listener for drop down select changes
    document.addEventListener("change", e => {
        if(e.target.matches(".tSelect"))
            selectChangeTop();
        else
            selectChangeBottom();
    });

    //event listener fpr click on map region event
    document.addEventListener("click", e => {
        if(e.target.matches(".CanadaMap"))
            fillDataBox(e.target.getAttribute("name"));
    })
