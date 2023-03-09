const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const port = 3000 || process.env.PORT;
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to Light's Blog Website!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.locals._ = _;

// mongoose.connect('mongodb+srv://light:mahimg@cluster0.xl6a65u.mongodb.net/newsLetterDB');
mongoose.connect('mongodb://127.0.0.1:27017/newsLetterDB');


const postSchema = new mongoose.Schema({
    postName:{type:String, required: true},
    postContent:String
});

const Post = mongoose.model('Post', postSchema);

app.get('/', async (req, res) =>{

    const allPosts = await getPost();
    res.render('home', {
        homeStartingContent : homeStartingContent, 
        posts: allPosts  
    });

});

app.get('/contact', function(req, res){
    res.render('contact', {contactContent: contactContent});
});

app.get('/about', function(req, res){
    res.render('about', {aboutContent: aboutContent});
});

app.get('/compose', function(req, res){
    res.render('compose');
});

app.post('/compose', async function(req,res){

    await addPost(req.body.composeTitle, req.body.composeText);
    res.redirect('/');
});

app.get('/posts/:postName', async function(req,res){
    let found = 0;
    let postContent = {};
    const postsType = _.lowerCase(req.params.postName);
    const posts = await getPost();
    posts.forEach(function(post){
        if(postsType == _.lowerCase(post.postName)){
            found = 1;
            postContent = {
                title: post.postName, 
                content: post.postContent
            }
        }
    });
    if(found){ 
        console.log("Match Found");
        res.render(`post`,{
            title:  postContent.title, 
            content: postContent.content}
            );
    }
    else console.log("Not Found");

});

app.listen(port, function(){
    console.log(`Server running on port: ${port}`);
})



async function addPost(name, content){
    try{
        const newPost = new Post({
            postName:name,
            postContent:content
               
        });
        await newPost.save();  

    }
    catch(err){
        console.log(err);
    }
}

async function getPost(){
    try{


        return await(Post.find());

    }
    catch(err){
        console.log(err);
    }
}

