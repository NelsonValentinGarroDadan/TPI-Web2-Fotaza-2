const profile_img_preview = document.getElementById("profile_img_preview");
const input_profile_img = document.getElementById("profile_img");
const remove_profile_img = document.getElementById("remove_profile_img");

const defaultProfile_img_preview = "/icons/user-plus-bold.svg";

input_profile_img.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if(file){

        const imageURL = URL.createObjectURL(file);

        profile_img_preview.src = imageURL;

        remove_profile_img.classList.remove("hidden");
        profile_img_preview.classList.remove("bg-blue","p-2"); 

    }else{

        profile_img_preview.src = defaultProfile_img_preview;

        remove_profile_img.classList.add("hidden");
    }
});

remove_profile_img.addEventListener("click", () => {

    input_profile_img.value = "";

    profile_img_preview.src = defaultProfile_img_preview;
    profile_img_preview.classList.add("bg-blue","p-2")

    remove_profile_img.classList.add("hidden");
});
