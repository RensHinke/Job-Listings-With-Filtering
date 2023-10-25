$(document).ready(function() {
    loadData();
});

function loadData() {
    $.getJSON("data.json", function(response) {
        $.each(response, function(i, field) {
            console.log(field);
            createCard(field);
        })
    });
}

function createCard(data) {
    let card = $("<div></div>").addClass("card");
    let cardLogo = createCardLogo(data.logo);
    let cardInfo = createCardInfo(data);
    let cardCategories = createCardCategories(data);

    // Add special styling to featured job listings
    if (data.featured) {
        $(card).addClass("featured");
    }

    $(card).append(cardLogo);
    $(card).append(cardInfo);
    $(card).append(cardCategories);
    $("main").append(card);
}

function createCardLogo(url) {
    let logo = document.createElement("img");
    logo.src = url;
    logo.alt = "Logo";
    return logo;
}

function createCardInfo(data) {
    let cardInfo = $("<div></div>").addClass("card-info");
    let cardInfoCompany = $("<div></div>").addClass("card-info-top");
    let cardInfoPosition = $("<div></div>").addClass("card-info-position");
    let cardInfoTimeAndPlace = $("<div></div>").addClass("card-info-bottom");

    // CardInfoCompany content
    let companyName = $("<div></div>").addClass("company-name");
    $(companyName).append(data.company);
    $(cardInfoCompany).append(companyName);

    if (data.new) {
        let newTag = $("<div></div>").addClass("card-tag-new");
        $(newTag).append("NEW!");
        $(cardInfoCompany).append(newTag);
    }

    if (data.featured) {
        let featuredTag = $("<div></div>").addClass("card-tag-featured");
        $(featuredTag).append("FEATURED");
        $(cardInfoCompany).append(featuredTag);
    }

    // CardInfoPosition content
    let positionName = $("<div></div>").addClass("card-info-position");
    $(positionName).append(data.position);
    $(cardInfoPosition).append(positionName);

    // CardInfoTimeAndPlace content
    let timeAndPlaceInfo = $("<div></div>")
    $(timeAndPlaceInfo).append(data.postedAt + "  &sdot;  " + data.contract + "  &sdot;  " + data.location);
    $(cardInfoTimeAndPlace).append(timeAndPlaceInfo);

    $(cardInfo).append(cardInfoCompany);
    $(cardInfo).append(cardInfoPosition);
    $(cardInfo).append(cardInfoTimeAndPlace);
    return cardInfo;
}

function createCardCategories(data) {
    let cardCategories = $("<div></div>").addClass("card-categories");

    // Add role
    let role = $("<button></button>").addClass("card-category-button");
    $(role).append(data.role);
    $(cardCategories).append(role);

    // Add level
    let level = $("<button></button>").addClass("card-category-button");
    $(level).append(data.level);
    $(cardCategories).append(level);
    
    data.languages.forEach(lang => {
        let languageButton = $("<button></button>").addClass("card-category-button");
        $(languageButton).append(lang);
        $(cardCategories).append(languageButton);
    });

    data.tools.forEach(tool => {
        let toolButton = $("<button></button>").addClass("card-category-button");
        $(toolButton).append(tool);
        $(cardCategories).append(toolButton);
    });

    return cardCategories;
}