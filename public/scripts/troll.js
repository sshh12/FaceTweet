/*
 * troll.js
 *  For the lolz, trollz, and stuffz
 */
'use strict';

/*
 * Helpers
 */
let makeFakeInputDialog = (title, text, inputType) => {
  swal({
     title: title,
     text: text,
     content: {
        element: "input",
        attributes: {
           type: inputType,
        },
     },
  });
}

let makeFakeButtonDialog = (title, text, buttons) => {
  swal({
     title: title,
     text: text,
     buttons: buttons
  });
}

/*
 * The Pranks
 */
let pranks = {
   'personalinfo': [
      () => makeFakeInputDialog('SSN Confirmation', 'Enter you social security number to continue.', 'password'),
      () => makeFakeInputDialog('Birthday', 'We need your birthday in order to access the rest of the site.', 'date'),
      () => makeFakeInputDialog('Restroom', 'When was the last time you used the restroom?', 'time'),
      () => makeFakeInputDialog('Color', 'We need your favorite color.', 'color'),
      () => makeFakeInputDialog('Income', 'We need your exact income to allow you to proceed.', 'number'),
      () => makeFakeInputDialog('Income', 'We need your exact income to allow you to proceed.', 'text'),
      () => makeFakeButtonDialog('Race', 'We need your race to better personalize your experience.', {White: true, Asian: true, Black: true, idk: true})
   ]
}

let prank = (prankType) => {
   pranks[prankType][Math.floor(Math.random() * pranks[prankType].length)]();
}

/*
 * Automatically Prank the User
 */
let prankTimer;

$(document).ready(() => {
   prankTimer = setInterval(() => {
     if(Math.random() < .05) { // 1 prank / 20 seconds
       prank('personalinfo');
     }
   }, 1000)
});
