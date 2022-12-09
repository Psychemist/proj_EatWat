import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { FilesystemDirectory } from '@capacitor/core'
import fs from 'fs'
import { existsSync } from 'node:fs';






const takePhotoBtn = document.querySelector('#take-photo')
const profilePicFormElem = document.querySelector("#profile-pic-form")
const userProfilePicElem = document.querySelector(".user-profile-pic")
let closeBtnElem = document.querySelector(".close-btn");
let menuBtnElem = document.querySelector(".menu-btn");
let leftBarElem = document.querySelector(".left-sidebar");



menuBtnElem.addEventListener("click", () => {
    leftBarElem.style.display = "block";
})

closeBtnElem.addEventListener("click", () => {
    leftBarElem.style.display = "none";
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


const IMAGE_DIR = "assets/user-profile-pictures"

takePhotoBtn.addEventListener('click', async () => {
    try {

        // Take photo
        const photo = await Camera.getPhoto({
            resultType: "uri",
        });
        console.log("photo", photo)


        // display only
        const imageElem = document.querySelector('#image');
        if (!imageElem) {
            return;
        }
        let photoUrl = photo.webPath;
        imageElem.src = photoUrl
        console.log("imageElem.src: ", imageElem.src)

        // Submit the image via formidable
        profilePicFormElem.addEventListener("submit", async (e) => {
            e.preventDefault()

            // prepare the file for formidable

            const uriResult = await fetch(photoUrl);
            const blob = await uriResult.blob();
            let imageFile = new File([blob], "", { type: 'image/png' });

            console.log(imageFile)

            const form = e.target
            const formData = new FormData()

            formData.append("image", imageFile)

            const res = await fetch('/user/profilePicture', {
                method: "POST",
                body: formData
            })



        })


    } catch (e) {
        console.warn('User cancelled', e);
    }
})



