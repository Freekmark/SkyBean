
tabs = [];

function add_tab(name, label, icon_name)
{
    icon = document.createElement("i");
    $(icon).addClass("fa");
    $(icon).addClass("fa-2x");    
    $(icon).addClass("fa-" + icon_name);    

    inner = document.createElement("div");
    $(inner).append(icon);
    $(inner).append(document.createElement("br"));
    $(inner).append(label);
    $(inner).addClass("valign");

    new_menu = document.createElement("div");
    $(new_menu).attr("id", "tab_" + name);
    $(new_menu).append(inner);
    $(new_menu).addClass("tab");
    $(new_menu).click(function () {
        show_page(name);
    });

    $("#menu").append(new_menu);
    
    page = document.createElement("div");
    $(page).attr("id", "page_" + name);
    $(page).addClass("page_hidden");
    $(page).load("tabs/" + name + ".html");
    
    $("#page").append(page);
    
    tabs.push(name);
}

function show_page(name)
{
    for (id in tabs)
        if (tabs[id] == name)
        {
            $("#tab_" + tabs[id]).addClass("tab_active");
            $("#page_" + tabs[id]).addClass("page_active");
        }
        else
        {
            $("#tab_" + tabs[id]).removeClass("tab_active");    
            $("#page_" + tabs[id]).removeClass("page_active");    
        }
}


function init_page(name)
{
    switch (name)
    {
        case("home"):
            tab_home_init();
        break;
    }    

}

$(document).ready(function(){
    add_tab("home", "Home", "home");
    add_tab("cfg", "Settings", "gear");
    add_tab("prof1", "Profile 1", "bar-chart");
    add_tab("prof2", "Profile 2", "bar-chart");
    
    for (id in tabs)
         init_page(tabs[id]); 
    
    show_page("home");
});
