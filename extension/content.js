// available variables: document

class TextElement {

    constructor(element) {
        this.element = element;
        this.text = element.textContent;
    }

    trim() {
        this.text = this.text.replaceAll("…", "").trim();
    }

    isInsignificant() {
        return this.text == "" || this.text.length <= 10;
    }

    getString() {
        return this.text;
    }

}

class TextSearch {

    constructor() {
        this.texts = [];
    }

    combineText(elements) {
        for (const element of elements) {
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
        this.texts.push(new TextElement(element));
    }

    discardExtranousSentences() {
        for (var i = this.texts.length - 1; i >= 0; i--) {
            let text = this.texts[i];
            text.trim();
            
            if (text.isInsignificant()) {
                this.texts.splice(i, 1);
            }
        }
    }

    debugDisplay(element) {
        var word = "";

        for (const text of this.texts) {
            word = word + text.getString() + " ";
        }

        element.textContent = word;
    }

}
search = new TextSearch();
search.combineText(document.getElementsByTagName("*"));
search.discardExtranousSentences();
search.debugDisplay(document.getElementsByTagName("*")[0]);

$.ajax({
    type: "POST",
    url: "~/model.py",
    data: { param: text}
  }).done(function( o ) {
     // do something
  });
