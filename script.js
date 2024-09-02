{
    const delay = (time = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
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
        // for (let i = 0; i < 3; i++) {
        //     await showCompanyJobs(companies[i])
        // }
        showCompanyJobs(companies[4])
    }

    async function showCompanyJobs(element) {
        const links = element.querySelectorAll("a")
        console.log("🚀 ~ showCompanyJobs ~ links:", links)
        links[0].click()
        await delay(1000); // Give it 1 second to load the job details
        await applyForJob()
        await closeCompany()
    }

    const applyForJob = async () => {

        await delay(1000)
        const modal = document.querySelector('.ReactModal__Content ')
        await delay(1000)
        console.log("🚀 ~ applyForJob ~ modal:", modal)
        const links = modal.querySelectorAll('a')
        // Loop through the <a> tags and print their text content
        for (let i = 0; i < links.length; i++) {
            const linkText = links[i].textContent.trim()
            console.log(`Link ${i + 1}: ${linkText}`);
            const parentDiv = links[i].closest('div')
            if (parentDiv) {
                console.log(`🚀 ~ Parent Div of Link ${i + 1}:`, parentDiv);

                // Now find the sibling div that contains the buttons                
                const siblingDiv = parentDiv.nextElementSibling

                if (siblingDiv) {
                    console.log(`🚀 ~ Sibling Div of Link ${i + 1}:`, siblingDiv);

                    const buttons = siblingDiv.querySelectorAll("button")

                    if (Array.from(buttons).some(button => button.textContent === 'Apply')) {
                        console.log(`${linkText} is a job application`)
                    }
                } else {
                    console.log("Sibling div not found.");
                }

            }
        }
        // console.log("🚀 ~ applyForJob ~ links:", links)

    }

    start()
}