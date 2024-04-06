from bs4 import BeautifulSoup
from selenium import webdriver
from typing import List

from .db_context import mongo_db_context
from .job_listing_model import job_listing
from .job_listing_repository import job_listing_repository

def get_cachable_listings() -> List[job_listing]:
    # here we are using the Firefox browser, once I (RH) create the docker image, I'll change this code to chromium,
    # but for now, I'll leave it as is while we develop the chunk of this scraper.
    # Chromium will be downloaded outside of the project file within the docker image, code below will be used when container is created.
    
    # chromium = "/usr/bin/chromium"
    # options = webdriver.ChromeOptions()
    # options.binary_location = chromium
    # driver = webdriver.Chrome(options=options)

    # Set up mongo db context and prepare to cache listings

    driver = webdriver.Firefox()
    url = f"https://www.indeed.com/jobs?q=&l=remote"
    driver.get(url)

    scraper = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    results = scraper.findAll('li', {'class': 'css-5lfssm eu4oa1w0'})

    job_listings = []
    for job in results:
        listing_link_section = job.find('a', {'class': 'jcs-JobTitle css-jspxzf eu4oa1w0'})
        if (listing_link_section == None):
            continue
        listing_link = listing_link_section['href']
        listing_link_anchor = listing_link_section.find('span')
        listing_title = listing_link_anchor.text
        listing_company = job.find('span', {'class': 'css-92r8pb eu4oa1w0'}).text
        listing_location = job.find('div', {'class': 'css-1p0sjhy eu4oa1w0'}).text

        # This is for dev purposes to see if the function works, instead of print statements, we will cache these listings
        # print('-----------------')
        # print(listing_title)
        # print(listing_company)
        # print(listing_location)
        # print("indeed.com" + listing_link)

        listed_job = job_listing(listing_title, listing_company, listing_location, "indeed.com" + listing_link)
        job_listings.append(listed_job)

    return job_listings

def cache_listing(listing, ip='localhost', port=27017, dbname='job_listings', collectionName='job_listings'):
    context = mongo_db_context(ip, port, dbname, collectionName)
    repo = job_listing_repository(context)
    repo.save(listing)