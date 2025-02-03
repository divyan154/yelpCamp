const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const page = Math.floor(Math.random() * 10);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const API_KEY = "47791587-2d01873056b863409593e5e53";

// API endpoint to fetch random nature images
const URL = `https://pixabay.com/api/?key=${API_KEY}&q=nature&image_type=photo&orientation=horizontal&safesearch=true&per_page=50`;

// Function to fetch a random nature image
// async function fetchNatureImage() {
//   try {
//     const response = await fetch(URL);
//     const data = await response.json();

//     if (data.hits && data.hits.length > 0) {
//       // Get the first image from the results
//       const imageUrl = data.hits[0].webformatURL;
//       console.log('Random Nature Image URL:', imageUrl);
//     }}catch(e){
//     console.log("error in generating image")
//     }

const price = Math.floor(Math.random() * 20) + 10;
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDb = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 400; i++) {
    // const image = await client.photos.curated({ page, per_page: 1 });
    // const response = await fetch(URL);
    // const data = await response.json();

    // const imgUrl = data.hits[i].webformatURL;
    // console.log("Random Nature Image URL:", imgUrl);

    const camp = new Campground({
      location: `${cities[i].city},${cities[i].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[i].longitude, cities[i].latitude],
      },
      author: "6788e9c9013a7e437ccb7f09",
      images: [
        {
          url: "https://yelpcampawsbucket24.s3.ap-south-1.amazonaws.com/uploads/1738505645200-paul-imanuelsen-RM5ZMgYm8MM-unsplash.jpg",
          fileName:
            "uploads/1738505645200-paul-imanuelsen-RM5ZMgYm8MM-unsplash.jpg",
        },
        {
          url: "https://yelpcampawsbucket24.s3.ap-south-1.amazonaws.com/uploads/1738505645225-diego-jimenez-A-NVHPka9Rk-unsplash.jpg",
          fileName:
            "uploads/1738505645225-diego-jimenez-A-NVHPka9Rk-unsplash.jpg",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore sapiente voluptatum illo, ipsa qui ut explicabo, rerum dolores quod eveniet numquam libero ad perspiciatis fugiat a molestias doloremque laborum iure.",
      price,
    });
    await camp.save();
  }
};

seedDb().then(() => {
  console.log(db.close());
});
