let cBox = document.getElementById("colorBox");
let colorBtn = document.getElementById("changeColor")
let imgBox = document.getElementById("dogImage")
let imageBtn = document.getElementById("toggleImage")

let assignRandomColor = function()
{
    let rComp = 255 * Math.random()
    let gComp = 255 * Math.random()
    let bComp = 255 * Math.random()
cBox.style.backgroundColor = "rgb(" + rComp + ", " + gComp + ", " + bComp + " )"
}
const toggledogImage = () =>
{
    console.log(imgBox.src)
    if(imgBox.src.includes("dog1"))
    {
       imgBox.src="assets/dog2.jpg"
    } 
    else   
    {
       imgBox.src="assets/dog1.JPG"
    }
}

imageBtn.addEventListener("click", toggledogImage)
colorBtn.addEventListener("click", assignRandomColor)