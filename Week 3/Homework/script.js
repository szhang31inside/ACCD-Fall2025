let gT1 = document.getElementById("galleryThumb1")
let gT2 = document.getElementById("galleryThumb2")
let gT3 = document.getElementById("galleryThumb3")
let gT4 = document.getElementById("galleryThumb4")

let scImage = document.getElementById ("showcaseImage")

function changeImage (event) {
    console.log(event)
    let thumbSrc = event.target.src
    scImage.src = thumbSrc
    console.log(
        event.target.parentElement.classList.add("current-thumb")

    )

}

gT1.addEventListener("click",changeImage)
gT2.addEventListener("click",changeImage)
gT3.addEventListener("click",changeImage)
gT4.addEventListener("click",changeImage)

