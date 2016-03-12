var isAddingOption = false,
    colors         = ["#f00", "#0f0", "#00f", "#650", "#350", "#aaa", "#888", "#666", "#444", "#222"],
    pollId         = $("#pollid").val(),
    chartData      = [];


// LISTENERS

$("#castVote").on('click', function() {
    var id = $("#selectList").val();
    
    if (id === null)
        return;
        
    if (!isAddingOption)
        castVote(id);
    else
        addOption($("#optionalSelection").val());
});

$(".delete").on('click', function() {
    $.ajax({
        url: "/poll/" + pollId,
        type: "DELETE"
    })
        .done(function() { window.location.replace("/poll") }); 
});

$("#selectList").on('change', function() {
    var selection = $(this).val();
    
    if (selection === 'selectNew') {
        isAddingOption = true;
        loadOptionalInput();
        return;
    } 
    if (isAddingOption) {
        clearOptionalInput();
        isAddingOption = false;
    }
});


$(document).ready(function () {
   getAndLoadData();
});




// FUNCTIONS

function castVote(id) {
    $.post("./" + pollId + "/vote", { optionId : id })
        .done(function() {
           getAndLoadData();
           markVotesComplete();
        });
}


function addOption(optionName) {
    $.post("./" + pollId + "/option", {option: optionName})
        .done(function() {
            getAndLoadData();
            markVotesComplete();
        });
}

function getAndLoadData() {
    $.get("/api/poll/" + pollId + "/options")
        .done(function(data) {
            loadData(data);
        });
}


var myPieChart;
function loadData(data) {
    chartData = [];
    if (myPieChart)
        myPieChart.destroy();
    
    data.forEach(function(item, index, arr) {
        var color = (index < 10) ? colors[index] : getRandomColor(),
            entry = { value: item.votes, label: item.name, color: color};
        
        chartData.push(entry);
        
        if (index === arr.length - 1) {
            var ctx = document.getElementById("myChart").getContext("2d");
            myPieChart = new Chart(ctx).Pie(chartData);
            createGraphKey();
        }
    });
}

function getRandomColor() {
    var min = 0,
        max = 255;
        
    var red   = Math.floor(Math.random() * (max - min + 1)) + min,
        green = Math.floor(Math.random() * (max - min + 1)) + min,
        blue  = Math.floor(Math.random() * (max - min + 1)) + min;
        
    return "RGB(" + red + ", " + green + ", " + blue + ")";
}

function createGraphKey() {
    $(".right").html('');
    chartData.forEach(function(item) {
        var html = "<div class='key-item'><span class='key-box' style='background: " + item.color +  "'></span><span class='key-label'>" + item.label + "</span></div>";
        $(".right").append(html);
    });
}

function loadOptionalInput() {
    $("#customOption").html('<input type="text" id="optionalSelection" placeholder="enter custom option" class="form-control">');
}

function clearOptionalInput() {
    $("#customOption").html("");
}

function markVotesComplete() {
    $("#vote-info").html("<h3 class='text-center'>Thanks For Voting!</h3>");
}