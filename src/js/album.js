let userProfilePicElem = document.querySelector(".user-profile-pic")
import fs from 'fs'
import { existsSync } from 'node:fs';


window.onload = async () => {
    await loadAlbum()
    console.log("reload")
}
//
async function loadAlbum() {
    const res = await fetch('/album')
    const datas = await res.json()
    console.log(datas)
    if (res.ok) {
        let html = ''
        let index = 0
        for (let data of datas) {
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
    console.log("Albums loaded successfully")
}








const memowallFormElement = document.querySelector("#user-album-form")

memowallFormElement.addEventListener("submit", async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData()
    for (let i = 0; i < form.image.files.length; i++) {
        let file = form.image.files[i]
        console.log("file:", file)
        formData.append("image_" + i, file)
    }
    const res = await fetch('/album/upload', {
        method: "POST",
        body: formData
    })


    if (res.status === 200) {
        loadAlbum()
    }
})


async function loadProfilePic() {
    let result = await fetch('/user/username')
    let currentUser = await result.json()
    console.log("currentUsername: ", currentUser)
    let currentUsername = currentUser["username"]

    // if (fs.existsSync(`/upload/${currentUsername}.jpg`) || fs.existsSync(`/upload/${currentUsername}.png`) || fs.existsSync(`/upload/${currentUsername}.webp`) || fs.existsSync(`/upload/${currentUsername}.jpeg`)) {
    //     return
    // }

    userProfilePicElem.outerHTML = /*html*/`
    <div class="image-src user-profile-pic"><img src="../uploads/${(currentUsername + ".png") || (currentUsername + ".jpg") || (currentUsername + ".jpeg") || (currentUsername + ".webp")}"></div>
    `
}
loadProfilePic()