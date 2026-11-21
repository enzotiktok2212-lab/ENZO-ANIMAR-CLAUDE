#!/usr/bin/env python3
"""Acelera (sin cambiar el tono) los tramos de HUSS de la voz. uso: acelerar_huss.py in.mp3 raw.json out.wav factor"""
import json,subprocess,sys,numpy as np
src,rj,out,f=sys.argv[1],sys.argv[2],sys.argv[3],float(sys.argv[4])
w=json.load(open(rj));R=44100
pcm=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(R),'-f','f32le','-'],capture_output=True).stdout,np.float32)
g=[];cur=[];prev_end=0
for i,(a,b,t) in enumerate(w):
    if 'huss' in t.lower():
        if not cur: cur=[max(prev_end,a-0.12)]
        cur_end=b
    elif cur:
        g.append((cur[0],min(a-0.03,cur_end+0.25)));cur=[]
    prev_end=b
if cur: g.append((cur[0],len(pcm)/R))
parts=[];p=0
for a,b in g:
    A,B=int(a*R),int(b*R); parts.append(pcm[p:A])
    fast=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(R),'-ac','1','-i','-','-af',f'atempo={f}','-f','f32le','-'],input=pcm[A:B].tobytes(),capture_output=True).stdout,np.float32)
    parts.append(fast); p=B; print(f'{a:.2f}-{b:.2f} -> {(B-A)/R/f:.2f}s',file=sys.stderr)
parts.append(pcm[p:])
y=np.concatenate(parts)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(R),'-ac','1','-i','-',out],input=y.tobytes(),check=True)
