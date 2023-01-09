const comments = {
    data() {
        return {
            comments: [],
            //v-model puts values here
            username: "",
            comment: "",
        };
    },
    props: ["image_id"], //gets id from modal in modal's template section
    methods: {
        submitComment(e) {
            e.preventDefault();

            //body defined by values from v-model/data(), then stringify in fetch
            const body = {
                image_id: this.image_id,
                username: this.username,
                comment: this.comment,
            };

            fetch("/comments", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((myComment) => {
                    //push to array and loop over it in template
                    this.comments.push(myComment);
                });
        },
    },
    mounted() {
        //fetch request gets all comments about selected image
        fetch(`/images/${this.image_id}/comment`)
            .then((res) => res.json())
            .then((comments) => {
                console.log(comments);
                this.comments = comments;
            });
    },

    template: `

    <div class="comment-form">

        <form>
        <input type="text" v-model="comment" id="comment" name="comment" placeholder="some comment here"><br>
        <input type="text" v-model="username" id="username" name="username" placeholder="username"><br>
        <input type="button" @click="submitComment" value="✅" class="btn-comment" />
        </form>

    </div>

    <div class="comment-block">

        <div v-for="comment of comments" class="single-comment">
            
            <h5>{{comment.comment}}</h5>
            <p>{{comment.username}} created at {{comment.created_at}}</p>

        </div>

    </div>`,
};

export default comments;
