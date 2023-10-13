const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let errorCount = 0;

// Unsplash API
let initialCount = 5;
const apiKey = 'LcF6W8ga6isKr-0u3JdTme2iwLX3FqqBfmUP1WIpiQU';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// Load the initial photos then load the rest  of the photos
function updateAPICount(count) {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
}

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}
// Helper Function to Set Attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
// Create Elements for Links & Photos, Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        // Create <a> to link to unsplash 
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        })
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })
        // Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        // Put <img> inside <a>, then place both in the imageContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}
// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if(isInitialLoad) {
            updateAPICount(30);
            isInitialLoad = false;
        }
    } catch (error) {
        // Catch Error Here
        if(errorCount <= 10) {
            getPhotos();
            errorCount++;
        } else {
            alert("No more images can be loaded, please wait an hour to refresh the page!");
        }
    }
}

// Check to see if scrolling near bottom of page load more photos
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
})

// On Load
getPhotos();