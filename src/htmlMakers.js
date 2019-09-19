const setElementsDisplayProperty = (coll, value) => {
  coll.forEach((elem) => {
    elem.style.display = value; // eslint-disable-line no-param-reassign
  });
};

export const moveRssForm = ({ style }) => {
  // eslint-disable-next-line no-param-reassign
  style.cssText = `position: absolute; bottom: 0;
  left: 15px; right: 15px;
  margin-bottom: 10px; padding: 10px`;
};

export const makeRssFeedElem = ({ feeds }, feedsList, example, markActive) => {
  const { rssInfo, lastFeedId } = feeds;
  const lastRssInfo = rssInfo[lastFeedId];
  const { title, description, newsCount } = lastRssInfo;
  const newFeedTag = example.cloneNode(false);
  example.style.display = 'none'; // eslint-disable-line no-param-reassign

  newFeedTag.id = lastFeedId;
  newFeedTag.addEventListener('click', markActive);
  newFeedTag.style.display = 'block';
  newFeedTag.innerHTML = `
    <div class="float-left" style="max-width: 90%">
      <h5 class="mb-1">${title}</h5>
      <p class="mb-1">${description}</p>
    </div>
    <span class="badge badge-success badge-pill float-right" id="newsCount${lastFeedId}">
      ${newsCount}
    </span>
  `;
  feedsList.prepend(newFeedTag);
};

export const makeNewsList = ({ feeds }, newsTag, example) => {
  const { activeFeedId, items } = feeds;
  const { freshNews, allNewsTitles } = items;
  const [activeId, sameIdMark] = activeFeedId.split(' ');
  const currentNewsIds = Object.keys(freshNews);

  if (example.hasAttribute('hidden')) {
    example.removeAttribute('hidden');
  }
  const badgeAndFeedIds = [...allNewsTitles.keys()].map(feeId => [feeId, `newsCount${feeId}`]);
  badgeAndFeedIds.forEach(([feeId, badgeId]) => {
    const currentFeedAllNewsCount = allNewsTitles.get(feeId).size;
    document.getElementById(badgeId).textContent = currentFeedAllNewsCount;
  });

  currentNewsIds.forEach((storyId) => {
    const [currentFeedId] = storyId.split('-');
    const [title, link, description] = freshNews[storyId];
    const visualization = !activeId || sameIdMark || activeId === currentFeedId ? 'block' : 'none';

    const newStoryTag = example.cloneNode(false);
    newStoryTag.id = storyId;
    newStoryTag.classList.add(currentFeedId);
    newStoryTag.style.display = visualization;
    newStoryTag.innerHTML = `
      <a href="${link}">${title}</a>
      <button type="button" class="btn btn-outline-info btn-sm ml-md-3" data-toggle="modal" data-target="#modal${storyId}">
        read more
      </button>
      <div class="modal fade bd-example-modal-lg" id="modal${storyId}" role="dialog" tabindex="-1"
        aria-labelledby="modalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="title${storyId}">${title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">${description}</div>
          </div>
        </div>
      </div>
    `;
    newsTag.prepend(newStoryTag);
  });
  example.hidden = true; // eslint-disable-line no-param-reassign
  newsTag.classList.replace('d-none', 'd-block'); // eslint-disable-line no-param-reassign
};

export const displayNews = ({ feeds }, newsListTag) => {
  const { activeFeedId, prevActiveFeedId } = feeds;
  const [currentId] = activeFeedId.split(' ');
  const prevFeed = document.querySelector('#rssFeeds .active');
  const currentFeed = document.getElementById(currentId);
  const allNews = [...newsListTag.getElementsByTagName('li')];
  if (currentId === prevActiveFeedId) {
    setElementsDisplayProperty(allNews, 'block');
    currentFeed.classList.remove('active');
    return;
  }
  if (prevFeed) {
    prevFeed.classList.remove('active');
  }
  setElementsDisplayProperty(allNews, 'none');

  currentFeed.classList.add('active');
  const currentFeedNews = [...newsListTag.querySelectorAll(`.${currentId}`)];
  setElementsDisplayProperty(currentFeedNews, 'block');
};
