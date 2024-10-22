"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart")
  storyList = await StoryList.getStories();

  $storiesLoadingMsg.remove();
  
  putStoriesOnPage();
}

async function refreshStories() {
  console.debug("refreshStories");
  storyList = await StoryList.getStories();

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

  /** helper function takes storyUser; Returns DELETE button if story user matches current user*/
  const shouldDisplayDeleteButton = (storyUser) => {
    if(storyUser === currentUser.username){
      return `<button class="story-delete-button">Delete</button>`;
    }
    return "";
  }

  return $(`
      <li class="li-story" id="${story.storyId}">
        ${isFavorite(story.storyId)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-div">
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
        ${shouldDisplayDeleteButton(story.username)}
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

/** display list of current users favorite stories  */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");
  $allStoriesList.hide();
  $favoriteStoriesList.empty();
  const { favorites } = currentUser;

  for (let story of favorites) {
    const $story = generateStoryMarkup(story, favorites);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

/** display list of current users favorite stories  */
function putCurrentUserStoriesOnPage() {
  console.debug("putCurrentUserStoriesOnPage");
  $userStoriesList.empty();
  $allStoriesList.hide();
  const { ownStories, favorites } = currentUser;
  console.debug("User submitted stories", ownStories);

  for (let story of ownStories){
    const $story = generateStoryMarkup(story, favorites);
    $userStoriesList.append($story);
  }

  $userStoriesList.show();
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


  // adds story to storyList and currentUsers.ownStories
  // resets and hides newStoryForm
  // loads new stories while user is redirected to stories page
  const story = await storyList.addStory(currentUser, newStory);
  currentUser.ownStories.push(story);

  $newStoryForm.trigger("reset");
  $newStoryForm.hide();

  $navAddStory.show();

  $storiesLoadingMsg.show();
  await refreshStories();
}


/** general click handler for stories list */
async function handleClick(evt){
  const { target } = evt;
  // Favorite/UnFavorite Story
  if(target.localName === "small" && target.className.includes("story-favorite")) return await markStory(evt);

  // Delete Story
  if(target.localName === "button" && target.className.includes("story-delete-button")) return await handleDeleteNewStory(evt);
};

/** handler function when user clicks DELETE button under a story */
async function handleDeleteNewStory(evt){
  console.debug("handleDeleteNewStory", evt);
  evt.preventDefault();

  const { target } = evt;
  const storyId = target.parentElement.id;
  const $story = $(`#${storyId}`);

  try {
    const response = await storyList.removeStory(storyId);
    const story = response.story || null;

    // removes story from $allStoriesList if story exists
    if(story) $story.remove();

    await refreshStories();
    return response;
  }catch(err){
    return err;
  }
}

/** handler function for Mark/Unmarking story for current user */
async function markStory(evt){
  evt.preventDefault();
  const { target } = evt;

  const id = target.id;
  const $star = $(`#${id}`);
  const storyId = id.replace("favorite-", "");

  if(!target.className.includes("starred")){ // will favorite story
    await favorite(currentUser.username, storyId);
    $star.text("★");
  }else{ // will unfavorite story
    await unfavorite(currentUser.username, storyId);
    $star.text("☆");
  }

  $star.toggleClass("starred");
}

/** favorite(username, storyId) 
 *   - username: Current users username
 *   - storyId: Story Id to favorite
 */
async function favorite(username, storyId){
  try {
    const response = await User.markFavoriteStory(username, storyId);
    // console.debug("marked story", response.data);
    currentUser.favorites = response.data.user.favorites;
  }catch(err){
    return err;
  }
}

/** unfavorite(username, storyId) 
 *   - username: Current users username
 *   - storyId: Story Id to unfavorite
 */
async function unfavorite(username, storyId){
  try {
    const response = await User.unmarkFavoriteStory(username, storyId);
    // console.debug("unmarked story", response.data);
    currentUser.favorites = response.data.user.favorites;
  }catch(err){
    return err;
  }
}

$newStoryForm.on("submit", addNewStory);
$allStoriesList.on("click", handleClick);
