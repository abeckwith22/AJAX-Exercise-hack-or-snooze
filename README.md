# AJAX with jQuery Exercise: Hack-or-Snooze

In this exercise, you'll add features to a news-aggregator site (based loosely on a popular one called Hacker News). It will allow users to create accounts, log in, create articles, mark articles as favorites, and more!

We've already built the backend server API, so you'll focus on learning to use an API and adding features to the front-end JavaScript.

### Part 1: Explore the Starter Code

- [x] Download the starter code and start it with `python3 -m http.server`. You can then visit the site at `http://localhost:8000/`

You will see that stories are displayed and there is functionality to log in and create a user. (later, you'll write the features to let users add new stories, favorite a story, and delete a story.)

Our front-end app consists of two parts:

- Classes and methods for the big data ideas: a ***Story*** class for each story, a ***StoryList*** class for the list of stories, and a ***User*** class for the logged-in user (if any). These methods also handle interacting with the API.

- Functions for the UI, handling things like reading form values from forms and manipulating the DOM.

#### Preparing to Read the Code

When meeting a new codebase, be thoughtful about *how* to read the code. It's usually not helpful to just read everything in detail, top to bottom. You won't remember it all, and it won't help you understand what the pieces are and how they fit together.

It can be very helpful to make a pen-and-paper drawing of the names of the important functions and how they call other functions.

### Part 2: Creating New Stories
In this part, you'll design and write the functionality to let logged-in users add new stories. We've broken this task into two parts. It will help you to tackle them in this order.

#### Subpart 2A: Sending Story Data to the Backend API

- [x] Here you'll need to write a method that adds a new story by sending the right data to our API.

- [x] We've given you a comment string and a stub method for this, ***addStory***, in the ***StoryList*** class. Complete this function, making sure your function takes in the same parameters and returns the same result as our comment said.

- [x] Test that this works, and that your method returns an instance of ***Story***. You can do this in the browser console with:

```js
let newStory = await storyList.addStory(currentUser,
    {title: "Test", author: "Me", url:"http://meow.com"}));
```
And make sure that line returns an instance of the ***Story*** class:

```js
newStory instanceof Story;  // should be true!
```
#### Subpart 2B: Building the UI for New Story Form/Add New Story

Now, we'll add the UI for the story-adding feature:

- [x] Add a form in the HTML for the story. This should initially be hidden.
- [x] Add a link in the navbar with the text of "submit".
- [x] Write a function in ***nav.js*** that is called when users click that navbar link. Look at the other function names in that file that do similar things and pick something descriptive and similar.
- [x] Write a function in ***stories.js*** that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the ***.addStory*** method you wrote, and then put that new story on the page.

### Part 3: Favorite stories

In this step, you'll add a feature marking/unmarking a story as a favorite.

As before, it's best to write the data-logic and API-call part first, and do the UI afterwards.

#### Subpart 3A: Data/API Changes

- [x] Allow logged in users to *favorite* and *un-favorite* a story. These stories should remain favorited when the page refreshes.
- [x] Allow logged in users to see a separate list of favorited stories.

**The methods for adding and removing favorite status on a story should be defined in the User class.**

### Part 4: Removing Stories

- [x] Allow logged in users to remove a story. Once a story has been deleted, remove it from the DOM and let the API know its been deleted.


### Part 5: Styling

- [x] Restyle the landing and login page to match this mock-up-provided by a designer
