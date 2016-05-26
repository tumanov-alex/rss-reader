String.prototype.countChars = function() {
    var res = {},
        str = this.replace(/[^a-zA-Z]/g, '').toLowerCase().split('');

    for(var i = str.length-1; i > -1; --i) {
        if(!(str[i] in res)) {
            res[str[i]] = 1;
        } else {
            res[str[i]]++;
        }
    }

    return res;
};

var randomColorFactor = function() {
    return Math.round(Math.random() * 255);
};

var randomColor = function(opacity) {
    return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
};

var clearChartData = function() {
    config.data.labels = [];
    config.data.datasets[0].data = [];
    config.data.datasets[0].backgroundColor = [];
};

var setChartValues = function(values) {
    clearChartData();
    for(val in values) {
        config.data.labels.push(val);
        config.data.datasets[0].data.push(values[val]);
        config.data.datasets[0].backgroundColor.push(randomColor(0.7));
    }
};

var paintChart = function(values) {
    // was chart already created?
    if(config.data.datasets[0].data.length) {
        setChartValues(values);
        window.myDoughnut.update();
    } else {
        setChartValues(values);
        var ctx = document.getElementById("chart-area").getContext("2d");
        window.myDoughnut = new Chart(ctx, config);
    }
};