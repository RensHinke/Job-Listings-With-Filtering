let filters = {
    role: [],
    level: [],
    languages: [],
    tools: []
}
let jobListings = [];

$(document).ready(function() {
    loadData();
});

function loadData() {
    $.getJSON("data.json", function(response) {
        $.each(response, function(i, field) {
            $(".filterbar").hide();
            $(".filterbar-clear-button").click(function() {
                for (let category in filters) {
                    filters[category] = [];
                }
                updateScreen();
            });
            jobListings.push(field);
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
    let postedAtInfo = $("<div></div>");
    $(postedAtInfo).append(data.postedAt);
    $(cardInfoTimeAndPlace).append(postedAtInfo);

    let dot1 = $("<div>&sdot;</div>");
    $(cardInfoTimeAndPlace).append(dot1);

    let contractInfo = $("<div></div>");
    $(contractInfo).append(data.contract);
    $(cardInfoTimeAndPlace).append(contractInfo);

    let dot2 = $("<div>&sdot;</div>");
    $(cardInfoTimeAndPlace).append(dot2);

    let locationInfo = $("<div></div>");
    $(locationInfo).append(data.location);
    $(cardInfoTimeAndPlace).append(locationInfo);

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
    $(role).click(function() {
        addToFilters("role", data.role);
    })
    $(cardCategories).append(role);

    // Add level
    let level = $("<button></button>").addClass("card-category-button");
    $(level).append(data.level);
    $(level).click(function() {
        addToFilters("level", data.level);
    })
    $(cardCategories).append(level);
    
    data.languages.forEach(lang => {
        let languageButton = $("<button></button>").addClass("card-category-button");
        $(languageButton).append(lang);
        $(languageButton).click(function() {
            addToFilters("languages", lang);
        })
        $(cardCategories).append(languageButton);
    });

    data.tools.forEach(tool => {
        let toolButton = $("<button></button>").addClass("card-category-button");
        $(toolButton).append(tool);
        $(toolButton).click(function() {
            addToFilters("tools", tool);
        })
        $(cardCategories).append(toolButton);
    });

    return cardCategories;
}

function addToFilters(category, value) {
    if (!filters[category].includes(value)) {
        filters[category].push(value);
    }
    updateScreen();
}

function removeFiltersOnScreen() {
    $(".filterbar-filters").empty();
}

function displayFiltersOnScreen() {
    let filterCount = 0;
    for (let category in filters) {
        filterCount += filters[category].length;
        filters[category].forEach(value => {
            let filterButton = $("<button></button>").addClass("card-category-filter-button");

            let filterName = $("<div></div>").addClass("card-category-filter-name");
            $(filterName).append(value);
            $(filterButton).append(filterName);

            let filterClose = $("<div>&#128940;</div>").addClass("card-category-filter-close");
            $(filterButton).append(filterClose);
            // Remove filter
            $(filterButton).click(function() {
                filters[category].splice(filters[category].indexOf(value), 1);
                updateScreen()
            });
            $(".filterbar-filters").append(filterButton);
        })
    }
    // Hide filterbar if there are no currently selected filters
    if (filterCount == 0) {
        $(".filterbar").hide();
    } else {
        $(".filterbar").show();
    }
}

function removeJobsOnScreen() {
    $("main").empty();
}

function addFilteredListings() {
    const filteredListings = getFilteredListings();
    for (let i in filteredListings) {
        createCard(filteredListings[i]);
    }
}

function getFilteredListings() {
    let filteredListings = jobListings.filter(job => {
        let allowed = true;
        for (let category in filters) {
            let jobCategoryValues;
            if (!Array.isArray(job[category])) {
                jobCategoryValues = [job[category]];
            } else {
                jobCategoryValues = job[category];
            }
            let intersection = getIntersectionOfArrays(jobCategoryValues, filters[category]);
            if (filters[category].length > 0 && intersection.length < filters[category].length) {
                allowed = false;
            }
        }
        return allowed;
    });
    return filteredListings;
}

function getIntersectionOfArrays(arr1, arr2) {
    return arr1.filter(element => arr2.includes(element));
}

function updateScreen() {
    removeFiltersOnScreen();
    displayFiltersOnScreen();
    removeJobsOnScreen();
    addFilteredListings();
}