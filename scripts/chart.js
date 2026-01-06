window.onload = function () {

    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const xStep = 20;
    const gridX = 150;
    const gridY = 100;

    let showGrid = true;
    let interval = 1000;
    let running = true;
    let timer;
   const MIN_INTERVAL = 200;
   const MAX_INTERVAL = 2000;
    // Multiple data series
    let series = [
        { color: "green", data: [] },
        { color: "red", data: [] }
    ];

    function randomValue() {
        return Math.floor(Math.random() * height);
    }

    function initData() {
        series.forEach(s => {
            s.data = [];
            for (let i = 0; i <= width; i += xStep) {
                s.data.push(randomValue());
            }
        });
    }

    function drawGrid() {
        if (!showGrid) return;

        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += gridX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += gridY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    function drawSeries() {
        series.forEach(s => {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 3;
            ctx.beginPath();

            ctx.moveTo(0, height - s.data[0]);
            for (let i = 1; i < s.data.length; i++) {
                ctx.lineTo(i * xStep, height - s.data[i]);
            }
            ctx.stroke();
        });
    }

    function updateData() {
        series.forEach(s => {
            s.data.push(randomValue());
            s.data.shift();
        });
    }

    function updateStats() {
        const all = series[0].data;
        const min = Math.min(...all);
        const max = Math.max(...all);
        const avg = (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1);

        document.getElementById("currentValue").textContent = all[all.length - 1];
        document.getElementById("minValue").textContent = min;
        document.getElementById("maxValue").textContent = max;
        document.getElementById("avgValue").textContent = avg;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        drawGrid();
        drawSeries();
        updateStats();
    }

    function start() {
        timer = setInterval(() => {
            updateData();
            draw();
        }, interval);
    }

    function stop() {
        clearInterval(timer);
    }

    // Controls
    document.getElementById("toggleBtn").onclick = () => {
        running ? stop() : start();
        running = !running;
    };

    document.getElementById("resetBtn").onclick = () => {
        initData();
        draw();
    };

    document.getElementById("gridToggle").onchange = e => {
        showGrid = e.target.checked;
        draw();
    };

 

document.getElementById("speedRange").oninput = (e) => {
    const sliderValue = parseInt(e.target.value);

  
    interval = MAX_INTERVAL - sliderValue;

    if (interval < MIN_INTERVAL) {
        interval = MIN_INTERVAL;
    }

    stop();
    if (running) start();
};

    document.getElementById("exportBtn").onclick = () => {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    document.getElementById("themeSelect").onchange = e => {
        document.body.className = e.target.value === "dark" ? "dark" : "";
    };

    // Init
    initData();
    draw();
    start();
};
