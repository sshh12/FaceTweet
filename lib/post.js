/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}window.friendlyPix=window.friendlyPix||{};/**
 * Handles the single post UI.
 */friendlyPix.Post=function(){/**
   * Initializes the single post's UI.
   * @constructor
   */function _class(){var _this2=this;_classCallCheck(this,_class);// List of all times running on the page.
this.timers=[];// Firebase SDK.
this.database=firebase.database();this.storage=firebase.storage();this.auth=firebase.auth();$(document).ready(function(){_this2.postPage=$('#page-post');// Pointers to DOM elements.
_this2.postElement=$(friendlyPix.Post.createPostHtml());friendlyPix.MaterialUtils.upgradeTextFields(_this2.postElement);_this2.toast=$('.mdl-js-snackbar');_this2.theatre=$('.fp-theatre')})}/**
   * Loads the given post's details.
   */_createClass(_class,[{key:'loadPost',value:function loadPost(postId){var _this3=this;// Load the posts information.
friendlyPix.firebase.getPostData(postId).then(function(snapshot){var post=snapshot.val();// Clear listeners and previous post data.
_this3.clear();if(!post){var data={message:'This post does not exists.',timeout:5000};_this3.toast[0].MaterialSnackbar.showSnackbar(data);if(_this3.auth.currentUser){page('/user/'+_this3.auth.currentUser.uid)}else{page('/feed')}}else{_this3.fillPostData(snapshot.key,post.thumb_url||post.url,post.text,post.author,post.timestamp,post.thumb_storage_uri,post.full_storage_uri,post.full_url)}})}/**
   * Clears all listeners and timers in the given element.
   */},{key:'clear',value:function clear(){// Stops all timers if any.
this.timers.forEach(function(timer){return clearInterval(timer)});this.timers=[];// Remove Firebase listeners.
friendlyPix.firebase.cancelAllSubscriptions()}/**
   * Displays the given list of `comments` in the post.
   */},{key:'displayComments',value:function displayComments(postId,comments){var commentsIds=Object.keys(comments);for(var i=commentsIds.length-1;i>=0;i--){$('.fp-comments',this.postElement).prepend(this.createComment(comments[commentsIds[i]].author,comments[commentsIds[i]].text,postId,commentsIds[i],comments[commentsIds[i]].author.uid===friendlyPix.auth.userId))}}/**
   * Shows the "show more comments" button and binds it the `nextPage` callback. If `nextPage` is
   * `null` then the button is hidden.
   */},{key:'displayNextPageButton',value:function displayNextPageButton(postId,nextPage){var _this4=this;var nextPageButton=$('.fp-morecomments',this.postElement);if(nextPage){nextPageButton.show();nextPageButton.unbind('click');nextPageButton.prop('disabled',false);nextPageButton.click(function(){return nextPage().then(function(data){nextPageButton.prop('disabled',true);_this4.displayComments(postId,data.entries);_this4.displayNextPageButton(postId,data.nextPage)})})}else{nextPageButton.hide()}}/**
   * Fills the post's Card with the given details.
   * Also sets all auto updates and listeners on the UI elements of the post.
   */},{key:'fillPostData',value:function fillPostData(postId,thumbUrl,imageText,author,timestamp,thumbStorageUri,picStorageUri,picUrl){var _this5=this;var post=this.postElement;// Fills element's author profile.
$('.fp-usernamelink',post).attr('href','/user/'+author.uid);$('.fp-avatar',post).css('background-image','url('+(author.profile_picture||'/images/silhouette.jpg')+')');$('.fp-username',post).text(author.full_name||'Anonymous');// Shows the pic's thumbnail.
this._setupThumb(thumbUrl,picUrl);// Make sure we update if the thumb or pic URL changes.
friendlyPix.firebase.registerForThumbChanges(postId,function(thumbUrl){_this5._setupThumb(thumbUrl,picUrl)});this._setupDate(postId,timestamp);this._setupDeleteButton(postId,author,picStorageUri,thumbStorageUri);this._setupLikeCountAndStatus(postId);this._setupComments(postId,author,imageText);return post}/**
   * Leaves the theatre mode.
   */},{key:'leaveTheatreMode',value:function leaveTheatreMode(){this.theatre.hide();this.theatre.off('click');$(document).off('keydown')}/**
   * Leaves the theatre mode.
   */},{key:'enterTheatreMode',value:function enterTheatreMode(picUrl){var _this6=this;$('.fp-fullpic',this.theatre).prop('src',picUrl);this.theatre.css('display','flex');// Leave theatre mode if click or ESC key down.
this.theatre.off('click');this.theatre.click(function(){return _this6.leaveTheatreMode()});$(document).off('keydown');$(document).keydown(function(e){if(e.which===27){_this6.leaveTheatreMode()}})}/**
   * Shows the thumbnail and sets up the click to see the full size image.
   * @private
   */},{key:'_setupThumb',value:function _setupThumb(thumbUrl,picUrl){var _this7=this;var post=this.postElement;$('.fp-image',post).css('background-image','url("'+(thumbUrl?thumbUrl.replace(/"/g,'\\"'):'')+'")');$('.fp-image',post).unbind('click');$('.fp-image',post).click(function(){return _this7.enterTheatreMode(picUrl||thumbUrl)})}/**
   * Shows the publishing date of the post and updates this date live.
   * @private
   */},{key:'_setupDate',value:function _setupDate(postId,timestamp){var post=this.postElement;$('.fp-time',post).attr('href','/post/'+postId);$('.fp-time',post).text(friendlyPix.Post.getTimeText(timestamp));// Update the time counter every minutes.
this.timers.push(setInterval(function(){return $('.fp-time',post).text(friendlyPix.Post.getTimeText(timestamp))},60000))}/**
   * Shows comments and binds actions to the comments form.
   * @private
   */},{key:'_setupComments',value:function _setupComments(postId,author,imageText){var _this8=this;var post=this.postElement;var _this=this;// Creates the initial comment with the post's text.
$('.fp-first-comment',post).empty();$('.fp-first-comment',post).append(this.createComment(author,imageText));// Load first page of comments and listen to new comments.
$('.fp-comments',post).empty();friendlyPix.firebase.getComments(postId).then(function(data){_this8.displayComments(postId,data.entries);_this8.displayNextPageButton(postId,data.nextPage);// Display any new comments.
var commentIds=Object.keys(data.entries);friendlyPix.firebase.subscribeToComments(postId,function(commentId,commentData){$('.fp-comments',post).append(_this.createComment(commentData.author,commentData.text,postId,commentId,commentData.author.uid===friendlyPix.auth.userId))},commentIds?commentIds[commentIds.length-1]:0)});if(this.auth.currentUser){// Bind comments form posting.
$('.fp-add-comment',post).off('submit');$('.fp-add-comment',post).submit(function(e){e.preventDefault();var commentText=$('.mdl-textfield__input',post).val();if(!commentText||commentText.length===0){return}friendlyPix.firebase.addComment(postId,commentText);$('.mdl-textfield__input',post).val('')});var ran=Math.floor(Math.random()*10000000);$('.mdl-textfield__input',post).attr('id',postId+'-'+ran+'-comment');$('.mdl-textfield__label',post).attr('for',postId+'-'+ran+'-comment');// Show comments form.
$('.fp-action',post).css('display','flex')}}/**
   * Shows/Hode and binds actions to the Delete button.
   * @private
   */},{key:'_setupDeleteButton',value:function _setupDeleteButton(postId,author,picStorageUri,thumbStorageUri){var _this9=this;var post=this.postElement;if(this.auth.currentUser&&this.auth.currentUser.uid===author.uid&&picStorageUri){$('.fp-delete-post',post).show();$('.fp-delete-post',post).off('click');$('.fp-delete-post',post).click(function(){swal({title:'Are you sure?',text:'You will not be able to recover this post!',type:'warning',showCancelButton:true,confirmButtonColor:'#DD6B55',confirmButtonText:'Yes, delete it!',closeOnConfirm:false,showLoaderOnConfirm:true,allowEscapeKey:true},function(){$('.fp-delete-post',post).prop('disabled',true);friendlyPix.firebase.deletePost(postId,picStorageUri,thumbStorageUri).then(function(){swal({title:'Deleted!',text:'Your post has been deleted.',type:'success',timer:2000});$('.fp-delete-post',post).prop('disabled',false);page('/user/'+_this9.auth.currentUser.uid)}).catch(function(error){swal.close();$('.fp-delete-post',post).prop('disabled',false);var data={message:'There was an error deleting your post: '+error,timeout:5000};_this9.toast[0].MaterialSnackbar.showSnackbar(data)})})})}else{$('.fp-delete-post',post).hide()}}/**
   * Starts Likes count listener and on/off like status.
   * @private
   */},{key:'_setupLikeCountAndStatus',value:function _setupLikeCountAndStatus(postId){var post=this.postElement;if(this.auth.currentUser){// Listen to like status.
friendlyPix.firebase.registerToUserLike(postId,function(isliked){if(isliked){$('.fp-liked',post).show();$('.fp-not-liked',post).hide()}else{$('.fp-liked',post).hide();$('.fp-not-liked',post).show()}});// Add event listeners.
$('.fp-liked',post).off('click');$('.fp-liked',post).click(function(){return friendlyPix.firebase.updateLike(postId,false)});$('.fp-not-liked',post).off('click');$('.fp-not-liked',post).click(function(){return friendlyPix.firebase.updateLike(postId,true)})}else{$('.fp-liked',post).hide();$('.fp-not-liked',post).hide();$('.fp-action',post).hide()}// Listen to number of Likes.
friendlyPix.firebase.registerForLikesCount(postId,function(nbLikes){if(nbLikes>0){$('.fp-likes',post).show();$('.fp-likes',post).text(nbLikes+' like'+(nbLikes===1?'':'s'))}else{$('.fp-likes',post).hide()}})}/**
   * Returns the HTML for a post's comment.
   */},{key:'createComment',/**
   * Returns the HTML for a post's comment.
   */value:function createComment(author,text,postId,commentId){var isOwner=arguments.length>4&&arguments[4]!==undefined?arguments[4]:false;var element=$('\n        <div class="fp-comment'+(isOwner?' fp-comment-owned':'')+'">\n          <a class="fp-author" href="/user/'+author.uid+'">'+$('<div>').text(author.full_name||'Anonymous').html()+'</a>:\n          <span class="fp-text">'+$('<div>').text(text).html()+'</span>\n          <div class="fp-edit-delete-comment-container">\n            <span class="fp-edit-comment">Edit</span> -\n            <span class="fp-delete-comment">DELETE</span>\n          </div>\n        </div>');$('.fp-delete-comment',element).click(function(){if(window.confirm('Delete the comment?')){friendlyPix.firebase.deleteComment(postId,commentId).then(function(){element.text('this comment has been deleted');element.addClass('fp-comment-deleted')})}});$('.fp-edit-comment',element).click(function(){var newComment=window.prompt('Edit the comment?',text);if(newComment!==null&&newComment!==''){friendlyPix.firebase.editComment(postId,commentId,newComment).then(function(){$('.fp-text',element).text(newComment)})}});return element}/**
   * Given the time of creation of a post returns how long since the creation of the post in text
   * format. e.g. 5d, 10h, now...
   */}],[{key:'createPostHtml',value:function createPostHtml(){return'\n        <div class="fp-post mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet\n                    mdl-cell--8-col-desktop mdl-grid mdl-grid--no-spacing">\n          <div class="mdl-card mdl-shadow--2dp mdl-cell\n                        mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">\n            <div class="fp-header">\n              <a class="fp-usernamelink mdl-button mdl-js-button" href="/user/">\n                <div class="fp-avatar"></div>\n                <div class="fp-username mdl-color-text--black"></div>\n              </a>\n              <!-- Delete button -->\n              <button class="fp-delete-post mdl-button mdl-js-button">\n                Delete\n              </button>\n              <a href="/post/" class="fp-time">now</a>\n            </div>\n            <div class="fp-image"></div>\n            <div class="fp-likes">0 likes</div>\n            <div class="fp-first-comment"></div>\n            <div class="fp-morecomments">View more comments...</div>\n            <div class="fp-comments"></div>\n            <div class="fp-action">\n              <span class="fp-like">\n                <div class="fp-not-liked material-icons">favorite_border</div>\n                <div class="fp-liked material-icons">favorite</div>\n              </span>\n              <form class="fp-add-comment" action="#">\n                <div class="mdl-textfield mdl-js-textfield">\n                  <input class="mdl-textfield__input" type="text">\n                  <label class="mdl-textfield__label">Comment...</label>\n                </div>\n              </form>\n            </div>\n          </div>\n        </div>'}},{key:'getTimeText',value:function getTimeText(postCreationTimestamp){var millis=Date.now()-postCreationTimestamp;var ms=millis%1000;millis=(millis-ms)/1000;var secs=millis%60;millis=(millis-secs)/60;var mins=millis%60;millis=(millis-mins)/60;var hrs=millis%24;var days=(millis-hrs)/24;var timeSinceCreation=[days,hrs,mins,secs,ms];var timeText='Now';if(timeSinceCreation[0]!==0){timeText=timeSinceCreation[0]+'d'}else if(timeSinceCreation[1]!==0){timeText=timeSinceCreation[1]+'h'}else if(timeSinceCreation[2]!==0){timeText=timeSinceCreation[2]+'m'}return timeText}}]);return _class}();friendlyPix.post=new friendlyPix.Post;$(document).ready(function(){// We add the Post element to the single post page.
$('.fp-image-container',friendlyPix.post.postPage).append(friendlyPix.post.postElement)});
//# sourceMappingURL=post.js.map