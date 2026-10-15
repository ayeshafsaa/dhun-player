# Dhun - Music Player

A responsive music player web app built with HTML, CSS and vanilla JavaScript. It has a home screen with a song list and a full player screen, in the style of popular streaming apps.

**Live demo:** [YOUR-LINK-HERE](YOUR-LINK-HERE)

## Features

- Play, pause, next and previous controls
- Song title, artist, cover art and duration
- Seekable progress bar with current time
- Volume control
- Playlist with an "Up Next" list
- Autoplay: the next song starts when one ends
- Shuffle and repeat modes
- Favourite songs, saved in the browser with localStorage
- Favourites tab to see only liked songs
- Mini player that stays on the home screen
- Background color that changes with each song
- Responsive layout for desktop and mobile

## Tech stack

- HTML5
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (Audio API, localStorage)
- Font Awesome icons via CDN

## Project structure

```
MusicPlayer/
├── index.html
├── style.css
├── script.js
├── favicon.svg
└── assets/
    ├── songs/
    └── covers/
```

## Run locally

1. Download or clone this repository.
2. Open the folder in VS Code and start it with the Live Server extension, or open `index.html` in a browser.

## Add your own songs

Open `script.js` and add a new object to the `songs` array:

```js
{
  title: "Song title",
  artist: "Artist name",
  src: "assets/songs/your-song.mp3",
  cover: "assets/covers/your-cover.jpg",
  color: "#0f766e"
}
```

## Credits

- Music from Pixabay (royalty-free): "Wonders of the Earth" by Grand_Project, and "Sports Rock Music" and "Suspenseful Tense" by lNPLUSMUSIC
- Cover images from Pexels
- Icons by Font Awesome