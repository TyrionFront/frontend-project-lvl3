/* eslint-disable lodash-fp/use-fp */
import _ from 'lodash';

const getPureDescription = (bufferTag, content) => {
  bufferTag.innerHTML = content; // eslint-disable-line no-param-reassign
  const tags = [...bufferTag.children].filter(tag => tag.tagName === 'DIV' || tag.id);
  if (tags) {
    tags.forEach(tag => bufferTag.removeChild(tag));
  }
  return bufferTag.textContent;
};

export const makeFeedItem = (feeds, feedsListTag, markActive) => {
  const { length } = feeds;
  const {
    feedId, title, description, postsCount,
  } = feeds[length - 1];
  const newFeedItem = document.createElement('li');
  newFeedItem.className = 'list-group-item list-group-item-action rounded border mb-1 d-block';
  newFeedItem.id = `${feedId}`;
  newFeedItem.addEventListener('click', markActive);
  newFeedItem.innerHTML = `<div class="d-flex justify-content-center">
    <h5 class="flex-fill mb-1">${title}</h5>
      <div>
        <span id="${feedId}-badge" class="badge badge-success badge-pill mb-0">${postsCount}</span>
      </div>
  </div>
  <p class="flex-fill mb-1">${description}</p>`;
  feedsListTag.prepend(newFeedItem);
};

export const makePostsList = (freshPosts, postsTag, activeFeedId, postElements) => {
  const descriptionBuffer = document.createElement('div');
  const [currentFeedId, posts] = freshPosts;
  posts.forEach((post) => {
    const {
      postTitle, postUrl, postDescription, postId,
    } = post;
    const newStoryTag = document.createElement('div');
    postsTag.prepend(newStoryTag);

    const visualization = !activeFeedId || activeFeedId === 'sameFeed' || activeFeedId === currentFeedId ? '' : 'd-none';
    newStoryTag.outerHTML = `<li class="${currentFeedId} list-group-item rounded border mb-1 ${visualization}" id="${postId}">
      <a href="${postUrl}">${postTitle}</a>
      <button type="button" class="btn btn-outline-info btn-sm ml-3" data-toggle="modal" data-target="#modal-${postId}">
        read more</button>
      <div class="modal fade bd-example-modal-lg" id="modal-${postId}" role="dialog" tabindex="-1"
        aria-labelledby="modalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="#">${postTitle}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">${getPureDescription(descriptionBuffer, postDescription)}</div>
          </div>
        </div>
      </div>
    </li>`;
    postElements.set(postId, document.getElementById(postId));
  });
};

export const displayHidePosts = (activeFeedId, postElements) => {
  switch (activeFeedId) {
    case 'sameFeed':
      postElements.forEach(({ classList }) => classList.remove('d-none'));
      break;
    default:
      postElements.forEach(({ classList }) => (
        classList.contains(activeFeedId) ? classList.remove('d-none') : classList.add('d-none')));
  }
};
