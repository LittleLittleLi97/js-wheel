const images = document.querySelectorAll('img');

const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if (entry.isIntersecting) {
            const el = entry.target;
            const src = el.getAttribute('data-src');
            el.setAttribute('src', src);
            observer.unobserve(el);
        }
    })
});

images.forEach((image)=>{
    observer.observe(image);
})