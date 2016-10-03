window.onload = function () {
    
    /* The url searches for vue.js repositories, in the language of javascript, created in the last week, sorted by score */
    var url = "https://api.github.com/search/repositories?q=vue.js+language:javascript&created:>=" + getDateLastWeek() + "&sort=score&order=desc";
    
    var xhr;

    makeRequest(url);

    /*----- Get Date one week ago to use in query ----*/
    function getDateLastWeek() {
        var date = new Date();
        /*-- set date to 7 days ago --*/
        date.setDate(date.getDate() - 7);
    
        /* Get date values */
        var day = date.getDate(),
            /* +1 to account for 0 indexing of months */
            month = date.getMonth() + 1,
            year = date.getFullYear();

        /* Create string of last week's date to use in query */
        var dateLastWeek = year + "-" + month + "-" + day;
        return (dateLastWeek);
    }
    
    /*---- Create http instance ----*/
    function makeRequest(url) {
        if (window.XMLHttpRequest) {
            
            xhr = new XMLHttpRequest();
            if (!xhr) {
                alert("Cannot create XMLHTTP instance.");
                return false;
            }

            xhr.onreadystatechange = handleGithubResponse;

            xhr.addEventListener("error", function (err) {
                alert("Error Message" + err);
            }, false);
            
            xhr.open("GET", url, true);
            xhr.send();
            
        } else {
            alert("Unable to fetch the API data");
        }
    }
    
    /*---- Handle Github search API response ----*/
    function handleGithubResponse() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var rsp = JSON.parse(xhr.responseText);
                /* display results on page */
                displayResults(rsp);
                
            } else if (xhr.status === 404) {
                alert("Sorry, there has been an error while collecting the data. Please refresh and try again.");
            } else {
                alert("There was an unknown error with the request");
            }
        }
        
    }
    
    /*----- Display the results to the table -----*/
    function displayResults(rsp) {
        var table = document.getElementById("repositoryTable");
        var reposArray = rsp.items;
        
        /* Loop through repositories and display relevant parameters in table */
        for (var i = 0; i < reposArray.length; i++) {
            
            var name = reposArray[i].name,
                url = rsp.items[i].html_url,
                score = (rsp.items[i].score).toFixed(1),
                number = (i+1);
            
            var row = document.createElement("tr");
            
            /* Array of properties to add to table */
            var properties = [number, name, score];
     
            for (var j = 0; j < properties.length; j++) {
                var cell = document.createElement("td");
                /*-- For the name property, add anchor tag linking to Github url--*/
                if (properties[j] == name) {
                    var nameLink = document.createElement("a");
                    nameLink.innerHTML = name;
                    nameLink.setAttribute("href", url);
                    cell.appendChild(nameLink);
                /* For other properties, just add normal text */
                } else {
                    cell.innerHTML = properties[j];
                }
                
                row.appendChild(cell);
                
            }
         
            table.appendChild(row);
        }
    }
        
    }
    
    
