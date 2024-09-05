{
    const COMPANIES_TO_APPLY_TO = 21
    const STARTING_INDEX = 0

    const delay = (time = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    }

    const exponentialBackoffRetry = async (task, maxRetries = 7) => {
        let retries = 0
        let delayTime = 1000 // Start with 1 second

        while (retries < maxRetries) {
            try {
                await task()
                return
            } catch (error) {
                retries++
                console.log(`Attempt ${retries} failed. Retrying in ${delayTime / 1000} seconds...`);
                await delay(delayTime)
                delayTime *= 2 // Double the wait time with each retry
            }
        }
        console.log('Max retries reached. Could not complete the task.');
    }

    const closeCompany = async () => {
        const closeButton = document.querySelector('[data-test="closeButton"]')
        if (closeButton) {
            closeButton.click()
        }
        else {
            console.error("Close button not found");
        }
    }

    const start = async () => {
        const companies = document.querySelectorAll('[data-test="StartupResult"]');
        for (let i = STARTING_INDEX; i < COMPANIES_TO_APPLY_TO; i++) {
            console.log(`Visiting company #${i + 1}`)
            await showCompanyJobs(companies[i])
        }
    }

    async function showCompanyJobs(element) {
        const links = element.querySelectorAll("a")
        links[0].click()
        await delay(1000); // Give it 1 second to load the job details
        await exponentialBackoffRetry(applyForJob)
        await closeCompany()
    }

    const applyForJob = async () => {
        let attempts = 0
        let jobLinks = []
        while (jobLinks.length === 0 && attempts < 3) {
            await delay(1000)
            const modal = document.querySelector('.ReactModal__Content ')
            const links = modal ? modal.querySelectorAll('a') : []
            jobLinks = Array.from(links).filter(link => link.hasAttribute('href') && link.getAttribute("href").startsWith("/jobs"))
            attempts++
        }
        console.log("🚀 ~ applyForJob ~ jobLinks:", jobLinks)

        if (jobLinks.length > 0) {
            await clickOnJobLink(jobLinks)
        }
        else {
            console.log("🚀 ~ applyForJob ~ No job links found after 3 attempts, moving to the next job...");
        }
    }

    const clickOnJobLink = async (jobLinks) => {
        let links
        if (jobLinks.length === 1) {
            links = jobLinks[0]
        }
        else {
            const frontEndLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("front"))
            const fullStackLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("full"))
            const softwareLinks = jobLinks.filter(link => link.hasAttribute('href') && link.getAttribute("href").includes("software"))
            if (frontEndLinks.length > 0) {
                links = frontEndLinks[0]
            }
            else if (fullStackLinks.length > 0) {
                links = fullStackLinks[0]
            }
            else if (softwareLinks.length > 0) {
                links = softwareLinks[0]
            }
            else {
                links = jobLinks[0]
            }
        }
        await exponentialBackoffRetry(() => clickApplyButton(links))
    }

    const clickApplyButton = async (element) => {
        const parentDiv = element.closest('div')
        if (parentDiv) {
            // Now find the sibling div that contains the buttons                
            const siblingDiv = parentDiv.nextElementSibling

            if (siblingDiv) {
                const buttons = siblingDiv.querySelectorAll("button")
                buttons[1].click()

                let clickedApply = false
                let attempts = 0
                while (!clickedApply && attempts < 3) {
                    const allButtons = document.querySelectorAll('button')
                    for (const button of allButtons) {
                        if (button.textContent.trim() === 'Send application') {
                            console.log("🚀 ~ clickApplyButton ~ Attempting to click Send application button...");
                            button.click()
                            clickedApply = true
                            break
                        }
                    }
                    if (!clickedApply) {
                        console.log(`🚀 ~ clickApplyButton ~ Could not apply... Retry attempt ${attempts + 1}`);
                        attempts++
                        await delay(1000)
                    }
                }
            } else {
                console.log("Sibling div not found.");
            }
        }
    }

    start()
}