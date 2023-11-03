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
print(tokenized)
print(bytes(message, 'utf-8'))

UDP_IP = "127.0.0.1"
UDP_PORT = 3546  # unassigned port
MESSAGE = "Hello World!"

sock = socket.socket(socket.AF_INET,  # Internet
                     socket.SOCK_DGRAM)  # UDP
sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))


def convert_standard(sentence: string) -> bytes:
    return bytes(sentence, 'utf-8')
