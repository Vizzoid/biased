// available variables: document

class TextSearch {

    constructor() {
        this.text = "";
    }

    combineText(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = "warden burger";
        }
    }

}
new TextSearch().combineText(document.getElementsByTagName("*"))
