"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $navAddStory.show();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navAddStoryClick(evt) {
  console.debug("navAddStoryClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navAddStory.on("click", navAddStoryClick);

/** Show users favorited stories */
function navViewFavoriteStories(evt) {
  console.debug("navViewFavoriteStories", evt);
  hidePageComponents();
  putFavoriteStoriesOnPage(evt);
}

$navShowFavorites.on("click", navViewFavoriteStories);

/** Show users submitted stories */
function navViewUserStories(evt){
  console.debug("navViewUserStories", evt);
  hidePageComponents();
  putCurrentUserStoriesOnPage(evt);
}

$navShowUserStories.on("click", navViewUserStories);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
