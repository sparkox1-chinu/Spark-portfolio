const toggleBtn = document.getElementById('darkToggle');
    const icon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      toggleBtn.classList.toggle('active');
      icon.classList.toggle('fa-moon');
      icon.classList.toggle('fa-sun');
    });

    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const sections = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const trigger = window.innerHeight * 0.85;
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < trigger) sec.classList.add('active');
      });

      if (window.scrollY > 200) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);


//vercel speed and analytics 
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
