from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
from transformers import pipeline, Pipeline

bias_threshold = 0.8
tokenizer = AutoTokenizer.from_pretrained("d4data/bias-detection-model")
model = TFAutoModelForSequenceClassification.from_pretrained("d4data/bias-detection-model")

pipe = pipeline('text-classification', model=model, tokenizer=tokenizer)

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
        return Score(get_score(self.pipeline, sentence))
    
    def process_sentences(self, sentences : list[str]) -> list[Score]:
        length = len(sentences)
        results = [None] * length
        for i in range(0, length):
            results[i] = self.process_sentence(sentences[i])
        
        return results

class Client:
    
    def split_into_sentences(self, text : str) -> list[str]:
        return text.split('.')
    
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
        print(results)

server = Server(pipe)
client = Client()

while True:
    client.render()