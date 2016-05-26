var config = {
    type: 'doughnut',
    data: {
        datasets: [
            {
                data: [],
                backgroundColor: []
            }],
        labels: []
    },
    options: {
        responsive: true,
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Characters in this message'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
};