
const searchWrapper = document.querySelector('input-wrapper');
const inputBar = document.querySelector('input');
const autocompleteBox = document.querySelector('.autocomplete-box');
const listElement = document.getElementsByTagName('li');
const listOfRepos = document.querySelector('.saved-repos');

function debounce(fn) {
   let time;
     return function(...args) {
        clearTimeout(time);
        time = setTimeout(() => {
            fn.apply(this, args)
        }, 500);
     }
};

inputBar.addEventListener('keyup', debounce(startSearch));

async function startSearch(e) {
    try {
    let userInput = e.target.value;
    let repos = await getRepos(userInput);
    let showReposArr = await showRepos(repos);
    addCard(showReposArr);

    } catch(error) {
        console.log(error);
        autocompleteBox.classList.remove('autocomplete-box--active');
    }
};


async function getRepos(repoName) {
    return fetch(
        `https://api.github.com/search/repositories?q=${repoName}&per_page=5`
        ).then(response => response.json());
}

async function showRepos(repos) {
    try {
        let names = repos.items.map(({name}) => {
            return name
        });
        let listNames = names.map(name => {
            return `<li>${name}</li>`;
        })
        let listNamesChunk;
        
        if(listNames.length < 5 || listNames === undefined) {
            autocompleteBox.classList.add('autocomplete-box--active');
            listNamesChunk = 'Repositories not found';
        } else {
           listNamesChunk = listNames.join('');
           autocompleteBox.classList.add('autocomplete-box--active');
        }
        autocompleteBox.innerHTML = listNamesChunk;

    } catch (error) {
        autocompleteBox.classList.remove('autocomplete-box--active');
    }

    return repos.items;
}


function addCard(repos) {
    let arr = Array.from(listElement);
    arr.forEach((item) => {
        item.addEventListener('click', addRepoCard);
    });
    
    async function addRepoCard(e) {
        inputBar.value = '';
        autocompleteBox.classList.remove('autocomplete-box--active');

        const newCard = document.createElement('div');
        newCard.classList.add('card');
    
        const cardName = document.createElement('span');
        cardName.textContent = `Name: ${repos[arr.indexOf(e.target)].name}`;

        const cardAuthor = document.createElement('span');
        cardAuthor.textContent = `Owner: ${repos[arr.indexOf(e.target)].owner.login}`;

        const cardStars = document.createElement('span');
        cardStars.textContent = `Stars: ${repos[arr.indexOf(e.target)].stargazers_count}`;

        const card = document.createElement('div');
        card.classList.add('card');
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card__info');

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        const oneLine = document.createElement('span');
        const secondLine = document.createElement('span');
        oneLine.classList.add('close-button__part-one');
        secondLine.classList.add('close-button__part-two');

        cardInfo.appendChild(cardName);
        cardInfo.appendChild(cardAuthor);
        cardInfo.appendChild(cardStars);

        closeButton.appendChild(oneLine);
        closeButton.appendChild(secondLine);

        card.appendChild(cardInfo);
        card.appendChild(closeButton);

        listOfRepos.appendChild(card);

        closeButton.addEventListener('click', () => {
            card.remove();
        })
    }
}


