import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    components: {
        modal: modal,
    },
    data() {
        return {
            //empty array for images, to loop through
            images: [],
            //inputs from v-model in html form
            username: "",
            title: "",
            description: "",
            //for modal to be closed as default
            modal: false,
            selectedId: null,
            //loadMore
            moreItems: true,
            page: 0,
        };
    },
    methods: {
        uploadImage() {
            //use FormData API to send file to the server
            const file = document.querySelector("input[type=file]").files[0];
            console.log(file);

            const formData = new FormData(); //create FormData instance and append file to it

            formData.append("file", file);

            formData.append("username", this.username);
            formData.append("title", this.title);
            formData.append("description", this.description);

            //send formData instance in POST request
            fetch("/images", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json(); //json from "/images" post in server
                })
                .then((result) => {
                    console.log(result);
                    this.images.unshift(result);

                    this.username = result.username;
                    this.title = ""; //result.file contains title
                    this.description = "";
                });
        },
        showModal(imageId) {
            //set to true, to show modal via v-if
            this.modal = true;
            //passing imageId to selectedId in data
            this.selectedId = imageId;
            history.pushState(null, "", `/image/${imageId}`);
        },
        closeModal() {
            this.modal = false;
            history.replaceState(null, "", "/");
        },
        showMore() {
            //if fetch result(images) has 5 pics, delete last one while concat
            //if fetch result is lower, indicates final load, so delete button afterwards

            fetch(`/images?page=${++this.page}`)
                .then((res) => res.json())
                .then((images) => {
                    if (images.length === 5) {
                        const lastRemoved = images.slice(0, images.length - 1);
                        //concat current amount of imgs with new load
                        this.images = this.images.concat(lastRemoved);
                    } else {
                        this.images = this.images.concat(images);
                        this.moreItems = false;
                    }
                });
        },
    },
    //mounted() = first thing that happens when page is loaded
    mounted() {
        //GET request bey default
        fetch("/images")
            .then((res) => res.json())
            .then((images) => {
                //remove last, cause limit is 5 but only 4 wanted
                //const lastRemoved = images.slice(0, images.length - 1);
                this.images = images;
            });
    },
}).mount("#main");
