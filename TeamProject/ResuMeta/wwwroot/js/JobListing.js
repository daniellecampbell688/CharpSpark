document.addEventListener('DOMContentLoaded', initializePage, false);

let pageNumber = 1;
let numberOfPages = 0;

function initializePage() {
    const getCachedListingsBtn = document.getElementById('get-cached-listings');
    const searchJobListingsBtn = document.getElementById('search-job-listings');
    const searchCachedListings = document.getElementById('cached-job-title');
    const pageNumberInput = document.getElementById('pagination');

    searchCachedListings.addEventListener('change', () => {
        pageNumber = 1;
        getCachedJobListings(pageNumber, searchCachedListings.value)
    })
    getCachedJobListings(pageNumber, "");
    searchJobListingsBtn ? searchJobListingsBtn.addEventListener('click', searchJobListings, false) : "";


    // add event listener to first and last links for pagination
    document.getElementById('first-page').addEventListener('click', () => {
        pageNumber = 1;
        getCachedJobListings(pageNumber, searchCachedListings.value);
    });
    document.getElementById('last-page').addEventListener('click', () => {
        pageNumber = numberOfPages;
        getCachedJobListings(pageNumber, searchCachedListings.value);
    });

    // add event listener to individual page numbers
    pageNumberInput.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            pageNumber = parseInt(event.target.textContent);
            getCachedJobListings(pageNumber, searchCachedListings.value);
        }
    })
}
function hideLoader() {
    document.getElementById('page-number').classList.remove("invisible");
    document.getElementById("loader").classList.add("invisible");
}
function showLoader() {
    document.getElementById('page-number').classList.add("invisible");
    document.getElementById("loader").classList.remove("invisible");
}

async function getCachedJobListings(pageNumber, jobTitle) {
    showLoader();
    //console.log("Getting cached job listings");
    const jobListingContainer = document.getElementById('job-container');
    jobListingContainer.innerHTML = '';
    const response = await fetch(`api/scraper/cached_listings?pageNum=${pageNumber}&jobTitle=${jobTitle}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json; application/problem+json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (response.ok) {
        var jobs = await response.json();
        numberOfPages = jobs.numberOfPages;
        populatePageNumber();
        //console.log(jobs.numberOfPages);
        if (jobs.jobListings.length === 0) {
            let noResultsNode = document.createElement('div');
            noResultsNode.className = 'no-results';
            noResultsNode.innerHTML = 'No cached job listings found';
            jobListingContainer.appendChild(noResultsNode);
        } else {
            jobs.jobListings.forEach(job => {
                const jobListingNode = generateJobListingNode(job);
                jobListingContainer.appendChild(jobListingNode);
            });
        }
    }
    else
    {
        var noResultsNode = document.createElement('div');
        noResultsNode.className = 'no-results';
        noResultsNode.innerHTML = 'No cached job listings found';
        jobListingContainer.appendChild(noResultsNode);
    }
    hideLoader();
    return;
}

function populatePageNumber() {
    const paginationList = document.getElementById('pagination');
    paginationList.innerHTML = '';

    let i = 0;
    for (i = pageNumber - 1; i <= pageNumber + 1; i++) {
        if (i < 1 || i > numberOfPages) continue;
        addPaginationLink(i, i === pageNumber);
    }
    if (pageNumber === 1 && pageNumber + 1 < numberOfPages) addPaginationLink(i);
}

function addPaginationLink(number, active = false) {
    const paginationList = document.getElementById('pagination');

    const pageItem = document.createElement('li');
    pageItem.className = 'page-item';

    if (active) {
        pageItem.classList.add('active');
    }

    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = '#';
    pageLink.textContent = number;

    pageItem.appendChild(pageLink);
    paginationList.appendChild(pageItem);
}


async function searchJobListings() {
    showLoader();
    //console.log("Searching job listings");
    const jobListingContainer = document.getElementById('job-container');
    jobListingContainer.innerHTML = '';

    const jobTitle = document.getElementById('job-title').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const response = await fetch(`api/scraper/search_jobs/job_title=${jobTitle}&city=${city}&state=${state}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json; application/problem+json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    if (response.ok) {
        var contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            var jobs = await response.json();
            //console.log(jobs);
            jobs.forEach(job => {
                const jobListingNode = generateJobListingNode(job);
                jobListingContainer.appendChild(jobListingNode);
            });
            hideLoader();
        }
        else
        {
            var noResultsNode = document.createElement('div');
            noResultsNode.className = 'no-results';
            noResultsNode.innerHTML = 'No job listings found';
            jobListingContainer.appendChild(noResultsNode);
            hideLoader();
            return;
        }
    }
    else
    {
        var noResultsNode = document.createElement('div');
        noResultsNode.className = 'no-results';
        noResultsNode.innerHTML = 'No job listings found';
        jobListingContainer.appendChild(noResultsNode);
        hideLoader();
        return;
    }
    hideLoader();
}

function generateJobListingNode(job) {
    const jobListingTemplate = document.getElementById("job-listing-template");
    const templateClone = jobListingTemplate.content.cloneNode(true);
    const clone = templateClone.firstElementChild;

    const jobLink = clone.querySelector("a");
    const jobTitle = clone.querySelector(".job-listing-title");
    const jobCompany = clone.querySelector(".job-listing-company");
    const jobLocation = clone.querySelector(".job-listing-location");


    jobLink.href = `https://www.${job.link}`;
    jobTitle.textContent = job.jobTitle;
    jobCompany.innerHTML = `<span class="fa fa-building"></span> ${job.company}`;
    jobLocation.innerHTML = `<span class="fa fa-globe"></span> ${job.location}`;

    const isAuthenticated = document.querySelector("#modal");
    if (isAuthenticated != null) {
        const modalCloseBtn1 = document.getElementById("close-modal1");
        const modalCloseBtn2 = document.getElementById("close-modal2");
        modalCloseBtn1.addEventListener('click', closeModal, false);
        modalCloseBtn2.addEventListener('click', closeModal, false);
        clone.addEventListener('click', function (event) {
            openModal(event.currentTarget);
        }, false);
    }

    return clone;
}

function openModal(listing) {
    closeModal();
    const jobTitle = listing.querySelector(".job-listing-title").textContent;
    const jobCompany = listing.querySelector(".job-listing-company").textContent;
    const jobLocation = listing.querySelector(".job-listing-location").textContent;
    const jobLink = listing.querySelector("a").href;
    const appliedDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const modalBody = document.getElementById("modal-job-input");
    const viewableListing = document.getElementById("viewable-listing");

    const jobListingTemplate = document.getElementById("job-listing-template");
    const templateClone = jobListingTemplate.content.cloneNode(true);
    const clone = templateClone.querySelector(".card-body");

    const cloneJobTitle = clone.querySelector(".job-listing-title");
    const cloneJobCompany = clone.querySelector(".job-listing-company");
    const cloneJobLocation = clone.querySelector(".job-listing-location"); 

    cloneJobTitle.textContent = jobTitle;
    cloneJobCompany.innerHTML = `<span class="fa fa-building"></span> ${jobCompany}`;
    cloneJobLocation.innerHTML = `<span class="fa fa-globe"></span> ${jobLocation}`;
    
    
    const inputTitle = modalBody.querySelector("#job-title");
    const inputCompany = modalBody.querySelector("#company");
    const inputLink = modalBody.querySelector("#job-link");
    const inputAppliedDate = modalBody.querySelector("#applied-date");

    inputTitle.value = jobTitle;
    inputCompany.value = jobCompany;
    inputLink.value = jobLink;
    inputAppliedDate.value = appliedDate;
    viewableListing.appendChild(clone);

}

function closeModal() {
    const modalBody = document.getElementById("modal-job-input");
    const viewableListing = document.getElementById("viewable-listing");
    const inputTitle = modalBody.querySelector("#job-title");
    const inputCompany = modalBody.querySelector("#company");
    const inputLink = modalBody.querySelector("#job-link");
    const inputAppliedDate = modalBody.querySelector("#applied-date");

    inputTitle.value = '';
    inputCompany.value = '';
    inputLink.value = '';
    inputAppliedDate.value = '';
    viewableListing.innerHTML = '';

}