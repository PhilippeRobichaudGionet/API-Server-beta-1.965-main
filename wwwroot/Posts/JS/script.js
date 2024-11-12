$(document).ready(function(){
    let EditBtn = $("#Edit");
    let DeleteBtn = $("#Delete");
    let NewZone = $("#News");
    let BtnSection = $("#BtnSection");

    // Show/Hide Button
    NewZone.hover(function () { BtnSection.show(); }, function () { BtnSection.hide(); });

    EditBtn.click(function (e) { 
       console.log("Edit");    
    });

    DeleteBtn.click(function (e) { 
        console.log("Delete");   
    });
});
