# Load model directly
import os
import string
from typing import Union

import transformers
import torch
import tensorflow as tf
import keras

import socket

tokenizer = transformers.AutoTokenizer.from_pretrained("d4data/bias-detection-model")
model = transformers.AutoModelForSequenceClassification.from_pretrained("d4data/bias-detection-model", from_tf=True)

message = "I have a new GPU!"
tokenized = tokenizer.tokenize(message)



def convert_standard(sentence: string) -> bytes:
    return bytes(sentence, 'utf-8')
