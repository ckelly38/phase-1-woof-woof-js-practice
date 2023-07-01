document.addEventListener("DOMContentLoaded", function()
{
    //get the dogs info
    //add name to span tag and that to dom
    //save all of the data in a dogs array to be accessed later

    let mydogsarrobj = null;
    fetch("http://localhost:3000/pups").
    then((response) => response.json()).
    then(function(response)
    {
        //console.log("response = " + response);
        mydogsarrobj = response;
        //debugger;
        for (let n = 0; n < mydogsarrobj.length; n++)
        {
            //console.log("mydogsarrobj[" + n + "].id = " + mydogsarrobj[n].id);
            //console.log("mydogsarrobj[" + n + "].name = " + mydogsarrobj[n].name);
            //console.log("mydogsarrobj[" + n + "].isGoodDog = " +
            //    mydogsarrobj[n].isGoodDog);
            //console.log("mydogsarrobj[" + n + "].image = " + mydogsarrobj[n].image);
            
            let myspan = document.createElement("span");
            myspan.id = mydogsarrobj[n].id;
            myspan.textContent = "" + mydogsarrobj[n].name;
            document.getElementById("dog-bar").appendChild(myspan);

            let mydiv = document.createElement("div");
            mydiv.id = "" + mydogsarrobj[n].id + "info";
            let myimg = document.createElement("img");
            myimg.src = "" + mydogsarrobj[n].image;
            let mynmhtwo = document.createElement("h2");
            mynmhtwo.textContent = "" + mydogsarrobj[n].name;
            let mygbdbtn = document.createElement("button");
            mygbdbtn.id = "" + mydogsarrobj[n].id + "btn";
            mygbdbtn.textContent = "" +
                (mydogsarrobj[n].isGoodDog ? "Good Dog!" : "Bad Dog!");
            mygbdbtn.disabled = true;
            mydiv.style.display = "none";
            mydiv.appendChild(myimg);
            mydiv.appendChild(mynmhtwo);
            mydiv.appendChild(mygbdbtn);
            document.getElementById("dog-info").appendChild(mydiv);
        }//end of n for loop
        //console.log("successfully added all of the dog elements to the document!");
        //debugger;

        //now make sure the buttons are all hooked up
        let myspans = document.getElementById("dog-bar").children;
        let mydisplayid = -1;
        for (let n = 0; n < myspans.length; n++)
        {
            myspans[n].addEventListener("click", function(event)
            {
                //console.log("clicked on a span!");
                //console.log("this.id = " + this.id);
                //console.log("myspans.length = " + myspans.length);
                //console.log("OLD mydisplayid = " + mydisplayid);
                
                //hide all other dog infos
                if (mydisplayid < 1 || mydisplayid > myspans.length);
                else
                {
                    document.getElementById(mydisplayid + "info").style.display = "none";
                    //console.log("hid the old one successfully!");
                }

                //show the dog info that we just clicked on
                document.getElementById(this.id + "info").style.display = "block";
                mydisplayid = this.id;
                //console.log("NEW mydisplayid = " + mydisplayid);
                //console.log("successfully showed the dog's info!");
                //debugger;
                
                document.getElementById(this.id + "btn").disabled = false;
                //console.log("successfully enabled the button!");
                //debugger;
            }.bind(myspans[n]));
        }//end of n for loop
        //console.log("successfully hooked up all of the span buttons!");
        //debugger;

        let myfilterbtn = document.getElementById("good-dog-filter");
        let usefilter = false;
        for (let n = 0; n < myspans.length; n++)
        {
            let mybtn = document.getElementById(myspans[n].id + "btn");
            mybtn.addEventListener("click", function(event)
            {
                //console.log("clicked the dog's button!");
                //console.log("this.id = " + this.id);
                //console.log("mybtn.textContent = " + mybtn.textContent);

                let tempgooddog = (mybtn.textContent === "Good Dog!");
                let myidnumonlystr = this.id.substring(0, this.id.indexOf("btn"));
                //console.log("myidnumonlystr = " + myidnumonlystr);
                //console.log("tempgooddog = " + tempgooddog);

                //send a request to the server to update the information
                const myconfigobj = {
                    method: "PATCH",
                    headers:{
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        isGoodDog: (!tempgooddog)
                    })
                };
                fetch("http://localhost:3000/pups/" + myidnumonlystr, myconfigobj).
                then((response) => response.json())
                .then(function(response){
                    //then after we get the data back, update the DOM based on that
                    //console.log("response = " + response);
                    let myresgdg = response.isGoodDog;
                    console.log("myresgdg = " + myresgdg);
                    if (myresgdg == (!tempgooddog));
                    else throw "update failed, boolean values did not match!";
                    mybtn.textContent = "" + (myresgdg ? "Good Dog!" : "Bad Dog!");
                    //console.log("successfully changed the goodness status of the dog!");
                    
                    //if this one changed from good to bad:
                    //if the filter is on, then hide the span of this one
                    //if not, do nothing
                    //console.log("usefilter = " + usefilter);
                    if (usefilter)
                    {
                        if (myresgdg)
                        {
                            throw "the filter failed to filter it out because it " +
                                "changed from bad to good when the filter was on!";
                        }
                        else
                        {
                            //this changed from good to bad when the filter was on
                            //console.log("this changed from good to bad when the " +
                            //    "filter was on!");
                            myspans[Number(myidnumonlystr) - 1].style.display = "none";
                            mybtn.disabled = true;
                            document.getElementById(Number(myidnumonlystr) + "info").
                                style.display = "none";
                            //console.log("successfully hid the bad dog!");
                        }
                    }
                    //else;//do nothing
                    //console.log("successfully updated the filter status!");

                    //debugger;
                })
                .catch(function(err){
                    console.error("there was an error updating the data on the server!");
                    console.error(err);
                });
                //debugger;
            }.bind(mybtn));
        }//end of n for loop
        //console.log("successfully hooked up all of the good dog bad dog buttons!");
        //debugger;

        //apply the filter based on the dog's goodness or badness status
        myfilterbtn.addEventListener("click", function(event)
        {
            //console.log("clicked the filter button!");
            //console.log("OLD usefilter = " + usefilter);
            if (usefilter)
            {
                myfilterbtn.textContent = "Filter good dogs: OFF";
                usefilter = false;
                
                //make sure all of the spans are showing
                for (let n = 0; n < myspans.length; n++)
                {
                    if (myspans[n].style.display === "block");
                    else myspans[n].style.display = "block";
                }
                //console.log("successfully showed all of the spans!");
            }
            else
            {
                myfilterbtn.textContent = "Filter good dogs: ON";
                usefilter = true;
                //show only those whose isGoodDog status is true
                for (let n = 0; n < myspans.length; n++)
                {
                    //console.log("myspans[" + n + "].id = " + myspans[n].id);
                    let mygdstr =
                        document.getElementById("" + myspans[n].id + "btn").textContent;
                    //console.log("mygdstr = " + mygdstr);
                    
                    let mygoodstatus = false;
                    if (mygdstr === "Good Dog!") mygoodstatus = true;
                    else if (mygdstr === "Bad Dog!");
                    else throw "the good status on the button was illegal!";
                    //console.log("mygoodstatus = " + mygoodstatus);

                    if (mygoodstatus)
                    {
                        //show the span
                        if (myspans[n].style.display === "block");
                        else myspans[n].style.display = "block";
                    }
                    else
                    {
                        //hide it on the span
                        if (myspans[n].style.display === "none");
                        else myspans[n].style.display = "none";
                    }
                }//end of n for loop
                //console.log("successfully showed only the good ones one the spans!");

                //if the currently displayed info container contains a bad dog
                //then it should also be hidden
                //console.log("OLD mydisplayid = " + mydisplayid);
                
                let cdispbtn = document.getElementById(mydisplayid + "btn");
                
                //console.log("cdispbtn.textContent = " + cdispbtn.textContent);
                
                let mygoodstatus = false;
                if (cdispbtn.textContent === "Good Dog!") mygoodstatus = true;
                else if (cdispbtn.textContent === "Bad Dog!");
                else throw "the good status on the button was illegal!";
                //console.log("mygoodstatus = " + mygoodstatus);

                if (mygoodstatus);
                else
                {
                    document.getElementById(mydisplayid + "info").style.display = "none";
                    document.getElementById(mydisplayid + "btn").disabled = true;
                    mydisplayid = -1;
                    //console.log("successfully filtered out the bad dog on display!");
                }
                //console.log("NEW mydisplayid = " + mydisplayid);
            }
            //console.log("NEW usefilter = " + usefilter);
            //debugger;
        });
        //console.log("successfully hooked up the filter button!");
        //debugger;
    })
    .catch(function(err)
    {
        console.error("there was an error getting all of the dogs info!");
        console.error(err);
        mydogsarrobj = null;
        //debugger;
    });
});
