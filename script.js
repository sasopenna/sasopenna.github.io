const navLinks = document.querySelectorAll("#navbar a");

navLinks.forEach(link => {
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (link.classList.contains("active")) {
                const href = link.getAttribute("href");
                history.replaceState(null, null, href);
            }
        });
    }).observe(link, { attributes: true });
});