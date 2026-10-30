// DOM Elements
const startBtn = document.getElementById("startBtn");
const chainLog = document.getElementById("chainLog");
const resultSection = document.getElementById("result");
const breedNameEl = document.getElementById("breedName");
const dogImgEl = document.getElementById("dogImg");
const breedInfoEl = document.getElementById("breedInfo");
const movieCard = document.getElementById("movieCard");
const moviePosterEl = document.getElementById("moviePoster");
const movieTitleEl = document.getElementById("movieTitle");
const movieMetaEl = document.getElementById("movieMeta");
const moviePreviewEl = document.getElementById("moviePreview");
const movieLinkEl = document.getElementById("movieLink");
const datelineEl = document.getElementById("dateline");

// Set Current Dateline
if (datelineEl) {
  const now = new Date();
  datelineEl.innerText = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).toUpperCase();
}

// 常见犬种到经典狗电影的映射
const dogMovieKeywords = {
  dalmatian: "101 Dalmatians",
  beagle: "Snoopy",
  husky: "Eight Below",
  akita: "Hachi",
  shiba: "Dog",
  retriever: "Dog's Purpose",
  labrador: "Marley",
  germanshepherd: "K-9",
  stbernard: "Beethoven",
  poodle: "Pets",
  pug: "Patrick",
  collie: "Lassie"
};

// 🌟 为每个品种定制的小简介/趣味冷知识库（作为链式反应中的特色文本传递）
const breedCustomBios = {
  dalmatian: "Famous for their striking spots and historic affinity with firehouses, Dalmatians are born completely white and develop their distinctive patterns as they mature.",
  beagle: "Equipped with an extraordinary sense of smell and soulful eyes, this hound is an expert tracker driven entirely by curiosity and snack incentives.",
  husky: "Built for endurance across arctic tundras, Huskies possess striking multi-colored eyes and an independent, talkative spirit that loves to howl.",
  akita: "A symbol of profound loyalty and dignity in Japanese culture, the Akita is a powerful guardian with a quiet, noble presence.",
  shiba: "Known for their cat-like agility, fox-like expression, and dramatic emotional outbursts, the Shiba Inu is a small dog with an enormous personality.",
  retriever: "Universally loved for their golden hearts and eternal optimism, they treat every human they meet as a lifelong best friend.",
  labrador: "The undisputed kings of enthusiasm, Labradors excel at swimming, fetching, and convincing anyone within 5 feet to share their sandwich.",
  germanshepherd: "Combining brains, bravery, and unwavering loyalty, the German Shepherd stands as an elite protector and working partner.",
  stbernard: "Gentle giants of the snowy Alps, historic rescue dogs equipped with monumental warmth and an even bigger heart.",
  poodle: "Far more than a stylish haircut, Poodles rank among the sharpest intellects in the canine kingdom, originally bred as elite water retrievers.",
  pug: "Masters of dramatic facial expressions and comedic snorts, Pugs prove that grandeur comes in compact, wrinkle-covered packages.",
  collie: "Graceful and astonishingly intelligent herders whose legendary devotion has inspired generations of literature and cinema."
};

// 绝对兜底的经典狗狗电影列表
const fallbackMovies = [
  {
    title: "Isle of Dogs",
    genre: "Animation / Comedy",
    year: "2018",
    poster: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    url: "https://itunes.apple.com/us/movie/isle-of-dogs/id1361250275"
  },
  {
    title: "A Dog's Purpose",
    genre: "Family / Drama",
    year: "2017",
    poster: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    url: "https://itunes.apple.com/us/movie/a-dogs-purpose/id1199342718"
  },
  {
    title: "The Secret Life of Pets",
    genre: "Animation / Family",
    year: "2016",
    poster: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80",
    url: "https://itunes.apple.com/us/movie/the-secret-life-of-pets/id1125211904"
  }
];

// Helper: Log step into Wire Bulletins
function logStep(text) {
  const li = document.createElement("li");
  li.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  chainLog.appendChild(li);
}

// Helper: Format breed raw string
function formatBreedName(rawBreed) {
  const parts = rawBreed.split("/");
  if (parts.length > 1) {
    return `${capitalize(parts[1])} ${capitalize(parts[0])}`;
  }
  return capitalize(parts[0]);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Main Chaining Logic
startBtn.addEventListener("click", async () => {
  // Reset UI
  chainLog.innerHTML = "";
  resultSection.classList.add("hidden");
  movieCard.classList.add("hidden");
  moviePreviewEl.src = "";
  startBtn.disabled = true;

  try {
    // STEP 1: Fetch Random Dog Payload from Dog CEO API
    logStep("FETCH: Requesting random dog from Dog CEO API...");
    const dogRes = await fetch("https://dog.ceo/api/breeds/image/random");
    const dogData = await dogRes.json();

    if (dogData.status !== "success") throw new Error("Failed to fetch dog image.");

    const urlParts = dogData.message.split("/");
    const rawBreed = urlParts[urlParts.indexOf("breeds") + 1].replace("-", "/");
    const formattedBreed = formatBreedName(rawBreed);
    const mainBreed = rawBreed.split("/")[0].toLowerCase();

    dogImgEl.src = dogData.message;
    breedNameEl.innerText = formattedBreed;
    logStep(`SUCCESS: Discovered breed payload [${formattedBreed}]`);

    // STEP 2: 优先从定制简介库中提取简介，如果没有则尝试请求 Wikipedia API 兜底
    logStep(`CHAINING: Pulling custom editorial bio for "${mainBreed}"...`);
    if (breedCustomBios[mainBreed]) {
      breedInfoEl.innerText = breedCustomBios[mainBreed];
      logStep(`SUCCESS: Injected curated editorial profile for [${formattedBreed}]`);
    } else {
      // 如果不在本地字典里，尝试调用 Wikipedia 抓取
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedBreed + " dog")}`
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          breedInfoEl.innerText = wikiData.extract || `${formattedBreed} is a fine canine specimen recorded in the digital archives.`;
        } else {
          breedInfoEl.innerText = `${formattedBreed} is a remarkable dog breed with a unique digital footprint.`;
        }
      } catch (e) {
        breedInfoEl.innerText = `${formattedBreed} is a magnificent canine specimen.`;
      }
    }

    resultSection.classList.remove("hidden");

    // STEP 3: Chain breed data into iTunes Search API
    const movieSearchTerm = dogMovieKeywords[mainBreed] || "Dog movie";
    logStep(`CHAINING: Triggering movie search for term "${movieSearchTerm}" via iTunes API...`);

    let movieLoaded = false;
    try {
      const movieRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(movieSearchTerm)}&entity=movie&limit=5`
      );
      const movieData = await movieRes.json();

      if (movieData.results && movieData.results.length > 0) {
        const movie = movieData.results[Math.floor(Math.random() * movieData.results.length)];

        movieTitleEl.innerText = movie.trackName;
        movieMetaEl.innerText = `${movie.primaryGenreName || "Feature Film"} · ${new Date(movie.releaseDate).getFullYear() || "2020"}`;
        moviePosterEl.src = movie.artworkUrl100 ? movie.artworkUrl100.replace("100x100bb", "600x600bb") : fallbackMovies[0].poster;

        if (movie.previewUrl) {
          moviePreviewEl.src = movie.previewUrl;
          moviePreviewEl.style.display = "block";
        } else {
          moviePreviewEl.style.display = "none";
        }

        movieLinkEl.href = movie.trackViewUrl || "https://itunes.apple.com";
        movieCard.classList.remove("hidden");
        movieLoaded = true;
        logStep(`COMPLETE: Linked movie "${movie.trackName}" to breed [${formattedBreed}]`);
      }
    } catch (apiErr) {
      logStep(`WARN: iTunes API network blocked. Using fallback archive...`);
    }

    // 终极备用电影方案
    if (!movieLoaded) {
      const fallback = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
      movieTitleEl.innerText = fallback.title;
      movieMetaEl.innerText = `${fallback.genre} · ${fallback.year}`;
      moviePosterEl.src = fallback.poster;
      moviePreviewEl.style.display = "none";
      movieLinkEl.href = fallback.url;
      movieCard.classList.remove("hidden");
      logStep(`FALLBACK COMPLETE: Retrieved classic archive feature "${fallback.title}" for [${formattedBreed}]`);
    }

  } catch (error) {
    console.error(error);
    logStep(`ERROR: Chain reaction broken - ${error.message}`);
  } finally {
    startBtn.disabled = false;
  }
});
