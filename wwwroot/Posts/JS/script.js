$(document).ready(function(){
    //Get DOM Element
    let EditBtn = $("#Edit");
    let DeleteBtn = $("#Delete");
    let NewZone = $("#Newsrow");
    let parent;
    let child;
    for (let index = 1; $("#BtnSection" + index).length; index++) {
        child = $("#BtnSection" + index)
        parent = child.parent();
        
        parent.hover(function () { child.show(); }, function () { child.hide(); });
        console.log("#BtnSection" + index);
    }
    EditBtn.click(function (e) { 
         
    });

    DeleteBtn.click(function (e) { 
          
    });
});
