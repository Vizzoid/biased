from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from transformers import pipeline, Pipeline

# web server
import json
import logging
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
# web server end

# desktop
# import tkinter 
# desktop end

bias_threshold = 0.8
tokenizer = AutoTokenizer.from_pretrained("d4data/bias-detection-model")
model = TFAutoModelForSequenceClassification.from_pretrained("d4data/bias-detection-model")

pipe = pipeline('text-classification', model=model, tokenizer=tokenizer)
debug = True

def get_score(ai_pipe, message):
    return ai_pipe(message).__getitem__(0).get('score')

class Score:

    def __init__(self, score):
        self.score = score
    
    def get_value(self):
        return self.score

    def __str__(self):
        return str(self.get_value())
    
    def __repr(self):
        return self.__str__()

class BooleanScore(Score):

    def __init__(self, score):
        self.score = score
    
    def get_value(self):
        return self.score > bias_threshold


class Server:
    
    def __init__(self, pipeline : Pipeline):
        self.pipeline = pipeline
    
    def process_sentence(self, sentence : str) -> Score:
        raw_score = get_score(self.pipeline, sentence)
        return Score(raw_score) if debug else BooleanScore(raw_score)
    
    def process_sentences(self, sentences : list[str]) -> list[Score]:
        length = len(sentences)
        results = [None] * length
        for i in range(0, length):
            results[i] = self.process_sentence(sentences[i])
        
        return results

class Client:
    
    def split_into_sentences(self, text : str) -> list[str]:
        return text.replace('!', '.').replace('?', '.').split('.')
    
    def process_text(self, text : str) -> list[Score]:
        return server.process_sentences(self.split_into_sentences(text))
    
    def render_text(self, text : str) -> None:
        self.render_results(self.process_text(text))
    
    def render_html(self, html : str) -> None:
        self.render_text(self.text_from_html(html))
    
    def render(self) -> None:
        self.render_html(self.pull_html())
    
    def pull_html(self) -> str:
        return input("What is the paragraph you want to test?\n")
    
    def text_from_html(self, html : str) -> str:
        return html
    
    def render_results(self, results : list[Score]) -> None:
        print(results_to_string(results))

def results_to_string(results : list[Score]) -> list[str]:
    length = len(results)
    str_results = [None] * length
    for i in range(0, length):
        str_results[i] = results[i].__str__()
    
    return str_results

server = Server(pipe)
client = Client()

# web server
class HTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if re.search('/api/ai/*', self.path):
            sentence = self.path.split('/')[-1]
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            data = json.dumps(client.process_text(sentence)).encode('utf-8')
            logging.info("get record %s: %s", sentence, data)
            self.wfile.write(data)

        else:
            self.send_response(403)
        self.end_headers()

        
if __name__ == '__main__':
    # run server
    server = HTTPServer(('localhost', 8000), HTTPRequestHandler)
    logging.info('Starting server...\n')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()
    logging.info('Stopping server...\n')
# web server end

# desktop
# window=tk.Tk()
# window.title("BiasEd")
# window.geometry("600x400")

# label = tk.Label(window)
# label.pack()

# e = tk.Entry(window)
# e.pack()
# e.focus_set()

# def enter_text():
#     global e
#     string = e.get()
#     client.render_text(string)

# b = tk.Button(window, text='Submit', command=enter_text)
# b.pack(side='bottom')
# window.mainloop()
# desktop end