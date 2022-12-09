import { Geolocation } from '@capacitor/geolocation';
import fs from 'fs'
// import { existsSync } from 'node:fs';
import path from 'path'

// profile bar 


let barFunctionElem = document.querySelector(".bar-function");
let imageElem = document.querySelector(".image-src > img");
let editProfilePicBtn = document.querySelector(".edit-profile-pic-btn")
let userProfilePicElem = document.querySelector(".user-profile-pic")
let closeBtnElem = document.querySelector(".close-btn");
let menuBtnElem = document.querySelector(".menu-btn");
let leftBarElem = document.querySelector(".left-sidebar");


// Get the Geolocation of the user when window onload
window.addEventListener('load', async () => {
    console.log('page is fully loaded');
    try {
        const coordinates = await Geolocation.getCurrentPosition();

        const latitude = coordinates.coords.latitude
        const longitude = coordinates.coords.longitude

        console.log(latitude)
        console.log(longitude)

        const res = await fetch('/user/location', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                latitude,
                longitude
            })
        })
        console.log("CP1")

        // get location
        const location = await fetch('/user/location')
        const locationResult = await location.json()
        document.querySelector('.locationText').innerHTML = `Location : ${locationResult}`

        //get user favourites category
        const favouritesCategory = await fetch('/user/favouriteCat')
        const favouritesCategoryResult = await favouritesCategory.json()
        console.log("HAHAHAH");
        console.log(favouritesCategoryResult)
        document.querySelector('.foodCat').innerHTML = `${favouritesCategoryResult}`

        if (res.ok) {
            console.log("post location successfully")
        }



    } catch (error) {
        console.log("Error: ", "please enable the location feature")
    }
});



async function loadProfilePic() {
    let result = await fetch('/user/username')
    let currentUser = await result.json()
    console.log("currentUsername: ", currentUser)
    let currentUsername = currentUser["username"]

    // let pathWithoutExtension = path.join(__dirname, currentUsername)
    // console.log("pathWithoutExtension: ", pathWithoutExtension)

    // if (fs.existsSync(`/upload/${currentUsername}.jpg`) || fs.existsSync(`/upload/${currentUsername}.png`) || fs.existsSync(`/upload/${currentUsername}.webp`) || fs.existsSync(`/upload/${currentUsername}.jpeg`)) {
    //     return
    // }

    userProfilePicElem.outerHTML = /*html*/`
    <div class="image-src user-profile-pic"><img src="../uploads/${(currentUsername + ".png") || (currentUsername + ".jpg") || (currentUsername + ".jpeg") || (currentUsername + ".webp")}"></div>
    `
}
loadProfilePic()



menuBtnElem.addEventListener("click", () => {
    leftBarElem.style.display = "block";
})

closeBtnElem.addEventListener("click", () => {
    leftBarElem.style.display = "none";
})



// logout

async function logoutInit() {
    let logoutElem = document.querySelector('.logout-btn');

    logoutElem.addEventListener('click', async function (event) {
        event.preventDefault();
        const res = await fetch('/user/logout', {
            method: 'POST',
        })
        console.log("test logout")
        if (res.ok) {
            // alert('Logout successfully')
            location.replace('/index.html')
        }
    })
}

logoutInit();



// Change Profile Picture
editProfilePicBtn.addEventListener("click", async () => {

})



// window.onload = async () => {
//     await loadAlbum()
// }
window.onload = async () => {
    await loadAlbum()
    console.log("reload")
    // circular-progress bar

    let progressBar = document.querySelector(".circular-progress");
    let valueContainer = document.querySelector(".value-container");

    const res = await fetch('/user/percentage')
    console.log(res)
    let percentage = await res.json()


    let progressValue = 0;
    let progressEndValue = percentage;  // wait for the training model value
    let speed = 20;

    let progress = setInterval(() => {
        progressValue++;
        valueContainer.textContent = `${progressValue}%`;
        progressBar.style.background = `conic-gradient(
              #4d5bf9 ${progressValue * 3.6}deg,
              #cadcff ${progressValue * 3.6}deg
          )`;
        if (progressValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

async function loadAlbum() {
    const res = await fetch('/album')
    const datas = await res.json()
    console.log(datas)
    console.log(datas[0])
    console.log(datas[1])
    if (res.ok) {
        let html = ''
        let index = 0
        for (let data of datas[0]) {
            // console.log(data.image_source)
            html += `
            <div class="photo-conatiner">
            <img class="photo" src="../uploads/${data.image_source}" alt="image" />
            <div class="delete-btn" data_index="${data.image_source}">
                <i class="fa-solid fa-trash" data_index="${data.image_source}"></i>
            </div>
            </div>`
            index++
        }

        const albumContainer = document.querySelector('.gallery-Container')
        albumContainer.innerHTML = html
    }
    // add event listener
    const galleryContainers = document.querySelectorAll('.photo-conatiner')
    for (let galleryContainer of galleryContainers) {
        const photoDiv = galleryContainer
        const deleteBtn = photoDiv.querySelector('.delete-btn')

        deleteBtn.addEventListener('click', async (e) => {
            // Call Delete API
            const element = e.target
            const data_index = element.getAttribute('data_index')
            const res = await fetch('/album', {
                method: "DELETE",
                body: JSON.stringify({
                    index: data_index
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (res.ok) {
                loadAlbum()
            }
        })
    }
    document.querySelector('.nameText').innerHTML = `Name : ${datas[1].username}`

    // get location
    const location = await fetch('/user/location')
    const locationResult = await location.json()
    document.querySelector('.locationText').innerHTML = `Location : ${locationResult}`

    //get user favourites category
    const favouritesCategory = await fetch('/user/favouriteCat')
    const favouritesCategoryResult = await favouritesCategory.json()
    console.log("HAHAHAH");
    console.log(favouritesCategoryResult)
    document.querySelector('.foodCat').innerHTML = `${favouritesCategoryResult}`



    console.log("Albums loaded successfully")
}


const memowallFormElement = document.querySelector("#user-album-form")

memowallFormElement.addEventListener("submit", async (e) => {
    console.log("CP1")
    e.preventDefault()
    const form = e.target
    const formData = new FormData()
    for (let i = 0; i < form.image.files.length; i++) {
        let file = form.image.files[i]
        console.log("file:", file)
        formData.append("image_" + i, file)
    }
    console.log("CP2")
    const res = await fetch('/album/upload', {
        method: "POST",
        body: formData
    })
    let num = await res.json()
    console.log(num)

    document.querySelector('.value-container').innerHTML = `${num}%`

    // circular-progress bar

    let progressBar = document.querySelector(".circular-progress");
    let valueContainer = document.querySelector(".value-container");

    let progressValue = 0;
    let progressEndValue = num;  // wait for the training model value
    let speed = 20;

    let progress = setInterval(() => {
        progressValue++;
        valueContainer.textContent = `${progressValue}%`;
        progressBar.style.background = `conic-gradient(
                  #4d5bf9 ${progressValue * 3.6}deg,
                  #cadcff ${progressValue * 3.6}deg
              )`;
        if (progressValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);

    if (res.status === 200) {
        console.log("reload the page")
        loadAlbum()
    }
})

