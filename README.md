# Innowise Lab Internship: Level 1: Clever to-do list

## Task: [google docs](https://docs.google.com/document/d/1heFuihWrsw14bCpUdr6fla9ysqE6IrsobSMKAOpBiKA/edit).
---
## [Demo](https://vitali-kruchkou.github.io/Innowise-Lab-Internship-Level-1-Clever-to-do-list/)

---
## How to run the app:

1. Clone this repository
```
$ git clone git@github.com:AlexLevw/Innowise_Practice_Level_1.git
```
2. Go to the directory
```
$ cd Innowise_Practice_Level_1
```
3. Install app
```
$ yarn
```
4. Add ```.env.local``` file with firebase keys to the root directory

5. Start app
```
$ yarn start      #Open http://localhost:3000 to view it in the browser.
```
---
## Database snapshot
The application uses firestore db.
### Structure:
```
users - UserId
            ├haveCompleted:`boolean`
            ├haveUncompleted:`boolean`
            └ todos - ToDoId
                          ├ title: `string`
                          ├ body: `string`
                          ├ isComplete: `boolean`
                          └ createdAt: `string`
```
---
## Application stack
* React
* Typescript
* firebase
* react-router-dom
* node-sass
* eslint + prettier
* react-slick
* craco-alias