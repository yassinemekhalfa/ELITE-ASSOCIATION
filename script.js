//getting all required
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");


//if start quiz button clicked
start_btn.oneclick = ()=>{
    info_box.classList.add("activeInfo");
}

//if exit button clicked
exit_btn.oneclick = ()=>{
    info_box.classList.remove("activeInfo");
}