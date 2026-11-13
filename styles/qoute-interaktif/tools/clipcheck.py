#!/usr/bin/env python3
"""Sahkan kandungan setiap klip calon EDL: transkripsi semula setiap julat secara berasingan.
Guna: python3 -I clipcheck.py audio16k.wav '[[1.8,22.0],[22.75,30.3]]'"""
import sys, json, wave, numpy as np
from faster_whisper import WhisperModel
wf=wave.open(sys.argv[1]); a=np.frombuffer(wf.readframes(wf.getnframes()),dtype=np.int16).astype(np.float32)/32768
clips=json.loads(sys.argv[2])
m=WhisperModel('large-v3',device='cpu',compute_type='int8')
P='Loghat utara. Hang, sindiran, ukhuwah, Assalamualaikum.'
for s,e in clips:
    pad=np.zeros(8000,dtype=np.float32)
    x=np.concatenate([pad,a[int(s*16000):int(e*16000)],pad])
    r,_=m.transcribe(x,language='ms',initial_prompt=P,beam_size=5,word_timestamps=True,condition_on_previous_text=False)
    ws=[(w.word.strip(),w.start-0.5+s,w.end-0.5+s) for sg in r for w in sg.words]
    print(f'{s:.2f}-{e:.2f} |',' '.join(f'{w}@{a_:.2f}' for w,a_,b_ in ws))
