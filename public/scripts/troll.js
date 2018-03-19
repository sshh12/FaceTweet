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

let modifyPost = () => {

  let randomPost = $($('.fp-post').get(Math.floor(Math.random() * $('.fp-post').length)));

  let imageURL = randomPost.find(".fp-image").attr('style').split("\"")[1];

  let isLiked = randomPost.find(".fp-liked").attr('style').includes("block");

  if(isLiked) {
    swal({
      title: 'Perception Modification',
      text: 'Our algorithms have determined you don\'t actually like this post. It has been unliked.',
      icon: imageURL,
      timer: 6000
    });
    randomPost.find(".fp-liked").click();
  } else {
    swal({
      title: 'Perception Modification',
      text: 'Our algorithms have determined you actually like this post. It has been liked.',
      icon: imageURL,
      timer: 6000
    });
    randomPost.find(".fp-not-liked").click();
  }

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
      () => makeFakeInputDialog('Location', 'We would like to know exactly where you are right now.', 'text'),
      () => makeFakeButtonDialog('Race', 'We need your race to better personalize your experience.', {White: true, Asian: true, Black: true, idk: true}),
      () => makeFakeButtonDialog('Rating', 'Rate our site to continue.', {Poor: true, Ok: true, Good: true, Great: true}),
      () => makeFakeButtonDialog('Cookies', 'Enable cookies to continue.', {Enable: true}),
      () => makeFakeButtonDialog('Survey', 'Take this small survey and enter for a chance to win $500!', {No: true, Yes: true}),
      () => makeFakeButtonDialog('Improve Your Likes', 'Learn how to earn likes and followers with these simple 5 steps!', {No: true, Yes: true}),
      () => makeFakeButtonDialog('Religion', 'Select your religious affiliation to further personalize your profile!', {Christian: true, Muslim: true, NonReligious: true, Hindu: true, Other: true}),
   ],
   'ad': [
     () => makeFakeAd('Bananas', 'From your history we have determined you like bananas. Buy these in the next 5 seconds and you only pay $7.99!', 'https://images-na.ssl-images-amazon.com/images/I/71gI-IUNUkL._SX522_.jpg'),
     () => makeFakeAd('Anime Socks', 'From your history we have determined you like Anime. Buy these in the next 8 seconds and you only pay $9.99!', 'https://images-na.ssl-images-amazon.com/images/I/71kI3yXBaML._UX385_.jpg'),
     () => makeFakeAd('Meme Bible', 'From your history we have determined you like memes. Buy the Meme Bible now and get it half off!', 'https://images-na.ssl-images-amazon.com/images/I/51HMZpdYwrL._SX363_BO1,204,203,200_.jpg'),
     () => makeFakeAd('iPhone X', 'From your history we have determined you like apples. For a limited time buy this apple for only $1,999!', 'https://images-na.ssl-images-amazon.com/images/I/51qibZNVexL._SL600_.jpg'),
     () => makeFakeAd('Ads', 'Pay $69.96 to remove advertisements for 5 seconds!', 'https://i.vimeocdn.com/portrait/15640694_640x640')
   ],
   'posts': [
     () => modifyPost()
   ]
}

/*
 * Automatically Prank the User
 */
let prank = (prankType) => {
  pranks[prankType][Math.floor(Math.random() * pranks[prankType].length)]();
}

let prankTimer;
let lastPrank = 9999;

$(document).ready(() => {

  prankTimer = setInterval(() => {

    if(Math.random() < .05 && lastPrank > 6) { // 1 prank / 20 seconds

      let rand = Math.random();
      if(rand > .55) {
        prank('personalinfo');
      } else if(rand > .10) {
        prank('ad');
      } else {
        prank('posts');
      }
      lastPrank = 0;

    }

    lastPrank++;

  }, 1000)

});
