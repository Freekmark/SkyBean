//0 - auto_search
//1 - manual
//2 - defined and open
//3 - waiting for skybean
//4 - downloading
//5 - fail

port_state = 0;
port_name = "";
ports_old = false;

function update_port_state()
{
    switch(port_state)
    {
        case(0):
            $("#port_wizard_text").html("Looking for COM port");
            $("#port_wizard_desc").html("Connect USB interface board. If is the board allready connected disconnect the board and reconnect it again.");
            $(".loader").show();
            $("#reset_wizard").hide();            
        break;
        case(1):
            $("#port_wizard_text").html("Manual COM selection");
            $("#port_wizard_desc").html("Select USB interface COM port.");
            $(".loader").hide();
        break;
        case(2):
            $("#port_wizard_text").html("Waiting for SkyBean");
            $("#port_wizard_desc").html("Connect the SkyBean to interface board and turn it on.");
            $(".loader").show();
            $("#reset_wizard").show();            
        break;
        case(3):
            $("#port_wizard_text").html("Downloading configuration");
            $("#port_wizard_desc").html("Please wait until the configuration is downloade from the SkyBean");
        break;
        case(4):
            $("#port_wizard_text").html("Done");
            $("#port_wizard_desc").html("Configuration was sucesfully downloaded.");
            $(".loader").hide();
        break;
        case(5):
            $("#port_wizard_text").html("Error");
            $("#port_wizard_desc").html("Configuration Timeout.");
            $("loader").hide();
        break;       
    }
}


function open_port()
{
    chrome.serial.connect(port_name, function(info){
        console.log(info);
        
        port_state = 2;
        update_port_state();
    });
}

function start_wizard()
{
    port_state = 0;
    
    setTimeout(function() {
        chrome.serial.getDevices(update_ports_wizard);
    }, 1000);  
    
    update_port_state();
    ports_old = false;
}

function start_manual()
{
    port_state = 1;
    update_port_state(); 
    
    chrome.serial.getDevices(update_ports_manual);   
}

function tab_home_init()
{
    start_wizard();

    $("#reset_wizard").click(function(){
        start_wizard();
    });
    
    $("#no_wizard").click(function(){
        $("#port_wizard").hide();
        $("#port_manual").show();
        
        start_manual();
    });    
    
    $("#yes_wizard").click(function(){
        $("#port_wizard").show();
        $("#port_manual").hide();
        
        start_wizard(); 
    });
    
    $("#port_refresh").click(function(){
        start_manual();
    });
    
    $("#port_open").click(function(){
        port_name = $("#port_selector").val();
        if (port_name != null)
            open_port();
    });

}

function update_ports_wizard(devices)
{
    new_ports = [];

    for (id in devices)
    {
        new_ports.push(devices[id].path);
    }
    
    if (ports_old === false)
    {
        ports_old = new_ports;
    }
    else
    {
        for (i in new_ports)
        {
            path = new_ports[i];
            
            if (ports_old.indexOf(path) == -1)
            {
                port_state = 2;
                port_name = path;
                update_port_state();
            }
        }
        ports_old = new_ports;
    }
    
    if (port_state == 0)    
    setTimeout(function() {
        chrome.serial.getDevices(update_ports_wizard);
    }, 1000);    
}

function update_ports_manual(devices)
{
    $("#port_selector").html("");

    for (id in devices)
    {
        $("#port_selector").append("<option>" + devices[id].path + "</option>");
    }
    
    if (devices.length == 0)
        $("#port_selector").append("<option disabled>No COM ports found</option>");

}



