// available variables: document

class TextSearch {

    constructor() {
        this.text = "";
    }

    combineText(elements) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            this.combineElement(element);
        }
    }

    /**
     * Combines the inner text of an element with the interior text collection
     */
    combineElement(element) {
        // account for the element's children
        if (element.children.length > 0) {
            this.combineText(element.children);
            return;
        }
        // ignore html elements whose textContent is purposely CSS or JS
        if (element instanceof HTMLScriptElement || 
            element instanceof HTMLStyleElement) {
            return;
        }
        // ignore empty text elements
        if (element.textContent == null) {
            return;
        }
        this.text = this.text + ". \n" + element.textContent;
    }

    discardExtranousSentences() {
        let sentences = this.text.replaceAll("…", "").split('.');

        var newText = "";
        for (let i = 0; i < sentences.length; i++) {
            let sentence = sentences[i].trim();
            
            if (sentence == "" || sentence.length <= 10) {
                continue;
            }
            newText = newText + sentence + ". ";
        }
        this.text = newText;
    }

    debugDisplay(element) {
        element.textContent = this.text;
    }

}
search = new TextSearch();
search.combineText(document.getElementsByTagName("*"));
search.discardExtranousSentences();
search.debugDisplay(document.getElementsByTagName("*")[0]);
