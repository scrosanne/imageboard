import comments from "./comments.js";

const modal = {
    components: {
        comments: comments,
    },
    data() {
        return {
            image: {
                id: null,
                url: "",
                username: "",
                title: "",
                description: "",
                timestamp: "",
            },
        };
    },
    props: ["id"],

    mounted() {
        // id in images from data equals id I´m using here
        this.image.id = this.id;

        fetch(`/images/${this.id}`)
            .then((res) => res.json())
            .then((images) => {
                // this.id = images[0].id;
                this.image.url = images[0].url;

                this.image.title = images[0].title;
                this.image.description = images[0].description;
                this.image.username = images[0].username;
                this.image.timestamp = images[0].created_at;
            });
    },
    emits: ["close"],
    methods: {
        close() {
            this.$emit("close");
        },
    },
    template: `<div class="modal">
    
        <div class="modal-left">

            <div class="modal-card-top">
                <img :src="image.url" />
            </div>

            <div class="modal-card-bottom">
                <div>
                <h2>{{image.title}}</h2><br>
                <h4>{{image.description}}</h4>
                </div>
                <br>
                <p>created by <b>{{image.username}}</b> <i>at time {{image.timestamp}}</i></p>
            </div>

        </div>

        <div class="modal-right">
        
            <comments :image_id="id" ></comments>
        </div>

        <div id="close-modal" @click="close">x</div>
    
    </div>`,
};

export default modal;
