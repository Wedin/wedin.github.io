(() => {
  const searchString = 'animated-delay-';
  const searchStringLength = searchString.length;

  function cleanupAnimateIn(event) {
    if (event.propertyName.includes('transform')) {
      let delay = undefined;
      this.classList.forEach(className => {
        if (className.substr(0, searchStringLength) === searchString) {
          delay = className;
        }
      });
      if (delay) {
        this.classList.remove(delay);
      }
      this.removeEventListener('transitionend', cleanupAnimateIn);
    }
  }
  const animateIn = elem => {
    elem.addEventListener('transitionend', cleanupAnimateIn);
    elem.classList.remove('animate-in');
  };
  window.addEventListener('load', function(event) {
    const animateElements = document.querySelectorAll('.animate-in');
    animateElements.forEach(elem => animateIn(elem));
  });
})();
