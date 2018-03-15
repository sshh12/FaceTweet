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
};

let makeFakeButtonDialog = (title, text, buttons) => {
  swal({
     title: title,
     text: text,
     buttons: buttons
  });
};

let makeFakeAd = (title, text, imageURL) => {
  swal({
     title: title,
     text: text,
     icon: imageURL,
     buttons: {
       Cancel: true,
       Buy: true
     }
  }).then((value) => {
    if(value === "Buy") {
      swal("Purchase Complete", {
        icon: "success",
        text: "Your order will arrive soon."
      });
    } else {
      swal("Order Cancelled", {
        icon: "error",
        text: "You will be refunded in 5-10 business days."
      });
    }
  });
};

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
   ],
   'ad': [
     () => makeFakeAd('Bananas', 'From your history we have determined you like bananas. Buy these in the next 5 seconds and you only pay $7.99!', 'https://images-na.ssl-images-amazon.com/images/I/71gI-IUNUkL._SX522_.jpg'),
     () => makeFakeAd('Anime Socks', 'From your history we have determined you like Anime. Buy these in the next 8 seconds and you only pay $9.99!', 'https://images-na.ssl-images-amazon.com/images/I/71kI3yXBaML._UX385_.jpg'),
     () => makeFakeAd('Meme Bible', 'From your history we have determined you like memes. Buy the Meme Bible now and get it half off!', 'https://images-na.ssl-images-amazon.com/images/I/51HMZpdYwrL._SX363_BO1,204,203,200_.jpg'),
     () => makeFakeAd('iPhone X', 'From your history we have determined you like apples. For a limited time buy this apple for only $1,999!', 'https://images-na.ssl-images-amazon.com/images/I/51qibZNVexL._SL600_.jpg')
   ]
}

/*
 * Automatically Prank the User
 */
let prank = (prankType) => {
  pranks[prankType][Math.floor(Math.random() * pranks[prankType].length)]();
}

let prankTimer;

$(document).ready(() => {
   prankTimer = setInterval(() => {
     if(Math.random() < .05) { // 1 prank / 20 seconds
       if(Math.random() < .5) {
         prank('personalinfo');
       } else {
         prank('ad');
       }
     }
   }, 1000)
});
