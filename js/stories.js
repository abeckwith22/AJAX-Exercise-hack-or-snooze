"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart()")
  storyList = await StoryList.getStories();
  console.debug(storyList);
  $favoriteStoriesList.empty();
  $favoriteStoriesList.hide();
  $storiesLoadingMsg.remove();
  
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
*
* Returns the markup for the story.
*/

function generateStoryMarkup(story, favorites) {
  console.debug("generateStoryMarkup", story, favorites);
  
  // const hostName = story.getHostName() || "hostname.com";
  const hostName = "hostname.com";
  
  const isFavorite = (storyObjId) => {
    for(let fav of favorites){
      const { storyId } = fav;
      if(storyId === storyObjId){
        return `<small id="favorite-${storyObjId}" class="story-favorite starred">★</small>`
      }
    }
    return `<small id="favorite-${storyObjId}" class="story-favorite">☆</small>`
  }

  return $(`
      <li id="${story.storyId}">
        ${isFavorite(story.storyId)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="story-delete-button">Delete</button>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  const { favorites } = currentUser;

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, favorites);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");
  $allStoriesList.hide();
  $favoriteStoriesList.empty();
  const { favorites } = currentUser;
  console.log(favorites);

  for (let story of favorites) {
    const $story = generateStoryMarkup(story, favorites);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

/** Handles new story form when user submits */
async function addNewStory(evt){
  console.debug("handleAddNewStory", evt);
  evt.preventDefault();

  // grab title, author, url
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();

  const newStory = {
    title: title,
    author: author,
    url: url,
  };


  // adds story to storyList, resets and hides newStoryForm, loads new stories while user is redirected to stories page.
  await storyList.addStory(currentUser, newStory);

  $newStoryForm.trigger("reset");
  $newStoryForm.hide();

  $navAddStory.show();

  $storiesLoadingMsg.show();
  await getAndShowStoriesOnStart();
}

async function handleClick(evt){
  const { target } = evt;
  // Favorite/UnFavorite Story
  if(target.localName === "small" && target.className.includes("story-favorite")) return await handleClickFavorite(evt);

  // Delete Story
  if(target.localName === "button" && target.className.includes("story-delete-button")) return await handleDeleteNewStory(evt);
};

async function handleDeleteNewStory(evt){
  console.debug("handleDeleteNewStory", evt);
  evt.preventDefault();
}

async function handleClickFavorite(evt){
  evt.preventDefault();
  const { target } = evt;
  console.log(target);
  const id = target.id;
  const $star = $(`#${id}`);
  const formatted_id = id.replace("favorite-", "");
  if(target.className.includes("starred")){ // unmark story
    const { data } = await User.unmarkFavoriteStory(currentUser.username, formatted_id);
    console.log("THIS IS UNMARKED AS FAVORITED", data);
    // set currentUser.favorites to response
    currentUser.favorites = data.user.favorites;
    $star.text("☆");
  }else{ // mark story
    const { data } = await User.markFavoriteStory(currentUser.username, formatted_id);
    console.log("THIS IS MARKED AS FAVORITED", data);
    currentUser.favorites = data.user.favorites;
    $star.text("★");
  }
  $star.toggleClass("starred");
}

$newStoryForm.on("submit", addNewStory);
$allStoriesList.on("click", handleClickFavorite);
$navShowFavorites.on("click", putFavoriteStoriesOnPage);