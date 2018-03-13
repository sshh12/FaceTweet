/*
 * For the lolz, trollz, and stuffz
 */
'use strict';

let pranks = {
   'personalinfo': [
      () => {
         swal({
            title: 'SSN Confirmation',
            text: 'Enter you social security number to continue.',
            content: {
               element: "input",
               attributes: {
                  placeholder: "SNN",
                  type: "password",
               },
            },
         })
      },
      () => {
         swal({
            title: 'Birthday',
            text: 'We need your birthday in order to access the rest of the site.',
            content: {
               element: "input",
               attributes: {
                  type: "date",
               },
            },
         })
      }
   ]
}

let prank = (prankType) => {
   pranks[prankType][Math.floor(Math.random() * pranks[prankType].length)]();
}

$(document).ready(() => {
   // Start Random Prank Timer
});
